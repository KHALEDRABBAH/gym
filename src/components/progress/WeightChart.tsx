"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Mock data, in a real app this would come from the database via props
const data = [
  { date: 'Jan 1', weight: 85 },
  { date: 'Jan 15', weight: 84.2 },
  { date: 'Feb 1', weight: 83.5 },
  { date: 'Feb 15', weight: 82.1 },
  { date: 'Mar 1', weight: 81.5 },
  { date: 'Mar 15', weight: 80.8 },
  { date: 'Apr 1', weight: 80.0 },
];

export function WeightChart() {
  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader>
        <CardTitle>Weight Progress (kg)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <Line 
                type="monotone" 
                dataKey="weight" 
                stroke="#6366f1" 
                strokeWidth={3}
                dot={{ r: 4, fill: "#6366f1", strokeWidth: 2, stroke: "#111827" }}
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
              <CartesianGrid stroke="#1f2937" strokeDasharray="5 5" vertical={false} />
              <XAxis 
                dataKey="date" 
                stroke="#9ca3af" 
                tick={{ fill: '#9ca3af', fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                dy={10}
              />
              <YAxis 
                domain={['dataMin - 2', 'dataMax + 2']} 
                stroke="#9ca3af"
                tick={{ fill: '#9ca3af', fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                dx={-10}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1f2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#f3f4f6'
                }}
                itemStyle={{ color: '#818cf8', fontWeight: 'bold' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
