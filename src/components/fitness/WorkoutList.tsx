"use client";

import { useState } from "react";
import { PlayCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ExerciseModal } from "./ExerciseModal";

interface WorkoutListProps {
  exercises: any[];
}

export function WorkoutList({ exercises }: WorkoutListProps) {
  const [selectedExercise, setSelectedExercise] = useState<any>(null);

  if (!exercises || exercises.length === 0) return null;

  return (
    <>
      <div className="space-y-4">
        {exercises.map((ex, i) => (
          <div 
            key={ex.id} 
            className="flex items-center gap-4 p-4 rounded-xl bg-gray-900 border border-gray-800 hover:border-indigo-500/50 transition-colors cursor-pointer group"
            onClick={() => setSelectedExercise(ex)}
          >
            <span className="text-gray-500 font-bold w-6 text-center">{i + 1}</span>
            
            <div className="relative w-20 h-12 rounded-lg overflow-hidden shrink-0 bg-gray-950">
              <img 
                src={`https://img.youtube.com/vi/${ex.videoId}/mqdefault.jpg`} 
                alt={ex.name} 
                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-black/50 rounded px-2 py-0.5 text-white/80">
                  <span className="text-[10px] tracking-widest leading-none">•••</span>
                </div>
              </div>
            </div>
            
            <div className="flex-1">
              <h4 className="font-bold text-white text-sm md:text-base leading-tight mb-1">{ex.name}</h4>
              <div className="text-xs text-gray-400">
                {ex.sets} · Rest {ex.rest} · {ex.muscle}
              </div>
            </div>
            
            <div className="hidden md:flex flex-wrap gap-1 justify-end">
              {ex.tags.filter((t: string) => t !== 'compound' && t !== 'isolation').map((tag: string) => (
                <Badge key={tag} variant="secondary" className="bg-orange-900/30 text-orange-400 border-orange-900/50 text-[10px] uppercase">
                  {tag}
                </Badge>
              ))}
              <Badge variant="secondary" className="bg-indigo-900/30 text-indigo-400 border-indigo-900/50 text-[10px] uppercase">
                {ex.type}
              </Badge>
            </div>
            
            <PlayCircle className="w-6 h-6 text-red-500 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all ml-2" />
          </div>
        ))}
      </div>

      {selectedExercise && (
        <ExerciseModal 
          exercise={selectedExercise} 
          onClose={() => setSelectedExercise(null)} 
        />
      )}
    </>
  );
}
