"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Activity, Scale, Target } from "lucide-react";

export default function ProgressPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Progress Tracking</h1>
        <p className="text-gray-400 mt-1">Visualize your 90-day transformation</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Current Weight</CardTitle>
            <Scale className="h-4 w-4 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">78.5 kg</div>
            <p className="text-xs text-green-500 mt-1">-1.5 kg this month</p>
          </CardContent>
        </Card>
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Target Weight</CardTitle>
            <Target className="h-4 w-4 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">70.0 kg</div>
            <p className="text-xs text-gray-500 mt-1">8.5 kg to go</p>
          </CardContent>
        </Card>
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Body Fat %</CardTitle>
            <Activity className="h-4 w-4 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18.2%</div>
            <p className="text-xs text-green-500 mt-1">-0.8% this month</p>
          </CardContent>
        </Card>
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Target BF%</CardTitle>
            <Target className="h-4 w-4 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">11.0%</div>
            <p className="text-xs text-gray-500 mt-1">7.2% to go</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gray-900 border-gray-800 min-h-[400px] flex items-center justify-center">
        <div className="text-center text-gray-500">
          <LineChart className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Chart.js or Recharts implementation will go here</p>
          <p className="text-sm mt-2">Showing Weight & Body Fat trends over time</p>
        </div>
      </Card>
    </div>
  );
}
