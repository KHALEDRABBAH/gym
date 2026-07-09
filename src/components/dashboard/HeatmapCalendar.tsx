"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// Generate 90 days of mock data for the heatmap
const generateHeatmapData = () => {
  const data = [];
  const today = new Date();
  
  for (let i = 89; i >= 0; i--) {
    const date = new Date();
    date.setDate(today.getDate() - i);
    // Deterministic mock level based on index to avoid hydration mismatch
    const level = (i * 7) % 5;
    data.push({
      date: date.toISOString().split('T')[0],
      level: level
    });
  }
  return data;
};

const MOCK_DATA = generateHeatmapData();

const LEVEL_COLORS = [
  "bg-gray-800",                // 0: None
  "bg-emerald-900/40",          // 1: Low
  "bg-emerald-700/60",          // 2: Medium-Low
  "bg-emerald-500",             // 3: Medium-High
  "bg-emerald-400 shadow-glow"  // 4: High
];

export function HeatmapCalendar() {
  return (
    <Card className="bg-gray-900 border-gray-800 col-span-full">
      <CardHeader>
        <CardTitle>Consistency Heatmap (Last 90 Days)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-1 max-w-full overflow-hidden justify-start">
          <TooltipProvider delay={100}>
            {MOCK_DATA.map((day, i) => (
              <Tooltip key={i}>
                <TooltipTrigger>
                  <div 
                    className={cn(
                      "w-4 h-4 rounded-sm transition-transform hover:scale-125 cursor-pointer",
                      LEVEL_COLORS[day.level]
                    )}
                  />
                </TooltipTrigger>
                <TooltipContent className="bg-gray-800 border-gray-700 text-xs">
                  <p className="font-bold text-white">{day.date}</p>
                  <p className="text-gray-400">Activity Level: {day.level}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </TooltipProvider>
        </div>
        <div className="flex items-center gap-2 mt-4 text-xs text-gray-500 justify-end w-full pr-4">
          <span>Less</span>
          {LEVEL_COLORS.map((color, i) => (
            <div key={i} className={cn("w-3 h-3 rounded-sm", color)} />
          ))}
          <span>More</span>
        </div>
      </CardContent>
    </Card>
  );
}
