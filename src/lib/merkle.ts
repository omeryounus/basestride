import { MerkleTree } from 'merkletreejs';
import keccak256 from 'keccak256';
import { type Address, encodePacked, keccak256 as viemKeccak } from 'viem';

/**
 * Merkle Tree Helper for STRIDE Rewards
 */

export interface RewardLeaf {
    address: Address;
    amount: number; // STRIDE tokens
}

/**
 * Hashes a reward leaf for the Merkle Tree
 */
export function hashLeaf(leaf: RewardLeaf) {
    // We use the same encoding as Solidity: keccak256(abi.encodePacked(address, amount))
    // Note: We convert amount to wei (18 decimals) before hashing
    const amountInWei = BigInt(Math.floor(leaf.amount * 10 ** 18));

    return Buffer.from(
        viemKeccak(
            encodePacked(['address', 'uint256'], [leaf.address, amountInWei])
        ).slice(2),
        'hex'
    );
}

/**
 * Generates a Merkle Tree from a list of reward leaves
 */
export function generateMerkleTree(leaves: RewardLeaf[]) {
    const hashedLeaves = leaves.map(hashLeaf);
    return new MerkleTree(hashedLeaves, keccak256, { sortPairs: true });
}

/**
 * Gets a proof for a specific user
 */
export function getMerkleProof(tree: MerkleTree, leaf: RewardLeaf) {
    const hashedLeaf = hashLeaf(leaf);
    return tree.getHexProof(hashedLeaf);
}
