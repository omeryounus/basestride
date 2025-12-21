"use client";

import { ReactNode } from 'react';
import { OnchainKitProvider } from '@coinbase/onchainkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { base, baseSepolia } from 'wagmi/chains';
import { http, createConfig, WagmiProvider } from 'wagmi';
import { coinbaseWallet } from 'wagmi/connectors';

const queryClient = new QueryClient();

const config = createConfig({
    chains: [base, baseSepolia], // Support Base Mainnet and Sepolia
    connectors: [
        coinbaseWallet({
            appName: 'BaseStride',
            preference: 'smartWalletOnly', // Force Smart Wallet for easier onboarding
        }),
    ],
    transports: {
        [base.id]: http(),
        [baseSepolia.id]: http(),
    },
    ssr: true,
});

export default function OnchainProviders({ children }: { children: ReactNode }) {
    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <OnchainKitProvider
                    apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
                    chain={base}
                    config={{
                        appearance: {
                            mode: 'auto',
                        },
                        paymaster: `${process.env.NEXT_PUBLIC_CDP_PAYMASTER_URL}`,
                    }}
                >
                    {children}
                </OnchainKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
}

