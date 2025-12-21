import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { generateMerkleTree, getMerkleProof, RewardLeaf } from '@/lib/merkle';
import { type Address } from 'viem';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const address = searchParams.get('address') as Address;

        if (!address) {
            return NextResponse.json({ error: 'Address is required' }, { status: 400 });
        }

        // 1. Fetch all users who have earned tokens
        // For a real app, you'd filter by a specific epoch or state
        const { data: users, error } = await supabase
            .from('users')
            .select('wallet_address, total_earned_tokens')
            .gt('total_earned_tokens', 0);

        if (error) throw error;

        if (!users || users.length === 0) {
            return NextResponse.json({ error: 'No rewards available' }, { status: 404 });
        }

        // 2. Format leaves for the Merkle Tree
        const leaves: RewardLeaf[] = users.map(u => ({
            address: u.wallet_address as Address,
            amount: u.total_earned_tokens
        }));

        // 3. Generate the Merkle Tree
        const tree = generateMerkleTree(leaves);
        const root = tree.getHexRoot();

        // 4. Find the leaf for the requested user
        const userLeaf = leaves.find(l => l.address.toLowerCase() === address.toLowerCase());

        if (!userLeaf) {
            return NextResponse.json({ error: 'User has no rewards' }, { status: 404 });
        }

        // 5. Generate the proof
        const proof = getMerkleProof(tree, userLeaf);

        return NextResponse.json({
            address: userLeaf.address,
            amount: userLeaf.amount,
            proof,
            root,
            epoch: 1 // For now, we use a single epoch
        });
    } catch (error: any) {
        console.error('Proof API Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
