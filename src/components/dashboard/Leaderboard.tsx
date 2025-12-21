import { Trophy, Medal, User } from "lucide-react";
import { cn } from "@/lib/utils";

const MOCK_LEADERBOARD = [
    { rank: 1, user: "0x12...4A2", steps: 24500, avatar: "bg-yellow-500" },
    { rank: 2, user: "0x89...2B1", steps: 21200, avatar: "bg-gray-300" },
    { rank: 3, user: "0x33...C90", steps: 18900, avatar: "bg-orange-400" },
    { rank: 4, user: "0x77...1F4", steps: 15400, avatar: "bg-blue-400" },
    { rank: 5, user: "0x55...8E2", steps: 12100, avatar: "bg-purple-400" },
    { rank: 6, user: "0x99...3D5", steps: 10500, avatar: "bg-green-400" },
    { rank: 7, user: "0x22...5A1", steps: 9800, avatar: "bg-red-400" },
    { rank: 8, user: "0x44...7B3", steps: 8700, avatar: "bg-indigo-400" },
];

export function Leaderboard() {
    return (
        <div className="w-full max-w-md mx-auto h-full flex flex-col p-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center gap-2 mb-6 ml-2">
                <Trophy className="text-yellow-400 w-6 h-6" />
                <h2 className="text-xl font-black italic tracking-wider">TOP STRIDERS</h2>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pb-24 scrollbar-hide">
                {MOCK_LEADERBOARD.map((item, index) => (
                    <div
                        key={index}
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
                                <div className={`w-8 h-8 rounded-full ${item.avatar} flex items-center justify-center text-black/50`}>
                                    <User size={16} />
                                </div>
                                <span className="font-mono text-sm font-medium opacity-90">{item.user}</span>
                            </div>
                        </div>

                        <div className="flex flex-col items-end">
                            <span className="text-lg font-bold tracking-tight">{item.steps.toLocaleString()}</span>
                            <span className="text-[10px] text-muted-foreground font-bold tracking-wider">STEPS</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
