import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  Calendar,
  Zap,
  Moon,
  Heart,
  Flame,
} from "lucide-react";
import Header from "@/components/layout/Header";
import { PulseCard } from "@/components/ui/PulseCard";
import { useUser } from "@/hooks/useUser";
import { getAllCheckins, DailyCheckin } from "@/lib/queries/checkins";

const Timeline = () => {
  const { userId } = useUser();
  const [checkins, setCheckins] = useState<DailyCheckin[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCheckins() {
      if (!userId) return;

      setLoading(true);
      const data = await getAllCheckins(userId);
      setCheckins(data);
      setLoading(false);
    }

    loadCheckins();
  }, [userId]);

  const getMetricColor = (value: number) => {
    if (value >= 7) return "text-pulse-success";
    if (value >= 5) return "text-pulse-warning";
    return "text-pulse-pain";
  };

  const getBarHeight = (value: number) => `${value * 10}%`;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 pb-12 md:pt-28">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
              Linha do Tempo
            </h1>
            <p className="text-muted-foreground">
              Acompanhe sua evolução ao longo do tempo
            </p>
          </motion.div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-secondary/50 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : checkins.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <PulseCard className="p-12 text-center">
                <Calendar className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Nenhum registro ainda
                </h3>
                <p className="text-muted-foreground mb-6">
                  Comece fazendo seu primeiro check-in diário para acompanhar sua jornada
                </p>
              </PulseCard>
            </motion.div>
          ) : (
            <>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mb-8"
              >
                <PulseCard className="p-6">
                  <h3 className="text-sm font-medium text-muted-foreground mb-4">
                    Visão Geral
                  </h3>
                  <div className="flex items-end justify-between gap-3 h-48">
                    {checkins.slice(0, 7).map((checkin, index) => {
                      const date = new Date(checkin.checkin_date);
                      const dayName = date.toLocaleDateString("pt-BR", { weekday: "short" });

                      return (
                        <motion.div
                          key={checkin.id}
                          initial={{ opacity: 0, scaleY: 0 }}
                          animate={{ opacity: 1, scaleY: 1 }}
                          transition={{ delay: 0.2 + index * 0.05 }}
                          className="flex-1 flex flex-col items-center gap-2"
                          style={{ originY: 1 }}
                        >
                          <div className="w-full h-full flex flex-col justify-end gap-0.5">
                            <div
                              className="w-full rounded-t bg-pulse-energy/70 transition-all duration-500"
                              style={{ height: getBarHeight(checkin.energy_level) }}
                            />
                            <div
                              className="w-full bg-pulse-sleep/70 transition-all duration-500"
                              style={{ height: getBarHeight(checkin.sleep_quality) }}
                            />
                            <div
                              className="w-full bg-pulse-mood/70 transition-all duration-500"
                              style={{ height: getBarHeight(checkin.mood_score) }}
                            />
                            <div
                              className="w-full rounded-b bg-pulse-fatigue/70 transition-all duration-500"
                              style={{ height: getBarHeight(10 - checkin.fatigue_level) }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground font-medium capitalize">
                            {dayName}
                          </span>
                        </motion.div>
                      );
                    })}
                  </div>

                  <div className="flex items-center justify-center gap-4 mt-6 pt-4 border-t border-border flex-wrap">
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
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-pulse-fatigue" />
                      <span className="text-xs text-muted-foreground">Vitalidade</span>
                    </div>
                  </div>
                </PulseCard>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="text-lg font-semibold text-foreground mb-4">
                  Registros Diários
                </h2>

                <div className="space-y-4">
                  {checkins.map((checkin, index) => {
                    const date = new Date(checkin.checkin_date);
                    const dayName = date.toLocaleDateString("pt-BR", { weekday: "long" });
                    const dateStr = date.toLocaleDateString("pt-BR", {
                      day: "numeric",
                      month: "long",
                    });

                    return (
                      <motion.div
                        key={checkin.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + index * 0.05 }}
                      >
                        <PulseCard className="p-5">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                                <Calendar className="w-5 h-5 text-muted-foreground" />
                              </div>
                              <div>
                                <p className="font-medium text-foreground capitalize">
                                  {dayName}
                                </p>
                                <p className="text-xs text-muted-foreground capitalize">
                                  {dateStr}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-4 gap-3 mb-4">
                            <div className="text-center">
                              <div className="w-8 h-8 mx-auto mb-1 rounded-lg bg-pulse-energy/10 flex items-center justify-center">
                                <Zap className="w-4 h-4 text-pulse-energy" />
                              </div>
                              <p
                                className={`text-lg font-semibold ${getMetricColor(checkin.energy_level)}`}
                              >
                                {checkin.energy_level}
                              </p>
                              <p className="text-xs text-muted-foreground">Energia</p>
                            </div>
                            <div className="text-center">
                              <div className="w-8 h-8 mx-auto mb-1 rounded-lg bg-pulse-sleep/10 flex items-center justify-center">
                                <Moon className="w-4 h-4 text-pulse-sleep" />
                              </div>
                              <p
                                className={`text-lg font-semibold ${getMetricColor(checkin.sleep_quality)}`}
                              >
                                {checkin.sleep_quality}
                              </p>
                              <p className="text-xs text-muted-foreground">Sono</p>
                            </div>
                            <div className="text-center">
                              <div className="w-8 h-8 mx-auto mb-1 rounded-lg bg-pulse-mood/10 flex items-center justify-center">
                                <Heart className="w-4 h-4 text-pulse-mood" />
                              </div>
                              <p
                                className={`text-lg font-semibold ${getMetricColor(checkin.mood_score)}`}
                              >
                                {checkin.mood_score}
                              </p>
                              <p className="text-xs text-muted-foreground">Humor</p>
                            </div>
                            <div className="text-center">
                              <div className="w-8 h-8 mx-auto mb-1 rounded-lg bg-pulse-fatigue/10 flex items-center justify-center">
                                <Flame className="w-4 h-4 text-pulse-fatigue" />
                              </div>
                              <p
                                className={`text-lg font-semibold ${getMetricColor(10 - checkin.fatigue_level)}`}
                              >
                                {checkin.fatigue_level}
                              </p>
                              <p className="text-xs text-muted-foreground">Fadiga</p>
                            </div>
                          </div>

                          {checkin.notes && (
                            <div className="pt-3 border-t border-border">
                              <p className="text-sm text-muted-foreground italic">
                                "{checkin.notes}"
                              </p>
                            </div>
                          )}
                        </PulseCard>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Timeline;
