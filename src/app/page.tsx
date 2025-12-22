"use client";

import { usePedometer } from "@/hooks/usePedometer";
import { StepCounter } from "@/components/dashboard/StepCounter";
import { StepSimulator } from "@/components/debug/StepSimulator";
import { Button } from "@/components/ui/button";
import { WelcomeModal } from "@/components/WelcomeModal";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { Coins, Zap, MapPin, Trophy, Play, Pause, ShoppingBag } from "lucide-react";
import { useState, useEffect } from "react";
import { WalletWrapper } from "@/components/WalletWrapper";
import { Leaderboard } from "@/components/dashboard/Leaderboard";
import Marketplace from "@/components/dashboard/Marketplace";
import ShoeInventory from "@/components/dashboard/ShoeInventory";
import { ClaimRewards } from "@/components/dashboard/ClaimRewards";
import { type Address } from "viem";
import { useAccount } from "wagmi";
import { useActivity } from "@/hooks/useActivity";
import { ShareProgress } from "@/components/social/ShareProgress";

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
  const { address } = useAccount();
  const { initUser, saveSteps, getUserStats } = useActivity();
  const [balance, setBalance] = useState<number>(0);
  const [energy, setEnergy] = useState<number>(0);
  const [maxEnergy, setMaxEnergy] = useState<number>(20);

  const fetchStats = async (addr: string) => {
    const { data } = await getUserStats(addr);
    if (data) {
      setBalance(data.total_earned_tokens || 0);
      setEnergy(data.energy || 0);
    }
  };

  // Initialize user in Supabase when wallet connects
  useEffect(() => {
    if (address) {
      initUser(address).then(() => fetchStats(address));
    }
  }, [address, initUser]);

  const toggleTracking = async () => {
    if (!isTracking) {
      if (permissionGranted === null || permissionGranted === false) {
        requestPermission();
      } else {
        startTracking();
      }
    } else {
      stopTracking();
      // Save steps to Supabase when stopping
      if (address && steps > 0) {
        try {
          await saveSteps(address, steps);
          await fetchStats(address);
          console.log(`Saved ${steps} steps for ${address}`);
        } catch (err) {
          console.error("Failed to save steps:", err);
        }
      }
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
            {/* Token Balance */}
            <div className="flex flex-col items-end">
              <div className="flex items-center gap-1.5 px-3 py-1 bg-secondary/20 rounded-full border border-secondary/30">
                <Coins size={14} className="text-secondary opacity-80" />
                <span className="text-xs font-black tracking-tight text-secondary">
                  {balance.toFixed(2)} <span className="opacity-70">STRIDE</span>
                </span>
              </div>
            </div>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Energy Bar */}
            <div className="flex flex-col items-end w-24">
              <div className="flex justify-between w-full text-[10px] items-center mb-1">
                <Zap size={12} className="text-yellow-400 fill-current" />
                <span className="font-mono">{energy}/{maxEnergy}</span>
              </div>
              <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-400 transition-all duration-500"
                  style={{ width: `${(energy / maxEnergy) * 100}%` }}
                />
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

              {/* Claim Rewards Section */}
              {balance > 0 && !isTracking && address && (
                <ClaimRewards
                  amount={balance}
                  address={address as Address}
                  onSuccess={() => fetchStats(address)}
                />
              )}

              <div className="w-full mt-4">
                <ShareProgress
                  steps={steps}
                  earned={(steps / 1000).toFixed(2)}
                />
              </div>

              {/* Action Button */}
              <div className="mt-10 z-10 w-full flex flex-col items-center">
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

              {/* Shoe Inventory */}
              {!isTracking && address && (
                <div className="w-full mt-12 mb-8">
                  <ShoeInventory />
                </div>
              )}
            </div>
          )}

          {/* LEADERBOARD VIEW */}
          {currentView === 'LEADERBOARD' && <Leaderboard />}

          {/* MARKET VIEW */}
          {currentView === 'MARKET' && (
            <div className="w-full max-w-4xl">
              <Marketplace />
            </div>
          )}

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
