import { Injectable } from '@nestjs/common';
import {
  AnalysisInputType,
  AnalysisStatus,
  SeverityLevel,
} from '@prisma/client';
import { GeminiService } from '../../integrations/gemini/gemini.service';
import { AnalyzeTextDto } from './dto/analyze-text.dto';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class AiTriageService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly geminiService: GeminiService,
  ) {}

  async analyzeText(dto: AnalyzeTextDto, userId: string) {
    const aiResult = await this.geminiService.analyzeCyberbullyingText(
      dto.text,
    );

    const analysis = await this.prisma.analysisRequest.create({
      data: {
        userId,
        inputType: AnalysisInputType.text,
        originalText: dto.text,
        status: AnalysisStatus.processed,
        severity: aiResult.severity as SeverityLevel,
        classification: aiResult.classification,
        aiSummary: aiResult.summary,
        recommendedActions: aiResult.recommendedActions,
      },
    });

    return {
      analysisId: analysis.id,
      classification: aiResult.classification,
      severity: aiResult.severity,
      summary: aiResult.summary,
      recommendedActions: aiResult.recommendedActions,
      shouldSuggestPsp: aiResult.shouldSuggestPsp,
      detectedSignals: aiResult.detectedSignals,
    };
  }
}
