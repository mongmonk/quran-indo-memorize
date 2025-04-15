
import React, { useState, useEffect, useRef } from "react";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { SurahDetail } from "@/types/quran";

interface AudioPlayerProps {
  surah: SurahDetail;
  currentAyah: number;
  onAyahChange: (ayahNumber: number) => void;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({
  surah,
  currentAyah,
  onAyahChange,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [audioError, setAudioError] = useState<string | null>(null);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Initialize audio when component mounts
  useEffect(() => {
    if (surah && surah.audioUrl) {
      if (audioRef.current) {
        audioRef.current.pause();
        setIsPlaying(false);
        
        audioRef.current.src = surah.audioUrl;
        audioRef.current.load();
      } else {
        audioRef.current = new Audio(surah.audioUrl);
      }
      
      const audio = audioRef.current;
      
      const setAudioData = () => {
        setDuration(audio.duration);
        setAudioError(null);
      };
      
      const setAudioTime = () => {
        setCurrentTime(audio.currentTime);
      };
      
      const handleAudioEnd = () => {
        setIsPlaying(false);
        setCurrentTime(0);
      };
      
      const handleAudioError = (e: any) => {
        console.error("Audio error:", e);
        setAudioError("Gagal memuat audio. Coba dengan browser atau internet yang berbeda.");
        setIsPlaying(false);
      };
      
      // Audio event listeners
      audio.addEventListener("loadeddata", setAudioData);
      audio.addEventListener("timeupdate", setAudioTime);
      audio.addEventListener("ended", handleAudioEnd);
      audio.addEventListener("error", handleAudioError);
      
      // Set initial volume
      audio.volume = volume;
      
      // Cleanup
      return () => {
        audio.removeEventListener("loadeddata", setAudioData);
        audio.removeEventListener("timeupdate", setAudioTime);
        audio.removeEventListener("ended", handleAudioEnd);
        audio.removeEventListener("error", handleAudioError);
      };
    }
  }, [surah]);
  
  // Update volume when it changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);
  
  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(err => {
          console.error("Error playing audio:", err);
          setAudioError("Gagal memutar audio. Browser mungkin memblokir autoplay.");
        });
      }
      setIsPlaying(!isPlaying);
    }
  };
  
  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };
  
  const handleSeek = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  };
  
  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
    if (newVolume === 0) {
      setIsMuted(true);
    } else if (isMuted) {
      setIsMuted(false);
    }
  };
  
  // Format time to MM:SS
  const formatTime = (time: number) => {
    if (isNaN(time)) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };
  
  return (
    <div className="bg-gradient-to-r from-green-50 to-emerald-100 shadow-lg rounded-lg p-4 fixed bottom-0 left-0 right-0 z-10 border-t">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <Button
            variant="default"
            size="icon"
            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 rounded-full"
            onClick={togglePlay}
            disabled={!!audioError}
          >
            {isPlaying ? (
              <Pause className="h-5 w-5" />
            ) : (
              <Play className="h-5 w-5 ml-0.5" />
            )}
          </Button>
        </div>
        
        <div className="flex-1 flex items-center space-x-2 max-w-3xl w-full">
          <span className="text-sm w-12 text-right">
            {formatTime(currentTime)}
          </span>
          
          <div className="flex-1">
            <Slider
              value={[currentTime]}
              max={duration || 100}
              step={0.1}
              onValueChange={handleSeek}
              className="accent-green-500"
              disabled={!!audioError}
            />
          </div>
          
          <span className="text-sm w-12">
            {formatTime(duration)}
          </span>
        </div>
        
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleMute}
            disabled={!!audioError}
          >
            {isMuted ? (
              <VolumeX className="h-5 w-5" />
            ) : (
              <Volume2 className="h-5 w-5" />
            )}
          </Button>
          
          <div className="w-20">
            <Slider
              value={[volume]}
              max={1}
              step={0.01}
              onValueChange={handleVolumeChange}
              className="accent-green-500"
              disabled={!!audioError}
            />
          </div>
          
          <div className="ml-2 text-sm text-muted-foreground whitespace-nowrap">
            Surah {surah.englishName}
          </div>
        </div>
      </div>
      
      {audioError && (
        <div className="text-sm text-red-500 text-center mt-2">
          {audioError}
        </div>
      )}
    </div>
  );
};

export default AudioPlayer;
