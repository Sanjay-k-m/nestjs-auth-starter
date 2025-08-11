// src/config/features.config.ts
export const featuresConfig = () => ({
  helmet: process.env.ENABLE_HELMET !== 'false',
  swagger: process.env.ENABLE_SWAGGER !== 'false',
  loggingInterceptor: process.env.ENABLE_LOGGING_INTERCEPTOR !== 'false',
  globalValidationPipe: process.env.ENABLE_GLOBAL_VALIDATION_PIPE !== 'false',
  compression: process.env.COMPRESSION_ENABLED !== 'false',
});
