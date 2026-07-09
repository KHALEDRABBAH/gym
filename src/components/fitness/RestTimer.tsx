"use client";

import { useEffect, useState } from "react";
import { Play, Pause, X, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export function RestTimer() {
  const [timeLeft, setTimeLeft] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleStartTimer = (e: CustomEvent<{ seconds: number }>) => {
      setTimeLeft(e.detail.seconds);
      setIsActive(true);
      setIsVisible(true);
    };

    window.addEventListener("start-rest-timer", handleStartTimer as EventListener);
    return () => window.removeEventListener("start-rest-timer", handleStartTimer as EventListener);
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      // Play a sound when timer ends
      try {
        const audio = new Audio("https://actions.google.com/sounds/v1/alarms/beep_short.ogg");
        audio.play().catch(e => console.log("Audio play blocked", e));
      } catch (e) {}
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  if (!isVisible) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const isDanger = timeLeft > 0 && timeLeft <= 10;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
      <div className={`flex items-center gap-4 p-4 rounded-2xl border backdrop-blur-xl shadow-2xl transition-colors ${
        isDanger 
          ? "bg-red-500/90 border-red-400 text-white shadow-red-500/50" 
          : timeLeft === 0 && !isActive
            ? "bg-emerald-500/90 border-emerald-400 text-white shadow-emerald-500/50"
            : "bg-[#151923]/95 border-indigo-500/50 text-white shadow-indigo-500/20"
      }`}>
        <div className="text-3xl font-black font-mono tracking-tighter tabular-nums min-w-[70px] text-center">
          {minutes}:{seconds.toString().padStart(2, "0")}
        </div>
        
        <div className="flex items-center gap-2 border-l border-white/20 pl-4">
          <Button 
            onClick={() => setIsActive(!isActive)} 
            size="icon" 
            variant="ghost" 
            className="h-8 w-8 hover:bg-white/20 rounded-full"
          >
            {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </Button>
          <Button 
            onClick={() => setTimeLeft(60)} // Add 60s
            size="icon" 
            variant="ghost" 
            className="h-8 w-8 hover:bg-white/20 rounded-full"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
          <Button 
            onClick={() => setIsVisible(false)} 
            size="icon" 
            variant="ghost" 
            className="h-8 w-8 hover:bg-white/20 rounded-full text-red-200 hover:text-white hover:bg-red-500"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

// Helper to trigger timer from anywhere
export const startRestTimer = (seconds: number) => {
  if (typeof window !== "undefined") {
    const event = new CustomEvent("start-rest-timer", { detail: { seconds } });
    window.dispatchEvent(event);
  }
};
