import { motion } from "framer-motion";
import { CYBERBULLYING_TYPES } from "@/content/cyberbullyingTypes";

const CyberbullyingTypesSection = () => (
  <section className="bg-card border-y border-border">
    <div className="container py-16">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="text-center mb-10"
      >
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
          Tipos de ciberbullying
        </h2>
        <p className="text-muted-foreground">
          Conheça as formas mais comuns de agressão online
        </p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-5 max-w-4xl mx-auto">
        {CYBERBULLYING_TYPES.map((type, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="p-6 rounded-xl border border-border bg-background card-shadow"
          >
            <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center mb-4">
              <type.icon size={20} className="text-destructive" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">{type.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {type.desc}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default CyberbullyingTypesSection;
