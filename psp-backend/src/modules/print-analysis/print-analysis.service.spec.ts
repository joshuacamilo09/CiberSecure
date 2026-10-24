import { Test, TestingModule } from '@nestjs/testing';
import { PrintAnalysisService } from './print-analysis.service';

describe('PrintAnalysisService', () => {
  let service: PrintAnalysisService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrintAnalysisService],
    }).compile();

    service = module.get<PrintAnalysisService>(PrintAnalysisService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
