
import React, { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "@/components/Layout";
import VerseItem from "@/components/VerseItem";
import AudioPlayer from "@/components/AudioPlayer";
import { SurahDetail } from "@/types/quran";
import { fetchSurahWithTranslation, getProgress } from "@/services/quranService";
import { ArrowLeft, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }
  
  if (error || !surah) {
    return (
      <Layout>
        <div className="text-center p-8 text-red-500">
          <p>{error || "Tidak dapat memuat surah."}</p>
          <Button
            onClick={() => window.location.reload()}
            className="mt-4"
          >
            Coba Lagi
          </Button>
        </div>
      </Layout>
    );
  }
  
  const progress = memorizedAyahs.length / surah.numberOfAyahs * 100;
  
  return (
    <Layout>
      <div className="max-w-3xl mx-auto pb-24" ref={surahRef}>
        <div className="mb-6">
          <Link to="/">
            <Button variant="ghost" className="pl-0">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali ke Daftar Surah
            </Button>
          </Link>
        </div>
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2 arabic-text">{surah.name}</h1>
          <p className="text-xl mb-2">{surah.englishName}</p>
          <p className="text-muted-foreground">{surah.englishNameTranslation}</p>
          <div className="mt-4 flex justify-center items-center space-x-2">
            <span>{surah.numberOfAyahs} Ayat</span>
            <span>•</span>
            <span>{surah.revelationType}</span>
          </div>
          
          {memorizedAyahs.length > 0 && (
            <div className="mt-4 max-w-xs mx-auto">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-accent h-2 rounded-full"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {memorizedAyahs.length}/{surah.numberOfAyahs} ayat dihafalkan ({progress.toFixed(1)}%)
              </p>
            </div>
          )}
        </div>
        
        <Tabs defaultValue="all" className="mb-6">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="all">Semua Ayat</TabsTrigger>
            <TabsTrigger value="memorized">Sudah Dihafal ({memorizedAyahs.length})</TabsTrigger>
            <TabsTrigger value="unmemorized">Belum Dihafal ({surah.numberOfAyahs - memorizedAyahs.length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            {surah.ayahs.map((ayah) => (
              <div key={ayah.numberInSurah} id={`ayah-${ayah.numberInSurah}`}>
                <VerseItem
                  ayah={ayah}
                  surahId={surah.number}
                  isMemorized={memorizedAyahs.includes(ayah.numberInSurah)}
                  onMemorizationChange={handleMemorizationChange}
                />
              </div>
            ))}
          </TabsContent>
          
          <TabsContent value="memorized">
            {surah.ayahs
              .filter((ayah) => memorizedAyahs.includes(ayah.numberInSurah))
              .map((ayah) => (
                <div key={ayah.numberInSurah} id={`ayah-${ayah.numberInSurah}`}>
                  <VerseItem
                    ayah={ayah}
                    surahId={surah.number}
                    isMemorized={true}
                    onMemorizationChange={handleMemorizationChange}
                  />
                </div>
              ))}
            
            {memorizedAyahs.length === 0 && (
              <div className="text-center py-12">
                <BookOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  Belum ada ayat yang dihafal dalam surah ini.
                </p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="unmemorized">
            {surah.ayahs
              .filter((ayah) => !memorizedAyahs.includes(ayah.numberInSurah))
              .map((ayah) => (
                <div key={ayah.numberInSurah} id={`ayah-${ayah.numberInSurah}`}>
                  <VerseItem
                    ayah={ayah}
                    surahId={surah.number}
                    isMemorized={false}
                    onMemorizationChange={handleMemorizationChange}
                  />
                </div>
              ))}
            
            {memorizedAyahs.length === surah.numberOfAyahs && (
              <div className="text-center py-12">
                <BookOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  Selamat! Semua ayat dalam surah ini telah dihafal.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
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
