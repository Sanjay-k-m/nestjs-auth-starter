import { Logger, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UsersModule } from '../users/users.module';
import { ServicesModule } from 'src/common/services/services.module';
@Module({
  imports: [
    UsersModule,
    PassportModule,
    ServicesModule,
    JwtModule.registerAsync({
      imports: [ConfigModule], // ensure ConfigModule is imported here
      useFactory: (configService: ConfigService) => {
        const logger = new Logger('JwtModule');
        const secret = configService.get<string>('JWT_ACCESS_TOKEN_SECRET');
        if (!secret) {
          logger.error(
            'JWT_ACCESS_TOKEN_SECRET is not defined. Please add this variable to your .env file',
          );
          throw new Error('JWT_ACCESS_TOKEN_SECRET is not defined.');
        }
        logger.log('JWT secret loaded successfully');
        return {
          secret,
          signOptions: { expiresIn: '15m' },
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
