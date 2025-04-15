
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Ayah } from "@/types/quran";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bookmark, Eye, EyeOff, Check, ExternalLink } from "lucide-react";
import { saveProgress } from "@/services/quranService";

interface VerseItemProps {
  ayah: Ayah;
  surahId: number;
  isMemorized: boolean;
  onMemorizationChange: (ayahNumber: number, isMemorized: boolean) => void;
}

const VerseItem: React.FC<VerseItemProps> = ({
  ayah,
  surahId,
  isMemorized,
  onMemorizationChange,
}) => {
  const [hideArabic, setHideArabic] = useState(false);
  const [hideTranslation, setHideTranslation] = useState(false);

  const toggleMemorization = () => {
    const newStatus = !isMemorized;
    saveProgress(surahId, ayah.numberInSurah, newStatus);
    onMemorizationChange(ayah.numberInSurah, newStatus);
  };

  return (
    <Card className={`mb-4 border ${isMemorized ? 'border-accent border-2' : ''}`}>
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center">
            <span className="bg-secondary text-secondary-foreground w-8 h-8 rounded-full flex items-center justify-center text-sm mr-2">
              {ayah.numberInSurah}
            </span>
            <Link to={`/ayah/${surahId}/${ayah.numberInSurah}`}>
              <Button
                variant="ghost"
                size="icon"
                title="Lihat halaman ayat"
              >
                <ExternalLink size={18} />
              </Button>
            </Link>
          </div>
          <div className="flex space-x-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setHideArabic(!hideArabic)}
              title={hideArabic ? "Tampilkan teks Arab" : "Sembunyikan teks Arab"}
            >
              {hideArabic ? <Eye size={18} /> : <EyeOff size={18} />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setHideTranslation(!hideTranslation)}
              title={hideTranslation ? "Tampilkan terjemahan" : "Sembunyikan terjemahan"}
            >
              {hideTranslation ? <Eye size={18} /> : <EyeOff size={18} />}
            </Button>
            <Button 
              variant={isMemorized ? "default" : "outline"}
              size="icon"
              onClick={toggleMemorization}
              className={isMemorized ? "bg-accent text-accent-foreground" : ""}
              title={isMemorized ? "Sudah dihafal" : "Tandai sudah dihafal"}
            >
              {isMemorized ? <Check size={18} /> : <Bookmark size={18} />}
            </Button>
          </div>
        </div>

        {!hideArabic && (
          <p className="text-2xl arabic-text mb-3 leading-loose text-right pr-4">
            {ayah.text}
          </p>
        )}

        {!hideTranslation && ayah.translation && (
          <p className="text-gray-700 leading-relaxed">
            {ayah.translation}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default VerseItem;
