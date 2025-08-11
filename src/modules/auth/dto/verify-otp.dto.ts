import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class VerifyOtpDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Email address used to register',
  })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: '123456', description: 'OTP code sent to email' })
  @IsString()
  @MinLength(6)
  otp!: string;
}
