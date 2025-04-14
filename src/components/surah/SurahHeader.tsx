
import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SurahDetail } from "@/types/quran";

interface SurahHeaderProps {
  surah: SurahDetail;
  memorizedAyahs: number[];
}

const SurahHeader: React.FC<SurahHeaderProps> = ({ surah, memorizedAyahs }) => {
  const progress = memorizedAyahs.length / surah.numberOfAyahs * 100;
  
  return (
    <>
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
    </>
  );
};

export default SurahHeader;
