
import { QuranResponse, Surah, SurahDetail } from "@/types/quran";

const BASE_URL = "https://api.alquran.cloud/v1";
const INDONESIAN_EDITION = "id.indonesian";
const ARABIC_EDITION = "quran-uthmani";

// Fetch all surahs
export const fetchSurahs = async (): Promise<Surah[]> => {
  try {
    const response = await fetch(`${BASE_URL}/meta`);
    const data = await response.json();
    return data.data.surahs.references;
  } catch (error) {
    console.error("Error fetching surahs:", error);
    throw error;
  }
};

// Fetch a specific surah with Indonesian translation
export const fetchSurahWithTranslation = async (surahNumber: number): Promise<SurahDetail> => {
  try {
    // Fetch Arabic text
    const arabicResponse = await fetch(`${BASE_URL}/surah/${surahNumber}/${ARABIC_EDITION}`);
    const arabicData: QuranResponse = await arabicResponse.json();
    
    // Fetch Indonesian translation
    const translationResponse = await fetch(`${BASE_URL}/surah/${surahNumber}/${INDONESIAN_EDITION}`);
    const translationData: QuranResponse = await translationResponse.json();
    
    // Combine Arabic and translation
    const surahDetail = arabicData.data.surah as SurahDetail;
    
    // Add translations to each ayah
    if (surahDetail && translationData.data.surah) {
      surahDetail.ayahs = surahDetail.ayahs.map((ayah, index) => {
        return {
          ...ayah,
          translation: translationData.data.surah?.ayahs[index].text,
          audioUrl: `https://verses.quran.com/${surahNumber}/${ayah.numberInSurah}`
        };
      });
    }
    
    return surahDetail;
  } catch (error) {
    console.error(`Error fetching surah ${surahNumber}:`, error);
    throw error;
  }
};

// Get local storage key for progress
const getProgressKey = () => "quran_memorization_progress";

// Save memorization progress
export const saveProgress = (surahId: number, ayahNumber: number, isMemorized: boolean) => {
  try {
    const progressKey = getProgressKey();
    const savedProgress = localStorage.getItem(progressKey);
    const progress: Record<number, number[]> = savedProgress ? JSON.parse(savedProgress) : {};
    
    if (!progress[surahId]) {
      progress[surahId] = [];
    }
    
    if (isMemorized) {
      if (!progress[surahId].includes(ayahNumber)) {
        progress[surahId].push(ayahNumber);
      }
    } else {
      progress[surahId] = progress[surahId].filter(num => num !== ayahNumber);
    }
    
    localStorage.setItem(progressKey, JSON.stringify(progress));
    return progress[surahId];
  } catch (error) {
    console.error("Error saving progress:", error);
    return [];
  }
};

// Get memorization progress for a surah
export const getProgress = (surahId: number): number[] => {
  try {
    const progressKey = getProgressKey();
    const savedProgress = localStorage.getItem(progressKey);
    
    if (!savedProgress) return [];
    
    const progress: Record<number, number[]> = JSON.parse(savedProgress);
    return progress[surahId] || [];
  } catch (error) {
    console.error("Error getting progress:", error);
    return [];
  }
};

// Get overall progress stats
export const getOverallProgress = () => {
  try {
    const progressKey = getProgressKey();
    const savedProgress = localStorage.getItem(progressKey);
    
    if (!savedProgress) return { surahsStarted: 0, totalAyahsMemorized: 0 };
    
    const progress: Record<number, number[]> = JSON.parse(savedProgress);
    const surahKeys = Object.keys(progress);
    const surahsStarted = surahKeys.length;
    
    let totalAyahsMemorized = 0;
    surahKeys.forEach(key => {
      totalAyahsMemorized += progress[Number(key)].length;
    });
    
    return { surahsStarted, totalAyahsMemorized };
  } catch (error) {
    console.error("Error getting overall progress:", error);
    return { surahsStarted: 0, totalAyahsMemorized: 0 };
  }
};
