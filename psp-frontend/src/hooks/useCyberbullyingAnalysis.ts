import { useState } from "react";

export interface AnalysisResult {
  type: string;         // ex: "insultos", "ameaças", "exposição", "não identificado"
  severity: "low" | "medium" | "high";
  recommendation: string;
  shouldContactPSP: boolean;
}

interface UseCyberbullyingAnalysisReturn {
  analyse: (description: string) => Promise<void>;
  result: AnalysisResult | null;
  isLoading: boolean;
  error: string | null;
  reset: () => void;
}

export const useCyberbullyingAnalysis = (): UseCyberbullyingAnalysisReturn => {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyse = async (description: string): Promise<void> => {
    if (!description.trim()) {
      setError("Por favor, descreva a situação antes de analisar.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      // TODO: substituir pelo endpoint real da PSP / IA interna
      // Exemplo de payload esperado pela API:
      // POST /api/analyse  { description: string }
      // Resposta: AnalysisResult

      // Simulação temporária para desenvolvimento:
      await new Promise((resolve) => setTimeout(resolve, 1200));

      const mock: AnalysisResult = {
        type: "insultos",
        severity: "medium",
        recommendation: "Guarda as mensagens como evidência e bloqueia o agressor. Considera falar com um adulto de confiança.",
        shouldContactPSP: false,
      };

      setResult(mock);
    } catch (err) {
      setError("Ocorreu um erro ao analisar. Tenta novamente.");
      console.error("[useCyberbullyingAnalysis]", err);
    } finally {
      setIsLoading(false);
    }
  };

  const reset = (): void => {
    setResult(null);
    setError(null);
    setIsLoading(false);
  };

  return { analyse, result, isLoading, error, reset };
};
