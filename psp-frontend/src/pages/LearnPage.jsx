import { useState } from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  MessageSquareWarning,
  AlertTriangle,
  Eye,
  Shield,
  CheckCircle,
  BarChart3,
  Users,
  Heart,
  ChevronDown,
  ChevronUp,
  Quote,
  Brain,
  Lock,
  Smartphone,
  TrendingUp,
  UserX,
  Camera,
  Share2,
  Megaphone,
  Scale,
} from "lucide-react";
import PageHeader from "@/components/PageHeader";
import ChatBubble from "@/components/ChatBubble";

const fadeUp = {
  hidden: { opacity: 0, y: 18, filter: "blur(4px)" },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { delay: i * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  }),
};

const statistics = [
  {
    value: "1 em 3",
    label: "jovens já foi vítima de ciberbullying",
    icon: Users,
  },
  { value: "70%", label: "dos casos não são reportados", icon: BarChart3 },
  { value: "87%", label: "acontece nas redes sociais", icon: Smartphone },
  { value: "64%", label: "afirma que afetou a sua aprendizagem", icon: Brain },
];

const typesOfCyberbullying = [
  {
    icon: MessageSquareWarning,
    name: "Insultos e Humilhação (Flaming)",
    desc: "Envio de mensagens ofensivas, insultuosas ou provocadoras de forma intencional e repetida. Pode acontecer em comentários públicos, grupos de chat ou mensagens diretas. O objetivo é humilhar e ridicularizar a vítima perante outros.",
    signs: [
      "Comentários depreciativos constantes",
      "Memes ou imagens editadas para ridicularizar",
      "Insultos em publicações ou stories",
    ],
    example: {
      bully:
        "Olha quem apareceu 😂 és tão ridículo, ninguém te quer aqui. Vai-te embora que ninguém gosta de ti.",
      victim:
        "Porque é que estás a dizer isso? Eu não te fiz nada... por favor para.",
    },
    impact:
      "Pode causar isolamento social, baixa autoestima, ansiedade e depressão. As vítimas frequentemente começam a evitar interações online e presenciais.",
  },
  {
    icon: AlertTriangle,
    name: "Ameaças e Intimidação",
    desc: "Mensagens que contêm ameaças diretas ou indiretas de violência física, divulgação de informações privadas ou chantagem. É uma das formas mais graves de ciberbullying.",
    signs: [
      "Mensagens ameaçadoras repetidas",
      "Chantagem com fotos ou informações",
      "Coerção para fazer algo contra a vontade",
    ],
    example: {
      bully:
        "Se não fazes o que eu digo, vou espalhar aquela foto tua por toda a escola. Não tentes fugir.",
      victim:
        "Por favor não faças isso... eu tenho medo. O que é que queres de mim?",
    },
    impact:
      "Pode provocar medo intenso, perturbações do sono, ataques de pânico e, em casos extremos, pensamentos suicidas.",
  },
  {
    icon: Eye,
    name: "Exposição e Partilha Não Autorizada",
    desc: "Divulgação de fotos, vídeos, mensagens privadas ou informações pessoais sem o consentimento da pessoa. Inclui a prática de 'outing' (revelar segredos) e 'doxing' (expor dados pessoais).",
    signs: [
      "Partilha de conversas privadas",
      "Divulgação de fotos íntimas",
      "Exposição de informações pessoais",
    ],
    example: {
      bully:
        "Olhem todos para esta foto 😂😂 @todos vejam isto, que vergonha! Partilhem ao máximo!",
      victim:
        "Isso era privado!! Como é que conseguiste isso?! Tira isso AGORA!",
    },
    impact:
      "Pode causar vergonha profunda, trauma emocional duradouro e isolamento. A partilha de imagens íntimas de menores é crime grave em Portugal (Lei n.º 103/2015).",
  },
  {
    icon: UserX,
    name: "Exclusão Social Online",
    desc: "Excluir deliberadamente alguém de grupos online, jogos, conversas ou atividades digitais. Embora menos visível, é uma forma poderosa de bullying que faz a vítima sentir-se rejeitada e invisível.",
    signs: [
      "Remoção intencional de grupos",
      "Ignorar sistematicamente mensagens",
      "Criar grupos paralelos para excluir alguém",
    ],
    example: {
      bully:
        "Pessoal, criei um grupo novo sem a Maria. Não a adicionem, ela é chata.",
      victim:
        "Porque é que fui removida do grupo? Ninguém me responde... o que é que eu fiz?",
    },
    impact:
      "Causa sentimentos profundos de rejeição, solidão e inadequação. Pode levar ao isolamento social total e problemas de saúde mental.",
  },
  {
    icon: Camera,
    name: "Cyberstalking (Perseguição Online)",
    desc: "Monitorização obsessiva da atividade online de alguém, envio repetido de mensagens não desejadas, ou seguir todos os movimentos digitais da pessoa. É uma forma de assédio persistente.",
    signs: [
      "Contacto persistente apesar de bloqueio",
      "Criação de perfis falsos para contactar",
      "Monitorização constante de atividades",
    ],
    example: {
      bully:
        "Eu vi que estiveste online às 23h e não me respondeste. Vi a tua story com a Ana. Estou a ver tudo o que fazes.",
      victim:
        "Para de me seguir! Já te bloqueei em todo o lado, como é que continuas a saber onde estou?",
    },
    impact:
      "Provoca medo constante, paranoia e sensação de falta de segurança. Pode escalar para perseguição no mundo real.",
  },
  {
    icon: Share2,
    name: "Impersonação (Roubo de Identidade)",
    desc: "Criar perfis falsos ou hackear contas para se fazer passar por outra pessoa. O agressor publica conteúdo em nome da vítima para destruir a sua reputação ou causar conflitos.",
    signs: [
      "Perfis falsos com o nome da vítima",
      "Mensagens enviadas de contas hackeadas",
      "Publicações falsas atribuídas à vítima",
    ],
    example: {
      bully:
        "Criei um perfil com as fotos do João e disse que ele gosta da professora 😂 Toda a gente acreditou!",
      victim:
        "Esse perfil não sou eu! Estão a publicar coisas horríveis com o meu nome e toda a gente pensa que fui eu!",
    },
    impact:
      "Pode destruir reputações, amizades e causar confusão extrema. A vítima sente perda de controlo sobre a própria identidade digital.",
  },
];

