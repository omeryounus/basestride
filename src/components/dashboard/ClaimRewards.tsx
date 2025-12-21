"use client";

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
import { type Address, encodeFunctionData } from 'viem';
import { baseSepolia } from 'wagmi/chains';
import { REWARDS_CONTRACT_ADDRESS, isSponsorshipEligible } from '@/config/sponsorship';

// Mock ABI for a claim function - you'll replace this with your real contract ABI
const MOCK_CLAIM_ABI = [
    {
        name: 'claim',
        type: 'function',
        stateMutability: 'nonpayable',
        inputs: [{ name: 'amount', type: 'uint256' }],
        outputs: [],
    },
] as const;

interface ClaimRewardsProps {
    amount: number;
    address: Address;
    onSuccess?: () => void;
}

export function ClaimRewards({ amount, address, onSuccess }: ClaimRewardsProps) {
    // Safety Check: Verify if this contract and function are in our allowlist
    const isEligible = isSponsorshipEligible(REWARDS_CONTRACT_ADDRESS, 'claim');

    if (!isEligible) {
        console.warn('Attempted to sponsor a non-allowlisted contract or function.');
        return null;
    }
    // Convert STRIDE amount to wei (18 decimals)
    const amountInWei = BigInt(Math.floor(amount * 10 ** 18));

    const calls = [
        {
            to: REWARDS_CONTRACT_ADDRESS,
            data: encodeFunctionData({
                abi: MOCK_CLAIM_ABI,
                functionName: 'claim',
                args: [amountInWei],
            }),
        },
    ];

    const handleOnStatus = (status: any) => {
        console.log('Transaction Status:', status);
        if (status.statusName === 'success') {
            onSuccess?.();
        }
    };

    if (amount <= 0) return null;

    return (
        <div className="flex flex-col items-center w-full max-w-xs mt-6">
            <Transaction
                chainId={baseSepolia.id}
                calls={calls}
                onStatus={handleOnStatus}
            >
                <TransactionButton
                    className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground font-black py-4 rounded-xl shadow-[0_0_20px_rgba(212,255,0,0.3)] transition-all hover:scale-[1.02]"
                    text={`CLAIM ${amount.toFixed(2)} STRIDE (GAS-FREE)`}
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

            <p className="mt-2 text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
                Sponsored by BaseStride
            </p>
        </div>
    );
}
