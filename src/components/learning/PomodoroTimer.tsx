"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Play, Pause, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const MODES = [
  { label: "Pomodoro", minutes: 25 },
  { label: "Short Break", minutes: 5 },
  { label: "Long Break", minutes: 15 },
  { label: "Deep Work", minutes: 90 },
  { label: "Custom", minutes: 0 },
];

export function PomodoroTimer() {
  const [activeMode, setActiveMode] = useState(0);
  const [timeLeft, setTimeLeft] = useState(MODES[0].minutes * 60);
  const [customMinutes, setCustomMinutes] = useState("45");
  const [studySubject, setStudySubject] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);

  const resetTimer = useCallback(() => {
    if (activeMode === 4) {
      setTimeLeft((parseInt(customMinutes) || 0) * 60);
    } else {
      setTimeLeft(MODES[activeMode].minutes * 60);
    }
    setIsActive(false);
  }, [activeMode, customMinutes]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      setIsActive(false);
      
      if (activeMode === 0 || activeMode === 3 || activeMode === 4) {
        // Work mode completed
        setSessionsCompleted(s => s + 1);
        toast.success("Session completed! +100 XP", {
          description: `Great focus ${studySubject ? `on ${studySubject}` : ""}. Take a break!`,
        });
      } else {
        // Break completed
        toast.info("Break is over! Ready to focus?");
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, activeMode, studySubject]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const setMode = (index: number) => {
    setActiveMode(index);
    if (index === 4) {
      setTimeLeft((parseInt(customMinutes) || 0) * 60);
    } else {
      setTimeLeft(MODES[index].minutes * 60);
    }
    setIsActive(false);
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCustomMinutes(val);
    if (activeMode === 4 && !isActive) {
      setTimeLeft((parseInt(val) || 0) * 60);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const totalTimeForMode = activeMode === 4 ? (parseInt(customMinutes) || 1) * 60 : MODES[activeMode].minutes * 60;
  const progress = totalTimeForMode === 0 ? 0 : ((totalTimeForMode - timeLeft) / totalTimeForMode) * 100;

  return (
    <Card className="bg-gray-900 border-gray-800 flex flex-col items-center">
      <CardHeader className="text-center w-full pb-2">
        <div className="flex flex-wrap justify-center gap-2">
          {MODES.map((mode, idx) => (
            <Button
              key={mode.label}
              variant="outline"
              size="sm"
              onClick={() => setMode(idx)}
              className={cn(
                "rounded-full border-gray-700",
                activeMode === idx 
                  ? "bg-indigo-600 text-white border-indigo-600 hover:bg-indigo-700 hover:text-white"
                  : "bg-transparent text-gray-400 hover:text-white"
              )}
            >
              {mode.label}
            </Button>
          ))}
        </div>
      </CardHeader>
      
      <CardContent className="flex flex-col items-center pt-4 pb-8 w-full max-w-sm">
        {activeMode === 4 && (
          <div className="flex items-center gap-2 mb-6 w-full justify-center">
            <span className="text-sm text-gray-400">Timer duration (min):</span>
            <Input 
              type="number" 
              value={customMinutes} 
              onChange={handleCustomChange}
              disabled={isActive}
              className="w-20 bg-gray-950 border-gray-800 text-center"
            />
          </div>
        )}

        <div className="w-full mb-8">
          <Input 
            placeholder="What are you studying right now?" 
            value={studySubject}
            onChange={(e) => setStudySubject(e.target.value)}
            className="w-full bg-gray-950 border-gray-800 text-center text-indigo-200 placeholder:text-gray-600"
          />
        </div>

        <div className="relative w-64 h-64 mb-8 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90 absolute top-0 left-0">
            <circle
              cx="128"
              cy="128"
              r="120"
              className="stroke-gray-800 fill-none"
              strokeWidth="8"
            />
            <circle
              cx="128"
              cy="128"
              r="120"
              className={cn(
                "fill-none transition-all duration-1000 ease-linear",
                activeMode === 0 || activeMode === 3 || activeMode === 4 ? "stroke-indigo-500" : "stroke-green-500"
              )}
              strokeWidth="8"
              strokeDasharray={2 * Math.PI * 120}
              strokeDashoffset={2 * Math.PI * 120 * (1 - progress / 100)}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute text-6xl font-black text-white tracking-tighter">
            {formatTime(timeLeft)}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button 
            size="lg"
            className="w-32 h-14 text-lg rounded-full shadow-lg shadow-indigo-500/20"
            onClick={toggleTimer}
            variant={isActive ? "secondary" : "default"}
          >
            {isActive ? (
              <><Pause className="w-5 h-5 mr-2" /> Pause</>
            ) : (
              <><Play className="w-5 h-5 mr-2" /> Start</>
            )}
          </Button>
          <Button
            size="icon"
            variant="outline"
            className="w-14 h-14 rounded-full border-gray-700 hover:bg-gray-800"
            onClick={resetTimer}
          >
            <RotateCcw className="w-5 h-5 text-gray-400" />
          </Button>
        </div>

        <div className="mt-8 flex gap-2">
          {[...Array(4)].map((_, i) => (
            <div 
              key={i} 
              className={cn(
                "w-3 h-3 rounded-full border border-gray-700 transition-colors",
                i < (sessionsCompleted % 4) ? "bg-indigo-500 border-indigo-500" : "bg-transparent"
              )}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
