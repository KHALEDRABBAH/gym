"use client";

import { useState } from "react";
import { Flame, Plus, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLocalStorage } from "@/lib/hooks/useLocalStorage";
import { useDate } from "@/lib/context/DateContext";

// Generate last 7 days from a given date
const getPast7Days = (endDate: Date) => {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(endDate);
    d.setDate(d.getDate() - i);
    days.push(d);
  }
  return days;
};

type Habit = {
  id: number;
  name: string;
  streak: number;
  history: Record<string, boolean>; // key: YYYY-MM-DD
};

const INITIAL_HABITS: Habit[] = [
  { id: 1, name: "Drink 2L Water", streak: 12, history: {} },
  { id: 2, name: "Read 10 Pages", streak: 3, history: {} },
  { id: 3, name: "Workout", streak: 5, history: {} },
];

export default function HabitsPage() {
  const { selectedDate } = useDate();
  const past7Days = getPast7Days(selectedDate);
  const [habits, setHabits] = useLocalStorage<Habit[]>("fitness_hub_habits", INITIAL_HABITS);
  const [newHabit, setNewHabit] = useState("");

  const toggleHabit = (habitId: number, dateStr: string) => {
    setHabits(habits.map(h => {
      if (h.id === habitId) {
        const newHistory = { ...h.history };
        newHistory[dateStr] = !newHistory[dateStr];
        return { ...h, history: newHistory };
      }
      return h;
    }));
  };

  const addHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabit.trim()) return;
    setHabits([...habits, { id: Date.now(), name: newHabit, streak: 0, history: {} }]);
    setNewHabit("");
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12 w-full text-white">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white flex items-center gap-3">
            <Flame className="w-8 h-8 text-orange-500" /> Habits
          </h1>
          <p className="text-gray-400 mt-1">Build consistency and track your streaks.</p>
        </div>
      </div>

      <form onSubmit={addHabit} className="flex gap-4">
        <Input 
          value={newHabit}
          onChange={e => setNewHabit(e.target.value)}
          placeholder="New Habit Name..." 
          className="bg-[#151923] border-gray-800 text-white h-14 text-lg rounded-xl focus-visible:ring-orange-500 max-w-md"
        />
        <Button type="submit" className="h-14 px-8 bg-orange-600 hover:bg-orange-700 rounded-xl shadow-lg shadow-orange-500/20 font-bold">
          <Plus className="w-5 h-5 mr-2" /> Add Habit
        </Button>
      </form>

      <div className="bg-[#151923] border border-gray-800 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-900 border-b border-gray-800 text-gray-400 text-sm">
                <th className="p-4 font-bold w-1/3">Habit</th>
                {past7Days.map((d, i) => (
                  <th key={i} className="p-4 font-bold text-center">
                    <div className="text-xs uppercase">{d.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                    <div className="text-lg text-gray-200">{d.getDate()}</div>
                  </th>
                ))}
                <th className="p-4 font-bold text-center">Streak</th>
              </tr>
            </thead>
            <tbody>
              {habits.map(habit => (
                <tr key={habit.id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                  <td className="p-4 font-bold text-gray-200">
                    {habit.name}
                  </td>
                  
                  {past7Days.map((d, i) => {
                    const dateStr = d.toISOString().split('T')[0];
                    const isCompleted = habit.history[dateStr] || (i % 2 === 0 && Object.keys(habit.history).length === 0); // Mock data initially
                    
                    return (
                      <td key={i} className="p-4 text-center">
                        <button 
                          onClick={() => toggleHabit(habit.id, dateStr)}
                          className={`w-10 h-10 rounded-xl mx-auto flex items-center justify-center transition-all duration-300 ${
                            isCompleted 
                              ? 'bg-gradient-to-br from-orange-400 to-orange-600 shadow-lg shadow-orange-500/30 scale-110' 
                              : 'bg-gray-800 hover:bg-gray-700'
                          }`}
                        >
                          {isCompleted && <Check className="w-5 h-5 text-white" />}
                        </button>
                      </td>
                    );
                  })}
                  
                  <td className="p-4 text-center">
                    <div className="inline-flex items-center gap-1 bg-orange-500/10 text-orange-400 px-3 py-1 rounded-full font-bold">
                      <Flame className="w-4 h-4" />
                      {habit.streak}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}