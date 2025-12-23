"use client";

import { motion } from "framer-motion";
import { Share2, Zap } from "lucide-react";
import { sdk } from "@farcaster/frame-sdk";
import { Button } from "@/components/ui/button";

interface ShareProgressProps {
    steps: number;
    earned: string;
}

export function ShareProgress({ steps, earned }: ShareProgressProps) {
    const handleShare = async () => {
        try {
            const text = `👟 I just smashed ${steps.toLocaleString()} steps on BaseStride and earned ${earned} $STRIDE on Base! \n\nCheck out your stats:`;

            // Native share intent for Farcaster Mini App v2
            await sdk.actions.viewProfile({
                fid: 0 // Placeholder or use current user fid if available
            });

            // Alternative: Compose link
            window.open(`https://warpcast.com/~/compose?text=${encodeURIComponent(text)}&embeds[]=${encodeURIComponent("https://basestride.vercel.app")}`, "_blank");
        } catch (error) {
            console.error("Sharing failed", error);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full px-4"
        >
            <button
                onClick={handleShare}
                className="w-full h-12 glass-panel hover:bg-white/10 text-foreground font-black text-xs tracking-[0.2em] rounded-2xl flex items-center justify-center gap-3 border border-white/10 transition-all active:scale-95 group overflow-hidden relative"
            >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent -translate-x-full group-hover:animate-shimmer" />
                <Share2 className="w-4 h-4 text-primary" />
                SHARE YOUR PACE
                <Zap className="w-3 h-3 fill-primary text-primary animate-pulse" />
            </button>
        </motion.div>
    );
}

// Add shimmer animation to tailwind config if missing, but we'll use a CSS utility or raw class
