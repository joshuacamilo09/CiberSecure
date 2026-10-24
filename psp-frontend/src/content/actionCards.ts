import { BookOpen, Search, AlertTriangle } from "lucide-react";
import { ActionCardData } from "@/types";

export const ACTION_CARDS: ActionCardData[] = [
  {
    icon: BookOpen,
    title: "Aprender",
    description: "Descubra o que é o ciberbullying, como identificar e como se proteger.",
    to: "/aprender",
    variant: "default",
  },
  {
    icon: Search,
    title: "Analisar situação",
    description: "Envie uma mensagem ou descreva o que aconteceu. Vamos ajudar a classificar.",
    to: "/analisar",
    variant: "accent",
  },
  {
    icon: AlertTriangle,
    title: "Preciso de ajuda",
    description: "Aceda a apoio imediato, contacte a PSP ou fale com o nosso assistente.",
    to: "/apoio",
    variant: "warning",
  },
];
