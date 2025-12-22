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
        <div className="relative flex flex-col items-center justify-center py-12">
            {/* Ambient Background Glow */}
            <div className="absolute inset-0 bg-primary/5 blur-[100px] rounded-full transform scale-110 pointer-events-none" />

            {/* Circle Container */}
            <div className="relative w-[320px] h-[320px] flex items-center justify-center">
                {/* SVG Ring Layering */}
                <svg className="w-full h-full transform -rotate-90 filter drop-shadow-[0_0_20px_rgba(0,82,255,0.4)]">
                    {/* Outer Track (Glass effect) */}
                    <circle
                        cx="160"
                        cy="160"
                        r={radius}
                        stroke="currentColor"
                        strokeWidth="12"
                        fill="transparent"
                        className="text-muted/10"
                    />

                    {/* Inner Track Shadow */}
                    <circle
                        cx="160"
                        cy="160"
                        r={radius - 12}
                        stroke="currentColor"
                        strokeWidth="1"
                        fill="transparent"
                        className="text-white/5"
                    />

                    {/* Background Progress Glow (Faint) */}
                    <motion.circle
                        cx="160"
                        cy="160"
                        r={radius}
                        stroke="currentColor"
                        strokeWidth="12"
                        fill="transparent"
                        strokeDasharray={circumference}
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        strokeLinecap="round"
                        className="text-primary/20"
                    />

                    {/* Main Progress Indicator */}
                    <motion.circle
                        cx="160"
                        cy="160"
                        r={radius}
                        stroke="currentColor"
                        strokeWidth="12"
                        fill="transparent"
                        strokeDasharray={circumference}
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset }}
                        transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                        strokeLinecap="round"
                        className="text-primary neon-text"
                    />

                    {/* Progress Tip Glow */}
                    {progress > 0 && (
                        <circle
                            cx={160 + radius * Math.cos((progress * 360 - 90) * (Math.PI / 180))}
                            cy={160 + radius * Math.sin((progress * 360 - 90) * (Math.PI / 180))}
                            r="8"
                            fill="#0052FF"
                            className="filter blur-[4px]"
                        />
                    )}
                </svg>

                {/* Center Stats */}
                <div className="absolute flex flex-col items-center z-10">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", damping: 15 }}
                        className="flex flex-col items-center"
                    >
                        <span className="text-7xl font-black italic tracking-tighter text-foreground drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]">
                            {steps.toLocaleString()}
                        </span>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="h-[1px] w-4 bg-muted-foreground/30" />
                            <span className="text-xs uppercase tracking-[0.2em] font-bold text-muted-foreground">
                                Steps Today
                            </span>
                            <span className="h-[1px] w-4 bg-muted-foreground/30" />
                        </div>

                        <motion.div
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="mt-6 px-5 py-2 glass-panel neon-border-secondary rounded-2xl flex items-center gap-2 group cursor-default"
                        >
                            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse shadow-[0_0_10px_rgba(212,255,0,0.8)]" />
                            <span className="text-sm font-black text-secondary tracking-tight">
                                +{earned} $STRIDE
                            </span>
                        </motion.div>
                    </motion.div>
                </div>
            </div>

            {/* Goal Status Bar */}
            <div className="mt-8 flex flex-col items-center gap-2">
                <div className="flex justify-between w-48 text-[10px] uppercase tracking-widest font-black text-muted-foreground opacity-50">
                    <span>Progress</span>
                    <span>{(progress * 100).toFixed(0)}%</span>
                </div>
                <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress * 100}%` }}
                        className="h-full bg-primary shadow-[0_0_10px_rgba(0,82,255,0.5)]"
                    />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                    Daily Goal: <span className="text-foreground font-bold">{goal.toLocaleString()}</span>
                </p>
            </div>
        </div>
    );
};
