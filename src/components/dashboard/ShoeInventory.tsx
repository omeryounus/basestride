'use client';

import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Zap, ShoppingBag, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Shoe {
    id: string;
    token_id: number;
    rarity: string;
    level: number;
    efficiency: number;
}

const RARITY_COLORS: Record<string, string> = {
    Common: 'bg-slate-500',
    Uncommon: 'bg-green-500',
    Rare: 'bg-blue-500',
    Epic: 'bg-purple-500',
    Legendary: 'bg-orange-500'
};

export default function ShoeInventory() {
    const { address } = useAccount();
    const [shoes, setShoes] = useState<Shoe[]>([]);
    const [activeShoeId, setActiveShoeId] = useState<string | null>(null);
    const [energy, setEnergy] = useState<number>(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (address) {
            fetchInventory();
        }
    }, [address]);

    const fetchInventory = async () => {
        try {
            setLoading(true);

            // 1. Fetch user stats (energy & active shoe)
            const { data: user } = await supabase
                .from('users')
                .select('energy, active_shoe_id')
                .eq('wallet_address', address)
                .single();

            if (user) {
                setEnergy(user.energy);
                setActiveShoeId(user.active_shoe_id);
            }

            // 2. Fetch shoes
            const { data: userShoes } = await supabase
                .from('nft_shoes')
                .select('*')
                .eq('owner_address', address);

            if (userShoes) {
                setShoes(userShoes);
            }
        } catch (error) {
            console.error('Error fetching inventory:', error);
        } finally {
            setLoading(false);
        }
    };

    const equipShoe = async (shoeId: string) => {
        if (!address) return;

        try {
            const { error } = await supabase
                .from('users')
                .update({ active_shoe_id: shoeId })
                .eq('wallet_address', address);

            if (error) throw error;
            setActiveShoeId(shoeId);
        } catch (error) {
            console.error('Error equipping shoe:', error);
        }
    };

    if (!address) return null;

    return (
        <Card className="bg-black/40 border-slate-800 backdrop-blur-xl">
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                        Your Inventory
                    </CardTitle>
                    <p className="text-sm text-slate-400">Manage your active equipment</p>
                </div>
                <div className="flex items-center gap-2 bg-blue-500/10 px-3 py-1.5 rounded-full border border-blue-500/20">
                    <Zap className="w-4 h-4 text-blue-400 fill-blue-400" />
                    <span className="font-bold text-blue-100">{energy}/20</span>
                </div>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <AnimatePresence>
                        {shoes.length === 0 ? (
                            <div className="col-span-full py-8 text-center bg-slate-900/50 rounded-xl border border-dashed border-slate-700">
                                <ShoppingBag className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                                <p className="text-slate-400">No shoes found. Visit the Market to get started!</p>
                                <Button variant="link" className="text-blue-400 mt-2">Go to Marketplace</Button>
                            </div>
                        ) : (
                            shoes.map((shoe) => (
                                <motion.div
                                    key={shoe.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className={`relative p-4 rounded-xl border transition-all ${activeShoeId === shoe.id
                                            ? 'bg-blue-500/10 border-blue-500/50 ring-1 ring-blue-500/30'
                                            : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                                        }`}
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <Badge className={`${RARITY_COLORS[shoe.rarity]} text-white border-none`}>
                                            {shoe.rarity}
                                        </Badge>
                                        {activeShoeId === shoe.id && (
                                            <Badge variant="secondary" className="bg-blue-500 text-white border-none gap-1">
                                                <CheckCircle2 className="w-3 h-3" /> EQUIPPED
                                            </Badge>
                                        )}
                                    </div>

                                    <div className="aspect-square bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg mb-4 flex items-center justify-center relative group overflow-hidden">
                                        {/* Placeholder for NFT Image */}
                                        <div className="text-4xl">👟</div>
                                        <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex justify-between text-xs text-slate-400">
                                            <span>Level {shoe.level}</span>
                                            <span>Efficiency: {shoe.efficiency}</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-blue-500"
                                                style={{ width: `${Math.min(100, (shoe.level / 30) * 100)}%` }}
                                            />
                                        </div>
                                    </div>

                                    {activeShoeId !== shoe.id && (
                                        <Button
                                            onClick={() => equipShoe(shoe.id)}
                                            className="w-full mt-4 bg-slate-800 hover:bg-slate-700 text-slate-200"
                                            size="sm"
                                        >
                                            Equip
                                        </Button>
                                    )}
                                </motion.div>
                            ))
                        )}
                    </AnimatePresence>
                </div>
            </CardContent>
        </Card>
    );
}
