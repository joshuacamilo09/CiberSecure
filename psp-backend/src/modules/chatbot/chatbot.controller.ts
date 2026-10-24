import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ChatbotService } from './chatbot.service';
import { SendChatbotMessageDto } from './dto/send-chatbot-message.dto';

@ApiTags('Chatbot')
@Controller('chatbot')
export class ChatbotController {
  constructor(private readonly chatbotService: ChatbotService) {}

  @Post('message')
  @ApiOperation({ summary: 'Send a message to the public chatbot' })
  sendMessage(@Body() dto: SendChatbotMessageDto) {
    return this.chatbotService.sendMessage(dto);
  }
}