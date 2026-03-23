import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GeminiService } from './gemini.service';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [GeminiService],
  exports: [GeminiService],
})
export class GeminiModule {}