const realStories = [
  {
    quote:
      "Tudo começou com comentários numa foto minha. Primeiro eram piadas, depois insultos directos. Recebia mensagens todos os dias a dizer que eu era feia, que ninguém gostava de mim. Cheguei a um ponto em que tinha medo de abrir o telemóvel. A minha mãe reparou que eu já não queria ir à escola e levou-me a uma psicóloga. Pedi ajuda à escola e denunciei à PSP. Hoje sei que não estava sozinha.",
    age: "14 anos",
    location: "Lisboa",
    outcome: "Procurou ajuda profissional e denunciou à PSP",
  },
  {
    quote:
      "Um colega da minha turma criou um grupo no WhatsApp onde partilhavam fotos minhas editadas com legendas humilhantes. Quando descobri, já tinham mais de 30 pessoas no grupo. Senti-me completamente exposto e com vergonha. O meu pai ajudou-me a guardar as provas e foi à escola. O agressor foi suspenso e os pais foram chamados.",
    age: "16 anos",
    location: "Porto",
    outcome: "Guardou provas e reportou à escola com ajuda dos pais",
  },
  {
    quote:
      "A minha ex-namorada ameaçou partilhar fotos privadas minhas se eu não voltasse com ela. Vivi semanas com medo e ansiedade. Não sabia que isto era crime. Um professor em quem confiava explicou-me os meus direitos e acompanhou-me à PSP. Ela foi identificada e os conteúdos nunca foram partilhados.",
    age: "17 anos",
    location: "Coimbra",
    outcome: "Denunciou à PSP — conteúdos não foram partilhados",
  },
  {
    quote:
      "Sofri exclusão online durante meses. As minhas amigas criaram um grupo sem mim e combinavam tudo sem me contar. Nos intervalos, riam-se de coisas que eu não sabia. Sentia-me invisível. A minha mãe falou com a diretora de turma e fizeram uma sessão de sensibilização na escola. Hoje tenho um grupo de amigos verdadeiros.",
    age: "12 anos",
    location: "Braga",
    outcome: "Escola interveio com sessão de sensibilização",
  },
];

