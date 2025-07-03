import { Injectable, Logger } from "@nestjs/common";

@Injectable()
export class SmsService {
  private readonly logger = new Logger(SmsService.name);
  async send(phone: string, code: string) {
    // Здесь должна быть интеграция с реальным SMS API
    this.logger.log(`Отправлен код ${code} на номер ${phone}`);
    return true;
  }
}
