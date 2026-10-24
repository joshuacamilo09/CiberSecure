import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Mail, Lock, User, ArrowRight, Loader2, AlertCircle, X } from "lucide-react";
import { useAuth } from "@/content/AuthContent";

const AuthOverlay = ({ onSuccess }) => {
    const { login, register } = useAuth();

    const [mode, setMode] = useState("login"); // "login" | "register"
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            if (mode === "login") {
                await login(email, password);
            } else {
                await register(name, email, password);
            }
            onSuccess?.();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const toggleMode = () => {
        setMode((m) => (m === "login" ? "register" : "login"));
        setError(null);
        setName("");
        setEmail("");
        setPassword("");
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
        >
            {/* Blurred backdrop */}
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />

            {/* Card */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 16 }}
                transition={{ duration: 0.3 }}
                className="relative w-full max-w-md bg-card rounded-2xl border border-border shadow-xl p-6"
            >
                {/* Back link */}
                <a
                    href="/"
                    className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label="Voltar"
                >
                    <X size={18} />
                </a>

                {/* Header */}
                <div className="text-center mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center mx-auto mb-3">
                        <Shield size={24} className="text-secondary" />
                    </div>
                    <h2 className="text-xl font-bold text-foreground mb-1">
                        {mode === "login" ? "Bem-vindo/a de volta" : "Criar conta"}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        {mode === "login"
                            ? "Inicia sessão para aceder à análise de situações"
                            : "Regista-te para começar a usar a plataforma"}
                    </p>
                </div>

                {/* Error */}
                <AnimatePresence>
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700 mb-4"
                        >
                            <AlertCircle size={15} className="shrink-0" />
                            {error}
                        </motion.div>
                    )}
                </AnimatePresence>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name — register only */}
                    <AnimatePresence>
                        {mode === "register" && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="overflow-hidden"
                            >
                                <label className="block text-sm font-medium text-foreground mb-1.5">
                                    Nome
                                </label>
                                <div className="relative">
                                    <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="O teu nome"
                                        required={mode === "register"}
                                        className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-secondary transition-colors"
                                    />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1.5">
                            Email
                        </label>
                        <div className="relative">
                            <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="exemplo@email.com"
                                required
                                className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-secondary transition-colors"
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1.5">
                            Palavra-passe
                        </label>
                        <div className="relative">
                            <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                minLength={8}
                                className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-secondary transition-colors"
                            />
                        </div>
                    </div>

                    {/* Submit */}
                    <motion.button
                        type="submit"
                        disabled={loading}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-secondary text-secondary-foreground font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-secondary/90 transition-colors"
                    >
                        {loading ? (
                            <Loader2 size={16} className="animate-spin" />
                        ) : (
                            <>
                                {mode === "login" ? "Entrar" : "Criar conta"}
                                <ArrowRight size={15} />
                            </>
                        )}
                    </motion.button>
                </form>

                {/* Toggle */}
                <p className="text-center text-sm text-muted-foreground mt-5">
                    {mode === "login" ? "Ainda não tens conta?" : "Já tens conta?"}{" "}
                    <button
                        onClick={toggleMode}
                        className="text-secondary font-semibold hover:underline underline-offset-2 transition-colors"
                    >
                        {mode === "login" ? "Registar" : "Iniciar sessão"}
                    </button>
                </p>
            </motion.div>
        </motion.div>
    );
};

export default AuthOverlay;