const whatToDo = [
  {
    step: "1",
    title: "Não responder às provocações",
    desc: "Responder ao agressor é exatamente o que ele quer. Manter a calma é difícil, mas é o primeiro passo para retomar o controlo da situação. Não apagar as mensagens — vais precisar delas como prova.",
    icon: Shield,
  },
  {
    step: "2",
    title: "Guardar todas as provas",
    desc: "Faz capturas de ecrã de todas as mensagens, publicações, perfis falsos ou qualquer conteúdo ofensivo. Regista datas, horas e plataformas. Estas provas são essenciais para a investigação e podem ser usadas em tribunal.",
    icon: Camera,
  },
  {
    step: "3",
    title: "Bloquear e reportar",
    desc: "Bloqueia o agressor em todas as plataformas onde te contacta. Reporta o conteúdo ofensivo diretamente à rede social — todas têm mecanismos para isso. Se criar perfis novos para te contactar, bloqueia e reporta novamente.",
    icon: Lock,
  },
  {
    step: "4",
    title: "Falar com alguém de confiança",
    desc: "Fala com um pai, mãe, professor, psicólogo escolar ou outro adulto em quem confies. Não precisas de enfrentar isto sozinho/a. Partilhar o que estás a passar é um ato de coragem, não de fraqueza.",
    icon: Heart,
  },
  {
    step: "5",
    title: "Denunciar às autoridades",
    desc: "Se recebes ameaças, se partilharam imagens tuas sem consentimento, ou se a situação é grave, contacta a PSP. O ciberbullying pode constituir crime em Portugal e as autoridades podem intervir para te proteger.",
    icon: Scale,
  },
];

