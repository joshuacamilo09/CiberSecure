import { Module } from '@nestjs/common';
import { AiTriageController } from './ai-triage.controller';
import { AiTriageService } from './ai-triage.service';

@Module({
  controllers: [AiTriageController],
  providers: [AiTriageService]
})
export class AiTriageModule {}
