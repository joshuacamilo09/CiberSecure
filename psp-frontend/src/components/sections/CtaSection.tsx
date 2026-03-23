import { motion } from "framer-motion";
import { Users, ArrowRight } from "lucide-react";

const CtaSection = () => (
  <section className="container py-16">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="hero-gradient rounded-2xl p-8 md:p-12 text-center"
    >
      <div className="w-14 h-14 rounded-2xl bg-primary-foreground/10 flex items-center justify-center mx-auto mb-5">
        <Users size={28} className="text-accent" />
      </div>

      <h2 className="text-2xl md:text-3xl font-bold text-primary-foreground mb-3">
        Não estás sozinho/a
      </h2>

      <p className="text-primary-foreground/70 mb-8 max-w-md mx-auto">
        Se estás a passar por uma situação difícil, estamos aqui para ajudar.
        Fala connosco de forma segura e confidencial.
      </p>

      <div className="flex flex-wrap gap-3 justify-center">
        <motion.a
          href="/assistente"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-accent text-primary font-semibold text-sm"
        >
          Falar com assistente
          <ArrowRight size={16} />
        </motion.a>
        <motion.a
          href="/apoio"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary-foreground/10 text-primary-foreground font-semibold text-sm border border-primary-foreground/20"
        >
          Ver apoio disponível
        </motion.a>
      </div>
    </motion.div>
  </section>
);

export default CtaSection;
