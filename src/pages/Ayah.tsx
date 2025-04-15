
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { fetchAyah, fetchSurahWithTranslation } from "@/services/quranService";
import { Ayah as AyahType, SurahDetail } from "@/types/quran";
import LoadingSpinner from "@/components/ui/loading-spinner";
import ErrorMessage from "@/components/ui/error-message";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AyahPage: React.FC = () => {
  const { surahId, ayahId } = useParams<{ surahId: string; ayahId: string }>();
  const [ayah, setAyah] = useState<AyahType | null>(null);
  const [surah, setSurah] = useState<SurahDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const { toast } = useToast();
  
  const surahNumber = parseInt(surahId || "1");
  const ayahNumber = parseInt(ayahId || "1");
  
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        setErrorDetails(null);
        
        console.log(`Attempting to fetch ayah ${ayahNumber} from surah ${surahNumber}...`);
        
        // Fetch the surah first to get audio URL
        const surahData = await fetchSurahWithTranslation(surahNumber);
        setSurah(surahData);
        
        // Then get the specific ayah
        const ayahData = await fetchAyah(surahNumber, ayahNumber);
        
        if (!ayahData) {
          throw new Error("Ayah data is empty or invalid");
        }
        
        console.log(`Successfully loaded ayah ${ayahNumber} from surah ${surahNumber}`);
        setAyah(ayahData);
      } catch (err) {
        console.error(`Error in loadAyah for surah ${surahNumber}, ayah ${ayahNumber}:`, err);
        setError("Tidak dapat memuat ayat");
        
        if (err instanceof Error) {
          setErrorDetails(err.message);
        } else {
          setErrorDetails("Terjadi kesalahan saat memuat data ayat dari server.");
        }
        
        toast({
          title: "Error",
          description: "Gagal memuat ayat. Silakan coba lagi nanti.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [surahNumber, ayahNumber, toast]);
  
  const handlePreviousAyah = () => {
    if (ayahNumber > 1) {
      return `/ayah/${surahNumber}/${ayahNumber - 1}`;
    }
    return `/surah/${surahNumber}`;
  };
  
  const handleNextAyah = () => {
    if (surah && ayahNumber < surah.numberOfAyahs) {
      return `/ayah/${surahNumber}/${ayahNumber + 1}`;
    }
    return `/surah/${surahNumber}`;
  };
  
  const handleRetry = () => {
    window.location.reload();
  };
  
  if (loading) {
    return (
      <Layout>
        <LoadingSpinner message="Memuat ayat..." />
      </Layout>
    );
  }
  
  if (error || !ayah || !surah) {
    return (
      <Layout>
        <ErrorMessage 
          message={error || "Tidak dapat memuat ayat"} 
          details={errorDetails || undefined}
          onRetry={handleRetry} 
        />
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="max-w-3xl mx-auto py-8">
        <div className="mb-6">
          <Link to={`/surah/${surahNumber}`}>
            <Button variant="ghost" className="pl-0">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali ke Surah
            </Button>
          </Link>
        </div>
        
        <Card className="mb-8 bg-gradient-to-br from-green-50 to-emerald-50 border-emerald-100">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-emerald-800">
                Surah {surah.englishName} (Ayat {ayahNumber})
              </h2>
            </div>
            
            <p className="text-3xl arabic-text mb-6 leading-loose text-right">
              {ayah.text}
            </p>
            
            <p className="text-gray-700 leading-relaxed text-lg">
              {ayah.translation}
            </p>
          </CardContent>
        </Card>
        
        <div className="flex justify-between mt-8">
          <Link to={handlePreviousAyah()}>
            <Button variant="outline" className="border-emerald-200 hover:bg-emerald-50">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {ayahNumber > 1 ? "Ayat Sebelumnya" : "Kembali ke Surah"}
            </Button>
          </Link>
          
          <Link to={handleNextAyah()}>
            <Button variant="outline" className="border-emerald-200 hover:bg-emerald-50">
              Ayat Selanjutnya
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default AyahPage;
