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

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  // Register new user with hashed password
  async register(email: string, password: string): Promise<void> {
    const exists = await this.usersService.findByEmail(email);
    if (exists) throw new ConflictException('Email already registered');

    const hashedPassword = await bcrypt.hash(password, 12);

    await this.usersService.create({
      email,
      password: hashedPassword,
      roles: ['user'],
      isEmailVerified: false,
    });
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
    if (!user) return;

    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedResetToken = await bcrypt.hash(resetToken, 10);
    const expiry = Date.now() + 3600 * 1000; // 1 hour from now

    await this.usersService.setPasswordResetToken(
      user.id,
      hashedResetToken,
      expiry,
    );

    // TODO: Send `resetToken` via email to the user securely
  }

  // Reset password using the reset token
  async resetPassword(token: string, newPassword: string): Promise<void> {
    // Find user(s) by matching hashed reset token
    const users = await this.usersService.findByResetToken(token);
    if (!users.length)
      throw new BadRequestException('Invalid or expired token');

    const user = users[0];
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    await this.usersService.updatePassword(user.id, hashedPassword);
    await this.usersService.clearPasswordResetToken(user.id);
  }
}
