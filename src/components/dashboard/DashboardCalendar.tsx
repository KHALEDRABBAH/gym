"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function DashboardCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  // Adjust for Monday start instead of Sunday start
  const startOffset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: startOffset }, (_, i) => i);

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const today = new Date();
  const isCurrentMonth = today.getMonth() === currentDate.getMonth() && today.getFullYear() === currentDate.getFullYear();

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="flex items-center gap-2">
          <CalendarIcon className="w-5 h-5 text-indigo-400" />
          <span className="en-only">Activity Calendar</span>
          <span className="ar-only">النتيجة والنشاط</span>
        </CardTitle>
        <div className="flex items-center gap-4">
          <button onClick={prevMonth} className="text-gray-400 hover:text-white">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="font-bold w-32 text-center text-gray-200">
            {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </span>
          <button onClick={nextMonth} className="text-gray-400 hover:text-white">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-2 mb-2">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
            <div key={day} className="text-center text-xs font-bold text-gray-500 py-2">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-2">
          {blanks.map(blank => (
            <div key={`blank-${blank}`} className="aspect-square bg-transparent rounded-lg"></div>
          ))}
          {days.map(day => {
            const isToday = isCurrentMonth && day === today.getDate();
            const isPast = (isCurrentMonth && day < today.getDate()) || currentDate < today;
            
            // Mock completion state (deterministic to avoid hydration errors)
            const isCompleted = isPast && (day % 3 !== 0);

            return (
              <div 
                key={day} 
                className={cn(
                  "aspect-square rounded-lg flex flex-col items-center justify-center text-sm font-medium transition-colors cursor-pointer border",
                  isToday 
                    ? "bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/20" 
                    : isCompleted
                      ? "bg-indigo-900/30 border-indigo-900/50 text-indigo-300 hover:bg-indigo-800/40"
                      : "bg-gray-950 border-gray-800 text-gray-500 hover:border-gray-700 hover:text-gray-300"
                )}
              >
                {day}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
