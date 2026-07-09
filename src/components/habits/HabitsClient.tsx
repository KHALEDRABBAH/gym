"use client";

import { useState, useTransition } from "react";
import { Flame, Plus, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toggleHabit } from "@/app/actions";
import type { HabitLog } from "@prisma/client";

type HabitDisplay = {
  id: string;
  name: string;
  streak: number;
  history: Record<string, boolean>; // key: YYYY-MM-DD
};

export function HabitsClient({ 
  initialHabitLogs, 
  past7Days 
}: { 
  initialHabitLogs: HabitLog[], 
  past7Days: Date[] 
}) {
  const [isPending, startTransition] = useTransition();
  const [newHabit, setNewHabit] = useState("");
  
  // Transform flat logs into grouped habits for the UI
  const groupedHabits = initialHabitLogs.reduce((acc, log) => {
    if (!acc[log.habitId]) {
      acc[log.habitId] = { id: log.habitId, name: log.habitName, streak: 0, history: {} };
    }
    acc[log.habitId].history[log.date] = log.completed;
    return acc;
  }, {} as Record<string, HabitDisplay>);

  // Standard predefined habits if user has none
  if (Object.keys(groupedHabits).length === 0) {
    groupedHabits["water"] = { id: "water", name: "Drink 2L Water", streak: 0, history: {} };
    groupedHabits["read"] = { id: "read", name: "Read 10 Pages", streak: 0, history: {} };
    groupedHabits["workout"] = { id: "workout", name: "Workout", streak: 0, history: {} };
  }

  const [habits, setHabits] = useState<HabitDisplay[]>(Object.values(groupedHabits));

  const handleToggle = (habitId: string, habitName: string, dateStr: string) => {
    // Optimistic Update
    setHabits(current => current.map(h => {
      if (h.id === habitId) {
        return {
          ...h,
          history: { ...h.history, [dateStr]: !h.history[dateStr] }
        };
      }
      return h;
    }));

    // Server Action
    startTransition(() => {
      // Find new state from current render (not state) to ensure accuracy
      const currentHabit = habits.find(h => h.id === habitId);
      const isCompletedNow = currentHabit?.history[dateStr] ? false : true;
      toggleHabit(dateStr, habitId, habitName, isCompletedNow);
    });
  };

  const addHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabit.trim()) return;
    const newId = `habit-${Date.now()}`;
    setHabits([...habits, { id: newId, name: newHabit, streak: 0, history: {} }]);
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
                  <th key={i} className="p-4 font-bold text-center min-w-[60px]">
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
                    const isCompleted = habit.history[dateStr] || false;
                    
                    return (
                      <td key={i} className="p-4 text-center">
                        <button 
                          onClick={() => handleToggle(habit.id, habit.name, dateStr)}
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
