import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class RefreshTokenDto {
  @ApiProperty({ example: 123, description: 'User ID' })
  @IsNumber()
  userId!: number;

  @ApiProperty({ example: 'refreshTokenHere' })
  @IsString()
  refreshToken!: string;
}
