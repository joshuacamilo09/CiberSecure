import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
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
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 20,
      },
    ]),
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
    }),
    PrismaModule,
    GeminiModule,
    AuthModule,
    UsersModule,
    ChatModule,
    AiTriageModule,
    PrintAnalysisModule,
  ],
})
export class AppModule {}
