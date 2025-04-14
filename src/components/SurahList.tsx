
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Surah } from "@/types/quran";
import { fetchSurahs } from "@/services/quranService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { BookOpen, Search } from "lucide-react";
import { getProgress } from "@/services/quranService";

const SurahList: React.FC = () => {
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [filteredSurahs, setFilteredSurahs] = useState<Surah[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const loadSurahs = async () => {
      try {
        setLoading(true);
        const data = await fetchSurahs();
        setSurahs(data);
        setFilteredSurahs(data);
        setLoading(false);
      } catch (err) {
        setError("Terjadi kesalahan saat memuat data surah.");
        setLoading(false);
        console.error(err);
      }
    };

    loadSurahs();
  }, []);

  useEffect(() => {
    if (surahs.length > 0 && searchQuery) {
      const filtered = surahs.filter(
        (surah) =>
          surah.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          surah.englishName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          surah.number.toString().includes(searchQuery)
      );
      setFilteredSurahs(filtered);
    } else {
      setFilteredSurahs(surahs);
    }
  }, [searchQuery, surahs]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8 text-red-500">
        <p>{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-primary text-white rounded-md"
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Cari surah..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSurahs.map((surah) => {
          const memorizedAyahs = getProgress(surah.number).length;
          const progress = (memorizedAyahs / surah.numberOfAyahs) * 100;
          
          return (
            <Link key={surah.number} to={`/surah/${surah.number}`}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg flex items-center">
                      <span className="bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center mr-2 text-sm">
                        {surah.number}
                      </span>
                      {surah.englishName}
                    </CardTitle>
                    <div className="text-right">
                      <p className="text-lg font-bold arabic-text">{surah.name}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {surah.englishNameTranslation} • {surah.numberOfAyahs} Ayat
                  </p>
                  {memorizedAyahs > 0 && (
                    <div className="mt-2">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-accent h-2 rounded-full"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {memorizedAyahs}/{surah.numberOfAyahs} ayat dihafalkan
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default SurahList;
