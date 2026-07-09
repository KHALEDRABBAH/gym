"use client";

import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

export function TopCalendar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // Determine currently selected date from URL or default to today
  const dateParam = searchParams.get("date");
  const selectedDate = dateParam ? new Date(dateParam) : new Date();

  // Generate an array of 7 days around the selected date
  const days = [];
  for (let i = -3; i <= 3; i++) {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + i);
    days.push(d);
  }

  const handleDateSelect = (d: Date) => {
    const dateStr = d.toISOString().split("T")[0];
    const params = new URLSearchParams(searchParams.toString());
    params.set("date", dateStr);
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleToday = () => {
    handleDateSelect(new Date());
  };

  return (
    <div className="bg-[#1a1f2e] border-b border-gray-800 text-white h-16 flex items-center justify-between px-4 sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <Button onClick={handleToday} variant="outline" size="sm" className="bg-[#151923] border-gray-700 text-gray-300 hover:text-white h-8 text-xs font-bold">
          <CalendarIcon className="w-3 h-3 mr-2" /> Today
        </Button>
        <div className="text-sm font-bold text-gray-400 hidden md:block">
          {selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </div>
      </div>

      <div className="flex items-center gap-1 overflow-x-auto hide-scrollbar">
        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-white"
          onClick={() => {
            const d = new Date(selectedDate);
            d.setDate(d.getDate() - 1);
            handleDateSelect(d);
          }}>
          <ChevronLeft className="w-4 h-4" />
        </Button>
        
        {days.map((date, i) => {
          const isSelected = date.toDateString() === selectedDate.toDateString();
          const isToday = date.toDateString() === new Date().toDateString();
          
          return (
            <button
              key={i}
              onClick={() => handleDateSelect(date)}
              className={`flex flex-col items-center justify-center w-10 h-11 md:w-12 md:h-12 rounded-xl text-xs transition-all ${
                isSelected 
                  ? 'bg-indigo-600 text-white font-bold shadow-lg shadow-indigo-900/50 scale-105' 
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white font-medium'
              } ${isToday && !isSelected ? 'ring-1 ring-indigo-500/50 text-indigo-300' : ''}`}
            >
              <span className="text-[10px] uppercase mb-0.5 opacity-80">{date.toLocaleDateString('en-US', { weekday: 'short' })}</span>
              <span className={isSelected ? 'text-sm' : 'text-sm'}>{date.getDate()}</span>
            </button>
          );
        })}

        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-white"
          onClick={() => {
            const d = new Date(selectedDate);
            d.setDate(d.getDate() + 1);
            handleDateSelect(d);
          }}>
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