const ExpandableStory = ({ story, index }) => {
  const [expanded, setExpanded] = useState(false);
  const preview = story.quote.substring(0, 150);

  return (
    <motion.div
      custom={index}
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      className="bg-card rounded-xl border border-border p-5 md:p-6 card-shadow"
    >
      <div className="flex items-start gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center shrink-0 mt-0.5">
          <Quote size={18} className="text-secondary" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-secondary bg-secondary/10 px-2 py-0.5 rounded-full">
              {story.age}
            </span>
            <span className="text-xs text-muted-foreground">
              {story.location}
            </span>
          </div>
        </div>
      </div>

      <blockquote className="text-sm text-foreground/90 leading-relaxed italic mb-4 break-words">
        "{expanded ? story.quote : `${preview}...`}"
      </blockquote>

      <button
        onClick={() => setExpanded(!expanded)}
        className="text-xs font-medium text-secondary hover:text-secondary/80 flex items-center gap-1 transition-colors mb-3 active:scale-[0.97]"
      >
        {expanded ? "Ler menos" : "Ler história completa"}
        {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>

      {expanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="bg-secondary/5 border border-secondary/15 rounded-lg p-3 mt-2"
        >
          <div className="flex items-center gap-2">
            <CheckCircle size={14} className="text-[hsl(var(--risk-low))]" />
            <span className="text-xs font-semibold text-foreground">
              Resultado:
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1 break-words">
            {story.outcome}
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};

const ExpandableType = ({ type, index }) => {
  const [expanded, setExpanded] = useState(false);
  const Icon = type.icon;

  return (
    <motion.div
      custom={index}
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      className="bg-card rounded-xl border border-border overflow-hidden card-shadow"
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left p-5 md:p-6 flex items-start gap-4 hover:bg-muted/30 transition-colors active:scale-[0.995]"
      >
        <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center shrink-0">
          <Icon size={20} className="text-destructive" />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground mb-1 break-words">
            {type.name}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed break-words">
            {type.desc}
          </p>
        </div>

        <div className="shrink-0 mt-1">
          {expanded ? (
            <ChevronUp size={18} className="text-muted-foreground" />
          ) : (
            <ChevronDown size={18} className="text-muted-foreground" />
          )}
        </div>
      </button>

      {expanded && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="px-5 md:px-6 pb-5 md:pb-6 space-y-5"
        >
          <div className="border-t border-border pt-5">
            <p className="text-sm text-muted-foreground leading-relaxed break-words">
              {type.desc}
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-3">
              Sinais de Alerta
            </h4>
            <ul className="space-y-2">
              {type.signs.map((sign, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm text-muted-foreground"
                >
                  <AlertTriangle
                    size={14}
                    className="text-[hsl(var(--risk-medium))] shrink-0 mt-0.5"
                  />
                  <span className="break-words">{sign}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-3">
              Exemplo Real
            </h4>
            <div className="bg-muted/50 rounded-lg p-3 md:p-4">
              <ChatBubble
                message={type.example.bully}
                sender="bully"
                delay={0}
              />
              <ChatBubble
                message={type.example.victim}
                sender="user"
                delay={0}
              />
            </div>
          </div>

          <div className="bg-destructive/5 border border-destructive/15 rounded-lg p-4">
            <h4 className="text-xs font-semibold text-destructive uppercase tracking-wider mb-2">
              Impacto na Vítima
            </h4>
            <p className="text-sm text-foreground/80 leading-relaxed break-words">
              {type.impact}
            </p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

const LearnPage = () => {
  return (
    <div className="min-h-screen pt-4 md:pt-20">
      <div className="container py-6 md:py-8 max-w-4xl px-4">
        <PageHeader
          icon={BookOpen}
          title="Aprender"
          subtitle="Compreende, identifica e age perante o ciberbullying"
        />

        <div className="mb-8 md:mb-10 bg-secondary/5 border border-secondary/15 rounded-2xl p-5 md:p-6 flex items-start gap-4">
          <BookOpen size={32} className="text-secondary shrink-0 mt-1" />
          <div className="min-w-0">
            <h2 className="font-semibold text-foreground mb-1">
              O que vais encontrar aqui?
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed break-words">
              Nesta página encontras tudo o que precisas saber sobre
              ciberbullying — desde o que é, aos tipos mais comuns, histórias
              reais de jovens portugueses e o que fazer se fores vítima.
            </p>
          </div>
        </div>

        {/* What is cyberbullying */}
        <section id="what" className="mb-14 md:mb-16 scroll-mt-24">
          <motion.div
            custom={0}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center shrink-0">
                <Shield size={20} className="text-secondary" />
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-foreground">
                O que é o ciberbullying?
              </h2>
            </div>

            <div className="bg-card rounded-xl border border-border p-5 md:p-8 card-shadow space-y-5">
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed break-words">
                O <strong className="text-foreground">ciberbullying</strong> é
                uma forma de violência e agressão que acontece através de meios
                digitais — redes sociais, aplicações de mensagens, jogos online,
                fóruns ou qualquer plataforma digital. Distingue-se de outros
                conflitos online pela sua{" "}
                <strong className="text-foreground">intencionalidade</strong>,{" "}
                <strong className="text-foreground">repetição</strong> e pelo{" "}
                <strong className="text-foreground">
                  desequilíbrio de poder
                </strong>{" "}
                entre agressor e vítima.
              </p>

              <p className="text-sm md:text-base text-muted-foreground leading-relaxed break-words">
                Pode manifestar-se de diversas formas: insultos e comentários
                ofensivos, ameaças e intimidação, partilha de informações ou
                imagens privadas sem consentimento, exclusão deliberada de
                grupos sociais, perseguição online, criação de perfis falsos, e
                muito mais.
              </p>

              <p className="text-sm md:text-base text-muted-foreground leading-relaxed break-words">
                Ao contrário do bullying presencial, o ciberbullying não tem
                fronteiras físicas nem horários. A vítima pode ser atingida a
                qualquer hora, em qualquer lugar — mesmo em casa, no quarto, no
                espaço que deveria ser seguro. O conteúdo pode espalhar-se
                rapidamente para centenas ou milhares de pessoas, e muitas vezes
                permanece online indefinidamente.
              </p>

              <div className="bg-secondary/5 border border-secondary/15 rounded-lg p-4 md:p-5">
                <h3 className="text-sm font-semibold text-foreground mb-2">
                  Porque é tão perigoso?
                </h3>

                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <TrendingUp
                      size={14}
                      className="text-secondary shrink-0 mt-1"
                    />
                    <span>
                      <strong className="text-foreground">
                        Alcance massivo
                      </strong>{" "}
                      — um comentário pode chegar a milhares de pessoas em
                      minutos
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Lock size={14} className="text-secondary shrink-0 mt-1" />
                    <span>
                      <strong className="text-foreground">Persistência</strong>{" "}
                      — o conteúdo pode permanecer online para sempre
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Eye size={14} className="text-secondary shrink-0 mt-1" />
                    <span>
                      <strong className="text-foreground">Anonimato</strong> —
                      os agressores podem esconder-se atrás de perfis falsos
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Smartphone
                      size={14}
                      className="text-secondary shrink-0 mt-1"
                    />
                    <span>
                      <strong className="text-foreground">Omnipresença</strong>{" "}
                      — não há refúgio; a agressão pode chegar a qualquer lugar
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Statistics */}
        <section id="stats" className="mb-14 md:mb-16 scroll-mt-24">
          <motion.div
            custom={0}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center shrink-0">
                <BarChart3 size={20} className="text-secondary" />
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-foreground">
                Números que importam
              </h2>
            </div>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {statistics.map((stat, i) => (
              <motion.div
                key={i}
                custom={i + 1}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                className="bg-card rounded-xl border border-border p-4 md:p-5 card-shadow text-center"
              >
                <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center mx-auto mb-3">
                  <stat.icon size={20} className="text-secondary" />
                </div>
                <p className="text-2xl md:text-3xl font-bold text-foreground mb-1 break-words">
                  {stat.value}
                </p>
                <p className="text-xs text-muted-foreground leading-snug break-words">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>

          <motion.p
            custom={5}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="text-xs text-muted-foreground mt-4 text-center"
          >
            Fonte: Estudos europeus sobre ciberbullying em jovens (UNESCO, EU
            Kids Online)
          </motion.p>
        </section>

        {/* Types */}
        <section id="types" className="mb-14 md:mb-16 scroll-mt-24">
          <motion.div
            custom={0}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center shrink-0">
                <Megaphone size={20} className="text-destructive" />
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-foreground">
                Tipos de ciberbullying
              </h2>
            </div>

            <p className="text-sm text-muted-foreground mb-6 ml-0 sm:ml-[52px]">
              Clica em cada tipo para ver exemplos, sinais de alerta e o impacto
              na vítima.
            </p>
          </motion.div>

          <div className="space-y-4">
            {typesOfCyberbullying.map((type, i) => (
              <ExpandableType key={i} type={type} index={i} />
            ))}
          </div>
        </section>

        {/* Real stories */}
        <section id="stories" className="mb-14 md:mb-16 scroll-mt-24">
          <motion.div
            custom={0}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center shrink-0">
                <Heart size={20} className="text-secondary" />
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-foreground">
                Histórias reais
              </h2>
            </div>

            <p className="text-sm text-muted-foreground mb-6 ml-0 sm:ml-[52px]">
              Testemunhos anónimos de jovens portugueses que enfrentaram o
              ciberbullying. Não estás sozinho/a.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {realStories.map((story, i) => (
              <ExpandableStory key={i} story={story} index={i} />
            ))}
          </div>
        </section>

        {/* What to do */}
        <section id="actions" className="mb-14 md:mb-16 scroll-mt-24">
          <motion.div
            custom={0}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-[hsl(var(--risk-low))]/10 flex items-center justify-center shrink-0">
                <CheckCircle
                  size={20}
                  className="text-[hsl(var(--risk-low))]"
                />
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-foreground">
                O que fazer se fores vítima
              </h2>
            </div>

            <p className="text-sm text-muted-foreground mb-6 ml-0 sm:ml-[52px]">
              Segue estes passos para te protegeres e obteres ajuda.
            </p>
          </motion.div>

          <div className="space-y-4">
            {whatToDo.map((item, i) => (
              <motion.div
                key={i}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                className="bg-card rounded-xl border border-border p-5 md:p-6 card-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground text-sm font-bold shrink-0">
                    {item.step}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <item.icon
                        size={16}
                        className="text-secondary shrink-0"
                      />
                      <h3 className="font-semibold text-foreground break-words">
                        {item.title}
                      </h3>
                    </div>

                    <p className="text-sm text-muted-foreground leading-relaxed break-words">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default LearnPage;
