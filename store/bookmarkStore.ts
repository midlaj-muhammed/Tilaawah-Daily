import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { zustandStorage } from './storage';

interface Bookmark {
    id: string;
    surahId: number;
    ayahNumber: number;
    note?: string;
    createdAt: string;
}

interface BookmarkState {
    bookmarks: Bookmark[];
    addBookmark: (bookmark: Omit<Bookmark, 'id' | 'createdAt'>) => void;
    removeBookmark: (id: string) => void;
}

export const useBookmarkStore = create<BookmarkState>()(
    persist(
        (set) => ({
            bookmarks: [],
            addBookmark: (data) => set((state) => ({
                bookmarks: [
                    ...state.bookmarks,
                    { ...data, id: Date.now().toString(), createdAt: new Date().toISOString() }
                ]
            })),
            removeBookmark: (id) => set((state) => ({
                bookmarks: state.bookmarks.filter((b) => b.id !== id)
            })),
        }),
        {
            name: 'bookmark-storage',
            storage: createJSONStorage(() => zustandStorage),
        }
    )
);
