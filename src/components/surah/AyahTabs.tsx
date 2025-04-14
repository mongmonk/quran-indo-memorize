
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Ayah, SurahDetail } from "@/types/quran";
import VerseItem from "@/components/VerseItem";
import { BookOpen } from "lucide-react";

interface AyahTabsProps {
  surah: SurahDetail;
  memorizedAyahs: number[];
  onMemorizationChange: (ayahNumber: number, isMemorized: boolean) => void;
}

const AyahTabs: React.FC<AyahTabsProps> = ({ 
  surah, 
  memorizedAyahs, 
  onMemorizationChange 
}) => {
  return (
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
              onMemorizationChange={onMemorizationChange}
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
                onMemorizationChange={onMemorizationChange}
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
                onMemorizationChange={onMemorizationChange}
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
  );
};

export default AyahTabs;
