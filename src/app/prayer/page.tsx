"use client";

import { useState } from "react";
import { Moon, Check, Save } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useLocalStorage } from "@/lib/hooks/useLocalStorage";
import { useDate } from "@/lib/context/DateContext";

export default function PrayerPage() {
  const { dateKey } = useDate();
  
  const [prayers, setPrayers] = useLocalStorage(`fitness_hub_prayers_${dateKey}`, {
    Fajr: false,
    Dhuhr: false,
    Asr: false,
    Maghrib: false,
    Isha: false
  });

  const [mosqueDays, setMosqueDays] = useLocalStorage<Record<string, boolean>>(`fitness_hub_mosque_${dateKey}`, {});
  const [quranPages, setQuranPages] = useState("");
  const [totalRead, setTotalRead] = useLocalStorage("fitness_hub_quran_total", { today: 0, total: 0 });

  const togglePrayer = (name: keyof typeof prayers) => {
    setPrayers(prev => ({ ...prev, [name]: !prev[name] }));
  };

  const logReading = () => {
    if (!quranPages) return;
    const pages = parseInt(quranPages);
    if (isNaN(pages)) return;
    
    setTotalRead(prev => ({
      today: prev.today + pages,
      total: prev.total + pages
    }));
    setQuranPages("");
  };

  const getWeekDays = () => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() - d.getDay() + 1 + i); // Monday start
      days.push(d);
    }
    return days;
  };

  const weekDays = getWeekDays();

  return (
    <div className="flex flex-col gap-8 pb-12 w-full max-w-6xl mx-auto text-white">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-black text-white">Prayer</h1>
        <div className="flex gap-4">
          <Badge className="bg-gray-800 text-gray-400 hover:bg-gray-800 border-gray-700">
            <Moon className="w-4 h-4 text-orange-400 mr-2" /> 0 Day Streak
          </Badge>
          <Badge className="bg-indigo-900/30 text-indigo-400 border-indigo-500/30 hover:bg-indigo-900/30">
            <Save className="w-4 h-4 mr-1" /> Saved
          </Badge>
        </div>
      </div>

      {/* Daily Prayers */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {Object.entries(prayers).map(([name, completed]) => (
          <div 
            key={name}
            onClick={() => togglePrayer(name as keyof typeof prayers)}
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
            <h3 className="font-bold tracking-wider text-sm text-gray-300 uppercase">{name}</h3>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Mosque Attendance */}
        <Card className="bg-[#151923] border-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base text-gray-200">
              <span>🕌</span> Mosque Attendance This Week
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {weekDays.map(date => {
                const dateStr = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
                const isChecked = mosqueDays[dateStr];
                
                return (
                  <div 
                    key={dateStr}
                    onClick={() => setMosqueDays(prev => ({...prev, [dateStr]: !prev[dateStr]}))}
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

        {/* Quran Reading Log */}
        <Card className="bg-[#151923] border-gray-800 h-fit">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base text-gray-200">
              <span>📖</span> Quran Reading Log
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="text-sm text-gray-400 mb-2 block">Pages read today</label>
              <Input 
                type="number" 
                value={quranPages}
                onChange={e => setQuranPages(e.target.value)}
                placeholder="0"
                className="bg-[#1e2536] border-gray-700 text-white h-12"
              />
            </div>
            
            <Button 
              onClick={logReading}
              className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold px-8 h-10 rounded-lg shadow-lg shadow-indigo-500/20"
            >
              Log Reading
            </Button>

            <div className="space-y-4 pt-4 border-t border-gray-800">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400">Today</span>
                <span className="font-bold">{totalRead.today} pages</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400">Total</span>
                <span className="font-bold">{totalRead.total} pages</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Completion Chart */}
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
            
            {/* Mock Chart Bars */}
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
  );
}
