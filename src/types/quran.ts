export interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
}

export interface Ayah {
  number: number;
  text: string;
  numberInSurah: number;
  juz: number;
  page: number;
  translation?: string;
  audioUrl?: string;
}

export interface SurahDetail extends Surah {
  ayahs: Ayah[];
  audioUrl?: string;
}

export interface Edition {
  identifier: string;
  language: string;
  name: string;
  englishName: string;
  format: string;
  type: string;
}

export interface QuranResponse {
  code: number;
  status: string;
  data: {
    surahs?: Surah[];
    surah?: SurahDetail;
    edition?: Edition;
  };
}

export interface MemorizationProgress {
  surahId: number;
  ayahsMemorized: number[];
  lastRead: Date;
}
