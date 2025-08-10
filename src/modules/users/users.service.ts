/* eslint-disable @typescript-eslint/require-await */
import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User } from '../../interfaces/user.interface';

@Injectable()
export class UsersService {
  private users: User[] = [];

  async findByEmail(email: string): Promise<User | undefined> {
    return this.users.find((user) => user.email === email);
  }

  async findById(id: number): Promise<User | undefined> {
    return this.users.find((user) => user.id === id);
  }

  async create(userData: Partial<User>): Promise<User> {
    const user: User = {
      id: this.users.length + 1,
      roles: ['user'],
      isEmailVerified: false,
      currentHashedRefreshToken: null,
      passwordResetToken: null,
      passwordResetExpires: null,
      ...userData,
    } as User;
    this.users.push(user);
    return user;
  }

  async setCurrentRefreshToken(
    userId: number,
    refreshToken: string,
  ): Promise<void> {
    const user = await this.findById(userId);
    if (user) {
      user.currentHashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    }
  }

  async removeRefreshToken(userId: number): Promise<void> {
    const user = await this.findById(userId);
    if (user) {
      user.currentHashedRefreshToken = null;
    }
  }

  async setPasswordResetToken(
    userId: number,
    token: string,
    expiry: number,
  ): Promise<void> {
    const user = await this.findById(userId);
    if (user) {
      user.passwordResetToken = token;
      user.passwordResetExpires = expiry;
    }
  }

  async findByResetToken(hashedToken: string): Promise<User[]> {
    return this.users.filter(
      (user) =>
        user.passwordResetToken &&
        user.passwordResetExpires &&
        user.passwordResetExpires > Date.now() &&
        bcrypt.compareSync(hashedToken, user.passwordResetToken),
    );
  }

  async updatePassword(userId: number, hashedPassword: string): Promise<void> {
    const user = await this.findById(userId);
    if (user) {
      user.password = hashedPassword;
    }
  }

  async clearPasswordResetToken(userId: number): Promise<void> {
    const user = await this.findById(userId);
    if (user) {
      user.passwordResetToken = null;
      user.passwordResetExpires = null;
    }
  }
}
