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
import { useState, useEffect } from 'react';
import { REWARDS_CONTRACT_ADDRESS, isSponsorshipEligible } from '@/config/sponsorship';
import { Button } from '@/components/ui/button';

// ABI for the StrideRewardsDistributor claim function
const CLAIM_ABI = [
    {
        name: 'claimRewards',
        type: 'function',
        stateMutability: 'nonpayable',
        inputs: [
            { name: 'epoch', type: 'uint256' },
            { name: 'amount', type: 'uint256' },
            { name: 'proof', type: 'bytes32[]' }
        ],
        outputs: [],
    },
] as const;

interface ClaimRewardsProps {
    amount: number;
    address: Address;
    onSuccess?: () => void;
}

export function ClaimRewards({ amount: propsAmount, address, onSuccess }: ClaimRewardsProps) {
    const [proof, setProof] = useState<string[]>([]);
    const [claimAmount, setClaimAmount] = useState<number>(0);
    const [epoch, setEpoch] = useState<number>(1);
    const [isLoadingProof, setIsLoadingProof] = useState(false);

    // Safety Check: Verify if this contract and function are in our allowlist
    const isEligible = isSponsorshipEligible(REWARDS_CONTRACT_ADDRESS, 'claimRewards');

    useEffect(() => {
        const fetchProof = async () => {
            if (!address) return;
            setIsLoadingProof(true);
            try {
                const res = await fetch(`/api/rewards/proof?address=${address}`);
                const data = await res.json();
                if (res.ok) {
                    setProof(data.proof);
                    setClaimAmount(data.amount);
                    setEpoch(data.epoch || 1);
                }
            } catch (err) {
                console.error('Failed to fetch proof:', err);
            } finally {
                setIsLoadingProof(false);
            }
        };

        fetchProof();
    }, [address]);

    if (!isEligible) {
        console.warn('Attempted to sponsor a non-allowlisted contract or function.');
        return null;
    }

    // Use the amount from the proof API to ensure consistency with the Merkle root
    const amountToClaim = claimAmount || propsAmount;
    const amountInWei = BigInt(Math.floor(amountToClaim * 10 ** 18));

    const calls = [
        {
            to: REWARDS_CONTRACT_ADDRESS,
            data: encodeFunctionData({
                abi: CLAIM_ABI,
                functionName: 'claimRewards',
                args: [BigInt(epoch), amountInWei, proof as any],
            }),
        },
    ];

    const handleOnStatus = (status: any) => {
        console.log('Transaction Status:', status);
        if (status.statusName === 'success') {
            onSuccess?.();
        }
    };

    const [isReadyToClaim, setIsReadyToClaim] = useState(false);

    if (amountToClaim <= 0 || (isLoadingProof && proof.length === 0)) {
        return null;
    }

    return (
        <div className="flex flex-col items-center w-full max-w-xs mt-6">
            {!isReadyToClaim ? (
                <Button
                    onClick={() => setIsReadyToClaim(true)}
                    disabled={isLoadingProof || proof.length === 0}
                    className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground font-black py-4 rounded-xl shadow-[0_0_20px_rgba(212,255,0,0.3)] transition-all"
                >
                    {isLoadingProof ? "FETCHING PROOF..." : `CLAIM ${amountToClaim.toFixed(2)} STRIDE`}
                </Button>
            ) : (
                <Transaction
                    chainId={baseSepolia.id}
                    calls={calls}
                    onStatus={handleOnStatus}
                    capabilities={{
                        paymasterService: {
                            url: process.env.NEXT_PUBLIC_CDP_PAYMASTER_URL!,
                        },
                    }}
                >
                    <TransactionButton
                        className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground font-black py-4 rounded-xl"
                        text="CONFIRM CLAIM (GAS-FREE)"
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
            )}

            <p className="mt-2 text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
                Sponsored by BaseStride
            </p>
        </div>
    );
}
