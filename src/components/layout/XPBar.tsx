"use client";

import { getNextLevelProgress } from "@/lib/gamification";
import { Progress } from "@/components/ui/progress";
import { Flame } from "lucide-react";

interface XPBarProps {
  xp: number;
  streak: number;
}

export function XPBar({ xp, streak }: XPBarProps) {
  const { currentLevel, currentLevelXp, nextLevelXp, progressPercentage } = getNextLevelProgress(xp);
  
  // Custom titles for levels
  const getLevelTitle = (level: number) => {
    if (level < 5) return "Novice";
    if (level < 10) return "Apprentice";
    if (level < 20) return "Athlete";
    if (level < 30) return "Warrior";
    return "Titan";
  };
  const title = getLevelTitle(currentLevel);

  return (
    <div className="p-4 border-t border-white/5 space-y-3 bg-[#0d1017]">
      <div className="flex justify-between items-center text-sm">
        <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-fuchsia-400 drop-shadow-[0_0_8px_rgba(249,115,22,0.8)]">
          Level {currentLevel} • {title}
        </span>
        <span className="text-gray-400 font-bold text-xs">{currentLevelXp} / {nextLevelXp} XP</span>
      </div>
      <Progress value={progressPercentage} className="h-2.5 bg-black/50 border border-white/5 [&>div]:bg-gradient-to-r [&>div]:from-orange-500 [&>div]:to-fuchsia-500" />
      <div className="flex justify-between items-center text-xs font-bold text-gray-500">
        <span>Total: <span className="text-gray-300">{xp} XP</span></span>
        <div className="flex items-center gap-1 text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded-md border border-orange-500/20">
          <Flame className="w-3 h-3" />
          {streak} Days
        </div>
      </div>
    </div>
  );
}
