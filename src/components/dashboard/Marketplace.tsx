'use client';

import React, { useState } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { STRIDE_SHOES_ADDRESS } from '@/config/sponsorship';
import StrideShoesABI from '@/lib/abis/StrideShoes.json';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingBag, Sparkles, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import {
    Transaction,
    TransactionButton,
    TransactionStatus,
    TransactionStatusLabel,
    TransactionStatusAction,
    TransactionToast,
    TransactionToastIcon,
    TransactionToastLabel,
    TransactionToastAction,
} from '@coinbase/onchainkit/transaction';
import { encodeFunctionData } from 'viem';
import { baseSepolia } from 'wagmi/chains';

const MARKET_ITEMS = [
    { rarity: 'Common', price: 'Free', enumValue: 0, description: 'Basic shoes for every runner.' },
    { rarity: 'Uncommon', price: '500 STRIDE', enumValue: 1, description: 'Increased efficiency and energy.' },
    { rarity: 'Rare', price: '1,500 STRIDE', enumValue: 2, description: 'High performance for athletes.' },
];

export default function Marketplace() {
    const { address } = useAccount();

    const syncShoe = async (rarityValue: number) => {
        try {
            // Note: In a real app, we'd fetch the TokenId from events
            // For now, we'll use a hack or wait for the user to refresh
            // But we'll try to sync with a placeholder or wait for indexing
            const res = await fetch('/api/shoes/sync', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    address,
                    tokenId: Date.now(), // Placeholder until we can reliably parse events
                    rarity: MARKET_ITEMS[rarityValue].rarity
                })
            });

            if (res.ok) {
                toast.success('Shoe purchased and added to inventory!');
                window.location.reload(); // Quick refresh to update state
            }
        } catch (error) {
            console.error('Sync error:', error);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <h2 className="text-2xl font-black italic text-slate-100 flex items-center gap-2">
                <ShoppingBag className="text-blue-500" />
                SHOE MARKET
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {MARKET_ITEMS.map((item, idx) => (
                    <Card key={item.rarity} className="bg-black/40 border-slate-800 backdrop-blur-xl group hover:border-blue-500/50 transition-all overflow-hidden">
                        <div className="h-2 bg-blue-500/20 group-hover:bg-blue-500/40" />
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <Badge variant="outline" className="border-blue-500/50 text-blue-400">
                                    {item.rarity}
                                </Badge>
                                <span className="text-sm font-bold text-slate-400">{item.price}</span>
                            </div>
                            <CardTitle className="text-xl mt-2">{item.rarity} Runner</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="aspect-square rounded-xl bg-slate-900 flex items-center justify-center text-5xl group-hover:scale-105 transition-transform duration-500">
                                👟
                            </div>
                            <p className="text-sm text-slate-400 min-h-[40px]">
                                {item.description}
                            </p>
                            <Transaction
                                chainId={baseSepolia.id}
                                calls={[
                                    {
                                        to: STRIDE_SHOES_ADDRESS,
                                        data: encodeFunctionData({
                                            abi: StrideShoesABI.abi,
                                            functionName: 'mint',
                                            args: [address, item.enumValue],
                                        }),
                                    },
                                ]}
                                onStatus={(status) => {
                                    if (status.statusName === 'success') {
                                        syncShoe(item.enumValue);
                                    }
                                }}
                                capabilities={{
                                    paymasterService: {
                                        url: process.env.NEXT_PUBLIC_CDP_PAYMASTER_URL!,
                                    },
                                }}
                            >
                                <TransactionButton
                                    className="w-full bg-blue-600 hover:bg-blue-500 font-bold py-4 rounded-xl"
                                    text={item.price === 'Free' ? "MINT FREE SHOE" : `BUY FOR ${item.price}`}
                                />
                                <TransactionStatus>
                                    <TransactionStatusLabel />
                                    <TransactionStatusAction />
                                </TransactionStatus>
                                <TransactionToast>
                                    <TransactionToastIcon />
                                    <TransactionToastLabel />
                                    <TransactionToastAction />
                                </TransactionToast>
                            </Transaction>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
