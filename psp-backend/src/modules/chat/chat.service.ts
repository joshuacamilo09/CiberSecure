import { Injectable, NotFoundException } from '@nestjs/common';
import { MessageRole } from '@prisma/client';
import { GeminiService } from '../../integrations/gemini/gemini.service';
import { CreateChatSessionDto } from './dto/create-chat-session.dto';
import { SendChatMessageDto } from './dto/send-chat-message.dto';
import { PrismaService } from 'prisma/prisma.service';


@Injectable()
export class ChatService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly geminiService: GeminiService,
  ) {}

  async createSession(_dto: CreateChatSessionDto, userId: string) {
    return this.prisma.chatSession.create({
      data: {
        status: 'active',
        userId,
      },
    });
  }

  async getSession(sessionId: string, userId: string) {
    const session = await this.prisma.chatSession.findFirst({
      where: {
        id: sessionId,
        userId,
      },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!session) {
      throw new NotFoundException('Chat session not found');
    }

    return session;
  }

  async sendMessage(
    sessionId: string,
    dto: SendChatMessageDto,
    userId: string,
  ) {
    const session = await this.prisma.chatSession.findFirst({
      where: {
        id: sessionId,
        userId,
      },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!session) {
      throw new NotFoundException('Chat session not found');
    }

    await this.prisma.chatMessage.create({
      data: {
        sessionId,
        role: MessageRole.user,
        content: dto.content,
      },
    });

    const updatedMessages = [
      ...session.messages.map((message) => ({
        role:
          message.role === MessageRole.assistant
            ? ('assistant' as const)
            : ('user' as const),
        content: message.content,
      })),
      {
        role: 'user' as const,
        content: dto.content,
      },
    ];

    const recentMessages = updatedMessages.slice(-10);
    const aiReply = await this.geminiService.generateChatReply(recentMessages);

    await this.prisma.chatMessage.create({
      data: {
        sessionId,
        role: MessageRole.assistant,
        content: aiReply.reply,
        intent: aiReply.intent,
      },
    });

    const finalSession = await this.prisma.chatSession.findFirst({
      where: {
        id: sessionId,
        userId,
      },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    return {
      session: finalSession,
      assistant: {
        reply: aiReply.reply,
        intent: aiReply.intent,
        shouldSuggestPsp: aiReply.shouldSuggestPsp,
        suggestedActions: aiReply.suggestedActions,
      },
    };
  }
}
