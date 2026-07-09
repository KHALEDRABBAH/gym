"use client";

import { Coffee, Moon, Sun, CloudRain, Zap, Heart, CheckCircle2, Loader2, VolumeX, Volume2, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useState, useEffect, useTransition } from "react";
import { updateSleepLog, updateReviewLog } from "@/app/actions";

// Use an inline type since Prisma types might take a moment to sync in IDE, though it works at build time
type SleepLogData = {
  hours: number;
  quality: number;
  timing: string | null;
  quietness: string | null;
};

export function LifestyleClient({ 
  dateKey, 
  initialSleep, 
  initialReview 
}: { 
  dateKey: string;
  initialSleep: any; // Using any to avoid strict Prisma TS errors if not refreshed locally yet
  initialReview: any;
}) {
  const [isPending, startTransition] = useTransition();

  // Parse initial journal and mood
  let initialMood = "good";
  let initialJournal = "";
  
  if (initialReview?.notes) {
    try {
      const parsed = JSON.parse(initialReview.notes);
      initialMood = parsed.mood || "good";
      initialJournal = parsed.journal || "";
    } catch(e) {
      initialJournal = initialReview.notes;
    }
  }

  // Sleep State
  const [sleepStr, setSleepStr] = useState<string>(initialSleep?.hours?.toString() || "7.5");
  const [timing, setTiming] = useState<string>(initialSleep?.timing || "Night");
  const [quietness, setQuietness] = useState<string>(initialSleep?.quietness || "Quiet");
  const [sleepSaveStatus, setSleepSaveStatus] = useState<"idle" | "saving" | "saved">("idle");

  // Mood State
  const [mood, setMood] = useState(initialMood);
  const [journalInput, setJournalInput] = useState(initialJournal);
  
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");
  const [moodSaveStatus, setMoodSaveStatus] = useState(false);

  // Auto-Save Sleep
  useEffect(() => {
    const hrs = parseFloat(sleepStr);
    if (isNaN(hrs)) return;

    setSleepSaveStatus("saving");
    const timeoutId = setTimeout(() => {
      startTransition(() => {
        updateSleepLog(dateKey, hrs, initialSleep?.quality || 3, timing, quietness);
        setSleepSaveStatus("saved");
        setTimeout(() => setSleepSaveStatus("idle"), 2000);
      });
    }, 1000);
    return () => clearTimeout(timeoutId);
  }, [sleepStr, timing, quietness, dateKey]);

  // Save Mood manually
  const handleMoodChange = (newMood: string) => {
    setMood(newMood);
    setMoodSaveStatus(true);
    const notesJson = JSON.stringify({ mood: newMood, journal: journalInput });
    startTransition(() => {
      updateReviewLog(dateKey, "DAILY", null, null, notesJson);
      setTimeout(() => setMoodSaveStatus(false), 2000);
    });
  };

  // Debounced Auto-save for Journal
  useEffect(() => {
    if (journalInput === initialJournal && saveStatus === "idle") return;
    
    setSaveStatus("saving");
    const timeoutId = setTimeout(() => {
      const notesJson = JSON.stringify({ mood, journal: journalInput });
      startTransition(() => {
        updateReviewLog(dateKey, "DAILY", null, null, notesJson);
        setSaveStatus("saved");
        setTimeout(() => setSaveStatus("idle"), 2000);
      });
    }, 1000);
    
    return () => clearTimeout(timeoutId);
  }, [journalInput, mood, dateKey]);
  
  // Insights logic
  const getInsights = () => {
    const hrs = parseFloat(sleepStr);
    const insights: Array<{ type: string, color: string, icon: string, text: string }> = [];
    if (isNaN(hrs)) return insights;

    if (hrs < 6) {
      insights.push({ type: 'danger', color: 'text-rose-400 bg-rose-500/10 border-rose-500/20', icon: '⚠️', text: 'أنت تنام أقل من 6 ساعات! قلة النوم تزيد من التوتر، وتقلل التركيز، وتضعف المناعة. حاول أن تنام بين 7 و 9 ساعات.' });
    } else if (hrs >= 7 && hrs <= 9) {
      insights.push({ type: 'success', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20', icon: '✅', text: 'نوم مثالي! الاستمرار على هذا المعدل يعزز بناء العضلات، ويحسن صحتك العقلية والجسدية.' });
    } else if (hrs > 9) {
      insights.push({ type: 'warning', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20', icon: '⚠️', text: 'لقد نمت أكثر من 9 ساعات. كثرة النوم قد تجعلك تشعر بالخمول طوال اليوم وتؤثر على حيويتك.' });
    }

    if (timing === "Day") {
      insights.push({ type: 'warning', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20', icon: '💡', text: 'النوم نهاراً يعطل ساعتك البيولوجية ويقلل من إفراز هرمون الميلاتونين. حاول تعديل روتينك للنوم ليلاً لتحصل على نوم أعمق وأكثر راحة.' });
    }

    if (quietness === "Noisy") {
      insights.push({ type: 'danger', color: 'text-rose-400 bg-rose-500/10 border-rose-500/20', icon: '🎧', text: 'النوم في بيئة مزعجة يمنعك من الوصول إلى مرحلة النوم العميق (Deep Sleep). جرّب استخدام سدادات أذن أو تشغيل أصوات بيضاء (White Noise).' });
    }

    return insights;
  };

  const insights = getInsights();

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12 w-full text-white">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white flex items-center gap-3">
            <Coffee className="w-8 h-8 text-amber-500" /> Lifestyle
          </h1>
          <p className="text-gray-400 mt-1">Track your sleep, mood, and daily reflections.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        
        {/* Sleep Dashboard */}
        <Card className="bg-[#151923] border-gray-800 md:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Moon className="w-5 h-5 text-indigo-400" /> Sleep Dashboard
              </CardTitle>
              <div className="flex items-center gap-2 text-sm">
                {sleepSaveStatus === "saving" && <><Loader2 className="w-4 h-4 animate-spin text-gray-400" /><span className="text-gray-400">Saving...</span></>}
                {sleepSaveStatus === "saved" && <><CheckCircle2 className="w-4 h-4 text-emerald-500" /><span className="text-emerald-500">Saved</span></>}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            
            <div className="grid md:grid-cols-3 gap-6">
              {/* Hours Input */}
              <div className="space-y-3 bg-gray-900/50 p-4 rounded-xl border border-gray-800">
                <p className="text-gray-400 text-sm font-medium">Hours Slept</p>
                <Input 
                  type="number"
                  step="0.5"
                  min="0"
                  max="24"
                  value={sleepStr}
                  onChange={(e) => setSleepStr(e.target.value)}
                  className="bg-[#151923] border-gray-700 text-3xl font-black text-indigo-400 h-16 text-center"
                />
              </div>

              {/* Timing Toggle */}
              <div className="space-y-3 bg-gray-900/50 p-4 rounded-xl border border-gray-800">
                <p className="text-gray-400 text-sm font-medium">Timing</p>
                <div className="flex gap-2 h-16">
                  <button 
                    onClick={() => setTiming("Night")}
                    className={`flex-1 rounded-lg border transition-all flex items-center justify-center gap-2 ${timing === "Night" ? 'bg-indigo-500/20 border-indigo-500 text-indigo-300' : 'bg-[#151923] border-gray-700 text-gray-500 hover:border-gray-500'}`}
                  >
                    <Moon className="w-5 h-5" /> Night
                  </button>
                  <button 
                    onClick={() => setTiming("Day")}
                    className={`flex-1 rounded-lg border transition-all flex items-center justify-center gap-2 ${timing === "Day" ? 'bg-amber-500/20 border-amber-500 text-amber-300' : 'bg-[#151923] border-gray-700 text-gray-500 hover:border-gray-500'}`}
                  >
                    <Sun className="w-5 h-5" /> Day
                  </button>
                </div>
              </div>

              {/* Environment Toggle */}
              <div className="space-y-3 bg-gray-900/50 p-4 rounded-xl border border-gray-800">
                <p className="text-gray-400 text-sm font-medium">Environment</p>
                <div className="flex gap-2 h-16">
                  <button 
                    onClick={() => setQuietness("Quiet")}
                    className={`flex-1 rounded-lg border transition-all flex flex-col items-center justify-center ${quietness === "Quiet" ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-[#151923] border-gray-700 text-gray-500 hover:border-gray-500'}`}
                  >
                    <VolumeX className="w-5 h-5 mb-1" />
                    <span className="text-[10px] uppercase font-bold">Quiet</span>
                  </button>
                  <button 
                    onClick={() => setQuietness("Noisy")}
                    className={`flex-1 rounded-lg border transition-all flex flex-col items-center justify-center ${quietness === "Noisy" ? 'bg-rose-500/20 border-rose-500 text-rose-400' : 'bg-[#151923] border-gray-700 text-gray-500 hover:border-gray-500'}`}
                  >
                    <Volume2 className="w-5 h-5 mb-1" />
                    <span className="text-[10px] uppercase font-bold">Noisy</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Insights Section */}
            {insights.length > 0 && (
              <div className="mt-6 space-y-3">
                <h3 className="text-gray-400 text-sm font-medium flex items-center gap-2">
                  <Info className="w-4 h-4" /> AI Sleep Insights
                </h3>
                <div className="grid gap-3">
                  {insights.map((insight, idx) => (
                    <div key={idx} className={`p-4 rounded-xl border flex items-start gap-3 ${insight.color}`}>
                      <span className="text-xl leading-none">{insight.icon}</span>
                      <p className="text-sm leading-relaxed">{insight.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </CardContent>
        </Card>

        {/* Mood Tracker */}
        <Card className="bg-[#151923] border-gray-800">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-rose-500" /> Mood Tracker
              </CardTitle>
              {moodSaveStatus && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-4 gap-4">
              <button 
                onClick={() => handleMoodChange("great")}
                className={`flex flex-col items-center gap-2 p-4 border rounded-xl transition-colors ${mood === "great" ? 'bg-amber-500/20 border-amber-500' : 'bg-gray-900 border-gray-800 hover:bg-amber-500/10 hover:border-amber-500'}`}
              >
                <Sun className={`w-8 h-8 ${mood === "great" ? 'text-amber-500' : 'text-gray-500'}`} />
                <span className={`text-xs font-bold ${mood === "great" ? 'text-amber-500' : 'text-gray-500'}`}>Great</span>
              </button>
              
              <button 
                onClick={() => handleMoodChange("good")}
                className={`flex flex-col items-center gap-2 p-4 border rounded-xl transition-colors ${mood === "good" ? 'bg-emerald-500/20 border-emerald-500' : 'bg-gray-900 border-gray-800 hover:bg-emerald-500/10 hover:border-emerald-500'}`}
              >
                <Zap className={`w-8 h-8 ${mood === "good" ? 'text-emerald-500' : 'text-gray-500'}`} />
                <span className={`text-xs font-bold ${mood === "good" ? 'text-emerald-500' : 'text-gray-500'}`}>Good</span>
              </button>
              
              <button 
                onClick={() => handleMoodChange("okay")}
                className={`flex flex-col items-center gap-2 p-4 border rounded-xl transition-colors ${mood === "okay" ? 'bg-blue-500/20 border-blue-500' : 'bg-gray-900 border-gray-800 hover:bg-blue-500/10 hover:border-blue-500'}`}
              >
                <CloudRain className={`w-8 h-8 ${mood === "okay" ? 'text-blue-500' : 'text-gray-500'}`} />
                <span className={`text-xs font-bold ${mood === "okay" ? 'text-blue-500' : 'text-gray-500'}`}>Okay</span>
              </button>
              
              <button 
                onClick={() => handleMoodChange("bad")}
                className={`flex flex-col items-center gap-2 p-4 border rounded-xl transition-colors ${mood === "bad" ? 'bg-rose-500/20 border-rose-500' : 'bg-gray-900 border-gray-800 hover:bg-rose-500/10 hover:border-rose-500'}`}
              >
                <Moon className={`w-8 h-8 ${mood === "bad" ? 'text-rose-500' : 'text-gray-500'}`} />
                <span className={`text-xs font-bold ${mood === "bad" ? 'text-rose-500' : 'text-gray-500'}`}>Bad</span>
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Journaling */}
        <Card className="bg-[#151923] border-gray-800 md:col-span-1">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Daily Reflection</CardTitle>
              <div className="flex items-center gap-3">
                {saveStatus === "saving" && (
                  <span className="text-gray-400 text-sm flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                  </span>
                )}
                {saveStatus === "saved" && (
                  <span className="text-emerald-400 text-sm flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" /> Saved
                  </span>
                )}
                {saveStatus === "idle" && (
                  <span className="text-gray-500 text-sm italic hidden md:inline-block">Auto-saves</span>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea 
              value={journalInput}
              onChange={(e) => setJournalInput(e.target.value)}
              placeholder="How are you feeling today? Any specific wins or struggles?"
              className="bg-gray-900 border-gray-800 min-h-[160px] resize-none focus:border-indigo-500"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
