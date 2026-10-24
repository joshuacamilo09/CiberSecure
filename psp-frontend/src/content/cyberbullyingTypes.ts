import { MessageSquareWarning, AlertTriangle, Eye } from "lucide-react";
import { CyberbullyingType } from "@/types";

export const CYBERBULLYING_TYPES: CyberbullyingType[] = [
  {
    icon: MessageSquareWarning,
    title: "Insultos e humilhação",
    desc: "Mensagens ofensivas, comentários depreciativos ou ridicularização pública.",
  },
  {
    icon: AlertTriangle,
    title: "Ameaças e intimidação",
    desc: "Mensagens ameaçadoras, chantagem emocional ou coerção online.",
  },
  {
    icon: Eye,
    title: "Exposição e partilha",
    desc: "Divulgação de fotos, vídeos ou informações pessoais sem consentimento.",
  },
];
