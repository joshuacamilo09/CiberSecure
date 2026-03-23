import { Shield } from "lucide-react";
import { motion } from "framer-motion";

const NAV_LINKS = [
  { label: "Aprender", to: "/aprender" },
  { label: "Analisar", to: "/analisar" },
  { label: "Apoio", to: "/apoio" },
  { label: "Assistente", to: "/assistente" },
];

const Header = () => (
  <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-sm">
    <div className="container flex items-center justify-between h-14">
      <a href="/" className="flex items-center gap-2">
        <Shield size={20} className="text-secondary" />
        <span className="text-sm font-bold text-foreground">CiberSeguro</span>
      </a>

      <nav className="hidden md:flex items-center gap-1">
        {NAV_LINKS.map((link) => (
          <motion.a
            key={link.to}
            href={link.to}
            whileHover={{ scale: 1.03 }}
            className="px-3 py-1.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            {link.label}
          </motion.a>
        ))}
      </nav>

      {/* Mobile: hamburger placeholder — implement with your preferred drawer/sheet */}
      <button className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors" aria-label="Menu">
        <div className="w-4 h-0.5 bg-foreground mb-1" />
        <div className="w-4 h-0.5 bg-foreground mb-1" />
        <div className="w-4 h-0.5 bg-foreground" />
      </button>
    </div>
  </header>
);

export default Header;
