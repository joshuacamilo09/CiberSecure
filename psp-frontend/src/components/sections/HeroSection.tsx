import { motion } from "framer-motion";
import { Shield, ArrowRight } from "lucide-react";
import Badge from "@/components/ui/Badge";

const HeroSection = () => (
  <section className="hero-gradient relative overflow-hidden">
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,hsl(211_100%_65%/0.15),transparent_60%)]" />
    <div className="container relative py-16 md:py-24">
      <div className="grid md:grid-cols-2 gap-10 items-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Badge icon={Shield} label="Plataforma oficial PSP" className="mb-6" />
          <h1 className="text-3xl md:text-5xl font-extrabold text-primary-foreground leading-tight mb-4">
            Sabe identificar e agir perante o{" "}
            <span className="text-accent">ciberbullying</span>?
          </h1>
          <p className="text-base md:text-lg text-primary-foreground/70 leading-relaxed mb-8 max-w-lg">
            Estamos aqui para ajudar. Aprenda a reconhecer situações de ciberbullying,
            analise casos e encontre o apoio de que precisa.
          </p>
          <div className="flex flex-wrap gap-3">
            <motion.a
              href="/analisar"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-accent text-primary font-semibold text-sm hover:bg-accent/90 transition-colors"
            >
              Analisar situação
              <ArrowRight size={16} />
            </motion.a>
            <motion.a
              href="/aprender"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary-foreground/10 text-primary-foreground font-semibold text-sm border border-primary-foreground/20 hover:bg-primary-foreground/15 transition-colors"
            >
              Saber mais
            </motion.a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="hidden md:flex justify-center"
        >
          {/* TODO: substituir por heroIllustration real */}
          <img
            src="/hero-placeholder.svg"
            alt="Proteção digital para jovens"
            className="w-full max-w-sm drop-shadow-2xl"
          />
        </motion.div>
      </div>
    </div>
  </section>
);

export default HeroSection;
