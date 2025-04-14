
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { fetchAyah } from "@/services/quranService";
import { Ayah as AyahType } from "@/types/quran";
import LoadingSpinner from "@/components/ui/loading-spinner";
import ErrorMessage from "@/components/ui/error-message";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Play, Pause } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AyahPage: React.FC = () => {
  const { surahId, ayahId } = useParams<{ surahId: string; ayahId: string }>();
  const [ayah, setAyah] = useState<AyahType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio] = useState(new Audio());
  const { toast } = useToast();
  
  const surahNumber = parseInt(surahId || "1");
  const ayahNumber = parseInt(ayahId || "1");
  
  useEffect(() => {
    const loadAyah = async () => {
      try {
        setLoading(true);
        setError(null);
        setErrorDetails(null);
        
        console.log(`Attempting to fetch ayah ${ayahNumber} from surah ${surahNumber}...`);
        const data = await fetchAyah(surahNumber, ayahNumber);
        
        if (!data) {
          throw new Error("Ayah data is empty or invalid");
        }
        
        console.log(`Successfully loaded ayah ${ayahNumber} from surah ${surahNumber}`);
        setAyah(data);
        
        // Load audio
        if (data.audioUrl) {
          audio.src = data.audioUrl;
          audio.load();
        }
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
    
    loadAyah();
    
    // Clean up audio when component unmounts
    return () => {
      audio.pause();
      audio.src = "";
    };
  }, [surahNumber, ayahNumber, audio, toast]);
  
  const handlePlayAudio = () => {
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().catch(err => {
        console.error("Error playing audio:", err);
        toast({
          title: "Error",
          description: "Gagal memutar audio. Silakan coba lagi nanti.",
          variant: "destructive",
        });
      });
      audio.onended = () => setIsPlaying(false);
      setIsPlaying(true);
    }
  };
  
  const handlePreviousAyah = () => {
    if (ayahNumber > 1) {
      return `/ayah/${surahNumber}/${ayahNumber - 1}`;
    }
    return `/surah/${surahNumber}`;
  };
  
  const handleNextAyah = () => {
    return `/ayah/${surahNumber}/${ayahNumber + 1}`;
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
  
  if (error || !ayah) {
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
        
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">
                Surah {surahNumber}, Ayat {ayahNumber}
              </h2>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={handlePlayAudio}
                title={isPlaying ? "Hentikan" : "Putar"}
              >
                {isPlaying ? <Pause size={18} /> : <Play size={18} />}
              </Button>
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
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {ayahNumber > 1 ? "Ayat Sebelumnya" : "Kembali ke Surah"}
            </Button>
          </Link>
          
          <Link to={handleNextAyah()}>
            <Button variant="outline">
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
