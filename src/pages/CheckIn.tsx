import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  Check,
  Zap,
  Moon,
  Heart,
  Flame,
  MapPin,
} from "lucide-react";
import { PulseButton } from "@/components/ui/PulseButton";
import { PulseCard } from "@/components/ui/PulseCard";
import { MetricSlider } from "@/components/ui/MetricSlider";
import BodyMap from "@/components/BodyMap";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/hooks/useUser";
import { saveDailyCheckin } from "@/lib/checkins";

const CheckIn = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { userId } = useUser();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    energy: [5],
    sleep: [5],
    mood: [5],
    fatigue: [5],
    painAreas: [] as string[],
    painLevels: {} as Record<string, number>,
    notes: "",
  });

  const steps = [
    {
      id: "energy",
      title: "Nível de Energia",
      description: "Como está sua energia hoje?",
      icon: <Zap className="w-6 h-6" />,
      color: "energy" as const,
    },
    {
      id: "sleep",
      title: "Qualidade do Sono",
      description: "Como você dormiu na última noite?",
      icon: <Moon className="w-6 h-6" />,
      color: "sleep" as const,
    },
    {
      id: "mood",
      title: "Seu Humor",
      description: "Como está seu estado emocional?",
      icon: <Heart className="w-6 h-6" />,
      color: "mood" as const,
    },
    {
      id: "fatigue",
      title: "Nível de Fadiga",
      description: "O quão cansado você se sente?",
      icon: <Flame className="w-6 h-6" />,
      color: "fatigue" as const,
    },
    {
      id: "pain",
      title: "Mapa Corporal",
      description: "Selecione áreas de dor ou desconforto",
      icon: <MapPin className="w-6 h-6" />,
      color: "fatigue" as const,
    },
  ];

  const handleSliderChange = (key: string, value: number[]) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handlePainToggle = (partId: string) => {
    setFormData((prev) => {
      const newPainAreas = prev.painAreas.includes(partId)
        ? prev.painAreas.filter((id) => id !== partId)
        : [...prev.painAreas, partId];

      const newPainLevels = { ...prev.painLevels };
      if (!prev.painAreas.includes(partId)) {
        newPainLevels[partId] = 5;
      } else {
        delete newPainLevels[partId];
      }

      return {
        ...prev,
        painAreas: newPainAreas,
        painLevels: newPainLevels,
      };
    });
  };

  const handlePainLevelChange = (partId: string, level: number) => {
    setFormData((prev) => ({
      ...prev,
      painLevels: {
        ...prev.painLevels,
        [partId]: level,
      },
    }));
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!userId) {
      toast({
        title: "Erro",
        description: "Usuário não autenticado",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    const result = await saveDailyCheckin(userId, {
      energy_level: formData.energy[0],
      sleep_quality: formData.sleep[0],
      mood_score: formData.mood[0],
      fatigue_level: formData.fatigue[0],
      notes: formData.notes || undefined,
    });

    setIsSubmitting(false);

    if (result.success) {
      toast({
        title: result.data?.is_new ? "Check-in salvo!" : "Check-in atualizado!",
        description: result.data?.is_new
          ? "Suas métricas foram registradas com sucesso."
          : "Seu check-in de hoje foi atualizado.",
      });
      navigate("/dashboard");
    } else {
      toast({
        title: "Erro ao salvar",
        description: result.error || "Tente novamente mais tarde",
        variant: "destructive",
      });
    }
  };

  const currentStepData = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-border/50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link
              to="/dashboard"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm font-medium">Voltar</span>
            </Link>

            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              <span className="font-semibold text-foreground">Check-in</span>
            </div>

            <div className="w-20 text-right">
              <span className="text-sm text-muted-foreground">
                {currentStep + 1}/{steps.length}
              </span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="h-1 bg-secondary -mx-4">
            <motion.div
              className="h-full bg-primary"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="pt-24 pb-32 px-4">
        <div className="container mx-auto max-w-lg">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Step header */}
              <div className="text-center mb-8">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center text-${currentStepData.color === "energy" ? "pulse-energy" : currentStepData.color === "sleep" ? "pulse-sleep" : currentStepData.color === "mood" ? "pulse-mood" : "pulse-fatigue"} bg-${currentStepData.color === "energy" ? "pulse-energy" : currentStepData.color === "sleep" ? "pulse-sleep" : currentStepData.color === "mood" ? "pulse-mood" : "pulse-fatigue"}/10`}
                >
                  {currentStepData.icon}
                </motion.div>
                <h1 className="text-2xl font-bold text-foreground mb-2">
                  {currentStepData.title}
                </h1>
                <p className="text-muted-foreground">
                  {currentStepData.description}
                </p>
              </div>

              {/* Step content */}
              <PulseCard className="p-6 md:p-8">
                {currentStepData.id === "pain" ? (
                  <BodyMap
                    selectedParts={formData.painAreas}
                    onPartToggle={handlePainToggle}
                    painLevels={formData.painLevels}
                    onPainLevelChange={handlePainLevelChange}
                  />
                ) : (
                  <MetricSlider
                    label={currentStepData.title}
                    icon={currentStepData.icon}
                    color={currentStepData.color}
                    value={formData[currentStepData.id as keyof typeof formData] as number[]}
                    onValueChange={(value) =>
                      handleSliderChange(currentStepData.id, value)
                    }
                    min={1}
                    max={10}
                    step={1}
                  />
                )}

                {/* Value indicators */}
                {currentStepData.id !== "pain" && (
                  <div className="flex justify-between mt-4 text-xs text-muted-foreground">
                    <span>Muito baixo</span>
                    <span>Muito alto</span>
                  </div>
                )}
              </PulseCard>

              {/* Quick labels for context */}
              {currentStepData.id !== "pain" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="mt-6 flex justify-center gap-2 flex-wrap"
                >
                  {currentStepData.id === "energy" && (
                    <>
                      {[
                        { value: 2, label: "Exausto" },
                        { value: 5, label: "Normal" },
                        { value: 8, label: "Energizado" },
                      ].map((item) => (
                        <button
                          key={item.value}
                          onClick={() =>
                            handleSliderChange(currentStepData.id, [item.value])
                          }
                          className="px-4 py-2 rounded-full text-sm bg-secondary hover:bg-secondary/80 text-muted-foreground hover:text-foreground transition-all"
                        >
                          {item.label}
                        </button>
                      ))}
                    </>
                  )}
                  {currentStepData.id === "sleep" && (
                    <>
                      {[
                        { value: 2, label: "Péssimo" },
                        { value: 5, label: "Regular" },
                        { value: 8, label: "Excelente" },
                      ].map((item) => (
                        <button
                          key={item.value}
                          onClick={() =>
                            handleSliderChange(currentStepData.id, [item.value])
                          }
                          className="px-4 py-2 rounded-full text-sm bg-secondary hover:bg-secondary/80 text-muted-foreground hover:text-foreground transition-all"
                        >
                          {item.label}
                        </button>
                      ))}
                    </>
                  )}
                  {currentStepData.id === "mood" && (
                    <>
                      {[
                        { value: 2, label: "😔 Triste" },
                        { value: 5, label: "😐 Neutro" },
                        { value: 8, label: "😊 Feliz" },
                      ].map((item) => (
                        <button
                          key={item.value}
                          onClick={() =>
                            handleSliderChange(currentStepData.id, [item.value])
                          }
                          className="px-4 py-2 rounded-full text-sm bg-secondary hover:bg-secondary/80 text-muted-foreground hover:text-foreground transition-all"
                        >
                          {item.label}
                        </button>
                      ))}
                    </>
                  )}
                  {currentStepData.id === "fatigue" && (
                    <>
                      {[
                        { value: 2, label: "Descansado" },
                        { value: 5, label: "Moderado" },
                        { value: 8, label: "Muito cansado" },
                      ].map((item) => (
                        <button
                          key={item.value}
                          onClick={() =>
                            handleSliderChange(currentStepData.id, [item.value])
                          }
                          className="px-4 py-2 rounded-full text-sm bg-secondary hover:bg-secondary/80 text-muted-foreground hover:text-foreground transition-all"
                        >
                          {item.label}
                        </button>
                      ))}
                    </>
                  )}
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Fixed bottom navigation */}
      <div className="fixed bottom-0 left-0 right-0 p-4 glass-card border-t border-border/50">
        <div className="container mx-auto max-w-lg flex gap-3">
          {currentStep > 0 && (
            <PulseButton
              variant="outline"
              size="lg"
              onClick={handleBack}
              className="flex-1"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Voltar
            </PulseButton>
          )}
          <PulseButton
            variant="hero"
            size="lg"
            onClick={isLastStep ? handleSubmit : handleNext}
            disabled={isSubmitting}
            className="flex-1"
          >
            {isSubmitting ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full"
              />
            ) : isLastStep ? (
              <>
                <Check className="w-5 h-5 mr-2" />
                Salvar Check-in
              </>
            ) : (
              <>
                Próximo
                <ArrowRight className="w-5 h-5 ml-2" />
              </>
            )}
          </PulseButton>
        </div>
      </div>
    </div>
  );
};

export default CheckIn;
