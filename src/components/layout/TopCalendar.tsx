"use client";

import { useDate } from "@/lib/context/DateContext";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export function TopCalendar() {
  const { selectedDate, setSelectedDate } = useDate();

  // Generate an array of 7 days around the selected date (e.g. 3 days before, 3 days after)
  const days = [];
  for (let i = -3; i <= 3; i++) {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + i);
    days.push(d);
  }

  const goBack = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 1);
    setSelectedDate(newDate);
  };

  const goForward = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 1);
    setSelectedDate(newDate);
  };

  const goToToday = () => {
    setSelectedDate(newDate());
  };
  
  const newDate = () => {
      return new Date();
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' });
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() && 
           date.getMonth() === today.getMonth() && 
           date.getFullYear() === today.getFullYear();
  };

  const isSelected = (date: Date) => {
    return date.getDate() === selectedDate.getDate() && 
           date.getMonth() === selectedDate.getMonth() && 
           date.getFullYear() === selectedDate.getFullYear();
  };

  return (
    <div className="bg-[#151923] border-b border-gray-800 px-4 md:px-8 py-4 flex flex-col md:flex-row items-center justify-between gap-4 sticky top-0 z-10 w-full">
      <div className="flex items-center gap-2">
        <Button onClick={goToToday} variant="outline" size="sm" className="border-gray-800 bg-gray-900 text-gray-300 hover:text-white hover:bg-gray-800">
          <CalendarIcon className="w-4 h-4 mr-2" /> Today
        </Button>
        <span className="text-gray-400 text-sm font-medium ml-2 hidden md:inline-block">
          {selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </span>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto max-w-full hide-scrollbar pb-2 md:pb-0">
        <Button onClick={goBack} variant="ghost" size="icon" className="text-gray-400 hover:text-white shrink-0">
          <ChevronLeft className="w-5 h-5" />
        </Button>
        
        <div className="flex gap-2">
          {days.map((date, i) => {
            const selected = isSelected(date);
            const today = isToday(date);
            
            return (
              <button
                key={i}
                onClick={() => setSelectedDate(date)}
                className={`flex flex-col items-center justify-center min-w-[3rem] h-14 rounded-xl border transition-colors shrink-0
                  ${selected 
                    ? 'bg-indigo-600 border-indigo-500 text-white shadow-[0_0_15px_rgba(79,70,229,0.3)]' 
                    : today 
                      ? 'bg-gray-800 border-gray-600 text-gray-200'
                      : 'bg-gray-900 border-gray-800 text-gray-400 hover:border-gray-700 hover:bg-gray-800'
                  }
                `}
              >
                <span className={`text-[10px] uppercase font-bold tracking-wider ${selected ? 'text-indigo-200' : ''}`}>
                  {date.toLocaleDateString('en-US', { weekday: 'short' })}
                </span>
                <span className={`text-lg font-black ${selected ? 'text-white' : ''}`}>
                  {date.getDate()}
                </span>
              </button>
            );
          })}
        </div>

        <Button onClick={goForward} variant="ghost" size="icon" className="text-gray-400 hover:text-white shrink-0">
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}
