"use client";

import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  BarChart, Bar
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Moon, Dumbbell } from "lucide-react";

export function AnalyticsCharts({ sleepData, workoutData }: { sleepData: any[], workoutData: any[] }) {
  return (
    <div className="grid md:grid-cols-2 gap-6 w-full">
      {/* Workout Volume Chart */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-indigo-400">
            <Dumbbell className="w-5 h-5" /> 
            Workout Volume (14 Days)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={workoutData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="date" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}kg`} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#11141d', border: '1px solid #ffffff20', borderRadius: '8px' }}
                  itemStyle={{ color: '#818cf8' }}
                />
                <Bar dataKey="volume" fill="#4f46e5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Sleep Quality Chart */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-fuchsia-400">
            <Moon className="w-5 h-5" /> 
            Sleep Trends (7 Days)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sleepData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="date" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} domain={[0, 12]} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#11141d', border: '1px solid #ffffff20', borderRadius: '8px' }}
                  itemStyle={{ color: '#e879f9' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="hours" 
                  stroke="#e879f9" 
                  strokeWidth={3}
                  dot={{ fill: '#e879f9', strokeWidth: 2 }}
                  activeDot={{ r: 6, fill: '#f0abfc' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
