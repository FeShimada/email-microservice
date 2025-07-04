import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload, Ctx, RmqContext } from '@nestjs/microservices';
import { EmailService } from './email.service';

@Controller('email')
export class EmailController {
  private readonly logger = new Logger(EmailController.name);

  constructor(private readonly emailService: EmailService) {}

  @EventPattern('send_email')
  async handleSendEmail(@Payload() data: any, @Ctx() context: RmqContext) {
    this.logger.log(`Recebido evento send_email com payload: ${JSON.stringify(data)}`);
    
    try {
      const result = await this.emailService.sendEmail(data);
      this.logger.log(`Email processado com sucesso: ${result.messageId}`);
    } catch (error) {
      this.logger.error(`Erro ao processar email: ${error.message}`);
      throw error;
    }
  }
}
