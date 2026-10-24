import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const variants = {
  default: {
    card: "bg-card border border-border hover:border-primary/40",
    icon: "bg-primary/10",
    iconColor: "text-primary",
    title: "text-foreground",
    desc: "text-muted-foreground",
    arrow: "text-primary",
  },
  accent: {
    card: "bg-card border border-border hover:border-secondary/40",
    icon: "bg-secondary/10",
    iconColor: "text-secondary",
    title: "text-foreground",
    desc: "text-muted-foreground",
    arrow: "text-secondary",
  },
  warning: {
    card: "bg-card border border-border hover:border-destructive/40",
    icon: "bg-destructive/10",
    iconColor: "text-destructive",
    title: "text-foreground",
    desc: "text-muted-foreground",
    arrow: "text-destructive",
  },
};

const ActionCard = ({
  icon: Icon,
  title,
  description,
  to,
  variant = "default",
  delay = 0,
}) => {
  const v = variants[variant];

  return (
    <motion.a
      href={to}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`block h-full p-5 md:p-6 rounded-xl card-shadow transition-colors cursor-pointer ${v.card}`}
    >
      <div className="flex flex-col h-full min-w-0">
        <div
          className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 shrink-0 ${v.icon}`}
        >
          <Icon size={20} className={v.iconColor} />
        </div>

        <h3 className={`font-semibold text-base mb-2 break-words ${v.title}`}>
          {title}
        </h3>

        <p className={`text-sm leading-relaxed mb-4 break-words ${v.desc}`}>
          {description}
        </p>

        <div
          className={`mt-auto flex items-center gap-1 text-sm font-medium ${v.arrow}`}
        >
          Saber mais
          <ArrowRight size={14} />
        </div>
      </div>
    </motion.a>
  );
};

export default ActionCard;
