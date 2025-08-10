/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter;

  constructor() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    this.transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST || 'smtp.example.com',
      port: Number(process.env.MAIL_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.MAIL_USER || 'user@example.com',
        pass: process.env.MAIL_PASS || 'password',
      },
    });
  }

  async sendMail(to: string, subject: string, html: string): Promise<void> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      await this.transporter.sendMail({
        from: `"Your App" <${process.env.MAIL_FROM || 'no-reply@example.com'}>`,
        to,
        subject,
        html,
      });
    } catch (error) {
      console.error('Mail sending error:', error);
      throw new InternalServerErrorException('Failed to send email');
    }
  }
}
