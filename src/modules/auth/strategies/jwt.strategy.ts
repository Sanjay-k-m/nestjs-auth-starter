import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt';
import { Logger } from '@nestjs/common';

interface JwtPayload {
  sub: number;
  email: string;
  roles?: string[];
}

export interface JwtUser {
  userId: number;
  email: string;
  roles: string[];
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    const secretCode = process.env.JWT_ACCESS_TOKEN_SECRET;
    if (!secretCode) {
      Logger.error(
        'JWT_ACCESS_TOKEN_SECRET is not defined. Please add this variable to your .env file',
      );
      throw new Error(
        'JWT_ACCESS_TOKEN_SECRET is not defined. Please add this variable to your .env file',
      );
    }

    const options: StrategyOptions = {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: secretCode,
      ignoreExpiration: false,
    };
    super(options);
  }

  validate(payload: JwtPayload): JwtUser {
    console.log('Payload:', payload);
    return {
      userId: payload.sub,
      email: payload.email,
      roles: payload.roles ?? [],
    };
  }
}
