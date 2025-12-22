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

export const REWARDS_CONTRACT_ADDRESS = '0x6c219eAd8e558eEc08837F13D9ae5D5F1396ebfa' as Address;
export const STRIDE_SHOES_ADDRESS = '0xA4a89A8E1b554Eaff54669E5adE1353147a87002' as Address;

export const SPONSORSHIP_ALLOWLIST = {
    // Allowlist by contract address
    contracts: [
        REWARDS_CONTRACT_ADDRESS,
        STRIDE_SHOES_ADDRESS,
    ],

    // Specific function allowlist (optional but recommended)
    // Format: "contractAddress:functionName"
    functions: [
        `${REWARDS_CONTRACT_ADDRESS}:claimRewards`,
        `${STRIDE_SHOES_ADDRESS}:mint`,
        `${STRIDE_SHOES_ADDRESS}:upgrade`,
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
