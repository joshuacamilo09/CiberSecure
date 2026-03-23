import {
  Home,
  Phone,
  BookOpen,
  MessageCircle,
  User,
  LogOut,
  LifeBuoy,
  Menu,
  X,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useAuth } from "@/content/AuthContent";
import pspLogo from "@/assets/psp.jpg";

const navItems = [
  { path: "/", icon: Home, label: "Início" },
  { path: "/aprender", icon: BookOpen, label: "Aprender" },
  { path: "/analisar", icon: MessageCircle, label: "Analisar" },
  { path: "/apoio", icon: LifeBuoy, label: "Apoio" },
  { path: "/contactos", icon: Phone, label: "Contactos" },
];

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMobileOpen(false);
    navigate("/");
  };

  const handleNavigate = (path) => {
    setMobileOpen(false);
    navigate(path);
  };

  const isActivePath = (path) => location.pathname === path;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-card/95 backdrop-blur-lg">
      <div className="container h-16 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center shrink-0"
        >
          <img
            src={pspLogo}
            alt="Polícia de Segurança Pública"
            className="h-14 md:h-16 w-auto object-contain"
          />
        </button>

        {/* Desktop nav */}
        <nav className="hidden lg:flex absolute left-1/2 -translate-x-1/2 items-center gap-1">
          {navItems.map((item) => {
            const isActive = isActivePath(item.path);

            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="relative px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                {isActive && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute inset-0 rounded-lg bg-secondary/10"
                    transition={{ type: "spring", stiffness: 500, damping: 35 }}
                  />
                )}

                <span
                  className={`relative z-10 flex items-center gap-1.5 ${
                    isActive
                      ? "text-secondary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <item.icon size={16} />
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Desktop right side */}
        <div className="hidden lg:flex items-center justify-end gap-2 min-w-[180px]">
          {isAuthenticated ? (
            <>
              <button
                onClick={() => navigate("/perfil")}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition ${
                  isActivePath("/perfil")
                    ? "bg-secondary/10 text-secondary"
                    : "hover:bg-muted text-foreground"
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center">
                  <User size={16} />
                </div>
                <span className="text-sm font-medium hidden xl:block max-w-[110px] truncate">
                  {user?.name}
                </span>
              </button>

              <button
                onClick={handleLogout}
                className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition"
                title="Terminar sessão"
              >
                <LogOut size={16} />
              </button>
            </>
          ) : (
            <button
              onClick={() => navigate("/analisar")}
              className="text-sm px-4 py-2 rounded-lg bg-secondary text-secondary-foreground font-medium hover:bg-secondary/90 transition"
            >
              Entrar
            </button>
          )}
        </div>

        {/* Mobile right side */}
        <div className="flex lg:hidden items-center gap-2">
          {isAuthenticated && (
            <button
              onClick={() => navigate("/perfil")}
              className="p-2 rounded-lg hover:bg-muted transition"
              title="Perfil"
            >
              <User size={18} />
            </button>
          )}

          <button
            onClick={() => setMobileOpen((prev) => !prev)}
            className="p-2 rounded-lg hover:bg-muted transition"
            title="Menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="lg:hidden border-t border-border bg-card"
          >
            <div className="container py-4 space-y-2">
              {navItems.map((item) => {
                const isActive = isActivePath(item.path);

                return (
                  <button
                    key={item.path}
                    onClick={() => handleNavigate(item.path)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${
                      isActive
                        ? "bg-secondary/10 text-secondary"
                        : "text-foreground hover:bg-muted"
                    }`}
                  >
                    <item.icon size={18} />
                    {item.label}
                  </button>
                );
              })}

              {isAuthenticated ? (
                <>
                  <button
                    onClick={() => handleNavigate("/perfil")}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${
                      isActivePath("/perfil")
                        ? "bg-secondary/10 text-secondary"
                        : "text-foreground hover:bg-muted"
                    }`}
                  >
                    <User size={18} />
                    Perfil
                  </button>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-foreground hover:bg-muted transition"
                  >
                    <LogOut size={18} />
                    Terminar sessão
                  </button>
                </>
              ) : (
                <button
                  onClick={() => handleNavigate("/analisar")}
                  className="w-full px-4 py-3 rounded-xl bg-secondary text-secondary-foreground text-sm font-semibold hover:bg-secondary/90 transition"
                >
                  Entrar
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
