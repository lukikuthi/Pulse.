import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface MetricSliderProps
  extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {
  label: string;
  icon: React.ReactNode;
  color: "energy" | "sleep" | "mood" | "fatigue";
  showValue?: boolean;
}

const colorClasses = {
  energy: {
    track: "bg-pulse-energy/20",
    range: "bg-pulse-energy",
    thumb: "border-pulse-energy bg-background shadow-[0_0_10px_hsl(var(--pulse-energy)/0.5)]",
    icon: "text-pulse-energy",
  },
  sleep: {
    track: "bg-pulse-sleep/20",
    range: "bg-pulse-sleep",
    thumb: "border-pulse-sleep bg-background shadow-[0_0_10px_hsl(var(--pulse-sleep)/0.5)]",
    icon: "text-pulse-sleep",
  },
  mood: {
    track: "bg-pulse-mood/20",
    range: "bg-pulse-mood",
    thumb: "border-pulse-mood bg-background shadow-[0_0_10px_hsl(var(--pulse-mood)/0.5)]",
    icon: "text-pulse-mood",
  },
  fatigue: {
    track: "bg-pulse-fatigue/20",
    range: "bg-pulse-fatigue",
    thumb: "border-pulse-fatigue bg-background shadow-[0_0_10px_hsl(var(--pulse-fatigue)/0.5)]",
    icon: "text-pulse-fatigue",
  },
};

const MetricSlider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  MetricSliderProps
>(({ className, label, icon, color, showValue = true, value, ...props }, ref) => {
  const colors = colorClasses[color];
  const currentValue = value?.[0] ?? 0;

  return (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className={cn("text-xl", colors.icon)}>{icon}</span>
          <span className="text-sm font-medium text-foreground">{label}</span>
        </div>
        {showValue && (
          <motion.span
            key={currentValue}
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-2xl font-semibold text-foreground tabular-nums"
          >
            {currentValue}
          </motion.span>
        )}
      </div>
      <SliderPrimitive.Root
        ref={ref}
        className={cn(
          "relative flex w-full touch-none select-none items-center",
          className
        )}
        value={value}
        {...props}
      >
        <SliderPrimitive.Track
          className={cn(
            "relative h-3 w-full grow overflow-hidden rounded-full",
            colors.track
          )}
        >
          <SliderPrimitive.Range
            className={cn("absolute h-full transition-all duration-150", colors.range)}
          />
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb
          className={cn(
            "block h-6 w-6 rounded-full border-2 transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:scale-110",
            colors.thumb
          )}
        />
      </SliderPrimitive.Root>
    </motion.div>
  );
});
MetricSlider.displayName = "MetricSlider";

export { MetricSlider };
