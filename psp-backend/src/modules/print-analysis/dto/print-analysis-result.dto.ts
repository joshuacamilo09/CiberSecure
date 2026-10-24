export class PrintAnalysisResultDto {
  analysisId: string;
  classification: string;
  severity: 'low' | 'medium' | 'high';
  summary: string;
  recommendedActions: string[];
  shouldSuggestPsp: boolean;
  detectedSignals: string[];
  evidence: {
    id: string;
    fileUrl: string;
    mimeType?: string | null;
    size?: number | null;
  };
}