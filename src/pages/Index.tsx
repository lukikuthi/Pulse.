import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Activity, Brain, Heart, Moon, Sparkles, TrendingUp, Zap, ArrowRight } from "lucide-react";
import Header from "@/components/layout/Header";
import { PulseButton } from "@/components/ui/PulseButton";
import { PulseCard } from "@/components/ui/PulseCard";
const Index = () => {
  const features = [{
    icon: <Brain className="w-6 h-6" />,
    title: "Consciência Corporal",
    description: "Entenda os sinais do seu corpo e desenvolva uma conexão mais profunda com você mesmo."
  }, {
    icon: <TrendingUp className="w-6 h-6" />,
    title: "Evolução Visual",
    description: "Acompanhe sua jornada através de gráficos elegantes e insights personalizados."
  }, {
    icon: <Sparkles className="w-6 h-6" />,
    title: "Check-ins Diários",
    description: "Registros simples e rápidos que capturam energia, sono, humor e muito mais."
  }, {
    icon: <Heart className="w-6 h-6" />,
    title: "Mapa Corporal",
    description: "Visualize e registre pontos de tensão e desconforto de forma intuitiva."
  }];
  const metrics = [{
    icon: <Zap className="w-5 h-5" />,
    label: "Energia",
    color: "pulse-energy"
  }, {
    icon: <Moon className="w-5 h-5" />,
    label: "Sono",
    color: "pulse-sleep"
  }, {
    icon: <Heart className="w-5 h-5" />,
    label: "Humor",
    color: "pulse-mood"
  }, {
    icon: <Activity className="w-5 h-5" />,
    label: "Fadiga",
    color: "pulse-fatigue"
  }];
  return <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-pulse-blue-light/50 to-transparent pointer-events-none" />
        
        {/* Floating orbs */}
        <motion.div animate={{
        y: [0, -20, 0]
      }} transition={{
        duration: 6,
        repeat: Infinity
      }} className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <motion.div animate={{
        y: [0, 20, 0]
      }} transition={{
        duration: 8,
        repeat: Infinity
      }} className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />

        <div className="container relative mx-auto px-4">
          <motion.div initial={{
          opacity: 0,
          y: 30
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.8
        }} className="text-center max-w-4xl mx-auto">
            <motion.div initial={{
            opacity: 0,
            scale: 0.8
          }} animate={{
            opacity: 1,
            scale: 1
          }} transition={{
            delay: 0.2
          }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8">
              <Sparkles className="w-4 h-4" />
              Consciência corporal redefinida
            </motion.div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6">
              <span className="text-foreground">Evolua no seu</span>
              <br />
              <span className="text-gradient font-thin">RITMO.</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              Não se trata de treinos ou calorias. É sobre entender seu corpo,
              respeitar seus limites e evoluir de forma consciente.
            </p>

            <motion.div initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            delay: 0.4
          }} className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth?mode=signup">
                <PulseButton variant="hero" size="xl" className="w-full sm:w-auto">
                  Começar Gratuitamente
                  <ArrowRight className="w-5 h-5 ml-2" />
                </PulseButton>
              </Link>
              <Link to="/dashboard">
                <PulseButton variant="outline" size="xl" className="w-full sm:w-auto">
                  Ver Demo
                </PulseButton>
              </Link>
            </motion.div>
          </motion.div>

          {/* Metrics preview */}
          <motion.div initial={{
          opacity: 0,
          y: 40
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: 0.6,
          duration: 0.8
        }} className="mt-20 flex justify-center gap-4 md:gap-8 flex-wrap">
            {metrics.map((metric, index) => <motion.div key={metric.label} initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            delay: 0.7 + index * 0.1
          }} className={`flex items-center gap-3 px-5 py-3 rounded-2xl bg-card border border-border shadow-soft`}>
                <span className={`text-${metric.color}`}>{metric.icon}</span>
                <span className="text-sm font-medium text-foreground">
                  {metric.label}
                </span>
              </motion.div>)}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
              Feito para você evoluir
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Ferramentas poderosas e intuitivas para acompanhar sua jornada de
              autoconhecimento.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {features.map((feature, index) => <motion.div key={feature.title} initial={{
            opacity: 0,
            y: 30
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} transition={{
            delay: index * 0.1
          }}>
                <PulseCard variant="interactive" className="p-8 h-full" whileHover={{
              y: -5
            }}>
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </PulseCard>
              </motion.div>)}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-pulse-blue-light/30 to-transparent pointer-events-none" />
        
        <div className="container relative mx-auto px-4">
          <motion.div initial={{
          opacity: 0,
          scale: 0.95
        }} whileInView={{
          opacity: 1,
          scale: 1
        }} viewport={{
          once: true
        }} className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
              Comece sua jornada hoje
            </h2>
            <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto">
              Junte-se a milhares de pessoas que estão redescobrindo a conexão
              com seu próprio corpo.
            </p>
            <Link to="/auth?mode=signup">
              <PulseButton variant="hero" size="xl">
                Criar Conta Gratuita
                <ArrowRight className="w-5 h-5 ml-2" />
              </PulseButton>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              
              <span className="text-foreground text-sm font-thin">
                PULSE<span className="text-primary">.</span>
              </span>
            </div>
            <p className="text-sm text-muted-foreground">LinkedIn - Lucas Kikuthi</p>
          </div>
        </div>
      </footer>
    </div>;
};
export default Index;