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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full"
        >
            <Button
                onClick={handleShare}
                className="w-full bg-slate-100 hover:bg-white text-black font-black py-6 rounded-2xl flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(255,255,255,0.1)] group overflow-hidden relative"
            >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer" />
                <Share2 className="w-5 h-5" />
                SHARE PROGRESS
                <Zap className="w-4 h-4 fill-black text-black" />
            </Button>
            <p className="text-[10px] text-center mt-3 text-muted-foreground uppercase tracking-widest font-bold opacity-60">
                Share stats to Warpcast and challenge friends
            </p>
        </motion.div>
    );
}

// Add shimmer animation to tailwind config if missing, but we'll use a CSS utility or raw class
