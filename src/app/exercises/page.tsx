"use client";

import { useState } from "react";
import { EXERCISE_DB } from "@/lib/data/exercises";
import { ExerciseCard } from "@/components/fitness/ExerciseCard";
import { Button } from "@/components/ui/button";

const CATEGORIES = ["All", "Chest", "Back", "Legs", "Shoulders", "Arms", "Core", "Mobility"];

export default function ExercisesPage() {
  const [activeTab, setActiveTab] = useState("All");

  const exerciseList = Object.entries(EXERCISE_DB).map(([key, value]) => ({
    id: key,
    ...value
  }));

  const filteredExercises = exerciseList.filter(ex => {
    if (activeTab === "All") return true;
    return ex.tags.includes(activeTab.toLowerCase());
  });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">🎬 Exercise Library</h1>
        <p className="text-gray-400">Every exercise with video tutorial, form cues & common mistakes.</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {CATEGORIES.map(cat => (
          <Button
            key={cat}
            variant={activeTab === cat ? "default" : "outline"}
            className={activeTab === cat ? "bg-indigo-600 hover:bg-indigo-700" : "bg-transparent border-gray-800 hover:bg-gray-800 text-gray-300"}
            onClick={() => setActiveTab(cat)}
          >
            {cat}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredExercises.map(ex => (
          <ExerciseCard key={ex.id} exercise={ex} />
        ))}
      </div>
    </div>
  );
}
