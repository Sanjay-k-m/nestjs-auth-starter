export const mailConfig = () => ({
  host: process.env.MAIL_HOST || 'smtp.gmail.com',
  port: Number(process.env.MAIL_PORT) || 587,
  secure: process.env.MAIL_SECURE === 'true' || false,
  auth: {
    user: process.env.MAIL_USER || '',
    pass: process.env.MAIL_PASS || '',
  },
});

export const mailFrom = () => process.env.MAIL_FROM || 'test@gmail.com';
