import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Phone,
  MessageCircle,
  MapPin,
  Mail,
  Globe,
  Clock,
  Shield,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import PageHeader from "@/components/PageHeader";

const supportEntities = [
  {
    name: "Linha SOS Criança",
    description: "Apoio a crianças e jovens em situação de risco",
    phone: "21 361 78 80",
    website: "www.iacrianca.pt",
  },
  {
    name: "Internet Segura",
    description: "Linha de denúncia e apoio sobre segurança online",
    phone: "210 497 400",
    website: "www.internetsegura.pt",
  },
  {
    name: "APAV - Vítimas de Crime",
    description: "Apoio a vítimas de crime, incluindo crimes online",
    phone: "116 006",
    website: "www.apav.pt",
  },
];

const checklist = [
  "Capturas de ecrã de todas as mensagens, publicações ou comentários ofensivos",
  "Datas e horas em que ocorreram os incidentes",
  "Informação sobre o agressor (nome, perfil, contacto, se disponível)",
  "Descrição detalhada do que aconteceu e como se sente",
];

const ActionButton = ({
  variant = "primary",
  icon: Icon,
  label,
  href,
  onClick,
}) => {
  const className =
    variant === "primary"
      ? "w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-secondary text-secondary-foreground text-sm font-semibold hover:bg-secondary/90 transition-colors"
      : "w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-border text-foreground text-sm font-semibold hover:bg-muted transition-colors";

  if (href) {
    return (
      <a href={href} className={className}>
        {Icon && <Icon size={16} />}
        {label}
      </a>
    );
  }

  return (
    <button onClick={onClick} className={className}>
      {Icon && <Icon size={16} />}
      {label}
    </button>
  );
};

const QuickCard = ({ icon: Icon, title, description, primary, secondary }) => (
  <div className="bg-card rounded-2xl border border-border shadow-sm p-5">
    <div className="w-11 h-11 rounded-xl bg-secondary/10 flex items-center justify-center mb-4">
      <Icon size={20} className="text-secondary" />
    </div>

    <h3 className="text-base font-bold text-foreground mb-2">{title}</h3>
    <p className="text-sm text-muted-foreground leading-relaxed mb-4 break-words">
      {description}
    </p>

    <div className="space-y-2">
      {primary && (
        <ActionButton
          variant="primary"
          icon={primary.icon}
          label={primary.label}
          href={primary.href}
          onClick={primary.onClick}
        />
      )}

      {secondary && (
        <ActionButton
          variant="secondary"
          icon={secondary.icon}
          label={secondary.label}
          href={secondary.href}
          onClick={secondary.onClick}
        />
      )}
    </div>
  </div>
);

const InfoItem = ({ icon: Icon, label, value, helper, href, newTab }) => (
  <div className="flex items-start gap-3">
    <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center shrink-0">
      <Icon size={18} className="text-secondary" />
    </div>
    <div className="min-w-0">
      <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
        {label}
      </p>

      {href ? (
        <a
          href={href}
          target={newTab ? "_blank" : undefined}
          rel={newTab ? "noopener noreferrer" : undefined}
          className="text-sm font-semibold text-secondary hover:underline mt-1 block break-all sm:break-normal"
        >
          {value}
        </a>
      ) : (
        <p className="text-sm font-semibold text-foreground mt-1 break-words">
          {value}
        </p>
      )}

      {helper && <p className="text-xs text-muted-foreground mt-1">{helper}</p>}
    </div>
  </div>
);

const ApoioPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen pt-4 md:pt-20">
      <div className="container py-6 md:py-8 max-w-5xl mx-auto px-4">
        <PageHeader
          icon={Phone}
          title="Apoio e Contactos"
          subtitle="Não está sozinho. Escolha o canal de apoio mais adequado à sua situação."
        />

        <div className="space-y-6 md:space-y-8">
          {/* Banner urgente */}
          <motion.section
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl bg-gradient-to-r from-red-600 to-red-500 text-white shadow-lg p-5 md:p-7"
          >
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center shrink-0">
                <AlertTriangle size={22} />
              </div>

              <div className="flex-1">
                <h2 className="text-xl font-bold mb-2">Situação urgente?</h2>
                <p className="text-sm md:text-base text-white/90 leading-relaxed mb-5">
                  Se está em perigo imediato ou a situação é grave, contacte
                  imediatamente os serviços de emergência ou a linha direta da
                  PSP.
                </p>

                <div className="flex flex-col sm:flex-row flex-wrap gap-3">
                  <a
                    href="tel:112"
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white text-red-600 font-semibold text-sm hover:bg-white/95 transition-colors w-full sm:w-auto"
                  >
                    <Phone size={16} />
                    Ligar 112 (Emergência)
                  </a>

                  <a
                    href="tel:+351217654242"
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-white/30 text-white font-semibold text-sm hover:bg-white/10 transition-colors w-full sm:w-auto"
                  >
                    <Phone size={16} />
                    PSP: 217 654 242 - Linha direta
                  </a>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Quick cards */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <QuickCard
              icon={Phone}
              title="Ajuda urgente"
              description="Contacte-nos diretamente para situações que requerem atenção imediata. A sua segurança é a nossa prioridade. Temos equipa especializada disponível para ouvir, aconselhar e encaminhar o seu caso para os serviços adequados."
            />

            <QuickCard
              icon={MessageCircle}
              title="Falar com alguém"
              description="Converse com o nosso assistente virtual ou contacte-nos diretamente."
              primary={{
                icon: MessageCircle,
                label: "Assistente Virtual",
                onClick: () => navigate("/assistente"),
              }}
              secondary={{
                icon: Mail,
                label: "Email PSP",
                href: "mailto:cmlisboa@psp.pt",
              }}
            />

            <QuickCard
              icon={MapPin}
              title="Esquadras PSP"
              description="Encontre a esquadra mais próxima para atendimento presencial."
              primary={{
                icon: MapPin,
                label: "Ver no mapa",
                onClick: () => navigate("/contactos"),
              }}
            />
          </section>

          {/* Bloco PSP */}
          <section className="bg-card rounded-2xl border border-border shadow-sm p-5 md:p-7">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-[#0A2A43] flex items-center justify-center shrink-0">
                <Shield size={24} className="text-white" />
              </div>

              <div className="min-w-0">
                <h2 className="text-xl font-bold text-foreground">
                  Polícia de Segurança Pública
                </h2>
                <p className="text-sm text-muted-foreground mt-1 break-words">
                  A PSP é a força policial responsável pela segurança pública em
                  Portugal.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InfoItem
                icon={Phone}
                label="Telefone"
                value="+351 217 654 242"
                helper="Dias úteis, 9h–18h"
                href="tel:+351217654242"
              />

              <InfoItem
                icon={Mail}
                label="Email"
                value="cmlisboa@psp.pt"
                helper="Resposta em 24–48h"
                href="mailto:cmlisboa@psp.pt"
              />

              <InfoItem
                icon={Globe}
                label="Website"
                value="www.psp.pt"
                helper="Informação e recursos"
                href="https://www.psp.pt"
                newTab={true}
              />

              <InfoItem
                icon={Clock}
                label="Horário"
                value="Segunda a Sexta, 9h–18h"
                helper="Urgências 24/7"
              />
            </div>
          </section>

          {/* Outras entidades */}
          <section>
            <h2 className="text-xl font-bold text-foreground mb-4">
              Outras Entidades de Apoio
            </h2>

            <div className="space-y-4">
              {supportEntities.map((entity) => (
                <motion.div
                  key={entity.name}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-card rounded-2xl border border-border shadow-sm p-5"
                >
                  <h3 className="text-base font-bold text-foreground">
                    {entity.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1 mb-3 break-words">
                    {entity.description}
                  </p>

                  <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-4 text-sm">
                    <a
                      href={`tel:${entity.phone.replace(/\s/g, "")}`}
                      className="inline-flex items-center gap-2 text-secondary font-medium hover:underline"
                    >
                      <Phone size={14} className="shrink-0" />
                      {entity.phone}
                    </a>

                    <a
                      href={`https://${entity.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-secondary font-medium hover:underline break-all sm:break-normal"
                    >
                      <Globe size={14} className="shrink-0" />
                      {entity.website}
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Checklist */}
          <section className="rounded-2xl border border-blue-200 bg-blue-50 p-5 md:p-6">
            <h2 className="text-lg font-bold text-foreground mb-4">
              Ao contactar, tenha preparado:
            </h2>

            <div className="space-y-3">
              {checklist.map((item, index) => (
                <div key={index} className="flex items-start gap-3 text-sm">
                  <CheckCircle2
                    size={18}
                    className="text-blue-500 shrink-0 mt-0.5"
                  />
                  <span className="text-foreground break-words">{item}</span>
                </div>
              ))}
            </div>
          </section>

          {/* CTA final */}
          <section className="flex flex-col sm:flex-row sm:flex-wrap gap-3">
            <button
              onClick={() => navigate("/assistente")}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-secondary text-secondary-foreground font-semibold text-sm hover:bg-secondary/90 transition-colors w-full sm:w-auto"
            >
              Falar com assistente
              <ArrowRight size={16} />
            </button>

            <button
              onClick={() => navigate("/analisar")}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-border text-foreground font-semibold text-sm hover:bg-muted transition-colors w-full sm:w-auto"
            >
              Analisar situação
            </button>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ApoioPage;
