import { Test, TestingModule } from '@nestjs/testing';
import { AiTriageController } from './ai-triage.controller';

describe('AiTriageController', () => {
  let controller: AiTriageController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AiTriageController],
    }).compile();

    controller = module.get<AiTriageController>(AiTriageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
