import { ApiProperty } from '@nestjs/swagger';

export class VerifyOtpDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Email address used to register',
  })
  email!: string;

  @ApiProperty({ example: '123456', description: 'OTP code sent to email' })
  otp!: string;

  @ApiProperty({
    example: 'strongPassword123',
    description: 'User password for registration',
  })
  password!: string;
}
