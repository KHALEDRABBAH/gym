"use client";

import { X, PlayCircle, Check, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ExerciseModalProps {
  exercise: any;
  onClose: () => void;
}

export function ExerciseModal({ exercise, onClose }: ExerciseModalProps) {
  if (!exercise) return null;

  const formCues = exercise.formCues ? exercise.formCues.split('.').filter((c: string) => c.trim()) : [];
  const mistakes = exercise.mistakes ? exercise.mistakes.split('.').filter((c: string) => c.trim()) : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose}>
      <div 
        className="bg-[#151923] border border-gray-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl relative animate-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()} // Prevent clicking inside from closing
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-gray-800 rounded-full text-gray-400 hover:text-white transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Video Player Placeholder */}
        <div className="w-full aspect-video bg-gray-900 relative">
          <img 
            src={`https://img.youtube.com/vi/${exercise.videoId}/maxresdefault.jpg`} 
            onError={(e) => e.currentTarget.src = `https://img.youtube.com/vi/${exercise.videoId}/hqdefault.jpg`}
            alt={exercise.name} 
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <a 
              href={`https://youtube.com/watch?v=${exercise.videoId}`}
              target="_blank"
              rel="noreferrer"
              className="p-4 bg-black/60 rounded-full hover:bg-red-600/90 hover:scale-110 transition-all text-white backdrop-blur-md"
            >
              <PlayCircle className="w-12 h-12" />
            </a>
          </div>
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-[#151923] to-transparent h-24" />
        </div>

        <div className="p-6">
          <h2 className="text-2xl font-black text-white mb-6">{exercise.name}</h2>
          
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-2 gap-4 mb-8">
            <div className="bg-[#1a1f2e] border border-gray-800 p-4 rounded-xl">
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">SETS × REPS</p>
              <p className="font-bold text-white text-lg">{exercise.sets}</p>
            </div>
            <div className="bg-[#1a1f2e] border border-gray-800 p-4 rounded-xl">
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">REST</p>
              <p className="font-bold text-white text-lg">{exercise.rest}</p>
            </div>
            <div className="bg-[#1a1f2e] border border-gray-800 p-4 rounded-xl">
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">TEMPO</p>
              <p className="font-bold text-white text-lg">{exercise.tempo || 'Control'}</p>
            </div>
            <div className="bg-[#1a1f2e] border border-gray-800 p-4 rounded-xl">
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">MUSCLES</p>
              <p className="font-bold text-white text-lg">{exercise.muscle}</p>
            </div>
            <div className="bg-[#1a1f2e] border border-gray-800 p-4 rounded-xl">
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">TYPE</p>
              <p className="font-bold text-white text-lg capitalize">{exercise.type}</p>
            </div>
            <div className="bg-[#1a1f2e] border border-gray-800 p-4 rounded-xl">
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">CHANNEL</p>
              <p className="font-bold text-white text-lg">{exercise.channel}</p>
            </div>
          </div>

          {/* Form Cues */}
          {formCues.length > 0 && (
            <div className="mb-6">
              <h3 className="flex items-center gap-2 font-bold text-emerald-500 mb-4">
                <Check className="w-5 h-5 bg-emerald-500/20 rounded text-emerald-400" />
                Form Cues
              </h3>
              <div className="space-y-2">
                {formCues.map((cue: string, idx: number) => (
                  <div key={idx} className="bg-[#1a1f2e] border-l-2 border-emerald-500 p-3 pl-4 rounded-r-lg text-gray-300 flex items-start gap-3 text-sm">
                    <span className="text-emerald-500 font-mono mt-0.5">✓</span>
                    {cue.trim()}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Common Mistakes */}
          {mistakes.length > 0 && (
            <div>
              <h3 className="flex items-center gap-2 font-bold text-red-500 mb-4">
                <XCircle className="w-5 h-5 bg-red-500/20 rounded text-red-400" />
                Common Mistakes
              </h3>
              <div className="space-y-2">
                {mistakes.map((mistake: string, idx: number) => (
                  <div key={idx} className="bg-[#24171d] border-l-2 border-red-500 p-3 pl-4 rounded-r-lg text-gray-300 flex items-start gap-3 text-sm">
                    <span className="text-red-500 font-mono mt-0.5">✕</span>
                    {mistake.trim()}
                  </div>
                ))}
              </div>
            </div>
          )}
          
        </div>
      </div>
    </div>
  );
}
