"use client";

import { useState, useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Coffee, Save, Loader2 } from "lucide-react";
import { updateNutritionLog } from "@/app/actions";
import { WaterLogger } from "./WaterLogger";
import { MEAL_PLAN, SUPPLEMENTS } from "@/lib/data/courses";

export function NutritionClient({ dateKey, nutritionLog, targetMacros }: any) {
  const [isPending, startTransition] = useTransition();
  const [isEditing, setIsEditing] = useState(false);
  const [macros, setMacros] = useState({
    calories: nutritionLog.calories,
    protein: nutritionLog.protein,
    carbs: nutritionLog.carbs,
    fat: nutritionLog.fat,
  });

  const handleSave = () => {
    startTransition(() => {
      updateNutritionLog(dateKey, macros);
      setIsEditing(false);
    });
  };

  return (
    <div className="flex flex-col gap-8 pb-12">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black tracking-tight">Nutrition Engine</h1>
          <p className="text-gray-400 mt-1 font-medium">Science-based macro tracking & Meal Plans</p>
        </div>
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)} className="bg-indigo-600 hover:bg-indigo-500 font-bold rounded-xl shadow-[0_0_15px_rgba(79,70,229,0.3)]">
            <Plus className="w-4 h-4 mr-2" /> Log Meal
          </Button>
        ) : (
          <Button onClick={handleSave} disabled={isPending} className="bg-emerald-600 hover:bg-emerald-500 font-bold rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.3)]">
            {isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />} Save Macros
          </Button>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <MacroCard 
          title="Calories" 
          current={macros.calories} 
          target={targetMacros.calories} 
          color="from-blue-500 to-indigo-500" 
          unit="kcal" 
          isEditing={isEditing}
          onChange={(val: number) => setMacros({...macros, calories: val})}
        />
        <MacroCard 
          title="Protein" 
          current={macros.protein} 
          target={targetMacros.protein} 
          color="from-red-500 to-orange-500" 
          unit="g" 
          isEditing={isEditing}
          onChange={(val: number) => setMacros({...macros, protein: val})}
        />
        <MacroCard 
          title="Carbs" 
          current={macros.carbs} 
          target={targetMacros.carbs} 
          color="from-orange-500 to-amber-500" 
          unit="g" 
          isEditing={isEditing}
          onChange={(val: number) => setMacros({...macros, carbs: val})}
        />
        <MacroCard 
          title="Fats" 
          current={macros.fat} 
          target={targetMacros.fat} 
          color="from-yellow-500 to-emerald-500" 
          unit="g" 
          isEditing={isEditing}
          onChange={(val: number) => setMacros({...macros, fat: val})}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-2 glass-card row-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Coffee className="w-5 h-5 text-indigo-400" />
              Recommended Meal Plan (150g Protein)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {MEAL_PLAN.map((meal, idx) => (
              <div key={idx} className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:border-indigo-500/30 transition-colors">
                <div className="mb-2 md:mb-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-black text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded uppercase tracking-wider" dangerouslySetInnerHTML={{ __html: meal.time }}></span>
                    <h4 className="font-bold text-white text-lg" dangerouslySetInnerHTML={{ __html: meal.name }}></h4>
                  </div>
                  <p className="text-sm text-gray-400 whitespace-pre-line" dangerouslySetInnerHTML={{ __html: meal.items }}></p>
                </div>
                <div className="text-left md:text-right bg-black/40 p-2 rounded-lg border border-white/5">
                  <span className="text-xs text-gray-400 font-bold whitespace-pre-line" dangerouslySetInnerHTML={{ __html: meal.macros }}></span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <WaterLogger currentWater={nutritionLog.waterLiters} dateKey={dateKey} />

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-white">Essential Supplements</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 max-h-[500px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10">
            {SUPPLEMENTS.map((supp, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-white/5 border border-white/5">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-bold text-white text-sm" dangerouslySetInnerHTML={{ __html: supp.name }}></h4>
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded border ${
                    supp.priority.includes('Essential') || supp.priority.includes('أساسي') ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                    supp.priority.includes('Important') || supp.priority.includes('مهم') ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' :
                    'bg-blue-500/10 text-blue-400 border-blue-500/20'
                  }`} dangerouslySetInnerHTML={{ __html: supp.priority }}></span>
                </div>
                <p className="text-xs text-indigo-400 font-bold mb-1" dangerouslySetInnerHTML={{ __html: supp.dose }}></p>
                <p className="text-xs text-gray-400 leading-relaxed" dangerouslySetInnerHTML={{ __html: supp.why }}></p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function MacroCard({ title, current, target, color, unit, isEditing, onChange }: any) {
  const percent = Math.min((current / target) * 100, 100);
  return (
    <Card className="glass-card overflow-hidden relative">
      {/* Decorative gradient */}
      <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${color} opacity-10 rounded-full blur-[40px] pointer-events-none`} />
      
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-bold text-gray-400 uppercase tracking-wider">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-2 mb-3">
          {isEditing ? (
            <Input 
              type="number" 
              value={current} 
              onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
              className="w-20 bg-black/40 border-white/10 text-white font-bold h-8"
            />
          ) : (
            <span className="text-3xl font-black text-white">{current}</span>
          )}
          <span className="text-sm font-bold text-gray-500">/ {target} {unit}</span>
        </div>
        <Progress value={percent} className={`h-2 bg-black/50 [&>div]:bg-gradient-to-r [&>div]:${color.replace('from-', 'from-').replace('to-', 'to-')}`} />
      </CardContent>
    </Card>
  );
}
