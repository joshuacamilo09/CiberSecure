import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bot,
  MessageSquare,
  Plus,
  Send,
  Loader2,
  AlertCircle,
  Shield,
} from "lucide-react";
import PageHeader from "@/components/PageHeader";
import AuthOverlay from "@/components/AuthOverlay";
import { useAuth } from "@/content/AuthContent";
import { apiFetch } from "@/lib/api";

const formatDate = (dateString) => {
  try {
    return new Date(dateString).toLocaleString("pt-PT", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateString;
  }
};

const getSessionPreview = (session) => {
  if (!session?.messages?.length) return "Nova conversa";
  const firstUserMessage = session.messages.find((m) => m.role === "user");
  return firstUserMessage?.content?.slice(0, 48) || "Conversa";
};

const MessageBubble = ({ message }) => {
  const isAssistant = message.role === "assistant";

  return (
    <div className={`flex ${isAssistant ? "justify-start" : "justify-end"}`}>
      <div
        className={[
          "max-w-[90%] sm:max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
          isAssistant
            ? "bg-card border border-border text-foreground"
            : "bg-secondary text-secondary-foreground",
        ].join(" ")}
      >
        <div className="whitespace-pre-wrap break-words">{message.content}</div>

        {isAssistant && message.intent && (
          <div className="mt-2 text-[11px] text-muted-foreground">
            Intenção: {message.intent}
          </div>
        )}
      </div>
    </div>
  );
};

const AssistentePage = () => {
  const { isAuthenticated } = useAuth();

  const [sessions, setSessions] = useState([]);
  const [sessionsLoading, setSessionsLoading] = useState(true);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [activeSession, setActiveSession] = useState(null);

  const [message, setMessage] = useState("");
  const [creatingSession, setCreatingSession] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [loadingSession, setLoadingSession] = useState(false);

  const [assistantMeta, setAssistantMeta] = useState(null);
  const [error, setError] = useState(null);

  const messagesEndRef = useRef(null);

  const sortedSessions = useMemo(() => {
    return [...sessions].sort((a, b) => {
      const aDate = new Date(a.startedAt).getTime();
      const bDate = new Date(b.startedAt).getTime();
      return bDate - aDate;
    });
  }, [sessions]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadChats = async () => {
    try {
      setSessionsLoading(true);
      const data = await apiFetch("/users/me/chats?page=1&limit=50");
      const items = data?.items ?? [];
      setSessions(items);

      if (!activeSessionId && items.length > 0) {
        setActiveSessionId(items[0].id);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSessionsLoading(false);
    }
  };

  const loadSession = async (sessionId) => {
    if (!sessionId) return;

    try {
      setLoadingSession(true);
      setError(null);
      const data = await apiFetch(`/chat/sessions/${sessionId}`);
      setActiveSession(data);
      setActiveSessionId(sessionId);
      setAssistantMeta(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingSession(false);
    }
  };

  const createNewSession = async () => {
    try {
      setCreatingSession(true);
      setError(null);

      const data = await apiFetch("/chat/sessions", {
        method: "POST",
        body: JSON.stringify({}),
      });

      const newSession = { ...data, messages: [] };

      setSessions((prev) => [newSession, ...prev]);
      setActiveSessionId(newSession.id);
      setActiveSession(newSession);
      setAssistantMeta(null);
      setMessage("");
    } catch (err) {
      setError(err.message);
    } finally {
      setCreatingSession(false);
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim() || !activeSessionId || sendingMessage) return;

    const content = message.trim();
    setMessage("");
    setError(null);

    const optimisticUserMessage = {
      id: `temp-${Date.now()}`,
      role: "user",
      content,
      intent: null,
      createdAt: new Date().toISOString(),
    };

    setActiveSession((prev) =>
      prev
        ? {
            ...prev,
            messages: [...(prev.messages ?? []), optimisticUserMessage],
          }
        : prev,
    );

    try {
      setSendingMessage(true);

      const data = await apiFetch(
        `/chat/sessions/${activeSessionId}/messages`,
        {
          method: "POST",
          body: JSON.stringify({ content }),
        },
      );

      setActiveSession(data.session);
      setAssistantMeta(data.assistant);
      await loadChats();
    } catch (err) {
      setError(err.message);

      setActiveSession((prev) =>
        prev
          ? {
              ...prev,
              messages: (prev.messages ?? []).filter(
                (m) => m.id !== optimisticUserMessage.id,
              ),
            }
          : prev,
      );
    } finally {
      setSendingMessage(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) return;
    loadChats();
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) return;
    if (activeSessionId) loadSession(activeSessionId);
  }, [activeSessionId, isAuthenticated]);

  useEffect(() => {
    scrollToBottom();
  }, [activeSession?.messages, sendingMessage]);

  return (
    <div className="relative min-h-screen pt-4 md:pt-20">
      <div
        className={
          !isAuthenticated ? "pointer-events-none select-none blur-sm" : ""
        }
      >
        <div className="container py-6 md:py-8 max-w-7xl mx-auto px-4">
          <PageHeader
            icon={Bot}
            title="Assistente inteligente"
            subtitle="Converse com o assistente para obter apoio e orientação"
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

          <div className="grid grid-cols-1 xl:grid-cols-[320px_1fr] gap-4 md:gap-6">
            {/* Sidebar */}
            <aside className="bg-card rounded-2xl border border-border p-4 xl:h-[75vh] flex flex-col">
              <div className="flex items-center justify-between gap-3 mb-4">
                <div>
                  <h2 className="text-base font-bold text-foreground">
                    Conversas
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Histórico rápido
                  </p>
                </div>

                <button
                  onClick={createNewSession}
                  disabled={creatingSession}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary text-secondary-foreground text-sm font-semibold hover:bg-secondary/90 transition-colors disabled:opacity-50"
                >
                  {creatingSession ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Plus size={14} />
                  )}
                  <span className="hidden sm:inline">Nova</span>
                </button>
              </div>

              <div className="max-h-[240px] xl:max-h-none xl:flex-1 overflow-y-auto space-y-2 pr-1">
                {sessionsLoading ? (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground p-3">
                    <Loader2 size={14} className="animate-spin" />A carregar
                    conversas...
                  </div>
                ) : sortedSessions.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-border p-4 text-sm text-muted-foreground">
                    Ainda não tens conversas. Cria uma nova sessão para começar.
                  </div>
                ) : (
                  sortedSessions.map((session) => {
                    const isActive = session.id === activeSessionId;

                    return (
                      <button
                        key={session.id}
                        onClick={() => setActiveSessionId(session.id)}
                        className={[
                          "w-full text-left rounded-xl border px-4 py-3 transition-all",
                          isActive
                            ? "border-secondary bg-secondary/5"
                            : "border-border hover:bg-muted",
                        ].join(" ")}
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-9 h-9 rounded-lg bg-secondary/10 flex items-center justify-center shrink-0">
                            <MessageSquare
                              size={16}
                              className="text-secondary"
                            />
                          </div>

                          <div className="min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">
                              {getSessionPreview(session)}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {formatDate(session.startedAt)}
                            </p>
                          </div>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </aside>

            {/* Main Chat */}
            <section className="bg-card rounded-2xl border border-border min-h-[70vh] xl:h-[75vh] flex flex-col overflow-hidden">
              <div className="border-b border-border px-4 md:px-5 py-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center shrink-0">
                  <Shield size={18} className="text-secondary" />
                </div>
                <div className="min-w-0">
                  <h2 className="text-base font-bold text-foreground">
                    Assistente de apoio
                  </h2>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    Respostas orientadas para ciberbullying e segurança digital
                  </p>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto px-4 md:px-5 py-5 space-y-4">
                {loadingSession ? (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 size={16} className="animate-spin" />A carregar
                    conversa...
                  </div>
                ) : !activeSession ? (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center max-w-sm">
                      <div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center mx-auto mb-4">
                        <Bot size={24} className="text-secondary" />
                      </div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">
                        Inicia uma nova conversa
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Cria uma sessão e fala com o assistente para obter
                        ajuda.
                      </p>
                      <button
                        onClick={createNewSession}
                        disabled={creatingSession}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary text-secondary-foreground font-semibold text-sm hover:bg-secondary/90 disabled:opacity-50"
                      >
                        {creatingSession ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : (
                          <Plus size={14} />
                        )}
                        Nova conversa
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    {(activeSession.messages ?? []).length === 0 ? (
                      <div className="h-full flex items-center justify-center">
                        <div className="text-center max-w-md">
                          <div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center mx-auto mb-4">
                            <Bot size={24} className="text-secondary" />
                          </div>
                          <h3 className="text-lg font-semibold text-foreground mb-2">
                            Como posso ajudar?
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Podes descrever a situação, pedir orientação ou
                            falar sobre uma análise que fizeste.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <>
                        {activeSession.messages.map((msg) => (
                          <MessageBubble key={msg.id} message={msg} />
                        ))}

                        {sendingMessage && (
                          <div className="flex justify-start">
                            <div className="bg-card border border-border rounded-2xl px-4 py-3 text-sm text-muted-foreground flex items-center gap-2">
                              <Loader2 size={14} className="animate-spin" />O
                              assistente está a responder...
                            </div>
                          </div>
                        )}
                      </>
                    )}

                    {assistantMeta?.suggestedActions?.length > 0 && (
                      <div className="rounded-xl border border-border bg-muted/30 p-4">
                        <p className="text-sm font-medium text-foreground mb-2">
                          Sugestões do assistente
                        </p>
                        <div className="space-y-2">
                          {assistantMeta.suggestedActions.map(
                            (action, index) => (
                              <div
                                key={index}
                                className="text-sm text-muted-foreground break-words"
                              >
                                • {action}
                              </div>
                            ),
                          )}
                        </div>
                      </div>
                    )}

                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>

              <div className="border-t border-border p-3 md:p-4">
                <div className="flex items-end gap-3">
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Escreve a tua mensagem..."
                    rows={1}
                    disabled={!activeSession || sendingMessage}
                    className="flex-1 min-h-[48px] max-h-32 rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground resize-none outline-none focus:border-secondary disabled:opacity-50"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />

                  <button
                    onClick={handleSendMessage}
                    disabled={
                      !message.trim() || !activeSession || sendingMessage
                    }
                    className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-secondary text-secondary-foreground hover:bg-secondary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
                  >
                    {sendingMessage ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      <Send size={18} />
                    )}
                  </button>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>

      <AnimatePresence>{!isAuthenticated && <AuthOverlay />}</AnimatePresence>
    </div>
  );
};

export default AssistentePage;
