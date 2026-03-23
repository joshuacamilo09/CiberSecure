import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  AnalysisInputType,
  AnalysisStatus,
  SeverityLevel,
} from '@prisma/client';
import { GeminiService } from '../../integrations/gemini/gemini.service';
import { PrismaService } from 'prisma/prisma.service';


@Injectable()
export class PrintAnalysisService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly geminiService: GeminiService,
  ) {}

  async uploadAndAnalyze(file: Express.Multer.File, userId: string) {
    if (!file) {
      throw new BadRequestException('File not provided');
    }

    const aiResult = await this.geminiService.analyzeCyberbullyingImage(
      file.path,
      file.mimetype,
    );

    const analysis = await this.prisma.analysisRequest.create({
      data: {
        userId,
        inputType: AnalysisInputType.image,
        status: AnalysisStatus.processed,
        severity: aiResult.severity as SeverityLevel,
        classification: aiResult.classification,
        aiSummary: aiResult.summary,
        recommendedActions: aiResult.recommendedActions,
      },
    });

    const evidence = await this.prisma.uploadedEvidence.create({
      data: {
        analysisRequestId: analysis.id,
        fileUrl: `/${file.path.replace(/\\/g, '/')}`,
        fileType: 'image',
        mimeType: file.mimetype,
        size: file.size,
        originalName: file.originalname,
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
      evidence: {
        id: evidence.id,
        fileUrl: evidence.fileUrl,
        mimeType: evidence.mimeType,
        size: evidence.size,
        originalName: evidence.originalName,
      },
    };
  }

  async getResult(id: string, userId: string) {
    const analysis = await this.prisma.analysisRequest.findFirst({
      where: {
        id,
        userId,
      },
      include: {
        evidences: true,
      },
    });

    if (!analysis) {
      throw new NotFoundException('Analysis result not found');
    }

    return analysis;
  }
}
