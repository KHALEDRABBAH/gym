"use client";

import { Coffee, Moon, Sun, CloudRain, Zap, Heart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect, useTransition } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { updateSleepLog, updateReviewLog } from "@/app/actions";
import type { SleepLog, ReviewLog } from "@prisma/client";

export function LifestyleClient({ 
  dateKey, 
  initialSleep, 
  initialReview 
}: { 
  dateKey: string;
  initialSleep: SleepLog | null;
  initialReview: ReviewLog | null;
}) {
  const [isPending, startTransition] = useTransition();

  // Parse initial journal and mood if stored as JSON in notes
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

  const [sleep, setSleep] = useState(initialSleep?.hours || 7.5);
  const [mood, setMood] = useState(initialMood);
  const [journalInput, setJournalInput] = useState(initialJournal);
  
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");
  const [sleepSaveStatus, setSleepSaveStatus] = useState(false);
  const [moodSaveStatus, setMoodSaveStatus] = useState(false);

  // Handlers
  const handleSleepChange = (h: number) => {
    setSleep(h);
    setSleepSaveStatus(true);
    startTransition(() => {
      updateSleepLog(dateKey, h, initialSleep?.quality || 3);
      setTimeout(() => setSleepSaveStatus(false), 2000);
    });
  };

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
    }, 1000); // 1 second debounce
    
    return () => clearTimeout(timeoutId);
  }, [journalInput, mood, dateKey]);
  
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
        <Card className="bg-[#151923] border-gray-800">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Moon className="w-5 h-5 text-indigo-400" /> Sleep Log
              </CardTitle>
              {sleepSaveStatus && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-between items-center text-center">
              <div>
                <p className="text-gray-500 text-sm mb-2">Hours Slept</p>
                <div className="text-4xl font-black text-indigo-400">{sleep}</div>
              </div>
              <div className="w-px h-16 bg-gray-800"></div>
              <div>
                <p className="text-gray-500 text-sm mb-2">Quality</p>
                <div className="text-4xl font-black text-emerald-400">Good</div>
              </div>
            </div>
            
            <div className="flex gap-2">
              {[4, 5, 6, 7, 8, 9, 10].map(h => (
                <button 
                  key={h} 
                  onClick={() => handleSleepChange(h)}
                  className={`flex-1 py-2 border rounded-lg transition-colors ${sleep === h ? 'bg-indigo-500/20 border-indigo-500' : 'bg-gray-900 border-gray-800 hover:border-indigo-500 hover:bg-indigo-500/10'}`}
                >
                  {h}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

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

        <Card className="bg-[#151923] border-gray-800 md:col-span-2">
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
                    <CheckCircle2 className="w-4 h-4" /> Saved automatically
                  </span>
                )}
                {saveStatus === "idle" && (
                  <span className="text-gray-500 text-sm italic hidden md:inline-block">Auto-saves as you type</span>
                )}
                
                <Button 
                  onClick={() => {
                    const notesJson = JSON.stringify({ mood, journal: journalInput });
                    startTransition(() => {
                      updateReviewLog(dateKey, "DAILY", null, null, notesJson);
                      setSaveStatus("saved");
                      setTimeout(() => setSaveStatus("idle"), 2000);
                    });
                  }}
                  disabled={isPending}
                  className="bg-indigo-600 hover:bg-indigo-700 h-8 text-xs font-bold"
                >
                  Save Journal
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea 
              value={journalInput}
              onChange={(e) => setJournalInput(e.target.value)}
              placeholder="How are you feeling today? Any specific wins or struggles?"
              className="bg-gray-900 border-gray-800 min-h-[120px] resize-none focus:border-indigo-500"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
