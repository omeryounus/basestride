import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
    try {
        const { address, tokenId, rarity } = await request.json();

        if (!address || !tokenId || !rarity) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // 1. Record the new shoe in our database
        const { data: newShoe, error: shoeError } = await supabase
            .from('nft_shoes')
            .insert({
                owner_address: address,
                token_id: tokenId,
                rarity: rarity,
                level: 1,
                efficiency: 100
            })
            .select()
            .single();

        if (shoeError) {
            // Handle duplicate token_id etc.
            if (shoeError.code === '23505') {
                return NextResponse.json({ success: true, message: 'Shoe already synced' });
            }
            throw shoeError;
        }

        // 2. If this is the user's first shoe, make it active
        const { data: userShoes } = await supabase
            .from('nft_shoes')
            .select('id')
            .eq('owner_address', address);

        if (userShoes && userShoes.length === 1) {
            await supabase
                .from('users')
                .update({ active_shoe_id: newShoe.id })
                .eq('wallet_address', address);
        }

        return NextResponse.json({
            success: true,
            shoe: newShoe
        });
    } catch (error: any) {
        console.error('Sync Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
