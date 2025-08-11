// src/config/cors.config.ts
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

export const corsConfig = (): CorsOptions => {
  const origins = (process.env.CORS_ORIGIN || 'http://localhost:3000')
    .split(',')
    .map((origin) => origin.trim());

  return {
    origin: origins,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  };
};
