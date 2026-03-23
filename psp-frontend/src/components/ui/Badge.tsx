import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface BadgeProps {
  icon?: LucideIcon;
  label: string;
  className?: string;
}

const Badge = ({ icon: Icon, label, className }: BadgeProps) => (
  <div
    className={cn(
      "inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-foreground/10 border border-primary-foreground/20",
      className
    )}
  >
    {Icon && <Icon size={14} className="text-accent" />}
    <span className="text-xs font-medium text-primary-foreground/80">{label}</span>
  </div>
);

export default Badge;
