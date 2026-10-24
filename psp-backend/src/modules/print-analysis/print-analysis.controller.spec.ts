import { Test, TestingModule } from '@nestjs/testing';
import { PrintAnalysisController } from './print-analysis.controller';

describe('PrintAnalysisController', () => {
  let controller: PrintAnalysisController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PrintAnalysisController],
    }).compile();

    controller = module.get<PrintAnalysisController>(PrintAnalysisController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
