// src/config/swagger.config.ts
export const swaggerConfig = () => ({
  enabled: process.env.ENABLE_SWAGGER === 'true',
  title: 'NEST API',
  description: 'API docs for nest backend',
  version: '1.0',
  path: 'api-docs',
});
