"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';
import { User, Camera, Check, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const AVATARS = [
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Aria",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Jack",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Luna",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Milo",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Zoe",
];

export const ProfilePage = ({ address, onUpdate }: { address: string; onUpdate?: () => void }) => {
    const [displayName, setDisplayName] = useState('');
    const [avatarUrl, setAvatarUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            if (!address) return;
            const { data } = await supabase
                .from('users')
                .select('display_name, avatar_url')
                .eq('wallet_address', address)
                .single();

            if (data) {
                setDisplayName(data.display_name || '');
                setAvatarUrl(data.avatar_url || AVATARS[0]);
            }
        };
        fetchProfile();
    }, [address]);

    const handleSave = async () => {
        setLoading(true);
        const { error } = await supabase
            .from('users')
            .update({
                display_name: displayName,
                avatar_url: avatarUrl
            })
            .eq('wallet_address', address);

        if (!error) {
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
            if (onUpdate) onUpdate();
        }
        setLoading(false);
    };

    return (
        <div className="w-full max-w-md mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header Section */}
            <div className="text-center space-y-2">
                <h2 className="text-3xl font-black italic tracking-tighter uppercase text-foreground">
                    Player Profile
                </h2>
                <p className="text-muted-foreground text-sm font-medium">
                    Customize your identity on the leaderboard
                </p>
            </div>

            {/* Profile Picture / Avatar Selection */}
            <div className="flex flex-col items-center gap-6">
                <div className="relative group">
                    <div className="w-32 h-32 rounded-full border-4 border-primary/20 p-1 group-hover:border-primary/40 transition-all">
                        <img
                            src={avatarUrl || AVATARS[0]}
                            alt="Avatar"
                            className="w-full h-full rounded-full bg-white/5 object-cover"
                        />
                    </div>
                    <div className="absolute bottom-0 right-0 w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white border-4 border-background shadow-lg group-hover:scale-110 transition-transform">
                        <Camera size={18} />
                    </div>
                </div>

                <div className="grid grid-cols-6 gap-2 w-full px-4">
                    {AVATARS.map((url) => (
                        <button
                            key={url}
                            onClick={() => setAvatarUrl(url)}
                            className={cn(
                                "w-full aspect-square rounded-xl border-2 transition-all overflow-hidden",
                                avatarUrl === url ? "border-primary scale-110 shadow-[0_0_15px_rgba(0,82,255,0.4)]" : "border-white/5 opacity-50 hover:opacity-100"
                            )}
                        >
                            <img src={url} alt="Avatar option" className="w-full h-full object-cover" />
                        </button>
                    ))}
                </div>
            </div>

            {/* Form Section */}
            <div className="space-y-4 px-4">
                <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-black text-muted-foreground ml-1">
                        Display Name
                    </label>
                    <Input
                        value={displayName}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDisplayName(e.target.value)}
                        placeholder="Enter your runner name..."
                        className="h-12 bg-white/5 border-white/10 rounded-xl focus:ring-primary focus:border-primary font-bold"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-black text-muted-foreground ml-1">
                        Wallet Address
                    </label>
                    <div className="h-12 bg-white/5 border border-white/5 rounded-xl flex items-center px-4 text-xs font-mono text-muted-foreground truncate opacity-50">
                        {address}
                    </div>
                </div>

                <Button
                    onClick={handleSave}
                    disabled={loading}
                    className={cn(
                        "w-full h-14 rounded-2xl text-lg font-black tracking-tight transition-all",
                        saved ? "bg-green-500 hover:bg-green-600" : "bg-primary hover:bg-primary/90"
                    )}
                >
                    {loading ? "SAVING..." : saved ? (
                        <div className="flex items-center gap-2">
                            <Check /> SAVED
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            UPDATE PROFILE <ChevronRight size={20} />
                        </div>
                    )}
                </Button>
            </div>

            {/* Stats Preview Card */}
            <div className="px-4">
                <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
                    <h3 className="text-[10px] uppercase tracking-[0.2em] font-black text-muted-foreground">Preview in Leaderboard</h3>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-white/5 overflow-hidden">
                                <img src={avatarUrl || AVATARS[0]} alt="Avatar" className="w-full h-full" />
                            </div>
                            <div>
                                <p className="font-bold text-sm">{displayName || "Runner"}</p>
                                <p className="text-[10px] text-muted-foreground font-mono">{address.slice(0, 6)}...{address.slice(-4)}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="font-black italic text-primary">#1</p>
                            <p className="text-[8px] font-bold text-muted-foreground uppercase">Rank</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
