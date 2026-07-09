"use client";

import { Button } from "@/components/ui/button";
import { Save, Trash2, CheckCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState, useTransition } from "react";
import { saveWorkoutSet, clearWorkoutLog } from "@/app/actions";
import type { WorkoutLog, ExerciseSet } from "@prisma/client";

interface WorkoutLogClientProps {
  exercises: any[];
  initialLog: (WorkoutLog & { exercises: ExerciseSet[] }) | null;
  dateKey: string;
  scheduleType: string;
}

export function WorkoutLogClient({ exercises, initialLog, dateKey, scheduleType }: WorkoutLogClientProps) {
  const [isPending, startTransition] = useTransition();
  const [savedStatus, setSavedStatus] = useState(false);
  
  // Transform flat DB sets into a UI-friendly map: { [exerciseId]: { sets: [{kg, rep}] } }
  const initialData: Record<string, any> = {};
  if (initialLog && initialLog.exercises) {
    initialLog.exercises.forEach((set: ExerciseSet) => {
      if (!initialData[set.exerciseId]) {
        initialData[set.exerciseId] = { sets: [] };
      }
      initialData[set.exerciseId].sets[set.setIndex] = { kg: set.weight.toString(), rep: set.reps.toString() };
    });
  }

  const [logData, setLogData] = useState<Record<string, any>>(initialData);

  if (!exercises || exercises.length === 0) return null;

  const handleUpdate = (exId: string, exName: string, setIndex: number, field: 'kg' | 'rep', value: string) => {
    // Update local state instantly
    setLogData(prev => {
      const exData = prev[exId] || { sets: [] };
      const sets = [...(exData.sets || [])];
      sets[setIndex] = { ...sets[setIndex], [field]: value };
      return { ...prev, [exId]: { ...exData, sets } };
    });

    // We don't save immediately on every keystroke to avoid spamming the DB,
    // we'll rely on the "Save Log" button, OR we can debounce.
    // For now, let's keep the manual "Save" button pattern since the user likes it.
  };

  const handleSave = () => {
    setSavedStatus(true);
    setTimeout(() => setSavedStatus(false), 2000);
    
    startTransition(async () => {
      for (const exId of Object.keys(logData)) {
        const exName = exercises.find(e => e.id === exId)?.name || exId;
        const sets = logData[exId].sets;
        for (let i = 0; i < sets.length; i++) {
          const s = sets[i];
          if (s && s.kg && s.rep) {
            await saveWorkoutSet(dateKey, scheduleType, exId, exName, i, parseFloat(s.kg), parseInt(s.rep));
          }
        }
      }
    });
  };

  const handleClear = () => {
    if (confirm("Are you sure you want to clear these logs?")) {
      setLogData({});
      startTransition(() => {
        clearWorkoutLog(dateKey);
      });
    }
  };

  return (
    <div className="bg-[#1a1f2e] border border-gray-800 rounded-2xl overflow-hidden mt-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 border-b border-gray-800 bg-[#151923]">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <span>📊</span> Workout Log — Track Your Weights
        </h3>
        <div className="flex items-center gap-2 mt-4 md:mt-0">
          <Button onClick={handleSave} disabled={isPending} size="sm" className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold h-8 transition-colors">
            {savedStatus || isPending ? <CheckCircle className="w-4 h-4 mr-2" /> : <Save className="w-4 h-4 mr-2" />} 
            {isPending ? "Saving..." : savedStatus ? "Saved!" : "Save Log"}
          </Button>
          <Button onClick={handleClear} disabled={isPending} size="sm" variant="destructive" className="bg-red-500 hover:bg-red-600 font-bold h-8">
            <Trash2 className="w-4 h-4 mr-2" /> Delete
          </Button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-[#1a1f2e] text-gray-400 border-b border-gray-800">
            <tr>
              <th className="px-4 py-3 font-bold tracking-wider text-xs">EXERCISE</th>
              <th className="px-4 py-3 font-bold tracking-wider text-xs text-center">SET 1</th>
              <th className="px-4 py-3 font-bold tracking-wider text-xs text-center">SET 2</th>
              <th className="px-4 py-3 font-bold tracking-wider text-xs text-center">SET 3</th>
              <th className="px-4 py-3 font-bold tracking-wider text-xs text-center">SET 4</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/50">
            {exercises.map((ex) => {
              const numSets = parseInt(ex.sets) || 4;
              const exLog = logData[ex.id] || { sets: [] };
              
              return (
                <tr key={ex.id} className="hover:bg-gray-800/20 transition-colors">
                  <td className="px-4 py-4">
                    <div className="font-bold text-gray-200">{ex.name}</div>
                    <div className="text-xs text-gray-500">{ex.sets}</div>
                  </td>
                  
                  {[0, 1, 2, 3].map((s) => {
                    const isDisabled = s >= numSets;
                    const setData = exLog.sets[s] || { kg: "", rep: "" };
                    
                    return (
                      <td key={s} className="px-2 py-4">
                        <div className={`flex items-center justify-center gap-1 ${isDisabled ? 'opacity-30 pointer-events-none' : ''}`}>
                          <Input 
                            type="number" 
                            placeholder="kg" 
                            value={setData.kg || ""}
                            onChange={(e) => handleUpdate(ex.id, ex.name, s, 'kg', e.target.value)}
                            className="w-16 h-8 bg-[#1f2537] border-gray-700 text-center text-gray-200 rounded-md focus:border-indigo-500 px-1 placeholder:text-gray-600 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            disabled={isDisabled}
                          />
                          <span className="text-gray-500 text-xs font-bold">×</span>
                          <Input 
                            type="number" 
                            placeholder="rep" 
                            value={setData.rep || ""}
                            onChange={(e) => handleUpdate(ex.id, ex.name, s, 'rep', e.target.value)}
                            className="w-16 h-8 bg-[#1f2537] border-gray-700 text-center text-gray-200 rounded-md focus:border-indigo-500 px-1 placeholder:text-gray-600 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            disabled={isDisabled}
                          />
                        </div>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
