"use client";

import { ReactNode } from 'react';
import { OnchainKitProvider } from '@coinbase/onchainkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { baseSepolia } from 'wagmi/chains';
import { http, createConfig, WagmiProvider } from 'wagmi';
import { coinbaseWallet } from 'wagmi/connectors';

const queryClient = new QueryClient();

const config = createConfig({
    chains: [baseSepolia],
    connectors: [
        coinbaseWallet({
            appName: 'BaseStride',
            appLogoUrl: 'https://basestride.vercel.app/icon.png',
            preference: 'smartWalletOnly',
        }),
    ],
    transports: {
        [baseSepolia.id]: http(),
    },
    ssr: false, // Disable SSR for onchain config to prevent hydration/origin mismatches
});

// Initialize Farcaster SDK at the top level
import { sdk } from "@farcaster/frame-sdk";
import { useEffect } from "react";

function FarcasterLoader() {
    useEffect(() => {
        sdk.actions.ready();
    }, []);
    return null;
}

export default function OnchainProviders({ children }: { children: ReactNode }) {
    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <OnchainKitProvider
                    apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
                    chain={baseSepolia}
                    config={{
                        appearance: {
                            mode: 'auto',
                        },
                        paymaster: process.env.NEXT_PUBLIC_CDP_PAYMASTER_URL || '',
                    }}
                >
                    <FarcasterLoader />
                    {children}
                </OnchainKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
}
