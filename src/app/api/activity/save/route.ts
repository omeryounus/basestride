import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

const BASE_STRIDE_PER_STEP = 0.001; // Base: 1000 steps = 1 STRIDE
const STEPS_PER_ENERGY = 500; // 1 energy per 500 steps

const RARITY_MULTIPLIERS: Record<string, number> = {
    'Common': 1.0,
    'Uncommon': 1.5,
    'Rare': 3.0,
    'Epic': 6.0,
    'Legendary': 12.0
};

export async function POST(request: Request) {
    try {
        const { address, steps } = await request.json();

        if (!address || steps <= 0) {
            return NextResponse.json({ error: 'Invalid address or steps' }, { status: 400 });
        }

        // 0. Fetch user energy and active shoe
        const { data: userData, error: userFetchError } = await supabase
            .from('users')
            .select('energy, active_shoe_id, total_lifetime_steps, total_earned_tokens')
            .eq('wallet_address', address)
            .single();

        if (userFetchError && userFetchError.code !== 'PGRST116') throw userFetchError;

        let multiplier = 1.0;
        let hasEnergy = (userData?.energy || 0) > 0;
        let activeShoe = null;

        if (userData?.active_shoe_id) {
            const { data: shoeData } = await supabase
                .from('nft_shoes')
                .select('rarity, level, efficiency')
                .eq('id', userData.active_shoe_id)
                .single();

            if (shoeData) {
                activeShoe = shoeData;
                multiplier = RARITY_MULTIPLIERS[shoeData.rarity] || 1.0;
            }
        }

        // Logic side: Calculate rewards
        // If no energy, user earns 0.0001 (base penalty)
        const effectiveMultiplier = hasEnergy ? multiplier : 0.1;
        const tokensEarned = Number((steps * BASE_STRIDE_PER_STEP * effectiveMultiplier).toFixed(4));
        const energyConsumed = hasEnergy ? Math.ceil(steps / STEPS_PER_ENERGY) : 0;
        const newEnergy = Math.max(0, (userData?.energy || 0) - energyConsumed);

        const today = new Date().toISOString().split('T')[0];

        // 1. Update/Create Daily Activity
        const { data: existingDay } = await supabase
            .from('daily_activities')
            .select('steps, tokens_earned')
            .eq('wallet_address', address)
            .eq('date', today)
            .single();

        const newTotalSteps = (existingDay?.steps || 0) + steps;
        const newTotalTokens = Number(((existingDay?.tokens_earned || 0) + tokensEarned).toFixed(4));

        const { error: dayError } = await supabase
            .from('daily_activities')
            .upsert({
                wallet_address: address,
                date: today,
                steps: newTotalSteps,
                tokens_earned: newTotalTokens,
                last_updated: new Date().toISOString()
            }, { onConflict: 'wallet_address,date' });

        if (dayError) throw dayError;

        // 2. Log individual session
        const { error: sessionError } = await supabase
            .from('activity_sessions')
            .insert({
                wallet_address: address,
                steps: steps,
                tokens_earned: tokensEarned,
                start_time: new Date().toISOString(),
                end_time: new Date().toISOString()
            });

        if (sessionError) throw sessionError;

        // 3. Update lifetime stats and energy
        const newLifetimeSteps = (userData?.total_lifetime_steps || 0) + steps;
        const newLifetimeTokens = Number(((userData?.total_earned_tokens || 0) + tokensEarned).toFixed(4));

        const { error: userUpdateError } = await supabase
            .from('users')
            .update({
                total_lifetime_steps: newLifetimeSteps,
                total_earned_tokens: newLifetimeTokens,
                energy: newEnergy
            })
            .eq('wallet_address', address);

        if (userUpdateError) throw userUpdateError;

        return NextResponse.json({
            success: true,
            earned: tokensEarned,
            energyUsed: energyConsumed,
            remainingEnergy: newEnergy,
            multiplier: effectiveMultiplier,
            newLifetimeSteps
        });
    } catch (error: any) {
        console.error('API Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
