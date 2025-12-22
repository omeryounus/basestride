"use client";

import {
    ConnectWallet,
    Wallet,
    WalletDropdown,
    WalletDropdownDisconnect,
    WalletDropdownLink
} from '@coinbase/onchainkit/wallet';
import { Address, Avatar, Name, Identity, EthBalance } from '@coinbase/onchainkit/identity';

export function WalletWrapper() {
    return (
        <Wallet>
            <ConnectWallet className="bg-primary/20 text-foreground hover:bg-primary/30 border border-primary/40 rounded-full px-4 py-1.5 text-xs font-black transition-all">
                <Avatar className="h-6 w-6" />
                <Name className="font-black italic italic tracking-tight" />
            </ConnectWallet>
            <WalletDropdown>
                <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
                    <Avatar />
                    <Name className="font-black italic" />
                    <Address className="text-muted-foreground font-mono" />
                    <EthBalance />
                </Identity>
                <WalletDropdownLink
                    icon="wallet"
                    href="https://keys.coinbase.com"
                >
                    Wallet Management
                </WalletDropdownLink>
                <WalletDropdownDisconnect />
            </WalletDropdown>
        </Wallet>
    );
}
