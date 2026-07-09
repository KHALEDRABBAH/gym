"use client";

import { Trophy, Star, Target, Flame, Dumbbell, BookOpen, Clock, Zap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const ACHIEVEMENTS = [
  { id: 1, title: "First Steps", desc: "Complete your first workout.", icon: Target, unlocked: true, color: "text-blue-500", bg: "bg-blue-500/20" },
  { id: 2, title: "On Fire", desc: "Reach a 7-day streak.", icon: Flame, unlocked: true, color: "text-orange-500", bg: "bg-orange-500/20" },
  { id: 3, title: "Iron Master", desc: "Log 50 workouts.", icon: Dumbbell, unlocked: false, progress: 12, max: 50, color: "text-gray-500", bg: "bg-gray-800" },
  { id: 4, title: "Bookworm", desc: "Read 1,000 pages.", icon: BookOpen, unlocked: false, progress: 350, max: 1000, color: "text-gray-500", bg: "bg-gray-800" },
  { id: 5, title: "Early Bird", desc: "Complete 5 morning workouts.", icon: Zap, unlocked: true, color: "text-yellow-500", bg: "bg-yellow-500/20" },
  { id: 6, title: "Time Lord", desc: "Complete 100 Pomodoros.", icon: Clock, unlocked: false, progress: 24, max: 100, color: "text-gray-500", bg: "bg-gray-800" },
];

export default function AchievementsPage() {
  const unlockedCount = ACHIEVEMENTS.filter(a => a.unlocked).length;

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12 w-full text-white">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white flex items-center gap-3">
            <Trophy className="w-8 h-8 text-yellow-500" /> Achievements
          </h1>
          <p className="text-gray-400 mt-1">Unlock badges as you level up your life.</p>
        </div>
      </div>

      <Card className="bg-gradient-to-br from-yellow-500/20 to-orange-500/5 border-yellow-500/30">
        <CardContent className="p-8 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-yellow-500">Level 5 Achiever</h2>
            <p className="text-gray-400 mt-1">You've unlocked {unlockedCount} out of {ACHIEVEMENTS.length} badges.</p>
          </div>
          <div className="w-24 h-24 bg-yellow-500/20 rounded-full border-4 border-yellow-500 flex items-center justify-center shadow-[0_0_30px_rgba(234,179,8,0.3)]">
            <Star className="w-12 h-12 text-yellow-500" />
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ACHIEVEMENTS.map(badge => (
          <Card key={badge.id} className={`bg-[#151923] border transition-all ${badge.unlocked ? 'border-gray-700 hover:border-yellow-500/50 hover:-translate-y-1' : 'border-gray-800 opacity-60 grayscale'}`}>
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className={`w-20 h-20 rounded-full flex items-center justify-center border-4 ${badge.unlocked ? 'border-gray-800' : 'border-transparent'} ${badge.bg}`}>
                  <badge.icon className={`w-10 h-10 ${badge.color}`} />
                </div>
                <div>
                  <h3 className={`font-bold text-lg ${badge.unlocked ? 'text-white' : 'text-gray-500'}`}>{badge.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">{badge.desc}</p>
                </div>
                
                {!badge.unlocked && badge.progress !== undefined && (
                  <div className="w-full space-y-2 mt-4">
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>{badge.progress}</span>
                      <span>{badge.max}</span>
                    </div>
                    <Progress value={(badge.progress / badge.max) * 100} className="h-2 bg-gray-900" />
                  </div>
                )}
                
                {badge.unlocked && (
                  <div className="text-xs font-bold text-yellow-500 bg-yellow-500/10 px-3 py-1 rounded-full uppercase tracking-widest mt-4">
                    Unlocked
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}