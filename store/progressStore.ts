import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { zustandStorage } from './storage';

interface Progress {
    totalAyahsRead: number;
    totalReadingSeconds: number;
    dailyAyahsRead: number;
    dailyReadingSeconds: number;
    lastTrackedDate: string;
    completionPercentage: number;
    lastReadSurahId: number;
    lastReadAyahNumber: number;
}

interface ProgressState {
    progress: Progress;
    updateProgress: (data: Partial<Progress>) => void;
}

export const useProgressStore = create<ProgressState>()(
    persist(
        (set) => ({
            progress: {
                totalAyahsRead: 0,
                totalReadingSeconds: 0,
                dailyAyahsRead: 0,
                dailyReadingSeconds: 0,
                lastTrackedDate: new Date().toISOString().split('T')[0],
                completionPercentage: 0,
                lastReadSurahId: 1,
                lastReadAyahNumber: 1,
            },
            updateProgress: (data) => set((state) => {
                const today = new Date().toISOString().split('T')[0];
                const isNewDay = state.progress.lastTrackedDate !== today;

                const newDailyAyahs = isNewDay ? (data.dailyAyahsRead || 0) : (state.progress.dailyAyahsRead || 0) + (data.dailyAyahsRead || 0);
                const newDailySeconds = isNewDay ? (data.dailyReadingSeconds || 0) : (state.progress.dailyReadingSeconds || 0) + (data.dailyReadingSeconds || 0);

                return {
                    progress: {
                        ...state.progress,
                        ...data,
                        dailyAyahsRead: newDailyAyahs,
                        dailyReadingSeconds: newDailySeconds,
                        lastTrackedDate: today,
                    }
                };
            }),
        }),
        {
            name: 'progress-storage',
            storage: createJSONStorage(() => zustandStorage),
        }
    )
);
