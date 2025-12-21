import { Trophy, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { LeaderboardSkeleton } from "@/components/ui/skeleton";
import { useActivity } from "@/hooks/useActivity";

interface LeaderboardItem {
    wallet_address: string;
    total_lifetime_steps: number;
}

export function Leaderboard() {
    const [isLoading, setIsLoading] = useState(true);
    const [leaderboardData, setLeaderboardData] = useState<LeaderboardItem[]>([]);
    const { getLeaderboard } = useActivity();

    useEffect(() => {
        const fetchLeaderboard = async () => {
            setIsLoading(true);
            const { data, error } = await getLeaderboard();
            if (!error && data) {
                setLeaderboardData(data as LeaderboardItem[]);
            }
            setIsLoading(false);
        };

        fetchLeaderboard();
    }, [getLeaderboard]);

    const shortenAddress = (address: string) => {
        return `${address.slice(0, 4)}...${address.slice(-3)}`;
    };

    return (
        <div className="w-full max-w-md mx-auto h-full flex flex-col p-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center gap-2 mb-6 ml-2">
                <Trophy className="text-yellow-400 w-6 h-6" />
                <h2 className="text-xl font-black italic tracking-wider">TOP STRIDERS</h2>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pb-24 scrollbar-hide">
                {isLoading ? (
                    <LeaderboardSkeleton />
                ) : leaderboardData.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                        <User size={48} className="opacity-20 mb-4" />
                        <p className="text-sm font-medium">No striders yet. Be the first!</p>
                    </div>
                ) : (
                    leaderboardData.map((item, index) => (
                        <div
                            key={item.wallet_address}
                            className={cn(
                                "flex items-center justify-between p-4 rounded-xl border backdrop-blur-md transition-all",
                                index < 3
                                    ? "bg-white/10 border-white/10 shadow-[0_0_15px_rgba(255,255,255,0.05)]"
                                    : "bg-white/5 border-transparent hover:bg-white/10"
                            )}
                        >
                            <div className="flex items-center gap-4">
                                <div className={cn(
                                    "w-8 h-8 flex items-center justify-center font-bold rounded-full text-xs",
                                    index === 0 ? "bg-yellow-400 text-black shadow-[0_0_10px_rgba(250,204,21,0.5)]" :
                                        index === 1 ? "bg-gray-300 text-black" :
                                            index === 2 ? "bg-orange-400 text-black" :
                                                "bg-white/10 text-muted-foreground"
                                )}>
                                    {index + 1}
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className={cn(
                                        "w-8 h-8 rounded-full flex items-center justify-center text-black/50",
                                        index === 0 ? "bg-yellow-500/20" : "bg-white/10"
                                    )}>
                                        <User size={16} />
                                    </div>
                                    <span className="font-mono text-sm font-medium opacity-90">
                                        {shortenAddress(item.wallet_address)}
                                    </span>
                                </div>
                            </div>

                            <div className="flex flex-col items-end">
                                <span className="text-lg font-bold tracking-tight">
                                    {item.total_lifetime_steps.toLocaleString()}
                                </span>
                                <span className="text-[10px] text-muted-foreground font-bold tracking-wider">STEPS</span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
