import { Shield } from "lucide-react";

const Footer = () => (
  <footer className="border-t border-border bg-card">
    <div className="container py-8 text-center">
      <div className="flex items-center justify-center gap-2 mb-3">
        <Shield size={18} className="text-secondary" />
        <span className="text-sm font-semibold text-foreground">
          CiberSeguro
        </span>
      </div>
      <p className="text-xs text-muted-foreground">
        Plataforma de prevenção ao ciberbullying · Polícia de Segurança Pública
      </p>
    </div>
  </footer>
);

export default Footer;