import pkg from "hardhat";
const { ethers } = pkg;
import { createClient } from '@supabase/supabase-js';
import { MerkleTree } from 'merkletreejs';
import keccak256 from 'keccak256';
import { encodePacked, keccak256 as viemKeccak } from 'viem';
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const REWARDS_CONTRACT_ADDRESS = '0x6c219eAd8e558eEc08837F13D9ae5D5F1396ebfa';

// Mirroring the hashLeaf logic from src/lib/merkle.ts
function hashLeaf(address: string, amount: number) {
    const amountInWei = BigInt(Math.floor(amount * 10 ** 18));
    return Buffer.from(
        viemKeccak(
            encodePacked(['address', 'uint256'], [address as `0x${string}`, amountInWei])
        ).slice(2),
        'hex'
    );
}

async function main() {
    console.log("Starting rewards settlement...");

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

    if (!supabaseUrl || !supabaseKey) {
        throw new Error("Supabase credentials missing in .env.local");
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // 1. Fetch users with rewards
    const { data: users, error } = await supabase
        .from('users')
        .select('wallet_address, total_earned_tokens')
        .gt('total_earned_tokens', 0);

    if (error) throw error;
    if (!users || users.length === 0) {
        console.log("No rewards to settle.");
        return;
    }

    console.log(`Found ${users.length} users with rewards.`);

    // 2. Generate Merkle Tree
    const hashedLeaves = users.map(u => hashLeaf(u.wallet_address, u.total_earned_tokens));
    const tree = new MerkleTree(hashedLeaves, keccak256, { sortPairs: true });
    const root = tree.getHexRoot();

    console.log(`Generated Merkle Root: ${root}`);

    // 3. Update Contract
    const [owner] = await ethers.getSigners();
    console.log(`Setting root as owner: ${owner.address}`);

    const StrideRewardsDistributor = await ethers.getContractFactory("StrideRewardsDistributor");
    const distributor = StrideRewardsDistributor.attach(REWARDS_CONTRACT_ADDRESS) as any;

    const tx = await distributor.setMerkleRoot(1, root);
    console.log(`Transaction sent: ${tx.hash}`);
    await tx.wait();

    console.log("Rewards successfully settled for Epoch 1!");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
