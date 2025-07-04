import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

interface EmailData {
  to: string;
  subject: string;
  body: string;
  html?: string;
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '465'),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
        from: process.env.SMTP_FROM,
    });
  }

  async sendEmail(data: EmailData) {
    try {
      this.logger.log(`Enviando email para: ${data.to}`);
      this.logger.log(`Assunto: ${data.subject}`);

      const mailOptions = {
        from: process.env.SMTP_FROM,
        to: data.to,
        subject: data.subject,
        text: data.body,
        html: data.html || data.body,
      };

      const result = await this.transporter.sendMail(mailOptions);
      
      this.logger.log(`Email enviado com sucesso! Message ID: ${result.messageId}`);
      return result;
    } catch (error) {
      this.logger.error(`Erro ao enviar email: ${error.message}`);
      throw error;
    }
  }
}
