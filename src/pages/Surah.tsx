
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
import { useToast } from "@/hooks/use-toast";

const Surah: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [surah, setSurah] = useState<SurahDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [memorizedAyahs, setMemorizedAyahs] = useState<number[]>([]);
  const [currentAyah, setCurrentAyah] = useState(1);
  const surahRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    const surahId = parseInt(id || "1");
    
    const loadSurah = async () => {
      try {
        setLoading(true);
        setError(null);
        setErrorDetails(null);
        
        console.log(`Attempting to fetch surah ${surahId}...`);
        const data = await fetchSurahWithTranslation(surahId);
        
        if (!data || !data.ayahs || data.ayahs.length === 0) {
          throw new Error("Surah data is empty or invalid");
        }
        
        console.log(`Successfully loaded surah ${surahId} with ${data.ayahs.length} ayahs`);
        setSurah(data);
        
        // Load memorization progress
        const progress = getProgress(surahId);
        setMemorizedAyahs(progress);
      } catch (err) {
        console.error(`Error in loadSurah for surah ${surahId}:`, err);
        setError("Tidak dapat memuat surah");
        
        if (err instanceof Error) {
          setErrorDetails(err.message);
        } else {
          setErrorDetails("Terjadi kesalahan saat memuat data surah dari server.");
        }
        
        toast({
          title: "Error",
          description: "Gagal memuat surah. Silakan coba lagi nanti.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadSurah();
  }, [id, toast]);
  
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
  
  const handleRetry = () => {
    window.location.reload();
  };
  
  if (loading) {
    return (
      <Layout>
        <LoadingSpinner message="Memuat surah..." />
      </Layout>
    );
  }
  
  if (error || !surah) {
    return (
      <Layout>
        <ErrorMessage 
          message={error || "Tidak dapat memuat surah"} 
          details={errorDetails || undefined}
          onRetry={handleRetry} 
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
