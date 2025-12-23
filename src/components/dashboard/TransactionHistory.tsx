"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { History, ArrowUpRight, ArrowDownLeft, ShoppingBag, Coins } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

interface Transaction {
    id: string;
    type: 'REWARD' | 'CLAIM' | 'PURCHASE';
    amount: number;
    description: string;
    created_at: string;
}

export const TransactionHistory = ({ address }: { address: string }) => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTransactions = async () => {
            if (!address) return;
            const { data, error } = await supabase
                .from('transactions')
                .select('*')
                .eq('wallet_address', address)
                .order('created_at', { ascending: false });

            if (data) setTransactions(data);
            setLoading(false);
        };

        fetchTransactions();
    }, [address]);

    const getIcon = (type: string) => {
        switch (type) {
            case 'REWARD': return <ArrowDownLeft className="text-green-400" size={18} />;
            case 'CLAIM': return <Coins className="text-primary" size={18} />;
            case 'PURCHASE': return <ShoppingBag className="text-secondary" size={18} />;
            default: return <History size={18} />;
        }
    };

    if (loading) return (
        <div className="flex flex-col gap-3 w-full animate-pulse">
            {[1, 2, 3].map(i => (
                <div key={i} className="h-20 bg-white/5 rounded-2xl" />
            ))}
        </div>
    );

    return (
        <div className="w-full space-y-4">
            <div className="flex items-center gap-2 mb-2">
                <History size={20} className="text-primary" />
                <h2 className="text-xl font-black italic tracking-tight uppercase">Recent Activity</h2>
            </div>

            <div className="space-y-3">
                <AnimatePresence mode="popLayout">
                    {transactions.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-10 glass-panel rounded-3xl border-dashed border-white/10"
                        >
                            <p className="text-muted-foreground text-sm">No transactions yet. Start moving!</p>
                        </motion.div>
                    ) : (
                        transactions.map((tx, idx) => (
                            <motion.div
                                key={tx.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className="glass-panel p-4 rounded-2xl flex items-center justify-between group hover:bg-white/10 transition-colors border border-white/5"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                                        {getIcon(tx.type)}
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm text-foreground">{tx.description}</p>
                                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
                                            {formatDistanceToNow(new Date(tx.created_at), { addSuffix: true })}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className={cn(
                                        "font-black text-sm",
                                        tx.type === 'REWARD' ? "text-green-400" : "text-primary"
                                    )}>
                                        {tx.type === 'REWARD' ? "+" : "-"}{tx.amount.toFixed(2)}
                                    </p>
                                    <p className="text-[8px] font-bold text-muted-foreground tracking-tighter">STRIDE</p>
                                </div>
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};
