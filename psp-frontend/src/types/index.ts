import { LucideIcon } from "lucide-react";

export interface Stat {
  value: string;
  label: string;
}

export interface ActionCardData {
  icon: LucideIcon;
  title: string;
  description: string;
  to: string;
  variant: "default" | "accent" | "warning";
}

export interface CyberbullyingType {
  icon: LucideIcon;
  title: string;
  desc: string;
}
