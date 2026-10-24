import { motion } from "framer-motion";
import ActionCard from "@/components/ActionCard";
import { ACTION_CARDS } from "@/content/actionCards";

const ActionCardsSection = () => (
  <section className="container py-16">
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4 }}
      className="text-center mb-10"
    >
      <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
        Como podemos ajudar?
      </h2>
      <p className="text-muted-foreground">
        Escolha a opção que melhor se aplica à sua situação
      </p>
    </motion.div>

    <div className="grid md:grid-cols-3 gap-5 max-w-4xl mx-auto">
      {ACTION_CARDS.map((card, i) => (
        <ActionCard
          key={card.to}
          icon={card.icon}
          title={card.title}
          description={card.description}
          to={card.to}
          variant={card.variant}
          delay={0.5 + i * 0.1}
        />
      ))}
    </div>
  </section>
);

export default ActionCardsSection;
