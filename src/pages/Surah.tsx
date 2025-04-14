
import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import Layout from "@/components/Layout";
import AudioPlayer from "@/components/AudioPlayer";
import { SurahDetail } from "@/types/quran";
import { fetchSurahWithTranslation, getProgress } from "@/services/quranService";
import LoadingSpinner from "@/components/ui/loading-spinner";
import ErrorMessage from "@/components/ui/error-message";
import SurahHeader from "@/components/surah/SurahHeader";
import AyahTabs from "@/components/surah/AyahTabs";

const Surah: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [surah, setSurah] = useState<SurahDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [memorizedAyahs, setMemorizedAyahs] = useState<number[]>([]);
  const [currentAyah, setCurrentAyah] = useState(1);
  const surahRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const surahId = parseInt(id || "1");
    
    const loadSurah = async () => {
      try {
        setLoading(true);
        const data = await fetchSurahWithTranslation(surahId);
        setSurah(data);
        setLoading(false);
        
        // Load memorization progress
        const progress = getProgress(surahId);
        setMemorizedAyahs(progress);
      } catch (err) {
        setError("Terjadi kesalahan saat memuat surah.");
        setLoading(false);
        console.error(err);
      }
    };
    
    loadSurah();
  }, [id]);
  
  const handleMemorizationChange = (ayahNumber: number, isMemorized: boolean) => {
    if (isMemorized) {
      setMemorizedAyahs(prev => [...prev, ayahNumber]);
    } else {
      setMemorizedAyahs(prev => prev.filter(num => num !== ayahNumber));
    }
  };
  
  const scrollToAyah = (ayahNumber: number) => {
    const ayahElement = document.getElementById(`ayah-${ayahNumber}`);
    if (ayahElement) {
      ayahElement.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };
  
  const handleAyahChange = (ayahNumber: number) => {
    setCurrentAyah(ayahNumber);
    scrollToAyah(ayahNumber);
  };
  
  if (loading) {
    return (
      <Layout>
        <LoadingSpinner />
      </Layout>
    );
  }
  
  if (error || !surah) {
    return (
      <Layout>
        <ErrorMessage 
          message={error || "Tidak dapat memuat surah."} 
          onRetry={() => window.location.reload()} 
        />
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="max-w-3xl mx-auto pb-24" ref={surahRef}>
        <SurahHeader surah={surah} memorizedAyahs={memorizedAyahs} />
        <AyahTabs 
          surah={surah} 
          memorizedAyahs={memorizedAyahs} 
          onMemorizationChange={handleMemorizationChange} 
        />
      </div>
      
      {surah && (
        <AudioPlayer
          surah={surah}
          currentAyah={currentAyah}
          onAyahChange={handleAyahChange}
        />
      )}
    </Layout>
  );
};

export default Surah;
