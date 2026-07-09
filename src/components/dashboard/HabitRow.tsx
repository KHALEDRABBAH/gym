"use client";

import { useTransition } from "react";
import { toggleHabit } from "@/app/actions";
import { Check } from "lucide-react";

interface HabitRowProps {
  id: string;
  name: string;
  completed: boolean;
}

export function HabitRow({ id, name, completed }: HabitRowProps) {
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    startTransition(() => {
      toggleHabit(id, !completed);
    });
  };

  return (
    <div 
      onClick={handleToggle}
      className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
        completed ? "bg-gray-900 border-gray-800" : "bg-gray-950 border-gray-800 hover:border-gray-700"
      } ${isPending ? "opacity-50 pointer-events-none" : ""}`}
    >
      <span className={completed ? "text-gray-400 line-through" : "text-white"}>{name}</span>
      <div 
        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
          completed ? "bg-green-500 border-green-500" : "border-gray-600"
        }`}
      >
        {completed && <Check className="w-4 h-4 text-black" strokeWidth={3} />}
      </div>
    </div>
  );
}
