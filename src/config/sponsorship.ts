import { Address } from 'viem';

/**
 * STRIDE Sponsorship Configuration
 * 
 * This file defines the smart contracts and functions that BaseStride 
 * is willing to sponsor for its users.
 * 
 * IMPORTANT: This list must match the allowlist configured in your 
 * Coinbase Developer Platform (CDP) project settings.
 */

export const REWARDS_CONTRACT_ADDRESS = '0x65bED2A902D6d76012D7826d2394151c81E54Abc' as Address;

export const SPONSORSHIP_ALLOWLIST = {
    // Allowlist by contract address
    contracts: [
        REWARDS_CONTRACT_ADDRESS,
    ],

    // Specific function allowlist (optional but recommended)
    // Format: "contractAddress:functionName"
    functions: [
        `${REWARDS_CONTRACT_ADDRESS}:claimRewards`,
    ],
};

/**
 * Helper to check if a specific call is eligible for sponsorship
 */
export function isSponsorshipEligible(to: Address, functionName?: string): boolean {
    const isContractAllowlisted = SPONSORSHIP_ALLOWLIST.contracts.includes(to);

    if (!functionName) {
        return isContractAllowlisted;
    }

    const isFunctionAllowlisted = SPONSORSHIP_ALLOWLIST.functions.includes(`${to}:${functionName}`);

    return isContractAllowlisted && isFunctionAllowlisted;
}
