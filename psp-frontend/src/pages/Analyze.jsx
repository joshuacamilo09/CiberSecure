import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Upload,
  MessageSquareWarning,
  AlertTriangle,
  Eye,
  ArrowRight,
  Shield,
  Save,
  Ban,
  Phone,
  Loader2,
} from "lucide-react";
import PageHeader from "@/components/PageHeader";
import RiskBadge from "@/components/RiskBadge";
import AuthOverlay from "@/components/AuthOverlay";
import { useAuth } from "@/content/AuthContent";
import { apiFetch } from "@/lib/api";

const quickButtons = [
  {
    icon: MessageSquareWarning,
    label: "Recebi insultos",
    text: "Recebi insultos e mensagens ofensivas repetidas.",
  },
  {
    icon: AlertTriangle,
    label: "Fui ameaçado/a",
    text: "Recebi ameaças online e sinto-me em risco.",
  },
  {
    icon: Eye,
    label: "Partilharam algo meu",
    text: "Partilharam uma imagem ou informação minha sem autorização.",
  },
];

const actionIcons = [Save, Ban, Phone, Shield];

const severityToRisk = {
  low: "low",
  medium: "medium",
  high: "high",
};

const AnalyzePage = () => {
  const { isAuthenticated } = useAuth();

  const [description, setDescription] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [result, setResult] = useState(null);
  const [selectedFileName, setSelectedFileName] = useState("");
  const fileInputRef = useRef(null);

  const mapResult = (data) => ({
    type: data.classification,
    risk: severityToRisk[data.severity] ?? "low",
    explanation: data.summary,
    actions: data.recommendedActions ?? [],
    shouldSuggestPsp: data.shouldSuggestPsp ?? false,
    detectedSignals: data.detectedSignals ?? [],
    analysisId: data.analysisId,
    evidence: data.evidence ?? null,
  });

  const handleQuickSelect = async (text) => {
    setDescription(text);
    setError(null);
    setLoading(true);

    try {
      const data = await apiFetch("/ai-triage/analyze-text", {
        method: "POST",
        body: JSON.stringify({ text }),
      });

      setResult(mapResult(data));
      setShowResult(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = async () => {
    if (!description.trim()) return;

    setError(null);
    setLoading(true);

    try {
      const data = await apiFetch("/ai-triage/analyze-text", {
        method: "POST",
        body: JSON.stringify({ text: description }),
      });

      setResult(mapResult(data));
      setShowResult(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePickFile = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFileName(file.name);
    setError(null);
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const data = await apiFetch("/print-analysis/upload", {
        method: "POST",
        body: formData,
      });

      setResult(mapResult(data));
      setShowResult(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setShowResult(false);
    setDescription("");
    setResult(null);
    setError(null);
    setSelectedFileName("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="relative min-h-screen pt-4 md:pt-20">
      <div
        className={
          !isAuthenticated ? "pointer-events-none select-none blur-sm" : ""
        }
      >
        <div className="container py-6 md:py-8 max-w-3xl mx-auto px-4">
          <PageHeader
            icon={Search}
            title="Analisar situação"
            subtitle="Descreva o que aconteceu e ajudamos a avaliar"
          />

          {error && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <AnimatePresence mode="wait">
            {!showResult ? (
              <motion.div
                key="input"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                className="space-y-5 md:space-y-6"
              >
                <div>
                  <p className="text-sm font-medium text-foreground mb-3">
                    Seleção rápida
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {quickButtons.map((btn) => (
                      <motion.button
                        key={btn.label}
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleQuickSelect(btn.text)}
                        disabled={loading}
                        className="flex items-center gap-3 p-4 rounded-xl border border-border bg-card hover:border-secondary/30 transition-all text-left disabled:opacity-60 min-h-[84px]"
                      >
                        <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center shrink-0">
                          <btn.icon size={20} className="text-destructive" />
                        </div>
                        <span className="text-sm font-medium text-foreground break-words">
                          {btn.label}
                        </span>
                      </motion.button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px bg-border" />
                  <span className="text-xs text-muted-foreground font-medium text-center">
                    ou descreva a situação
                  </span>
                  <div className="flex-1 h-px bg-border" />
                </div>

                <div className="bg-card rounded-xl border border-border p-4 md:p-5">
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Descreva o que aconteceu..."
                    className="w-full min-h-[140px] md:min-h-[120px] bg-transparent text-sm text-foreground placeholder:text-muted-foreground resize-none outline-none"
                  />

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    className="hidden"
                    onChange={handleFileChange}
                  />

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-4 pt-4 border-t border-border gap-3">
                    <button
                      onClick={handlePickFile}
                      disabled={loading}
                      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50 text-left"
                    >
                      <Upload size={16} className="shrink-0" />
                      <span className="break-all">
                        {selectedFileName
                          ? `Selecionado: ${selectedFileName}`
                          : "Anexar captura de ecrã"}
                      </span>
                    </button>

                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleAnalyze}
                      disabled={!description.trim() || loading}
                      className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-secondary text-secondary-foreground font-semibold text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-secondary/90 transition-colors w-full sm:w-auto"
                    >
                      {loading ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        "Analisar"
                      )}
                      {!loading && <ArrowRight size={16} />}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ) : result ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                className="space-y-5 md:space-y-6"
              >
                <div className="bg-card rounded-xl border border-border p-5 md:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                    <div>
                      <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">
                        Classificação
                      </p>
                      <h3 className="text-lg font-bold text-foreground break-words">
                        {result.type}
                      </h3>
                    </div>
                    <div className="self-start">
                      <RiskBadge level={result.risk} />
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground leading-relaxed break-words">
                    {result.explanation}
                  </p>
                </div>

                <div className="bg-card rounded-xl border border-border p-5 md:p-6">
                  <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Shield size={18} className="text-secondary shrink-0" />
                    Ações recomendadas
                  </h3>

                  <div className="space-y-3">
                    {result.actions.map((action, i) => {
                      const ActionIcon = actionIcons[i] ?? Shield;

                      return (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="flex items-start gap-3 text-sm"
                        >
                          <div className="w-6 h-6 rounded-full bg-secondary/10 flex items-center justify-center shrink-0 mt-0.5">
                            <ActionIcon size={12} className="text-secondary" />
                          </div>
                          <span className="text-foreground break-words">
                            {action}
                          </span>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3">
                  <a
                    href="/assistente"
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-secondary text-secondary-foreground font-semibold text-sm hover:bg-secondary/90 transition-colors w-full sm:w-auto"
                  >
                    Falar com assistente
                    <ArrowRight size={16} />
                  </a>

                  <a
                    href="/contactos"
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-border text-foreground font-semibold text-sm hover:bg-muted transition-colors w-full sm:w-auto"
                  >
                    Ver apoio próximo
                  </a>

                  <button
                    onClick={reset}
                    className="px-5 py-3 rounded-xl text-muted-foreground font-medium text-sm hover:text-foreground transition-colors w-full sm:w-auto"
                  >
                    Nova análise
                  </button>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>{!isAuthenticated && <AuthOverlay />}</AnimatePresence>
    </div>
  );
};

export default AnalyzePage;
