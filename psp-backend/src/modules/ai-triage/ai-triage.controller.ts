import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AiTriageService } from './ai-triage.service';
import { AnalyzeTextDto } from './dto/analyze-text.dto';

@ApiTags('AI Triage')
@Controller('ai-triage')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AiTriageController {
  constructor(private readonly aiTriageService: AiTriageService) {}

  @Post('analyze-text')
  @ApiOperation({ summary: 'Analyze user text for cyberbullying indicators' })
  analyzeText(
    @Body() dto: AnalyzeTextDto,
    @CurrentUser() user: { userId: string },
  ) {
    return this.aiTriageService.analyzeText(dto, user.userId);
  }
}
