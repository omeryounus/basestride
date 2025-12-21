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
            <ConnectWallet className="bg-primary/20 text-foreground hover:bg-primary/30 border border-primary/40 rounded-full px-4 py-1 text-xs font-bold transition-all">
                <Avatar className="h-6 w-6" />
                <Name />
            </ConnectWallet>
            <WalletDropdown>
                <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
                    <Avatar />
                    <Name />
                    <Address className="text-muted-foreground" />
                    <EthBalance />
                </Identity>
                <WalletDropdownLink icon="wallet" href="https://keys.coinbase.com">
                    Wallet
                </WalletDropdownLink>
                <WalletDropdownDisconnect />
            </WalletDropdown>
        </Wallet>
    );
}
