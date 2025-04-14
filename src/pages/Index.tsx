
import React from "react";
import Layout from "@/components/Layout";
import SurahList from "@/components/SurahList";
import ProgressTracker from "@/components/ProgressTracker";
import { BookOpen } from "lucide-react";

const Index: React.FC = () => {
  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center justify-center">
            <BookOpen className="mr-2" />
            Quran Hafiz
          </h1>
          <p className="text-muted-foreground">
            Aplikasi Penghafal Al-Quran dengan Terjemahan Bahasa Indonesia
          </p>
        </div>
        
        <ProgressTracker />
        
        <h2 className="text-2xl font-semibold mb-4">Daftar Surah</h2>
        <SurahList />
      </div>
    </Layout>
  );
};

export default Index;
