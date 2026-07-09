"use client";

import { Button } from "@/components/ui/button";
import { Save, Trash2, CheckCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useLocalStorage } from "@/lib/hooks/useLocalStorage";
import { useState } from "react";
import { useDate } from "@/lib/context/DateContext";

interface WorkoutLogProps {
  exercises: any[];
}

export function WorkoutLog({ exercises }: WorkoutLogProps) {
  const { dateKey } = useDate();
  const [logData, setLogData] = useLocalStorage<Record<string, any>>(`fitness_hub_workout_log_${dateKey}`, {});
  const [savedStatus, setSavedStatus] = useState(false);

  if (!exercises || exercises.length === 0) return null;

  const handleUpdate = (exId: string, setIndex: number, field: 'kg' | 'rep', value: string) => {
    setLogData(prev => {
      const exData = prev[exId] || { sets: [] };
      const sets = [...(exData.sets || [])];
      sets[setIndex] = { ...sets[setIndex], [field]: value };
      return { ...prev, [exId]: { ...exData, sets } };
    });
  };

  const handleNotes = (exId: string, notes: string) => {
    setLogData(prev => ({ ...prev, [exId]: { ...(prev[exId] || {}), notes } }));
  };

  const clearLog = () => {
    if (confirm("Are you sure you want to clear these logs?")) {
      setLogData(prev => {
        const next = { ...prev };
        exercises.forEach(ex => delete next[ex.id]);
        return next;
      });
    }
  };

  const handleSave = () => {
    setSavedStatus(true);
    setTimeout(() => setSavedStatus(false), 2000);
  };

  return (
    <div className="bg-[#1a1f2e] border border-gray-800 rounded-2xl overflow-hidden mt-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 border-b border-gray-800 bg-[#151923]">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <span>📊</span> Workout Log — Track Your Weights
        </h3>
        <div className="flex items-center gap-2 mt-4 md:mt-0">
          <Button onClick={handleSave} size="sm" className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold h-8 transition-colors">
            {savedStatus ? <CheckCircle className="w-4 h-4 mr-2" /> : <Save className="w-4 h-4 mr-2" />} 
            {savedStatus ? "Saved!" : "Save Log"}
          </Button>
          <Button onClick={clearLog} size="sm" variant="destructive" className="bg-red-500 hover:bg-red-600 font-bold h-8">
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
              <th className="px-4 py-3 font-bold tracking-wider text-xs text-center">NOTES</th>
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
                            value={setData.kg}
                            onChange={(e) => handleUpdate(ex.id, s, 'kg', e.target.value)}
                            className="w-16 h-8 bg-[#1f2537] border-gray-700 text-center text-gray-200 rounded-md focus:border-indigo-500 px-1 placeholder:text-gray-600 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            disabled={isDisabled}
                          />
                          <span className="text-gray-500 text-xs font-bold">×</span>
                          <Input 
                            type="number" 
                            placeholder="rep" 
                            value={setData.rep}
                            onChange={(e) => handleUpdate(ex.id, s, 'rep', e.target.value)}
                            className="w-16 h-8 bg-[#1f2537] border-gray-700 text-center text-gray-200 rounded-md focus:border-indigo-500 px-1 placeholder:text-gray-600 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            disabled={isDisabled}
                          />
                        </div>
                      </td>
                    );
                  })}
                  
                  <td className="px-4 py-4 text-center">
                    <Input 
                      type="text" 
                      placeholder="..." 
                      value={exLog.notes || ""}
                      onChange={(e) => handleNotes(ex.id, e.target.value)}
                      className="w-24 h-8 bg-[#1f2537] border-gray-700 text-center text-gray-200 mx-auto rounded-md focus:border-indigo-500 placeholder:text-gray-600"
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
