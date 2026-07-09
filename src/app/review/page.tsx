"use client";

import { CalendarCheck, Sun, CalendarDays, Loader2, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useLocalStorage } from "@/lib/hooks/useLocalStorage";
import { useState, useEffect } from "react";
import { useDate } from "@/lib/context/DateContext";

export default function ReviewPage() {
  const { dateKey } = useDate();
  const [activeTab, setActiveTab] = useState<"daily" | "weekly">("daily");

  // Daily State
  const [dailyLearned, setDailyLearned] = useLocalStorage(`fitness_hub_daily_learned_${dateKey}`, "");
  const [dailyWins, setDailyWins] = useLocalStorage(`fitness_hub_daily_wins_${dateKey}`, "");
  const [dailyTomorrow, setDailyTomorrow] = useLocalStorage(`fitness_hub_daily_tomorrow_${dateKey}`, "");

  // Weekly State
  const [wentWell, setWentWell] = useLocalStorage(`fitness_hub_weekly_well_${dateKey}`, "");
  const [improved, setImproved] = useLocalStorage(`fitness_hub_weekly_improved_${dateKey}`, "");
  const [goals, setGoals] = useLocalStorage(`fitness_hub_weekly_goals_${dateKey}`, "");

  // Auto-save UI
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");
  const [isTyping, setIsTyping] = useState(false);

  // Simple auto-save visualizer on change
  const triggerAutoSave = () => {
    setIsTyping(true);
    setSaveStatus("saving");
    setTimeout(() => {
      setIsTyping(false);
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 2000);
    }, 1000);
  };

  const handleTextChange = (setter: Function, value: string) => {
    setter(value);
    triggerAutoSave();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12 w-full text-white">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white flex items-center gap-3">
            <CalendarCheck className="w-8 h-8 text-fuchsia-500" /> Reviews
          </h1>
          <p className="text-gray-400 mt-1">Reflect on your progress daily and weekly.</p>
        </div>

        <div className="flex bg-gray-900 rounded-lg p-1 border border-gray-800">
          <button 
            onClick={() => setActiveTab("daily")}
            className={`flex items-center gap-2 px-6 py-2 rounded-md font-bold text-sm transition-colors ${activeTab === "daily" ? 'bg-fuchsia-600 text-white' : 'text-gray-400 hover:text-white'}`}
          >
            <Sun className="w-4 h-4" /> Daily
          </button>
          <button 
            onClick={() => setActiveTab("weekly")}
            className={`flex items-center gap-2 px-6 py-2 rounded-md font-bold text-sm transition-colors ${activeTab === "weekly" ? 'bg-fuchsia-600 text-white' : 'text-gray-400 hover:text-white'}`}
          >
            <CalendarDays className="w-4 h-4" /> Weekly
          </button>
        </div>
      </div>

      <Card className="bg-[#151923] border-gray-800">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{activeTab === "daily" ? "Daily Reflection" : "Weekly Reflection"}</CardTitle>
            <div className="flex items-center gap-2">
              {saveStatus === "saving" && <span className="text-gray-400 text-xs flex items-center gap-1"><Loader2 className="w-3 h-3 animate-spin"/> Saving...</span>}
              {saveStatus === "saved" && <span className="text-emerald-400 text-xs flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/> Saved</span>}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {activeTab === "daily" && (
            <>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-300">What did I learn today?</label>
                <Textarea 
                  value={dailyLearned}
                  onChange={(e) => handleTextChange(setDailyLearned, e.target.value)}
                  className="bg-gray-900 border-gray-800 min-h-[100px] resize-none focus:border-fuchsia-500"
                  placeholder="Today I learned that..."
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-300">What were my biggest wins?</label>
                <Textarea 
                  value={dailyWins}
                  onChange={(e) => handleTextChange(setDailyWins, e.target.value)}
                  className="bg-gray-900 border-gray-800 min-h-[100px] resize-none focus:border-fuchsia-500"
                  placeholder="I finally finished the project..."
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-300">What is my main focus for tomorrow?</label>
                <Textarea 
                  value={dailyTomorrow}
                  onChange={(e) => handleTextChange(setDailyTomorrow, e.target.value)}
                  className="bg-gray-900 border-gray-800 min-h-[100px] resize-none focus:border-fuchsia-500"
                  placeholder="Tomorrow I need to..."
                />
              </div>
            </>
          )}

          {activeTab === "weekly" && (
            <>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-fuchsia-500/10 border border-fuchsia-500/20 rounded-xl p-4 text-center">
                  <div className="text-3xl font-black text-fuchsia-500 mb-1">5</div>
                  <div className="text-xs text-fuchsia-400 font-bold uppercase tracking-widest">Workouts</div>
                </div>
                <div className="bg-fuchsia-500/10 border border-fuchsia-500/20 rounded-xl p-4 text-center">
                  <div className="text-3xl font-black text-fuchsia-500 mb-1">92%</div>
                  <div className="text-xs text-fuchsia-400 font-bold uppercase tracking-widest">Habits</div>
                </div>
                <div className="bg-fuchsia-500/10 border border-fuchsia-500/20 rounded-xl p-4 text-center">
                  <div className="text-3xl font-black text-fuchsia-500 mb-1">2.4k</div>
                  <div className="text-xs text-fuchsia-400 font-bold uppercase tracking-widest">XP Earned</div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-300">What went well this week?</label>
                <Textarea 
                  value={wentWell}
                  onChange={(e) => handleTextChange(setWentWell, e.target.value)}
                  className="bg-gray-900 border-gray-800 min-h-[100px] resize-none focus:border-fuchsia-500"
                  placeholder="I managed to hit all my protein goals..."
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-300">What could be improved?</label>
                <Textarea 
                  value={improved}
                  onChange={(e) => handleTextChange(setImproved, e.target.value)}
                  className="bg-gray-900 border-gray-800 min-h-[100px] resize-none focus:border-fuchsia-500"
                  placeholder="I missed my sleep target twice..."
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-300">Top 3 Goals for next week</label>
                <Textarea 
                  value={goals}
                  onChange={(e) => handleTextChange(setGoals, e.target.value)}
                  className="bg-gray-900 border-gray-800 min-h-[100px] resize-none focus:border-fuchsia-500"
                  placeholder="1. Drink 3L of water daily&#10;2. Read 2 chapters&#10;3. Try a new recipe"
                />
              </div>
            </>
          )}

        </CardContent>
      </Card>
    </div>
  );
}