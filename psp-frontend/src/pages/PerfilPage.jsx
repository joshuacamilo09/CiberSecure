import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  Shield,
  Calendar,
  History,
  MessageSquare,
  Search,
  LogOut,
  Loader2,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import PageHeader from "@/components/PageHeader";
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

const StatCard = ({ icon: Icon, title, value, subtitle }) => (
  <div className="bg-card rounded-xl border border-border p-5">
    <div className="flex items-start gap-4">
      <div className="w-11 h-11 rounded-xl bg-secondary/10 flex items-center justify-center shrink-0">
        <Icon size={20} className="text-secondary" />
      </div>
      <div className="min-w-0">
        <p className="text-sm text-muted-foreground">{title}</p>
        <h3 className="text-2xl font-bold text-foreground mt-1 break-words">
          {value}
        </h3>
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-1 break-words">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  </div>
);

const InfoRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-3 py-3">
    <div className="w-9 h-9 rounded-lg bg-secondary/10 flex items-center justify-center shrink-0">
      <Icon size={16} className="text-secondary" />
    </div>
    <div className="min-w-0">
      <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
        {label}
      </p>
      <p className="text-sm text-foreground mt-1 break-words">{value}</p>
    </div>
  </div>
);

const PerfilPage = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [history, setHistory] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingHistory, setLoadingHistory] = useState(true);
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

    const loadHistory = async () => {
      try {
        setLoadingHistory(true);
        const data = await apiFetch("/users/me/history?page=1&limit=5");
        setHistory(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingHistory(false);
      }
    };

    loadProfile();
    loadHistory();
  }, [isAuthenticated]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const analysesCount = history?.analyses?.meta?.total ?? 0;
  const chatsCount = history?.chats?.meta?.total ?? 0;

  return (
    <div className="relative min-h-screen pt-4 md:pt-20">
      <div
        className={
          !isAuthenticated ? "pointer-events-none select-none blur-sm" : ""
        }
      >
        <div className="container py-6 md:py-8 max-w-5xl mx-auto px-4">
          <PageHeader
            icon={User}
            title="Perfil"
            subtitle="Consulte os seus dados e a sua atividade"
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

          {loadingProfile ? (
            <div className="bg-card rounded-xl border border-border p-6 flex items-center gap-3 text-sm text-muted-foreground">
              <Loader2 size={16} className="animate-spin" />A carregar perfil...
            </div>
          ) : profile ? (
            <div className="grid grid-cols-1 xl:grid-cols-[1.2fr_0.8fr] gap-5 md:gap-6">
              {/* Main */}
              <div className="space-y-5 md:space-y-6">
                <div className="bg-card rounded-2xl border border-border p-5 md:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="flex items-start gap-4 min-w-0">
                      <div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center shrink-0">
                        <User size={24} className="text-secondary" />
                      </div>

                      <div className="min-w-0">
                        <h2 className="text-xl font-bold text-foreground break-words">
                          {profile.name}
                        </h2>
                        <p className="text-sm text-muted-foreground mt-1">
                          Conta pessoal autenticada
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={handleLogout}
                      className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors w-full sm:w-auto"
                    >
                      <LogOut size={16} />
                      Terminar sessão
                    </button>
                  </div>

                  <div className="mt-6 divide-y divide-border">
                    <InfoRow icon={Mail} label="Email" value={profile.email} />
                    <InfoRow
                      icon={Shield}
                      label="Tipo de conta"
                      value={
                        profile.role === "admin"
                          ? "Administrador"
                          : "Utilizador"
                      }
                    />
                    <InfoRow
                      icon={Calendar}
                      label="Conta criada em"
                      value={formatDate(profile.createdAt)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <StatCard
                    icon={Search}
                    title="Análises realizadas"
                    value={analysesCount}
                    subtitle="Texto e imagens analisadas"
                  />
                  <StatCard
                    icon={MessageSquare}
                    title="Conversas criadas"
                    value={chatsCount}
                    subtitle="Sessões com o assistente"
                  />
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-5 md:space-y-6">
                <div className="bg-card rounded-2xl border border-border p-5 md:p-6">
                  <h3 className="text-base font-bold text-foreground mb-4">
                    Acesso rápido
                  </h3>

                  <div className="space-y-3">
                    <Link
                      to="/assistente"
                      className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl border border-border hover:bg-muted transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center shrink-0">
                          <MessageSquare size={18} className="text-secondary" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-foreground">
                            Assistente
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Falar com a IA
                          </p>
                        </div>
                      </div>
                      <ArrowRight
                        size={16}
                        className="text-muted-foreground shrink-0"
                      />
                    </Link>

                    <Link
                      to="/historico"
                      className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl border border-border hover:bg-muted transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center shrink-0">
                          <History size={18} className="text-secondary" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-foreground">
                            Histórico
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Ver análises e conversas
                          </p>
                        </div>
                      </div>
                      <ArrowRight
                        size={16}
                        className="text-muted-foreground shrink-0"
                      />
                    </Link>
                  </div>
                </div>

                <div className="bg-card rounded-2xl border border-border p-5 md:p-6">
                  <h3 className="text-base font-bold text-foreground mb-3">
                    Resumo
                  </h3>

                  {loadingHistory ? (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Loader2 size={14} className="animate-spin" />A carregar
                      atividade...
                    </div>
                  ) : (
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p>• {analysesCount} análises guardadas</p>
                      <p>• {chatsCount} conversas registadas</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <AnimatePresence>{!isAuthenticated && <AuthOverlay />}</AnimatePresence>
    </div>
  );
};

export default PerfilPage;
