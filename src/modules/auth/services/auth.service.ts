/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

import { UsersService } from '../../users/users.service';
import { User } from '../../../interfaces/user.interface';
import { JwtPayload } from '../../../interfaces/auth.interface';
import { TempUserStoreService } from 'src/common/services/temp-user-store.service';
import { MailService } from 'src/common/services/mailProvider.service';
@Injectable()
export class AuthService {
  users: any;
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly tempUserStore: TempUserStoreService,
    private readonly mailService: MailService,
  ) {}

  // Register new user with hashed password
  async registerRequest(email: string, password: string): Promise<void> {
    const exists = await this.usersService.findByEmail(email);
    if (exists) throw new ConflictException('Email already registered');

    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
    const hashedOtp = await bcrypt.hash(otp, 10);

    // Save { email, hashedOtp, password: hashed & other details } in temp store (e.g. Redis or separate DB table)
    this.tempUserStore.save({
      email,
      password: await bcrypt.hash(password, 12),
      otp: hashedOtp,
      otpExpiry: Date.now() + 10 * 60 * 1000, // 10 min expiry
    });

    // Send OTP to user via email/sms
    await this.mailService.sendMail(email, 'OTP for registration', otp);
  }

  // auth.service.ts
  async verifyOtpAndRegister(email: string, otp: string): Promise<void> {
    const tempUser = this.tempUserStore.find(email);
    if (!tempUser) throw new BadRequestException('No pending registration');

    if (tempUser.otpExpiry < Date.now())
      throw new BadRequestException('OTP expired');

    const isValidOtp = await bcrypt.compare(otp, tempUser.otp);
    if (!isValidOtp) throw new BadRequestException('Invalid OTP');

    // Create the user in permanent DB
    await this.usersService.create({
      email: tempUser.email,
      password: tempUser.password,
      roles: ['user'],
      isEmailVerified: true,
    });

    // Remove temp user
    this.tempUserStore.remove(email);
  }

  // Validate user credentials and return user info without password
  async validateUser(
    email: string,
    password: string,
  ): Promise<Omit<User, 'password'> | null> {
    const user = await this.usersService.findByEmail(email);
    if (!user) return null;

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (isPasswordValid) {
      // Exclude password from returned user object
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _, ...result } = user;
      return result;
    }
    return null;
  }

  // Login user, generate access and refresh tokens
  async login(
    email: string,
    password: string,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const user = await this.validateUser(email, password);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      roles: user.roles,
    };

    const access_token = this.jwtService.sign(payload);
    const refresh_token = this.generateRefreshToken(user);

    await this.usersService.setCurrentRefreshToken(user.id, refresh_token);

    return { access_token, refresh_token };
  }

  // Generate refresh token signed with separate secret
  generateRefreshToken(user: Omit<User, 'password'>): string {
    return this.jwtService.sign(
      { sub: user.id },
      {
        secret: process.env.JWT_REFRESH_TOKEN_SECRET || 'refreshSecret',
        expiresIn: '7d',
      },
    );
  }

  // Logout user by clearing their refresh token
  async logout(userId: number): Promise<void> {
    await this.usersService.removeRefreshToken(userId);
  }

  // Refresh access and refresh tokens if refresh token is valid
  async refreshTokens(
    userId: number,
    refreshToken: string,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const user = await this.usersService.findById(userId);
    if (!user || !user.currentHashedRefreshToken)
      throw new UnauthorizedException();

    const isRefreshTokenValid = await bcrypt.compare(
      refreshToken,
      user.currentHashedRefreshToken,
    );
    if (!isRefreshTokenValid) throw new UnauthorizedException();

    // Generate new tokens
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      roles: user.roles,
    };
    const access_token = this.jwtService.sign(payload);
    const new_refresh_token = this.generateRefreshToken(user);

    await this.usersService.setCurrentRefreshToken(user.id, new_refresh_token);

    return { access_token, refresh_token: new_refresh_token };
  }

  // Request password reset: generate token, save hashed, and email user (TODO)
  async requestPasswordReset(email: string): Promise<void> {
    const user = await this.usersService.findByEmail(email);
    if (!user) return; // Don't reveal if user exists

    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedResetToken = await bcrypt.hash(resetToken, 10);
    const expiry = Date.now() + 3600 * 1000; // 1 hour

    await this.usersService.setPasswordResetToken(
      user.id,
      hashedResetToken,
      expiry,
    );

    // Send reset link via email
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    await this.mailService.sendMail(
      user.email,
      'Password Reset Request',
      `<p>You requested a password reset.</p>
             <p>Click <a href="${resetUrl}">here</a> to reset your password.</p>
             <p>This link will expire in 1 hour.</p>`,
    );
  }
  // async resetPassword (token: string, newPassword: string): Promise<User | undefined> {
  //   for (const user of this.users) {
  //     if (
  //       user.passwordResetToken &&
  //       user.passwordResetExpires &&
  //       user.passwordResetExpires > Date.now()
  //     ) {
  //       const isMatch = await bcrypt.compare(token, user.passwordResetToken);
  //       if (isMatch) {
  //         return user;
  //       }
  //     }
  //   }
  //   return undefined;
  // }
}
