"use client";

import { useState, useEffect } from "react";
import { X, Footprints, Trophy, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function WelcomeModal() {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        // Check if user has seen the welcome modal
        const hasSeenWelcome = localStorage.getItem("basestride-welcome-seen");
        if (!hasSeenWelcome) {
            setIsOpen(true);
        }
    }, []);

    const handleClose = () => {
        localStorage.setItem("basestride-welcome-seen", "true");
        setIsOpen(false);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="relative w-full max-w-md bg-gradient-to-br from-background via-background to-primary/5 border border-white/10 rounded-2xl shadow-2xl animate-in zoom-in-95 duration-300">
                {/* Close Button */}
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition-colors"
                >
                    <X size={20} className="text-muted-foreground" />
                </button>

                {/* Content */}
                <div className="p-8 space-y-6">
                    {/* Header */}
                    <div className="text-center space-y-2">
                        <div className="w-16 h-16 mx-auto bg-primary/20 rounded-full flex items-center justify-center mb-4">
                            <Footprints className="w-8 h-8 text-primary" />
                        </div>
                        <h2 className="text-2xl font-black tracking-tight">Welcome to BaseStride</h2>
                        <p className="text-muted-foreground text-sm">
                            Earn $STRIDE for every step you take
                        </p>
                    </div>

                    {/* Features */}
                    <div className="space-y-4">
                        <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                                <Footprints size={20} className="text-primary" />
                            </div>
                            <div>
                                <h3 className="font-bold text-sm">Track Your Steps</h3>
                                <p className="text-xs text-muted-foreground">
                                    Use your device's motion sensors to count every step
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0">
                                <Trophy size={20} className="text-secondary" />
                            </div>
                            <div>
                                <h3 className="font-bold text-sm">Compete & Earn</h3>
                                <p className="text-xs text-muted-foreground">
                                    Climb the leaderboard and earn $STRIDE tokens
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center flex-shrink-0">
                                <Wallet size={20} className="text-green-500" />
                            </div>
                            <div>
                                <h3 className="font-bold text-sm">Connect Your Wallet</h3>
                                <p className="text-xs text-muted-foreground">
                                    Seamlessly connect with Coinbase Smart Wallet
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* CTA */}
                    <Button
                        onClick={handleClose}
                        className={cn(
                            "w-full h-12 rounded-full text-base font-black tracking-wide",
                            "bg-primary hover:bg-primary/90 shadow-[0_0_20px_rgba(0,82,255,0.3)]",
                            "transition-all hover:scale-105 active:scale-95"
                        )}
                    >
                        Get Started
                    </Button>

                    <p className="text-center text-xs text-muted-foreground">
                        Press START on the main screen to begin tracking
                    </p>
                </div>
            </div>
        </div>
    );
}
