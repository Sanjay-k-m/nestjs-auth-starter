import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthService } from './services/auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UsersModule } from '../users/users.module';
import { ServicesModule } from 'src/common/services/services.module';
import { AuthControllerV1 } from './controllers/v1/auth.controller';
import { AuthControllerV2 } from './controllers/v2/auth.controller';
import { jwtConfig } from 'src/config';
@Module({
  imports: [
    UsersModule,
    PassportModule,
    ServicesModule,
    JwtModule.registerAsync({
      imports: [ConfigModule], // ensure ConfigModule is imported here
      useFactory: () => {
        const { accessToken } = jwtConfig();

        return {
          secret: accessToken.secret,
          signOptions: { expiresIn: accessToken.expiresIn },
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthControllerV1, AuthControllerV2],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
