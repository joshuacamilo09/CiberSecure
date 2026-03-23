import { Module } from '@nestjs/common';
import { PrintAnalysisController } from './print-analysis.controller';
import { PrintAnalysisService } from './print-analysis.service';

@Module({
  controllers: [PrintAnalysisController],
  providers: [PrintAnalysisService]
})
export class PrintAnalysisModule {}
