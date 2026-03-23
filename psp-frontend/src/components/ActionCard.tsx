import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ActionCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  to: string;
  variant?: "default" | "accent" | "warning";
  delay?: number;
}

const variantStyles = {
  default: "border-border hover:border-secondary/50 hover:bg-secondary/5",
  accent: "border-accent/30 bg-accent/5 hover:bg-accent/10",
  warning: "border-destructive/30 bg-destructive/5 hover:bg-destructive/10",
};

const iconStyles = {
  default: "bg-secondary/10 text-secondary",
  accent: "bg-accent/20 text-accent-foreground",
  warning: "bg-destructive/10 text-destructive",
};

const ActionCard = ({
  icon: Icon,
  title,
  description,
  to,
  variant = "default",
  delay = 0,
}: ActionCardProps) => (
  <motion.a
    href={to}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay }}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    className={cn(
      "block p-6 rounded-xl border bg-card card-shadow transition-colors cursor-pointer",
      variantStyles[variant]
    )}
  >
    <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center mb-4", iconStyles[variant])}>
      <Icon size={20} />
    </div>
    <h3 className="font-semibold text-foreground mb-2">{title}</h3>
    <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
  </motion.a>
);

export default ActionCard;
