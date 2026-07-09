"use client";

import { useState } from "react";
import { FolderHeart, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { EXERCISE_DB } from "@/lib/data/exercises";
import { WorkoutList } from "@/components/fitness/WorkoutList";
import { Badge } from "@/components/ui/badge";

export default function ExerciseLibraryPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all"); // 'all', 'chest', 'back', 'legs', 'shoulders'

  const allExercises = Object.entries(EXERCISE_DB).map(([key, value]) => ({
    id: key,
    ...value
  }));

  const filteredExercises = allExercises.filter(ex => {
    const matchesSearch = ex.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === "all" || ex.tags.includes(filter);
    return matchesSearch && matchesFilter;
  });

  const categories = ['all', 'chest', 'back', 'legs', 'shoulders'];

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12 w-full text-white">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white flex items-center gap-3">
            <FolderHeart className="w-8 h-8 text-pink-500" /> Exercise Library
          </h1>
          <p className="text-gray-400 mt-1">Browse and learn from our comprehensive exercise database.</p>
        </div>
        <div className="relative max-w-xs w-full">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <Input 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search exercises..."
            className="bg-[#151923] border-gray-800 pl-10 text-white"
          />
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map(cat => (
          <button 
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-2 rounded-xl text-sm font-bold uppercase transition-colors whitespace-nowrap ${
              filter === cat 
                ? 'bg-pink-600 text-white shadow-lg shadow-pink-500/20' 
                : 'bg-[#151923] border border-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="bg-[#151923] p-6 rounded-2xl border border-gray-800 shadow-xl">
        <WorkoutList exercises={filteredExercises} />
        {filteredExercises.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No exercises found matching your criteria.
          </div>
        )}
      </div>
    </div>
  );
}