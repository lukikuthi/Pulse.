import * as React from "react";
import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps } from "framer-motion";

interface PulseCardProps extends HTMLMotionProps<"div"> {
  variant?: "default" | "glass" | "metric" | "interactive";
}

const PulseCard = React.forwardRef<HTMLDivElement, PulseCardProps>(
  ({ className, variant = "default", children, ...props }, ref) => {
    const variants = {
      default: "bg-card border border-border rounded-2xl shadow-soft",
      glass: "glass-card rounded-2xl",
      metric: "metric-card bg-card border border-border shadow-soft",
      interactive:
        "bg-card border border-border rounded-2xl shadow-soft hover:shadow-medium hover:border-primary/20 cursor-pointer transition-all duration-300",
    };

    return (
      <motion.div
        ref={ref}
        className={cn(variants[variant], className)}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);
PulseCard.displayName = "PulseCard";

export { PulseCard };
