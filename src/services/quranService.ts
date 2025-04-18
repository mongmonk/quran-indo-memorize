
import { Surah, SurahDetail, Ayah } from "@/types/quran";

// Primary data source
const PRIMARY_DATA_URL = "https://raw.githubusercontent.com/bachors/Al-Quran-ID-API/refs/heads/master/offline/data.json";
// Fallback data URL (could be your own hosted copy)
const FALLBACK_DATA_URL = "https://hafalan.myquran.cloud/data.json";

// Fetch data with fallback mechanism
const fetchQuranData = async (): Promise<any[]> => {
  try {
    // Try primary source first
    const response = await fetch(PRIMARY_DATA_URL);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.status}`);
    }
    
    return await response.json();
  } catch (primaryError) {
    console.warn("Primary data source failed, trying fallback:", primaryError);
    
    try {
      // Try fallback source
      const fallbackResponse = await fetch(FALLBACK_DATA_URL);
      
      if (!fallbackResponse.ok) {
        throw new Error(`Fallback data fetch failed: ${fallbackResponse.status}`);
      }
      
      return await fallbackResponse.json();
    } catch (fallbackError) {
      console.error("All data sources failed:", fallbackError);
      
      // If both fail, throw a clearer error
      throw new Error("Tidak dapat mengakses data Al-Quran. Silakan periksa koneksi internet Anda atau coba lagi nanti.");
    }
  }
};

// Fetch all surahs
export const fetchSurahs = async (): Promise<Surah[]> => {
  try {
    const data = await fetchQuranData();
    
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
    const allData = await fetchQuranData();
    const surahData = allData.find((surah: any) => parseInt(surah.nomor) === surahNumber);
    
    if (!surahData) {
      throw new Error(`Surah dengan nomor ${surahNumber} tidak ditemukan`);
    }
    
    // Multiple audio sources for better reliability
    const audioSources = [
      `https://server8.mp3quran.net/ahmad_huth/${surahNumber.toString().padStart(3, '0')}.mp3`,
      `https://download.quranicaudio.com/quran/ahmad_huthayfi/${surahNumber.toString().padStart(3, '0')}.mp3`,
      `https://hafalan.myquran.cloud/audio/${surahNumber.toString().padStart(3, '0')}.mp3` // Your own hosted backup
    ];
    
    // Create a SurahDetail object from the data
    const surahDetail: SurahDetail = {
      number: parseInt(surahData.nomor),
      name: surahData.nama,
      englishName: surahData.nama_latin,
      englishNameTranslation: surahData.arti,
      numberOfAyahs: surahData.ayat.length,
      revelationType: surahData.type,
      audioUrl: audioSources[0], // Primary audio source
      audioSources: audioSources, // All audio sources for fallback
      ayahs: surahData.ayat.map((ayah: any, index: number) => ({
        number: index + 1,
        text: ayah.ar,
        numberInSurah: index + 1,
        juz: 0, // Not provided in the data
        page: 0, // Not provided in the data
        translation: ayah.id,
        audioUrl: '' // No individual audio URLs anymore
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
      throw new Error(`Ayat ${ayahNumber} tidak ditemukan dalam Surah ${surahNumber}`);
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
