
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, CheckCircle, Award } from 'lucide-react';
import { getOverallProgress } from '@/services/quranService';

const ProgressTracker: React.FC = () => {
  const { surahsStarted, totalAyahsMemorized } = getOverallProgress();
  const totalSurahs = 114;
  const totalAyahs = 6236;
  
  const surahProgress = (surahsStarted / totalSurahs) * 100;
  const ayahProgress = (totalAyahsMemorized / totalAyahs) * 100;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-muted-foreground flex items-center">
            <BookOpen className="mr-2 h-4 w-4" />
            Surah Dimulai
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-end">
            <p className="text-3xl font-bold">{surahsStarted}</p>
            <p className="text-muted-foreground text-sm">dari {totalSurahs}</p>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div
              className="bg-primary h-2 rounded-full"
              style={{ width: `${surahProgress}%` }}
            ></div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-muted-foreground flex items-center">
            <CheckCircle className="mr-2 h-4 w-4" />
            Ayat Dihafal
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-end">
            <p className="text-3xl font-bold">{totalAyahsMemorized}</p>
            <p className="text-muted-foreground text-sm">dari {totalAyahs}</p>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div
              className="bg-accent h-2 rounded-full"
              style={{ width: `${ayahProgress}%` }}
            ></div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-muted-foreground flex items-center">
            <Award className="mr-2 h-4 w-4" />
            Persentase Keseluruhan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-end">
            <p className="text-3xl font-bold">{ayahProgress.toFixed(2)}%</p>
            <p className="text-muted-foreground text-sm">selesai</p>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div
              className="bg-secondary h-2 rounded-full"
              style={{ width: `${ayahProgress}%` }}
            ></div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProgressTracker;
