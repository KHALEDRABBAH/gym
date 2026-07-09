"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLocalStorage } from "@/lib/hooks/useLocalStorage";
import { useState } from "react";
import { CheckCircle } from "lucide-react";

export default function SettingsPage() {
  const [name, setName] = useLocalStorage("fitness_hub_name", "Khaled Rabbah");
  const [currentWeight, setCurrentWeight] = useLocalStorage("fitness_hub_current_weight", "78.5");
  const [currentFat, setCurrentFat] = useLocalStorage("fitness_hub_current_fat", "18.2");
  const [targetWeight, setTargetWeight] = useLocalStorage("fitness_hub_target_weight", "70.0");
  const [targetFat, setTargetFat] = useLocalStorage("fitness_hub_target_fat", "11.0");
  
  const [savedStatus, setSavedStatus] = useState(false);

  const handleSave = () => {
    setSavedStatus(true);
    setTimeout(() => setSavedStatus(false), 2000);
  };

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Settings</h1>
        <p className="text-gray-400 mt-1">Manage your profile and preferences</p>
      </div>

      <div className="grid gap-8 max-w-3xl">
        <Card className="bg-gray-900 border-gray-800 text-white">
          <CardHeader>
            <CardTitle>Profile Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium text-gray-400">Name</label>
              <Input 
                value={name} 
                onChange={e => setName(e.target.value)} 
                className="bg-gray-950 border-gray-800 focus:border-indigo-500" 
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium text-gray-400">Email</label>
              <Input type="email" value="khaled@example.com" disabled className="bg-gray-950 border-gray-800 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800 text-white">
          <CardHeader>
            <CardTitle>Fitness Goals & Metrics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium text-gray-400">Current Weight (kg)</label>
                <Input 
                  type="number" 
                  value={currentWeight} 
                  onChange={e => setCurrentWeight(e.target.value)}
                  className="bg-gray-950 border-gray-800 focus:border-indigo-500" 
                />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium text-gray-400">Current Body Fat (%)</label>
                <Input 
                  type="number" 
                  value={currentFat} 
                  onChange={e => setCurrentFat(e.target.value)}
                  className="bg-gray-950 border-gray-800 focus:border-indigo-500" 
                />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium text-gray-400">Target Weight (kg)</label>
                <Input 
                  type="number" 
                  value={targetWeight} 
                  onChange={e => setTargetWeight(e.target.value)}
                  className="bg-gray-950 border-gray-800 focus:border-indigo-500" 
                />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium text-gray-400">Target Body Fat (%)</label>
                <Input 
                  type="number" 
                  value={targetFat} 
                  onChange={e => setTargetFat(e.target.value)}
                  className="bg-gray-950 border-gray-800 focus:border-indigo-500" 
                />
              </div>
            </div>
            <Button onClick={handleSave} className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition-colors">
              {savedStatus && <CheckCircle className="w-4 h-4 mr-2" />}
              {savedStatus ? "Saved Successfully" : "Save Goals"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
