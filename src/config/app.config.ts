export const appConfig = () => ({
  // appName: process.env.APP_NAME || 'MyEcommerceApp',
  port: process.env.PORT || 3000,
  //   environment: process.env.NODE_ENV || 'development',
  //   enableDebugLogs: process.env.DEBUG_LOGS === 'true' || false,
});

export const frontendUrl = () => process.env.FRONTEND_URL || 'localhost:3000';
