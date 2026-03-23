import { Module } from '@nestjs/common';
import { GeminiModule } from '../../integrations/gemini/gemini.module';
import { ChatbotController } from './chatbot.controller';
import { ChatbotService } from './chatbot.service';

@Module({
  imports: [GeminiModule],
  controllers: [ChatbotController],
  providers: [ChatbotService],
})
export class ChatbotModule {}