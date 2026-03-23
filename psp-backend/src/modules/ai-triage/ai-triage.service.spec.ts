import { Test, TestingModule } from '@nestjs/testing';
import { AiTriageService } from './ai-triage.service';

describe('AiTriageService', () => {
  let service: AiTriageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AiTriageService],
    }).compile();

    service = module.get<AiTriageService>(AiTriageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
