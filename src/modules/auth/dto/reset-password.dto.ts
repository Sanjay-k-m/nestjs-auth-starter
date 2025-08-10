import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({ example: 'reset-token-string' })
  @IsString()
  token!: string;

  @ApiProperty({ example: 'newStrongPassword123', minLength: 6 })
  @IsString()
  @MinLength(6)
  newPassword!: string;
}
