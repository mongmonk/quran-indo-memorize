
import React from "react";
import Layout from "@/components/Layout";
import ProgressTracker from "@/components/ProgressTracker";
import { BookOpen } from "lucide-react";

const Progress: React.FC = () => {
  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center justify-center">
            <BookOpen className="mr-2" />
            Kemajuan Hafalan
          </h1>
          <p className="text-muted-foreground">
            Pantau kemajuan hafalan Al-Quran Anda
          </p>
        </div>
        
        <ProgressTracker />
      </div>
    </Layout>
  );
};

export default Progress;
