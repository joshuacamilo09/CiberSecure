import { Stat } from "@/types";

interface StatCardProps {
  stat: Stat;
}

const StatCard = ({ stat }: StatCardProps) => (
  <div className="bg-card rounded-xl p-5 card-shadow border border-border text-center">
    <div className="text-2xl font-extrabold text-secondary mb-1">{stat.value}</div>
    <p className="text-sm text-muted-foreground">{stat.label}</p>
  </div>
);

export default StatCard;
