import { motion } from "framer-motion";
import StatCard from "@/components/ui/StatCard";
import { STATS } from "@/content/stats";

const StatsSection = () => (
  <section className="container -mt-8 relative z-10">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="grid grid-cols-1 md:grid-cols-3 gap-4"
    >
      {STATS.map((stat, i) => (
        <StatCard key={i} stat={stat} />
      ))}
    </motion.div>
  </section>
);

export default StatsSection;
