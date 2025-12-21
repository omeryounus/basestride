"use client";

import { usePedometer } from "@/hooks/usePedometer";
import { StepCounter } from "@/components/dashboard/StepCounter";
import { StepSimulator } from "@/components/debug/StepSimulator";
import { Button } from "@/components/ui/button";
import { Zap, MapPin, Trophy, Play, Pause } from "lucide-react";
import { useEffect } from "react";
import { WalletWrapper } from "@/components/WalletWrapper";

export default function Home() {
  const {
    steps,
    isTracking,
    permissionGranted,
    requestPermission,
    startTracking,
    stopTracking
  } = usePedometer();

  // Handle auto-start if permission already granted
  useEffect(() => {
    if (permissionGranted && !isTracking) {
      startTracking();
    }
  }, [permissionGranted, isTracking, startTracking]);

  const toggleTracking = () => {
    if (!isTracking) {
      if (permissionGranted === null || permissionGranted === false) {
        requestPermission();
      } else {
        startTracking();
      }
    } else {
      stopTracking();
    }
  };

  return (
    <main className="min-h-screen pb-20 bg-background text-foreground overflow-hidden relative">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />

      {/* Header */}
      <header className="px-6 py-4 flex justify-between items-center z-10 relative">
        <div className="flex items-center gap-3">
          <WalletWrapper />
        </div>

        <div className="flex items-center gap-4">
          {/* Energy Bar */}
          <div className="flex flex-col items-end w-24">
            <div className="flex justify-between w-full text-[10px] items-center mb-1">
              <Zap size={12} className="text-yellow-400 fill-current" />
              <span className="font-mono">8.5/10.0</span>
            </div>
            <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-yellow-400 w-[85%]" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 min-h-[60vh]">
        <StepCounter steps={steps} goal={10000} />

        {/* Action Button */}
        <div className="mt-8 z-10">
          <Button
            onClick={toggleTracking}
            className={`
              h-16 px-12 rounded-full text-lg font-black tracking-wide shadow-[0_0_30px_rgba(0,82,255,0.4)] transition-all hover:scale-105 active:scale-95
              ${isTracking ? 'bg-red-500 hover:bg-red-600 shadow-red-500/40' : 'bg-primary hover:bg-primary/90'}
            `}
          >
            {isTracking ? (
              <div className="flex items-center gap-2">
                <Pause fill="currentColor" /> PAUSE
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Play fill="currentColor" /> START
              </div>
            )}
          </Button>

          {!isTracking && (
            <p className="text-center text-xs text-muted-foreground mt-4 animate-pulse">
              Press START to earn
            </p>
          )}
        </div>
      </div>

      {/* Bottom Nav (Mock) */}
      <nav className="fixed bottom-0 left-0 right-0 h-20 glass-panel border-t border-white/5 flex justify-around items-center px-6 z-20">
        <div className="flex flex-col items-center gap-1 text-primary">
          <MapPin size={24} />
          <span className="text-[10px] font-bold">RUN</span>
        </div>
        <div className="flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground transition">
          <Trophy size={24} />
          <span className="text-[10px] font-bold">LEADERBOARD</span>
        </div>
        <div className="flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground transition">
          <div className="w-6 h-6 rounded bg-gradient-to-br from-secondary to-green-400" />
          <span className="text-[10px] font-bold">MARKET</span>
        </div>
      </nav>

      {/* Debug Tool */}
      {process.env.NODE_ENV === 'development' && <StepSimulator />}
    </main>
  );
}
