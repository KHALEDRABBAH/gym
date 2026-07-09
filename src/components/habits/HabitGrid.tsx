"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const HABITS = ["Morning Prayer", "Workout", "Read 10 Pages", "Drink 3L Water", "Code 1 Hour"];

// Mock 7 day data 
const generateGridData = () => {
  return HABITS.map(habit => ({
    name: habit,
    days: Array.from({ length: 7 }, () => Math.random() > 0.3)
  }));
};

const mockData = generateGridData();

export function HabitGrid() {
  return (
    <Card className="bg-gray-900 border-gray-800 col-span-full mt-4">
      <CardHeader>
        <CardTitle>Weekly Habit Grid</CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <div className="min-w-[600px]">
          <div className="grid grid-cols-[150px_repeat(7,1fr)] gap-2 mb-2">
            <div className="font-medium text-gray-500 text-sm">Habit</div>
            {DAYS.map(day => (
              <div key={day} className="text-center font-medium text-gray-500 text-sm">{day}</div>
            ))}
          </div>

          <div className="space-y-2">
            {mockData.map((habit, i) => (
              <div key={i} className="grid grid-cols-[150px_repeat(7,1fr)] gap-2 items-center">
                <div className="font-medium text-white text-sm">{habit.name}</div>
                {habit.days.map((isDone, j) => (
                  <div 
                    key={j} 
                    className={cn(
                      "aspect-square rounded-md border flex items-center justify-center transition-colors cursor-pointer hover:scale-105",
                      isDone 
                        ? "bg-indigo-500/20 border-indigo-500 text-indigo-400" 
                        : "bg-gray-950 border-gray-800 text-transparent hover:border-gray-600"
                    )}
                  >
                    {isDone && (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
