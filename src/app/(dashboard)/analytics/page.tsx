"use client";

import { PieChart as PieIcon, TrendingUp, Activity, Target } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar } from "recharts";

const XP_DATA = [
  { name: 'Mon', xp: 400 },
  { name: 'Tue', xp: 300 },
  { name: 'Wed', xp: 550 },
  { name: 'Thu', xp: 450 },
  { name: 'Fri', xp: 700 },
  { name: 'Sat', xp: 200 },
  { name: 'Sun', xp: 600 },
];

const HABIT_DATA = [
  { name: 'Water', completed: 6, missed: 1 },
  { name: 'Read', completed: 4, missed: 3 },
  { name: 'Workout', completed: 5, missed: 2 },
  { name: 'Code', completed: 7, missed: 0 },
];

export default function AnalyticsPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12 w-full text-white">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white flex items-center gap-3">
            <PieIcon className="w-8 h-8 text-blue-500" /> Analytics
          </h1>
          <p className="text-gray-400 mt-1">Deep dive into your performance metrics.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="bg-[#151923] border-gray-800">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-500">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Total XP Gained</p>
              <h3 className="text-2xl font-bold text-white">3,200</h3>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[#151923] border-gray-800">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Workout Consistency</p>
              <h3 className="text-2xl font-bold text-white">85%</h3>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[#151923] border-gray-800">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-500">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Habit Completion</p>
              <h3 className="text-2xl font-bold text-white">92%</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-[#151923] border-gray-800">
          <CardHeader>
            <CardTitle className="text-lg">Weekly XP Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={XP_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorXp" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" stroke="#4b5563" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#4b5563" fontSize={12} tickLine={false} axisLine={false} />
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '8px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Area type="monotone" dataKey="xp" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorXp)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#151923] border-gray-800">
          <CardHeader>
            <CardTitle className="text-lg">Habit Consistency</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={HABIT_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                  <XAxis dataKey="name" stroke="#4b5563" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#4b5563" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '8px' }}
                  />
                  <Bar dataKey="completed" stackId="a" fill="#10b981" radius={[0, 0, 4, 4]} />
                  <Bar dataKey="missed" stackId="a" fill="#ef4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}