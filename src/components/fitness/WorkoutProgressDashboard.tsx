"use client";

import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Activity, BarChart3, ChevronDown, ChevronUp } from "lucide-react";

interface WorkoutProgressDashboardProps {
  exercises: any[];
}

export function WorkoutProgressDashboard({ exercises }: WorkoutProgressDashboardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [historicalData, setHistoricalData] = useState<Record<string, any[]>>({});
  const [selectedExerciseId, setSelectedExerciseId] = useState<string>("");

  useEffect(() => {
    if (exercises.length > 0 && !selectedExerciseId) {
      setSelectedExerciseId(exercises[0].id);
    }
  }, [exercises, selectedExerciseId]);

  useEffect(() => {
    if (!isOpen) return;

    const data: Record<string, any[]> = {};
    
    // Initialize data structure for each exercise
    exercises.forEach(ex => {
      data[ex.id] = [];
    });

    // Scan local storage for workout logs
    try {
      const keys = Object.keys(window.localStorage);
      const logKeys = keys.filter(k => k.startsWith("fitness_hub_workout_log_"));
      
      // Sort keys by date (oldest to newest)
      logKeys.sort();

      logKeys.forEach(key => {
        const dateStr = key.replace("fitness_hub_workout_log_", "");
        // Format date nicely (e.g., "Jul 9")
        const dateObj = new Date(dateStr);
        const niceDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

        const item = window.localStorage.getItem(key);
        if (item) {
          const parsed = JSON.parse(item);
          exercises.forEach(ex => {
            const exLog = parsed[ex.id];
            if (exLog && exLog.sets && exLog.sets.length > 0) {
              // Find max weight in this session
              let maxWeight = 0;
              let totalVolume = 0;

              exLog.sets.forEach((set: any) => {
                const kg = parseFloat(set.kg) || 0;
                const rep = parseInt(set.rep) || 0;
                if (kg > maxWeight) maxWeight = kg;
                totalVolume += (kg * rep);
              });

              if (maxWeight > 0) {
                data[ex.id].push({
                  date: niceDate,
                  fullDate: dateStr,
                  maxWeight,
                  volume: totalVolume
                });
              }
            }
          });
        }
      });

      setHistoricalData(data);
    } catch (e) {
      console.error("Error reading historical workout logs", e);
    }
  }, [isOpen, exercises]);

  if (!exercises || exercises.length === 0) return null;

  const currentChartData = historicalData[selectedExerciseId] || [];

  return (
    <div className="mt-6 w-full">
      <Button 
        onClick={() => setIsOpen(!isOpen)} 
        variant="outline" 
        className="w-full bg-[#151923] border-gray-800 text-gray-300 hover:text-white hover:bg-gray-800 flex items-center justify-center gap-2 h-12"
      >
        <TrendingUp className="w-5 h-5 text-indigo-400" /> 
        {isOpen ? "Hide Previous Weeks" : "Show Last Weeks Progress"}
        {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </Button>

      {isOpen && (
        <Card className="mt-4 bg-[#1a1f2e] border-gray-800 shadow-xl overflow-hidden animate-in slide-in-from-top-4 duration-300">
          <CardHeader className="bg-[#151923] border-b border-gray-800 pb-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <CardTitle className="text-xl font-bold flex items-center gap-2 text-white">
                <BarChart3 className="w-6 h-6 text-indigo-500" />
                Performance Dashboard
              </CardTitle>
              
              <div className="flex gap-2 overflow-x-auto hide-scrollbar">
                {exercises.map((ex) => (
                  <button
                    key={ex.id}
                    onClick={() => setSelectedExerciseId(ex.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors border ${
                      selectedExerciseId === ex.id
                        ? 'bg-indigo-600 border-indigo-500 text-white'
                        : 'bg-gray-900 border-gray-700 text-gray-400 hover:text-white hover:bg-gray-800'
                    }`}
                  >
                    {ex.name}
                  </button>
                ))}
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-6">
            {currentChartData.length === 0 ? (
              <div className="h-[300px] flex flex-col items-center justify-center text-gray-500 gap-3 border border-dashed border-gray-800 rounded-xl">
                <Activity className="w-12 h-12 text-gray-700" />
                <p>No historical data for this exercise yet.</p>
                <p className="text-xs">Log weights over multiple days to see your progress here.</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                    <div className="text-gray-400 text-xs font-bold uppercase mb-1">Latest Max Weight</div>
                    <div className="text-2xl font-black text-white">
                      {currentChartData[currentChartData.length - 1].maxWeight} <span className="text-sm text-gray-500 font-normal">kg</span>
                    </div>
                  </div>
                  <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                    <div className="text-gray-400 text-xs font-bold uppercase mb-1">Sessions Logged</div>
                    <div className="text-2xl font-black text-indigo-400">
                      {currentChartData.length}
                    </div>
                  </div>
                </div>

                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={currentChartData} margin={{ top: 20, right: 20, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                      <XAxis 
                        dataKey="date" 
                        stroke="#9CA3AF" 
                        tick={{ fill: '#9CA3AF', fontSize: 12 }} 
                        tickMargin={10}
                      />
                      <YAxis 
                        stroke="#9CA3AF" 
                        tick={{ fill: '#9CA3AF', fontSize: 12 }} 
                        tickFormatter={(value) => `${value}kg`}
                      />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', color: '#fff', borderRadius: '8px' }}
                        itemStyle={{ color: '#818CF8', fontWeight: 'bold' }}
                        formatter={(value: any) => [`${value} kg`, 'Max Weight']}
                        labelStyle={{ color: '#9CA3AF', marginBottom: '4px' }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="maxWeight" 
                        stroke="#6366F1" 
                        strokeWidth={4}
                        dot={{ r: 6, fill: '#1F2937', stroke: '#6366F1', strokeWidth: 3 }}
                        activeDot={{ r: 8, fill: '#6366F1', stroke: '#fff' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
