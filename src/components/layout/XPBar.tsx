"use client";

import { getLevelFromXP, getXPForNextLevel, getLevelTitle, LEVEL_THRESHOLDS } from "@/lib/gamification";
import { Progress } from "@/components/ui/progress";
import { Flame } from "lucide-react";

interface XPBarProps {
  xp: number;
  streak: number;
}

export function XPBar({ xp, streak }: XPBarProps) {
  const currentLevel = getLevelFromXP(xp);
  const nextLevelXP = getXPForNextLevel(currentLevel);
  const currentLevelBaseXP = LEVEL_THRESHOLDS[currentLevel - 1];
  
  const xpIntoLevel = xp - currentLevelBaseXP;
  const xpNeededForLevel = nextLevelXP - currentLevelBaseXP;
  
  const progressPercent = Math.min((xpIntoLevel / xpNeededForLevel) * 100, 100);
  const title = getLevelTitle(currentLevel);

  return (
    <div className="p-4 border-t border-gray-800 space-y-3">
      <div className="flex justify-between items-center text-sm">
        <span className="font-bold text-orange-400">Level {currentLevel} • {title}</span>
        <span className="text-gray-400 font-medium">{xpIntoLevel} / {xpNeededForLevel} XP</span>
      </div>
      <Progress value={progressPercent} className="h-2 bg-gray-800 [&>div]:bg-gradient-to-r [&>div]:from-orange-500 [&>div]:to-yellow-500" />
      <div className="flex justify-between items-center text-xs text-gray-500">
        <span>Total XP: {xp}</span>
        <div className="flex items-center gap-1 text-orange-500">
          <Flame className="w-3 h-3" />
          {streak} Day Streak
        </div>
      </div>
    </div>
  );
}
