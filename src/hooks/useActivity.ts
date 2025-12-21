import { supabase } from '@/lib/supabase';
import { useCallback } from 'react';

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

        try {
            const response = await fetch('/api/activity/save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ address, steps })
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Failed to save steps');

            return { success: true, earned: data.earned };
        } catch (error) {
            console.error('Error calling saveSteps API:', error);
            return { success: false, error };
        }
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
