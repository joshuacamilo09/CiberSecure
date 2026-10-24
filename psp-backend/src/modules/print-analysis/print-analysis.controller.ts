import {
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { multerImageConfig } from '../../common/utils/upload/multer.config';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PrintAnalysisService } from './print-analysis.service';

@ApiTags('Print Analysis')
@Controller('print-analysis')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PrintAnalysisController {
  constructor(private readonly printAnalysisService: PrintAnalysisService) {}

  @Post('upload')
  @ApiOperation({ summary: 'Upload and analyze a screenshot/image' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file', multerImageConfig))
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
      required: ['file'],
    },
  })
  upload(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: { userId: string },
  ) {
    return this.printAnalysisService.uploadAndAnalyze(file, user.userId);
  }

  @Get(':id/result')
  @ApiOperation({ summary: 'Get analysis result' })
  getResult(@Param('id') id: string, @CurrentUser() user: { userId: string }) {
    return this.printAnalysisService.getResult(id, user.userId);
  }
}
