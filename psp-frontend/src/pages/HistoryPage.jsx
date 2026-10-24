import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  History,
  User,
  MessageSquare,
  Search,
  Loader2,
  AlertCircle,
  Calendar,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import PageHeader from "@/components/PageHeader";
import RiskBadge from "@/components/RiskBadge";
import AuthOverlay from "@/components/AuthOverlay";
import { useAuth } from "@/content/AuthContent";
import { apiFetch } from "@/lib/api";

const formatDate = (dateString) => {
  try {
    return new Date(dateString).toLocaleString("pt-PT", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateString;
  }
};

const severityToRisk = {
  low: "low",
  medium: "medium",
  high: "high",
};

const EmptyState = ({ icon: Icon, title, description }) => (
  <div className="bg-card rounded-xl border border-border p-6 md:p-8 text-center">
    <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center mx-auto mb-4">
      <Icon size={22} className="text-secondary" />
    </div>
    <h3 className="text-base font-semibold text-foreground mb-2">{title}</h3>
    <p className="text-sm text-muted-foreground break-words">{description}</p>
  </div>
);

const Pagination = ({ page, totalPages, onPrev, onNext }) => {
  if (!totalPages || totalPages <= 1) return null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
      <button
        onClick={onPrev}
        disabled={page <= 1}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm text-foreground disabled:opacity-40 disabled:cursor-not-allowed hover:bg-muted transition-colors w-full sm:w-auto justify-center"
      >
        <ChevronLeft size={16} />
        Anterior
      </button>

      <span className="text-sm text-muted-foreground text-center">
        Página <span className="font-medium text-foreground">{page}</span> de{" "}
        <span className="font-medium text-foreground">{totalPages}</span>
      </span>

      <button
        onClick={onNext}
        disabled={page >= totalPages}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm text-foreground disabled:opacity-40 disabled:cursor-not-allowed hover:bg-muted transition-colors w-full sm:w-auto justify-center"
      >
        Seguinte
        <ChevronRight size={16} />
      </button>
    </div>
  );
};

const ProfileCard = ({ profile }) => {
  if (!profile) return null;

  return (
    <div className="bg-card rounded-xl border border-border p-5 md:p-6">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center shrink-0">
          <User size={22} className="text-secondary" />
        </div>

        <div className="min-w-0">
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">
            Perfil
          </p>
          <h3 className="text-lg font-bold text-foreground break-words">
            {profile.name}
          </h3>
          <p className="text-sm text-muted-foreground break-words">
            {profile.email}
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Conta criada em {formatDate(profile.createdAt)}
          </p>
        </div>
      </div>
    </div>
  );
};

const AnalysisCard = ({ analysis }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-card rounded-xl border border-border p-5"
  >
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">
          Análise
        </p>
        <h3 className="text-base font-semibold text-foreground break-words">
          {analysis.classification || "Sem classificação"}
        </h3>
      </div>

      {analysis.severity && (
        <div className="self-start">
          <RiskBadge level={severityToRisk[analysis.severity] ?? "low"} />
        </div>
      )}
    </div>

    <p className="text-sm text-muted-foreground leading-relaxed mb-4 break-words">
      {analysis.aiSummary ||
        analysis.originalText ||
        "Sem descrição disponível."}
    </p>

    {Array.isArray(analysis.recommendedActions) &&
      analysis.recommendedActions.length > 0 && (
        <div className="mb-4">
          <p className="text-xs font-medium text-foreground mb-2">
            Ações recomendadas
          </p>
          <div className="space-y-2">
            {analysis.recommendedActions.slice(0, 3).map((action, index) => (
              <div
                key={index}
                className="text-sm text-muted-foreground break-words"
              >
                • {action}
              </div>
            ))}
          </div>
        </div>
      )}

    <div className="flex items-center gap-2 text-xs text-muted-foreground">
      <Calendar size={13} className="shrink-0" />
      {formatDate(analysis.createdAt)}
    </div>
  </motion.div>
);

const ChatCard = ({ chat }) => {
  const lastMessage =
    chat.messages && chat.messages.length > 0
      ? chat.messages[chat.messages.length - 1]
      : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-xl border border-border p-5"
    >
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
        <div className="min-w-0">
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">
            Conversa
          </p>
          <h3 className="text-base font-semibold text-foreground break-words">
            Sessão #{chat.id.slice(0, 8)}
          </h3>
        </div>

        <div className="text-xs text-muted-foreground">
          {chat.messages?.length ?? 0} mensagens
        </div>
      </div>

      <p className="text-sm text-muted-foreground leading-relaxed mb-4 break-words">
        {lastMessage?.content || "Ainda sem mensagens nesta sessão."}
      </p>

      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Calendar size={13} className="shrink-0" />
        {formatDate(chat.startedAt)}
      </div>
    </motion.div>
  );
};

