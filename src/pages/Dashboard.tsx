import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Activity,
  Zap,
  Moon,
  Heart,
  Flame,
  Plus,
  Calendar,
  ChevronRight,
} from "lucide-react";
import Header from "@/components/layout/Header";
import { PulseCard } from "@/components/ui/PulseCard";
import { useUser } from "@/hooks/useUser";
import { getTodayCheckin, getRecentCheckins, DailyCheckin } from "@/lib/queries/checkins";

const Dashboard = () => {
  const { userName, userId } = useUser();
  const [todayCheckin, setTodayCheckin] = useState<DailyCheckin | null>(null);
  const [recentCheckins, setRecentCheckins] = useState<DailyCheckin[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (!userId) return;

      setLoading(true);
      const [today, recent] = await Promise.all([
        getTodayCheckin(userId),
        getRecentCheckins(userId, 7),
      ]);

      setTodayCheckin(today);
      setRecentCheckins(recent);
      setLoading(false);
    }

    loadData();
  }, [userId]);

  const metrics = todayCheckin
    ? [
        {
          label: "Energia",
          value: todayCheckin.energy_level,
          icon: <Zap className="w-5 h-5" />,
          color: "bg-pulse-energy/10 text-pulse-energy",
          bgGlow: "from-pulse-energy/20",
        },
        {
          label: "Sono",
          value: todayCheckin.sleep_quality,
          icon: <Moon className="w-5 h-5" />,
          color: "bg-pulse-sleep/10 text-pulse-sleep",
          bgGlow: "from-pulse-sleep/20",
        },
        {
          label: "Humor",
          value: todayCheckin.mood_score,
          icon: <Heart className="w-5 h-5" />,
          color: "bg-pulse-mood/10 text-pulse-mood",
          bgGlow: "from-pulse-mood/20",
        },
        {
          label: "Fadiga",
          value: todayCheckin.fatigue_level,
          icon: <Flame className="w-5 h-5" />,
          color: "bg-pulse-fatigue/10 text-pulse-fatigue",
          bgGlow: "from-pulse-fatigue/20",
        },
      ]
    : [];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 pb-12 md:pt-28">
        <div className="container mx-auto px-4">
          {/* Welcome Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
              Olá, {userName} 👋
            </h1>
            <p className="text-muted-foreground">
              Como você está se sentindo hoje?
            </p>
          </motion.div>

          {/* Quick Check-in Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <Link to="/checkin">
              <PulseCard
                variant="interactive"
                className="p-6 bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center">
                      <Plus className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">
                        Fazer Check-in Diário
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Registre como você está se sentindo agora
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </div>
              </PulseCard>
            </Link>
          </motion.div>

          {/* Today's Metrics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">
                Métricas de Hoje
              </h2>
              <span className="text-sm text-muted-foreground flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {new Date().toLocaleDateString("pt-BR", {
                  weekday: "long",
                  day: "numeric",
                  month: "short",
                })}
              </span>
            </div>

            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-32 bg-secondary/50 rounded-2xl animate-pulse" />
                ))}
              </div>
            ) : metrics.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {metrics.map((metric, index) => (
                  <motion.div
                    key={metric.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                  >
                    <PulseCard className="p-5 relative overflow-hidden">
                      <div
                        className={`absolute inset-0 bg-gradient-to-br ${metric.bgGlow} to-transparent opacity-50`}
                      />
                      <div className="relative">
                        <div
                          className={`w-10 h-10 rounded-xl ${metric.color} flex items-center justify-center mb-3`}
                        >
                          {metric.icon}
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">
                          {metric.label}
                        </p>
                        <p className="text-3xl font-bold text-foreground">
                          {metric.value}
                          <span className="text-lg text-muted-foreground">/10</span>
                        </p>
                      </div>
                    </PulseCard>
                  </motion.div>
                ))}
              </div>
            ) : (
              <PulseCard className="p-8 text-center">
                <p className="text-muted-foreground mb-2">Nenhum check-in hoje</p>
                <p className="text-sm text-muted-foreground">
                  Faça seu primeiro check-in para acompanhar suas métricas
                </p>
              </PulseCard>
            )}
          </motion.div>

          {/* Weekly Overview */}
          {recentCheckins.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-8"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-foreground">
                  Últimos Registros
                </h2>
                <Link
                  to="/timeline"
                  className="text-sm text-primary hover:text-primary/80 font-medium flex items-center gap-1"
                >
                  Ver tudo
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              <PulseCard className="p-6">
                <div className="flex items-end justify-between gap-2 h-40">
                  {recentCheckins.map((checkin, index) => {
                    const date = new Date(checkin.checkin_date);
                    const dayName = date.toLocaleDateString("pt-BR", { weekday: "short" });

                    return (
                      <motion.div
                        key={checkin.id}
                        initial={{ opacity: 0, scaleY: 0 }}
                        animate={{ opacity: 1, scaleY: 1 }}
                        transition={{ delay: 0.5 + index * 0.05 }}
                        className="flex-1 flex flex-col items-center gap-2"
                        style={{ originY: 1 }}
                      >
                        <div className="w-full flex flex-col gap-1">
                          <div
                            className="w-full rounded-t-md bg-pulse-energy/60 transition-all duration-300"
                            style={{ height: `${checkin.energy_level * 10}px` }}
                          />
                          <div
                            className="w-full bg-pulse-sleep/60 transition-all duration-300"
                            style={{ height: `${checkin.sleep_quality * 8}px` }}
                          />
                          <div
                            className="w-full rounded-b-md bg-pulse-mood/60 transition-all duration-300"
                            style={{ height: `${checkin.mood_score * 6}px` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground font-medium capitalize">
                          {dayName}
                        </span>
                      </motion.div>
                    );
                  })}
                </div>

                <div className="flex items-center justify-center gap-6 mt-6 pt-4 border-t border-border">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-pulse-energy" />
                    <span className="text-xs text-muted-foreground">Energia</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-pulse-sleep" />
                    <span className="text-xs text-muted-foreground">Sono</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-pulse-mood" />
                    <span className="text-xs text-muted-foreground">Humor</span>
                  </div>
                </div>
              </PulseCard>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
