import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { envValidationSchema } from './config/env.validation';
import { GeminiModule } from './integrations/gemini/gemini.module';
import { AiTriageModule } from './modules/ai-triage/ai-triage.module';
import { AuthModule } from './modules/auth/auth.module';
import { ChatModule } from './modules/chat/chat.module';
import { PrintAnalysisModule } from './modules/print-analysis/print-analysis.module';
import { UsersModule } from './modules/users/users.module';
import { PrismaModule } from 'prisma/prisma.module';
import { ChatbotModule } from './modules/chatbot/chatbot.module';

@Module({
  imports: [
    ChatbotModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: envValidationSchema,
    }),
    // Rate limiting global por IP (protege também os endpoints de IA, que têm custo por pedido)
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 60,
      },
    ]),
    PrismaModule,
    GeminiModule,
    AuthModule,
    UsersModule,
    ChatModule,
    AiTriageModule,
    PrintAnalysisModule,
  ],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