const HistoryPage = () => {
  const { isAuthenticated } = useAuth();

  const [profile, setProfile] = useState(null);

  const [analyses, setAnalyses] = useState([]);
  const [analysesMeta, setAnalysesMeta] = useState(null);
  const [analysesPage, setAnalysesPage] = useState(1);

  const [chats, setChats] = useState([]);
  const [chatsMeta, setChatsMeta] = useState(null);
  const [chatsPage, setChatsPage] = useState(1);

  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingAnalyses, setLoadingAnalyses] = useState(true);
  const [loadingChats, setLoadingChats] = useState(true);

  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) return;

    const loadProfile = async () => {
      try {
        setLoadingProfile(true);
        const data = await apiFetch("/users/me/profile");
        setProfile(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingProfile(false);
      }
    };

    loadProfile();
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) return;

    const loadAnalyses = async () => {
      try {
        setLoadingAnalyses(true);
        const data = await apiFetch(
          `/users/me/analyses?page=${analysesPage}&limit=6`,
        );
        setAnalyses(data.items ?? []);
        setAnalysesMeta(data.meta ?? null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingAnalyses(false);
      }
    };

    loadAnalyses();
  }, [isAuthenticated, analysesPage]);

  useEffect(() => {
    if (!isAuthenticated) return;

    const loadChats = async () => {
      try {
        setLoadingChats(true);
        const data = await apiFetch(
          `/users/me/chats?page=${chatsPage}&limit=6`,
        );
        setChats(data.items ?? []);
        setChatsMeta(data.meta ?? null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingChats(false);
      }
    };

    loadChats();
  }, [isAuthenticated, chatsPage]);

  return (
    <div className="relative min-h-screen pt-4 md:pt-20">
      <div
        className={
          !isAuthenticated ? "pointer-events-none select-none blur-sm" : ""
        }
      >
        <div className="container py-6 md:py-8 max-w-5xl mx-auto px-4">
          <PageHeader
            icon={History}
            title="Histórico"
            subtitle="Consulte as suas análises e conversas anteriores"
          />

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700 mb-6"
              >
                <AlertCircle size={15} className="shrink-0" />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-7 md:space-y-8">
            <section>
              {loadingProfile ? (
                <div className="bg-card rounded-xl border border-border p-6 flex items-center gap-3 text-sm text-muted-foreground">
                  <Loader2 size={16} className="animate-spin" />A carregar
                  perfil...
                </div>
              ) : (
                <ProfileCard profile={profile} />
              )}
            </section>

            <section className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center shrink-0">
                  <Search size={18} className="text-secondary" />
                </div>
                <div className="min-w-0">
                  <h2 className="text-lg font-bold text-foreground">
                    Análises
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Histórico das situações analisadas
                  </p>
                </div>
              </div>

              {loadingAnalyses ? (
                <div className="bg-card rounded-xl border border-border p-6 flex items-center gap-3 text-sm text-muted-foreground">
                  <Loader2 size={16} className="animate-spin" />A carregar
                  análises...
                </div>
              ) : analyses.length === 0 ? (
                <EmptyState
                  icon={Search}
                  title="Ainda não existem análises"
                  description="Quando analisares texto ou imagens, os resultados vão aparecer aqui."
                />
              ) : (
                <>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {analyses.map((analysis) => (
                      <AnalysisCard key={analysis.id} analysis={analysis} />
                    ))}
                  </div>

                  <Pagination
                    page={analysesMeta?.page ?? 1}
                    totalPages={analysesMeta?.totalPages ?? 1}
                    onPrev={() =>
                      setAnalysesPage((prev) => Math.max(1, prev - 1))
                    }
                    onNext={() =>
                      setAnalysesPage((prev) =>
                        Math.min(analysesMeta?.totalPages ?? prev, prev + 1),
                      )
                    }
                  />
                </>
              )}
            </section>

            <section className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center shrink-0">
                  <MessageSquare size={18} className="text-secondary" />
                </div>
                <div className="min-w-0">
                  <h2 className="text-lg font-bold text-foreground">
                    Conversas
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Sessões com o assistente inteligente
                  </p>
                </div>
              </div>

              {loadingChats ? (
                <div className="bg-card rounded-xl border border-border p-6 flex items-center gap-3 text-sm text-muted-foreground">
                  <Loader2 size={16} className="animate-spin" />A carregar
                  conversas...
                </div>
              ) : chats.length === 0 ? (
                <EmptyState
                  icon={MessageSquare}
                  title="Ainda não existem conversas"
                  description="Quando falares com o assistente, as sessões vão aparecer aqui."
                />
              ) : (
                <>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {chats.map((chat) => (
                      <ChatCard key={chat.id} chat={chat} />
                    ))}
                  </div>

                  <Pagination
                    page={chatsMeta?.page ?? 1}
                    totalPages={chatsMeta?.totalPages ?? 1}
                    onPrev={() => setChatsPage((prev) => Math.max(1, prev - 1))}
                    onNext={() =>
                      setChatsPage((prev) =>
                        Math.min(chatsMeta?.totalPages ?? prev, prev + 1),
                      )
                    }
                  />
                </>
              )}
            </section>
          </div>
        </div>
      </div>

      <AnimatePresence>{!isAuthenticated && <AuthOverlay />}</AnimatePresence>
    </div>
  );
};

export default HistoryPage;
