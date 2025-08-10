import { Injectable } from '@nestjs/common';

interface TempUserData {
  email: string;
  password: string; // hashed password
  otp: string; // hashed otp
  otpExpiry: number;
}

@Injectable()
export class TempUserStoreService {
  private tempUsers = new Map<string, TempUserData>();

  save(data: TempUserData): void {
    this.tempUsers.set(data.email, data);
  }

  find(email: string): TempUserData | undefined {
    const data = this.tempUsers.get(email);
    if (data && data.otpExpiry > Date.now()) {
      return data;
    }
    this.tempUsers.delete(email); // expired, clean up
    return undefined;
  }

  remove(email: string): void {
    this.tempUsers.delete(email);
  }
}
