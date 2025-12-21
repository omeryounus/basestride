"use client";

import { usePedometer } from "@/hooks/usePedometer";
import { StepCounter } from "@/components/dashboard/StepCounter";
import { StepSimulator } from "@/components/debug/StepSimulator";
import { Button } from "@/components/ui/button";
import { Zap, MapPin, Trophy, Play, Pause, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { WalletWrapper } from "@/components/WalletWrapper";
import { Leaderboard } from "@/components/dashboard/Leaderboard";
import { MarketPlaceholder } from "@/components/dashboard/MarketPlaceholder";
import { WelcomeModal } from "@/components/WelcomeModal";
import { ThemeToggle } from "@/components/ThemeToggle";
import { cn } from "@/lib/utils";

type View = 'RUN' | 'LEADERBOARD' | 'MARKET';

export default function Home() {
  const [currentView, setCurrentView] = useState<View>('RUN');
  const {
    steps,
    isTracking,
    permissionGranted,
    requestPermission,
    startTracking,
    stopTracking
  } = usePedometer();

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
    <>
      <WelcomeModal />
      <main className="min-h-screen pb-24 bg-background text-foreground overflow-hidden relative">
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

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col items-center justify-center p-4 min-h-[60vh] relative z-10">

          {/* RUN VIEW */}
          {currentView === 'RUN' && (
            <div className="flex flex-col items-center w-full max-w-md animate-in fade-in zoom-in-95 duration-500">
              <StepCounter steps={steps} goal={10000} />

              {/* Action Button */}
              <div className="mt-8 z-10">
                <Button
                  onClick={toggleTracking}
                  className={cn(
                    "h-16 px-12 rounded-full text-lg font-black tracking-wide shadow-[0_0_30px_rgba(0,82,255,0.4)] transition-all hover:scale-105 active:scale-95",
                    isTracking ? 'bg-red-500 hover:bg-red-600 shadow-red-500/40' : 'bg-primary hover:bg-primary/90'
                  )}
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
          )}

          {/* LEADERBOARD VIEW */}
          {currentView === 'LEADERBOARD' && <Leaderboard />}

          {/* MARKET VIEW */}
          {currentView === 'MARKET' && <MarketPlaceholder />}

        </div>

        {/* Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 h-20 glass-panel border-t border-white/5 flex justify-around items-center px-6 z-20 backdrop-blur-xl bg-background/80">

          <button
            onClick={() => setCurrentView('RUN')}
            className={cn(
              "flex flex-col items-center gap-1 transition-all duration-300",
              currentView === 'RUN' ? "text-primary scale-110" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <MapPin size={24} className={currentView === 'RUN' ? "drop-shadow-[0_0_8px_rgba(0,82,255,0.5)]" : ""} />
            <span className="text-[10px] font-bold">RUN</span>
          </button>

          <button
            onClick={() => setCurrentView('LEADERBOARD')}
            className={cn(
              "flex flex-col items-center gap-1 transition-all duration-300",
              currentView === 'LEADERBOARD' ? "text-primary scale-110" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Trophy size={24} className={currentView === 'LEADERBOARD' ? "drop-shadow-[0_0_8px_rgba(0,82,255,0.5)]" : ""} />
            <span className="text-[10px] font-bold">LEADERBOARD</span>
          </button>

          <button
            onClick={() => setCurrentView('MARKET')}
            className={cn(
              "flex flex-col items-center gap-1 transition-all duration-300",
              currentView === 'MARKET' ? "text-secondary scale-110" : "text-muted-foreground hover:text-foreground"
            )}
          >
            {currentView === 'MARKET' ? (
              <ShoppingBag size={24} className="drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]" />
            ) : (
              <div className="w-6 h-6 rounded bg-gradient-to-br from-secondary to-green-400 opacity-70" />
            )}
            <span className="text-[10px] font-bold">MARKET</span>
          </button>

        </nav>

        {/* Debug Tool */}
        {process.env.NODE_ENV === 'development' && steps > 0 && currentView === 'RUN' && (
          <div className="absolute top-20 left-4 opacity-50 hover:opacity-100 transition-opacity">
            <StepSimulator />
          </div>
        )}
      </main>
    </>
  );
}
