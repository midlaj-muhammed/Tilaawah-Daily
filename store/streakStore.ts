import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { zustandStorage } from './storage';

interface StreakData {
    currentStreak: number;
    longestStreak: number;
    lastReadDate: string | null;
    history: string[];
}

interface StreakState {
    streakData: StreakData;
    updateStreak: () => void;
    resetStreak: () => void;
}

export const useStreakStore = create<StreakState>()(
    persist(
        (set, get) => ({
            streakData: {
                currentStreak: 0,
                longestStreak: 0,
                lastReadDate: null,
                history: [],
            },
            updateStreak: () => {
                const today = new Date().toISOString().split('T')[0];
                const { streakData } = get();

                if (streakData.lastReadDate === today) return;

                let newStreak = streakData.currentStreak + 1;
                if (streakData.lastReadDate) {
                    const last = new Date(streakData.lastReadDate);
                    const diff = (new Date(today).getTime() - last.getTime()) / (1000 * 60 * 60 * 24);
                    if (diff > 1) newStreak = 1;
                }

                set({
                    streakData: {
                        ...streakData,
                        currentStreak: newStreak,
                        longestStreak: Math.max(newStreak, streakData.longestStreak),
                        lastReadDate: today,
                        history: [...new Set([...streakData.history, today])],
                    }
                });
            },
            resetStreak: () => set({ streakData: { currentStreak: 0, longestStreak: 0, lastReadDate: null, history: [] } }),
        }),
        {
            name: 'streak-storage',
            storage: createJSONStorage(() => zustandStorage),
        }
    )
);
