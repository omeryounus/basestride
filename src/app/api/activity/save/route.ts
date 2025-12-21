import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

const STRIDE_PER_STEP = 0.001; // 1000 steps = 1 STRIDE

export async function POST(request: Request) {
    try {
        const { address, steps } = await request.json();

        if (!address || steps <= 0) {
            return NextResponse.json({ error: 'Invalid address or steps' }, { status: 400 });
        }

        // Logic side: Calculate rewards on backend
        const tokensEarned = Number((steps * STRIDE_PER_STEP).toFixed(4));
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

        // 3. Update lifetime stats
        const { data: user } = await supabase
            .from('users')
            .select('total_lifetime_steps, total_earned_tokens')
            .eq('wallet_address', address)
            .single();

        const newLifetimeSteps = (user?.total_lifetime_steps || 0) + steps;
        const newLifetimeTokens = Number(((user?.total_earned_tokens || 0) + tokensEarned).toFixed(4));

        const { error: userUpdateError } = await supabase
            .from('users')
            .update({
                total_lifetime_steps: newLifetimeSteps,
                total_earned_tokens: newLifetimeTokens
            })
            .eq('wallet_address', address);

        if (userUpdateError) throw userUpdateError;

        return NextResponse.json({
            success: true,
            earned: tokensEarned,
            newTotalSteps,
            newLifetimeSteps
        });
    } catch (error: any) {
        console.error('API Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
