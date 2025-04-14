
import { Surah, SurahDetail, Ayah } from "@/types/quran";

const DATA_URL = "https://raw.githubusercontent.com/bachors/Al-Quran-ID-API/refs/heads/master/offline/data.json";

// Fetch all surahs
export const fetchSurahs = async (): Promise<Surah[]> => {
  try {
    const response = await fetch(DATA_URL);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch surahs: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.map((surah: any) => ({
      number: parseInt(surah.nomor),
      name: surah.nama,
      englishName: surah.nama_latin,
      englishNameTranslation: surah.arti,
      numberOfAyahs: surah.ayat.length,
      revelationType: surah.type
    }));
  } catch (error) {
    console.error("Error fetching surahs:", error);
    throw error;
  }
};

// Fetch a specific surah with translation
export const fetchSurahWithTranslation = async (surahNumber: number): Promise<SurahDetail> => {
  try {
    const response = await fetch(DATA_URL);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch surah data: ${response.status} ${response.statusText}`);
    }
    
    const allData = await response.json();
    const surahData = allData.find((surah: any) => parseInt(surah.nomor) === surahNumber);
    
    if (!surahData) {
      throw new Error(`Surah with number ${surahNumber} not found`);
    }
    
    // Create a SurahDetail object from the data
    const surahDetail: SurahDetail = {
      number: parseInt(surahData.nomor),
      name: surahData.nama,
      englishName: surahData.nama_latin,
      englishNameTranslation: surahData.arti,
      numberOfAyahs: surahData.ayat.length,
      revelationType: surahData.type,
      ayahs: surahData.ayat.map((ayah: any, index: number) => ({
        number: index + 1,
        text: ayah.ar,
        numberInSurah: index + 1,
        juz: 0, // Not provided in the data
        page: 0, // Not provided in the data
        translation: ayah.id,
        audioUrl: `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${(surahNumber * 1000) + (index + 1)}.mp3`
      }))
    };
    
    return surahDetail;
  } catch (error) {
    console.error(`Error fetching surah ${surahNumber}:`, error);
    throw error;
  }
};

// Fetch a specific ayah
export const fetchAyah = async (surahNumber: number, ayahNumber: number): Promise<Ayah> => {
  try {
    const surah = await fetchSurahWithTranslation(surahNumber);
    const ayah = surah.ayahs.find(a => a.numberInSurah === ayahNumber);
    
    if (!ayah) {
      throw new Error(`Ayah ${ayahNumber} not found in Surah ${surahNumber}`);
    }
    
    return ayah;
  } catch (error) {
    console.error(`Error fetching ayah ${ayahNumber} from surah ${surahNumber}:`, error);
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
