import { Surah, Ayah, Juz } from '@/types';

const BASE_URL = 'https://api.alquran.cloud/v1';

export const quranService = {
    /**
     * Fetch list of all 114 Surahs
     */
    async getAllSurahs(): Promise<Surah[]> {
        try {
            const response = await fetch(`${BASE_URL}/surah`);
            const json = await response.json();

            if (json.code === 200) {
                return json.data.map((s: any) => ({
                    id: s.number,
                    name: s.name,
                    arabicName: s.name,
                    englishName: s.englishName,
                    meaning: s.englishNameTranslation,
                    ayahCount: s.numberOfAyahs,
                    revelationType: s.revelationType.toLowerCase(),
                }));
            }
            throw new Error('Failed to fetch surahs');
        } catch (error) {
            console.error('Error fetching surahs:', error);
            return [];
        }
    },

    /**
     * Fetch a specific Surah with all its ayahs
     */
    async getSurah(id: number, translation: string = 'en.sahih'): Promise<{ surah: Surah, ayahs: Ayah[] } | null> {
        try {
            // Fetch Arabic text and translation in parallel
            const [arabicRes, transRes] = await Promise.all([
                fetch(`${BASE_URL}/surah/${id}`),
                fetch(`${BASE_URL}/surah/${id}/${translation}`)
            ]);

            const arabicJson = await arabicRes.json();
            const transJson = await transRes.json();

            if (arabicJson.code === 200 && transJson.code === 200) {
                const s = arabicJson.data;
                const surah: Surah = {
                    id: s.number,
                    name: s.name,
                    arabicName: s.name,
                    englishName: s.englishName,
                    meaning: s.englishNameTranslation,
                    ayahCount: s.numberOfAyahs,
                    revelationType: s.revelationType.toLowerCase(),
                    juzNumbers: Array.from(new Set<number>(s.ayahs.map((a: any) => a.juz))),
                    startPage: s.ayahs[0].page,
                    endPage: s.ayahs[s.ayahs.length - 1].page,
                };

                const ayahs: Ayah[] = s.ayahs.map((a: any, index: number) => ({
                    id: a.number,
                    surahId: s.number,
                    ayahNumber: a.numberInSurah,
                    text: a.text,
                    textArabic: a.text,
                    textEnglish: transJson.data.ayahs[index].text,
                    juzNumber: a.juz,
                    pageNumber: a.page,
                    rukuNumber: a.ruku,
                    manzilNumber: a.manzil,
                }));

                return { surah, ayahs };
            }
            return null;
        } catch (error) {
            console.error(`Error fetching surah ${id}:`, error);
            return null;
        }
    },

    /**
     * Fetch a specific Juz with all its ayahs
     */
    async getJuz(id: number, translation: string = 'en.sahih'): Promise<{ ayahs: Ayah[] } | null> {
        try {
            // Fetch Arabic text and translation in parallel
            const [arabicRes, transRes] = await Promise.all([
                fetch(`${BASE_URL}/juz/${id}`),
                fetch(`${BASE_URL}/juz/${id}/${translation}`)
            ]);

            const arabicJson = await arabicRes.json();
            const transJson = await transRes.json();

            if (arabicJson.code === 200 && transJson.code === 200) {
                const s = arabicJson.data;

                const ayahs: Ayah[] = s.ayahs.map((a: any, index: number) => ({
                    id: a.number,
                    surahId: a.surah.number,
                    surahName: a.surah.name,
                    surahEnglishName: a.surah.englishName,
                    ayahNumber: a.numberInSurah,
                    text: a.text,
                    textArabic: a.text,
                    textEnglish: transJson.data.ayahs[index].text,
                    juzNumber: a.juz,
                    pageNumber: a.page,
                    rukuNumber: a.ruku,
                    manzilNumber: a.manzil,
                }));

                return { ayahs };
            }
            return null;
        } catch (error) {
            console.error(`Error fetching juz ${id}:`, error);
            return null;
        }
    },

    /**
     * Fetch all Juz details
     */
    async getAllJuzs(): Promise<Juz[]> {
        // Since there is no "list all juz" in the API, we return a local list of 30 juz
        return Array.from({ length: 30 }, (_, i) => ({
            id: i + 1,
            startSurah: 0, // Will be populated when needed
            startAyah: 0,
            endSurah: 0,
            endAyah: 0
        }));
    },

    /**
     * Get translation for a specific ayah
     */
    async getAyahTranslation(surahId: number, ayahNumber: number, translation: string = 'en.sahih'): Promise<string | null> {
        try {
            const response = await fetch(`${BASE_URL}/ayah/${surahId}:${ayahNumber}/${translation}`);
            const json = await response.json();

            if (json.code === 200) {
                return json.data.text;
            }
            return null;
        } catch (error) {
            console.error(`Error fetching translation for ${surahId}:${ayahNumber}:`, error);
            return null;
        }
    },

    /**
     * Get audio URL for a specific ayah with selected reciter
     */
    getAudioUrl(surahId: number, ayahNumber: number, reciterId: string = 'mishary_rashid'): string {
        // Map reciter IDs to everyayah.com folder names
        const reciterPaths: Record<string, string> = {
            'abdul_basit': 'Abdul_Basit_Murattal_192kbps',
            'abdulrahman_sudais': 'Abdurrahmaan_As-Sudais_192kbps',
            'mishary_rashid': 'Alafasy_128kbps',
            'mohammed_siddiq': 'Minshawy_Murattal_128kbps',
            'maher_al_muaiqly': 'Maher_AlMuaiqly_128kbps',
            'saud_shuraim': 'Saood_ash-Shuraym_128kbps',
        };

        const reciterPath = reciterPaths[reciterId] || 'Alafasy_128kbps';

        // Format: https://everyayah.com/data/Alafasy_128kbps/001001.mp3
        const surahStr = surahId.toString().padStart(3, '0');
        const ayahStr = ayahNumber.toString().padStart(3, '0');

        return `https://everyayah.com/data/${reciterPath}/${surahStr}${ayahStr}.mp3`;
    }
};

export const useQuranService = () => quranService;
