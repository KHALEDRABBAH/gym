"use client";

import { useState, useTransition } from "react";
import { Moon, Check, Save } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { togglePrayer } from "@/app/actions";
import type { PrayerLog } from "@prisma/client";

export function PrayerClient({ 
  initialLog, 
  dateKey,
  weekDays 
}: { 
  initialLog: PrayerLog, 
  dateKey: string,
  weekDays: Date[]
}) {
  const [isPending, startTransition] = useTransition();
  const [log, setLog] = useState<PrayerLog>(initialLog);

  const handleToggle = (prayerName: keyof PrayerLog) => {
    // Only toggle boolean fields
    if (typeof log[prayerName] !== 'boolean') return;
    
    const newValue = !log[prayerName];
    
    // Optimistic Update
    setLog(prev => ({ ...prev, [prayerName]: newValue }));

    // Server Action
    startTransition(() => {
      togglePrayer(dateKey, prayerName as string, newValue);
    });
  };

  const prayersList = [
    { key: "fajr" as const, label: "Fajr" },
    { key: "dhuhr" as const, label: "Dhuhr" },
    { key: "asr" as const, label: "Asr" },
    { key: "maghrib" as const, label: "Maghrib" },
    { key: "isha" as const, label: "Isha" },
  ];

  return (
    <div className="flex flex-col gap-8 pb-12 w-full max-w-6xl mx-auto text-white">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-black text-white">Prayer</h1>
        <div className="flex gap-4">
          <Badge className="bg-gray-800 text-gray-400 hover:bg-gray-800 border-gray-700">
            <Moon className="w-4 h-4 text-orange-400 mr-2" /> 0 Day Streak
          </Badge>
          <Badge className="bg-indigo-900/30 text-indigo-400 border-indigo-500/30 hover:bg-indigo-900/30">
            {isPending ? (
              <span className="flex items-center">Saving...</span>
            ) : (
              <><Save className="w-4 h-4 mr-1" /> Saved</>
            )}
          </Badge>
        </div>
      </div>

      {/* Daily Prayers */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {prayersList.map(({ key, label }) => {
          const completed = log[key] as boolean;
          return (
            <div 
              key={key}
              onClick={() => handleToggle(key)}
              className={`p-6 rounded-xl border-t-4 cursor-pointer transition-all ${
                completed 
                  ? 'bg-gray-800 border-emerald-500 shadow-lg shadow-emerald-500/10' 
                  : 'bg-[#151923] border-orange-500/50 hover:bg-gray-800/80'
              }`}
            >
              <div className={`w-6 h-6 rounded-md mb-4 flex items-center justify-center border ${
                completed ? 'bg-emerald-500 border-emerald-500' : 'bg-[#1e2536] border-gray-700'
              }`}>
                {completed && <Check className="w-4 h-4 text-white" />}
              </div>
              <h3 className="font-bold tracking-wider text-sm text-gray-300 uppercase">{label}</h3>
            </div>
          );
        })}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Mosque Attendance - UI Mock for Iteration 1 */}
        <Card className="bg-[#151923] border-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base text-gray-200">
              <span>🕌</span> Mosque Attendance This Week
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {weekDays.map((date, i) => {
                const dateStr = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
                const isChecked = false; // Mocked for now, needs DB model expansion for mosque attendance specifically
                
                return (
                  <div 
                    key={dateStr}
                    className="flex items-center gap-4 py-3 border-b border-gray-800/50 cursor-pointer hover:bg-gray-800/30 px-2 rounded-lg transition-colors"
                  >
                    <div className={`w-5 h-5 rounded border flex flex-shrink-0 items-center justify-center ${
                      isChecked ? 'bg-indigo-500 border-indigo-500' : 'border-gray-600 bg-gray-900'
                    }`}>
                      {isChecked && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <span className="text-gray-300 text-sm font-medium">{dateStr}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Weekly Completion Chart - UI Mock */}
        <Card className="bg-[#151923] border-gray-800">
          <CardHeader>
            <CardTitle className="text-base text-gray-200">Weekly Prayer Completion</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48 border-b border-l border-gray-800 flex items-end justify-between px-2 pt-4 relative">
              <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-gray-600 -ml-4 py-2">
                <span>5</span>
                <span>4</span>
                <span>3</span>
                <span>2</span>
                <span>1</span>
                <span>0</span>
              </div>
              
              {[5, 4, 3, 0, 0, 0, 0].map((val, i) => (
                <div key={i} className="w-12 bg-indigo-500/20 rounded-t-sm relative group cursor-pointer" style={{ height: `${(val/5)*100}%` }}>
                  <div className="absolute inset-x-0 bottom-0 bg-indigo-500 rounded-t-sm transition-all group-hover:opacity-80" style={{ height: '100%' }}></div>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2 px-2 text-xs text-gray-500">
              <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
