import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface BodyPart {
  id: string;
  name: string;
  path?: string;
  cx: number;
  cy: number;
}

interface BodyMapProps {
  selectedParts: string[];
  onPartToggle: (partId: string) => void;
  painLevels?: Record<string, number>;
  onPainLevelChange?: (partId: string, level: number) => void;
}

const bodyParts: BodyPart[] = [
  { id: "head", name: "Cabeça", cx: 100, cy: 30 },
  { id: "neck", name: "Pescoço", cx: 100, cy: 55 },
  { id: "shoulder_left", name: "Ombro Esq.", cx: 70, cy: 75 },
  { id: "shoulder_right", name: "Ombro Dir.", cx: 130, cy: 75 },
  { id: "chest", name: "Peito", cx: 100, cy: 95 },
  { id: "upper_back", name: "Costas Sup.", cx: 100, cy: 85 },
  { id: "arm_left", name: "Braço Esq.", cx: 55, cy: 110 },
  { id: "arm_right", name: "Braço Dir.", cx: 145, cy: 110 },
  { id: "lower_back", name: "Lombar", cx: 100, cy: 130 },
  { id: "abdomen", name: "Abdômen", cx: 100, cy: 120 },
  { id: "hip_left", name: "Quadril Esq.", cx: 80, cy: 150 },
  { id: "hip_right", name: "Quadril Dir.", cx: 120, cy: 150 },
  { id: "thigh_left", name: "Coxa Esq.", cx: 80, cy: 185 },
  { id: "thigh_right", name: "Coxa Dir.", cx: 120, cy: 185 },
  { id: "knee_left", name: "Joelho Esq.", cx: 80, cy: 220 },
  { id: "knee_right", name: "Joelho Dir.", cx: 120, cy: 220 },
  { id: "calf_left", name: "Panturrilha Esq.", cx: 80, cy: 255 },
  { id: "calf_right", name: "Panturrilha Dir.", cx: 120, cy: 255 },
  { id: "foot_left", name: "Pé Esq.", cx: 80, cy: 290 },
  { id: "foot_right", name: "Pé Dir.", cx: 120, cy: 290 },
];

const BodyMap = ({
  selectedParts,
  onPartToggle,
  painLevels = {},
  onPainLevelChange,
}: BodyMapProps) => {
  const [hoveredPart, setHoveredPart] = useState<string | null>(null);
  const [activePart, setActivePart] = useState<string | null>(null);

  const getPainColor = (level: number) => {
    if (level <= 3) return "hsl(var(--pulse-warning))";
    if (level <= 6) return "hsl(var(--pulse-fatigue))";
    return "hsl(var(--pulse-pain))";
  };

  const handlePartClick = (partId: string) => {
    if (selectedParts.includes(partId)) {
      setActivePart(activePart === partId ? null : partId);
    } else {
      onPartToggle(partId);
      setActivePart(partId);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 items-center justify-center">
      {/* Body SVG */}
      <div className="relative">
        <svg
          viewBox="0 0 200 320"
          className="w-48 h-80 md:w-56 md:h-96"
          style={{ filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.1))" }}
        >
          {/* Body outline */}
          <ellipse
            cx="100"
            cy="30"
            rx="22"
            ry="26"
            fill="hsl(var(--secondary))"
            stroke="hsl(var(--border))"
            strokeWidth="1.5"
          />
          <path
            d="M78 55 Q75 70 70 80 L55 130 Q50 140 55 145 L65 140 Q70 130 75 115 L78 100"
            fill="hsl(var(--secondary))"
            stroke="hsl(var(--border))"
            strokeWidth="1.5"
          />
          <path
            d="M122 55 Q125 70 130 80 L145 130 Q150 140 145 145 L135 140 Q130 130 125 115 L122 100"
            fill="hsl(var(--secondary))"
            stroke="hsl(var(--border))"
            strokeWidth="1.5"
          />
          <path
            d="M78 55 L78 100 Q78 160 85 165 L85 220 Q80 280 85 295 L90 295 Q95 280 92 220 L100 165 L108 220 Q105 280 110 295 L115 295 Q120 280 115 220 L115 165 Q122 160 122 100 L122 55 Q100 65 78 55"
            fill="hsl(var(--secondary))"
            stroke="hsl(var(--border))"
            strokeWidth="1.5"
          />

          {/* Interactive body parts */}
          {bodyParts.map((part) => {
            const isSelected = selectedParts.includes(part.id);
            const isHovered = hoveredPart === part.id;
            const painLevel = painLevels[part.id] || 0;

            return (
              <motion.circle
                key={part.id}
                cx={part.cx}
                cy={part.cy}
                r={isHovered ? 14 : 12}
                fill={isSelected ? getPainColor(painLevel) : "transparent"}
                stroke={isSelected ? getPainColor(painLevel) : "hsl(var(--border))"}
                strokeWidth={isSelected ? 2 : 1}
                strokeDasharray={isSelected ? "none" : "3 3"}
                className="cursor-pointer transition-all duration-200"
                onClick={() => handlePartClick(part.id)}
                onMouseEnter={() => setHoveredPart(part.id)}
                onMouseLeave={() => setHoveredPart(null)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0 }}
                animate={{
                  opacity: isSelected ? 0.8 : isHovered ? 0.5 : 0.3,
                  fill: isSelected ? getPainColor(painLevel) : isHovered ? "hsl(var(--primary) / 0.2)" : "transparent",
                }}
              />
            );
          })}
        </svg>

        {/* Hover tooltip */}
        <AnimatePresence>
          {hoveredPart && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-foreground text-background text-xs font-medium rounded-lg whitespace-nowrap"
            >
              {bodyParts.find((p) => p.id === hoveredPart)?.name}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Selected parts panel */}
      <div className="w-full md:w-64 space-y-3">
        <h4 className="text-sm font-medium text-muted-foreground">
          Áreas selecionadas
        </h4>
        <AnimatePresence mode="popLayout">
          {selectedParts.length === 0 ? (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-muted-foreground/60 italic"
            >
              Clique nas áreas do corpo para marcar dores
            </motion.p>
          ) : (
            selectedParts.map((partId) => {
              const part = bodyParts.find((p) => p.id === partId);
              const level = painLevels[partId] || 5;

              return (
                <motion.div
                  key={partId}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="p-3 rounded-xl bg-secondary/50 border border-border"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">{part?.name}</span>
                    <button
                      onClick={() => onPartToggle(partId)}
                      className="text-xs text-muted-foreground hover:text-destructive transition-colors"
                    >
                      Remover
                    </button>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Intensidade</span>
                      <span className="font-medium">{level}/10</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={level}
                      onChange={(e) =>
                        onPainLevelChange?.(partId, parseInt(e.target.value))
                      }
                      className="w-full h-2 rounded-full appearance-none cursor-pointer"
                      style={{
                        background: `linear-gradient(to right, ${getPainColor(level)} ${level * 10}%, hsl(var(--border)) ${level * 10}%)`,
                      }}
                    />
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default BodyMap;
