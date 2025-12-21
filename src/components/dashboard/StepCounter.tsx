"use client";

import { motion } from "framer-motion";

interface StepCounterProps {
    steps: number;
    goal?: number;
}

export const StepCounter = ({ steps, goal = 10000 }: StepCounterProps) => {
    // Calculate potential earnings (e.g., 1000 steps = 1 $STRIDE base)
    const earned = (steps / 1000).toFixed(2);
    const progress = Math.min(steps / goal, 1);

    // Circumference for SVG circle (r=120) -> 2*pi*r ≈ 754
    const radius = 120;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - progress * circumference;

    return (
        <div className="relative flex flex-col items-center justify-center py-8">
            {/* Glow Effect */}
            <div className="absolute inset-0 bg-primary/10 blur-[60px] rounded-full transform scale-75" />

            {/* Circle Container */}
            <div className="relative w-[300px] h-[300px] flex items-center justify-center">
                {/* SVG Ring */}
                <svg className="w-full h-full transform -rotate-90 drop-shadow-[0_0_15px_rgba(0,82,255,0.3)]">
                    {/* Background Track */}
                    <circle
                        cx="150"
                        cy="150"
                        r={radius}
                        stroke="currentColor"
                        strokeWidth="20"
                        fill="transparent"
                        className="text-muted/30"
                    />
                    {/* Progress Indicator */}
                    <motion.circle
                        cx="150"
                        cy="150"
                        r={radius}
                        stroke="currentColor"
                        strokeWidth="20"
                        fill="transparent"
                        strokeDasharray={circumference}
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        strokeLinecap="round"
                        className="text-primary neon-text"
                    />
                </svg>

                {/* Center Stats */}
                <div className="absolute flex flex-col items-center z-10">
                    <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="flex flex-col items-center"
                    >
                        <span className="text-6xl font-black italic tracking-tighter text-foreground drop-shadow-lg">
                            {steps.toLocaleString()}
                        </span>
                        <span className="text-xs uppercase tracking-widest text-muted-foreground mt-1">
                            Steps Today
                        </span>

                        <div className="mt-4 px-4 py-1 glass-panel rounded-full flex items-center gap-2 border-primary/20">
                            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
                            <span className="text-sm font-bold text-secondary">
                                +{earned} $STRIDE
                            </span>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Goal Status */}
            <p className="mt-4 text-sm text-muted-foreground">
                Goal: <span className="text-foreground font-semibold">{goal.toLocaleString()}</span>
            </p>
        </div>
    );
};
