import { useState } from "react";

export function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendMessage() {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    const newHistory = [...messages, { role: "user", content: userMessage }];

    setMessages(newHistory);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/chatbot/message`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: userMessage,
            history: messages.map((m) => ({
              role: m.role,
              content: String(m.content),
            })),
          }),
        },
      );

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.data.reply },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Erro ao contactar o assistente. Tenta novamente.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end gap-2">
      {open && (
        <div className="w-[calc(100vw-2rem)] sm:w-80 h-[70vh] sm:h-[420px] max-w-md bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200">
          <div className="bg-blue-600 text-white px-4 py-3 font-semibold text-sm flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span>💬</span>
              <span>Assistente Virtual</span>
            </div>

            <button
              onClick={() => setOpen(false)}
              className="sm:hidden text-white/90 hover:text-white"
            >
              ✕
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2 text-sm">
            {messages.length === 0 && (
              <p className="text-gray-400 text-xs text-center mt-4">
                Olá! Como posso ajudar?
              </p>
            )}

            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <span
                  className={`px-3 py-2 rounded-xl max-w-[85%] leading-snug break-words ${
                    msg.role === "user"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {msg.content}
                </span>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <span className="px-3 py-2 rounded-xl bg-gray-100 text-gray-400 text-xs">
                  A escrever...
                </span>
              </div>
            )}
          </div>

          <div className="flex border-t border-gray-200">
            <input
              className="flex-1 px-3 py-3 text-sm outline-none min-w-0"
              placeholder="Escreve uma mensagem..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              disabled={loading}
            />
            <button
              onClick={sendMessage}
              disabled={loading}
              className="px-4 bg-blue-600 text-white text-sm hover:bg-blue-700 disabled:opacity-50 transition-colors shrink-0"
            >
              ➤
            </button>
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen((o) => !o)}
        className="bg-blue-600 hover:bg-blue-700 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg text-2xl transition-colors"
      >
        {open ? "✕" : "💬"}
      </button>
    </div>
  );
}
