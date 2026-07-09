"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PlayCircle, AlertTriangle, Lightbulb, Clock, Layers } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface ExerciseCardProps {
  exercise: {
    name: string;
    sets: string;
    rest: string;
    tempo: string;
    muscle: string;
    type: string;
    tags: string[];
    videoId: string;
    channel: string;
    formCues: string;
    mistakes: string;
  };
}

export function ExerciseCard({ exercise }: ExerciseCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <div onClick={() => setIsOpen(true)}>
        <Card className="bg-gray-900 border-gray-800 overflow-hidden cursor-pointer hover:border-indigo-500 transition-colors group">
          <div className="relative aspect-video bg-gray-950 overflow-hidden">
            <img 
              src={`https://img.youtube.com/vi/${exercise.videoId}/hqdefault.jpg`} 
              alt={exercise.name}
              className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-transparent transition-colors">
              <PlayCircle className="w-12 h-12 text-white opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all drop-shadow-lg" />
            </div>
            <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-1 rounded text-xs font-bold text-white">
              {exercise.channel}
            </div>
          </div>
          <CardContent className="p-4 space-y-3">
            <h3 className="font-bold text-lg text-white leading-tight">{exercise.name}</h3>
            
            <div className="flex flex-wrap gap-1">
              {exercise.tags.map(tag => (
                <Badge key={tag} variant="secondary" className="bg-gray-800 text-gray-300 text-[10px] uppercase">
                  {tag}
                </Badge>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-2 text-sm pt-2 border-t border-gray-800">
              <div className="flex items-center gap-2 text-gray-400">
                <Layers className="w-4 h-4 text-indigo-400" />
                {exercise.sets}
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <Clock className="w-4 h-4 text-orange-400" />
                {exercise.rest}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <DialogContent className="max-w-3xl bg-gray-950 border-gray-800 text-white p-0 overflow-hidden">
        <DialogHeader className="p-4 md:p-6 pb-0">
          <DialogTitle className="text-xl md:text-2xl">{exercise.name}</DialogTitle>
        </DialogHeader>
        
        <div className="aspect-video w-full bg-black mt-4">
          <iframe 
            width="100%" 
            height="100%" 
            src={`https://www.youtube.com/embed/${exercise.videoId}?autoplay=1`}
            title={exercise.name}
            frameBorder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowFullScreen
          ></iframe>
        </div>

        <div className="p-4 md:p-6 space-y-4 max-h-[40vh] overflow-y-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-900 p-3 rounded-lg border border-gray-800 text-center">
              <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Sets x Reps</p>
              <p className="font-semibold text-white">{exercise.sets}</p>
            </div>
            <div className="bg-gray-900 p-3 rounded-lg border border-gray-800 text-center">
              <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Rest</p>
              <p className="font-semibold text-white">{exercise.rest}</p>
            </div>
            <div className="bg-gray-900 p-3 rounded-lg border border-gray-800 text-center">
              <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Tempo</p>
              <p className="font-semibold text-white">{exercise.tempo}</p>
            </div>
            <div className="bg-gray-900 p-3 rounded-lg border border-gray-800 text-center">
              <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Target</p>
              <p className="font-semibold text-white truncate px-2" title={exercise.muscle}>{exercise.muscle}</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4 pt-2">
            <div className="bg-indigo-950/30 border border-indigo-900/50 p-4 rounded-xl">
              <div className="flex items-center gap-2 mb-2 text-indigo-400 font-bold">
                <Lightbulb className="w-5 h-5" /> Form Cues
              </div>
              <p className="text-sm text-gray-300 leading-relaxed">{exercise.formCues}</p>
            </div>
            <div className="bg-red-950/30 border border-red-900/50 p-4 rounded-xl">
              <div className="flex items-center gap-2 mb-2 text-red-400 font-bold">
                <AlertTriangle className="w-5 h-5" /> Common Mistakes
              </div>
              <p className="text-sm text-gray-300 leading-relaxed">{exercise.mistakes}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
