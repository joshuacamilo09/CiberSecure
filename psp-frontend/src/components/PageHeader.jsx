import { motion } from "framer-motion";

const PageHeader = ({ icon: Icon, title, subtitle }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
    className="mb-6 md:mb-8"
  >
    <div className="flex items-center gap-3 mb-2">
      <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center shrink-0">
        <Icon size={20} className="text-secondary" />
      </div>

      <h1 className="text-2xl md:text-3xl font-bold text-foreground break-words">
        {title}
      </h1>
    </div>

    <p className="text-muted-foreground ml-0 sm:ml-[52px] break-words">
      {subtitle}
    </p>
  </motion.div>
);

export default PageHeader;
