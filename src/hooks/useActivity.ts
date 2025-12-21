import { supabase } from '@/lib/supabase';
import { useCallback } from 'react';

const STRIDE_PER_STEP = 0.001; // 1000 steps = 1 STRIDE

export const useActivity = () => {
    const initUser = useCallback(async (address: string) => {
        const { data, error } = await supabase
            .from('users')
            .upsert({ wallet_address: address }, { onConflict: 'wallet_address' })
            .select()
            .single();

        if (error) {
            console.error('Error initializing user:', error);
        }
        return { data, error };
    }, []);

    const saveSteps = useCallback(async (address: string, steps: number) => {
        if (!address || steps <= 0) return;

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

        if (dayError) {
            console.error('Error updating daily activity:', dayError);
        }

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

        if (sessionError) {
            console.error('Error logging session:', sessionError);
        }

        // 3. Update lifetime stats
        const { data: user } = await supabase
            .from('users')
            .select('total_lifetime_steps, total_earned_tokens')
            .eq('wallet_address', address)
            .single();

        const newLifetimeSteps = (user?.total_lifetime_steps || 0) + steps;
        const newLifetimeTokens = Number(((user?.total_earned_tokens || 0) + tokensEarned).toFixed(4));

        await supabase
            .from('users')
            .update({
                total_lifetime_steps: newLifetimeSteps,
                total_earned_tokens: newLifetimeTokens
            })
            .eq('wallet_address', address);

        return { success: !dayError && !sessionError, earned: tokensEarned };
    }, []);

    const getLeaderboard = useCallback(async () => {
        const { data, error } = await supabase
            .from('users')
            .select('wallet_address, total_lifetime_steps')
            .order('total_lifetime_steps', { ascending: false })
            .limit(10);

        if (error) {
            console.error('Error fetching leaderboard:', error);
        }
        return { data, error };
    }, []);

    const getUserStats = useCallback(async (address: string) => {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('wallet_address', address)
            .single();

        return { data, error };
    }, []);

    return {
        initUser,
        saveSteps,
        getLeaderboard,
        getUserStats
    };
};
