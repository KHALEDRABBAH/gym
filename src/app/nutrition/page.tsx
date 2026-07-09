import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Plus, Coffee } from "lucide-react";
import { getNutritionData } from "../actions";
import { WaterLogger } from "../../components/nutrition/WaterLogger";
import { MEAL_PLAN, GROCERY_LIST, SUPPLEMENTS } from "@/lib/data/courses";

export default async function NutritionPage() {
  const { nutritionLog, targetMacros } = await getNutritionData();

  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Nutrition Engine</h1>
          <p className="text-gray-400 mt-1">Science-based macro tracking & Meal Plans</p>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-700">
          <Plus className="w-4 h-4 mr-2" /> Log Meal
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <MacroCard 
          title="Calories" 
          current={nutritionLog.calories} 
          target={targetMacros.calories} 
          color="bg-blue-500" 
          unit="kcal" 
        />
        <MacroCard 
          title="Protein" 
          current={nutritionLog.protein} 
          target={targetMacros.protein} 
          color="bg-red-500" 
          unit="g" 
        />
        <MacroCard 
          title="Carbs" 
          current={nutritionLog.carbs} 
          target={targetMacros.carbs} 
          color="bg-orange-500" 
          unit="g" 
        />
        <MacroCard 
          title="Fats" 
          current={nutritionLog.fat} 
          target={targetMacros.fat} 
          color="bg-yellow-500" 
          unit="g" 
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-2 bg-gray-900 border-gray-800 row-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Coffee className="w-5 h-5 text-indigo-400" />
              Recommended Meal Plan (150g Protein)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {MEAL_PLAN.map((meal, idx) => (
              <div key={idx} className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-xl bg-gray-950 border border-gray-800 hover:border-gray-700 transition-colors">
                <div className="mb-2 md:mb-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-indigo-400 bg-indigo-950 px-2 py-0.5 rounded uppercase tracking-wider" dangerouslySetInnerHTML={{ __html: meal.time }}></span>
                    <h4 className="font-bold text-white text-lg" dangerouslySetInnerHTML={{ __html: meal.name }}></h4>
                  </div>
                  <p className="text-sm text-gray-400 whitespace-pre-line" dangerouslySetInnerHTML={{ __html: meal.items }}></p>
                </div>
                <div className="text-left md:text-right bg-gray-900 p-2 rounded-lg border border-gray-800">
                  <span className="text-xs text-gray-400 font-medium whitespace-pre-line" dangerouslySetInnerHTML={{ __html: meal.macros }}></span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <WaterLogger currentWater={nutritionLog.waterLiters} />

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle>Essential Supplements</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
            {SUPPLEMENTS.map((supp, idx) => (
              <div key={idx} className="p-3 rounded-lg bg-gray-950 border border-gray-800">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-bold text-white text-sm" dangerouslySetInnerHTML={{ __html: supp.name }}></h4>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    supp.priority.includes('Essential') || supp.priority.includes('أساسي') ? 'bg-red-900/50 text-red-400' :
                    supp.priority.includes('Important') || supp.priority.includes('مهم') ? 'bg-orange-900/50 text-orange-400' :
                    'bg-blue-900/50 text-blue-400'
                  }`} dangerouslySetInnerHTML={{ __html: supp.priority }}></span>
                </div>
                <p className="text-xs text-indigo-400 font-medium mb-1" dangerouslySetInnerHTML={{ __html: supp.dose }}></p>
                <p className="text-xs text-gray-400 leading-relaxed" dangerouslySetInnerHTML={{ __html: supp.why }}></p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function MacroCard({ title, current, target, color, unit }: any) {
  const percent = Math.min((current / target) * 100, 100);
  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm text-gray-400">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-1 mb-3">
          <span className="text-3xl font-bold text-white">{current}</span>
          <span className="text-sm text-gray-400">/ {target} {unit}</span>
        </div>
        <Progress value={percent} className={`h-2 ${color}`} />
      </CardContent>
    </Card>
  );
}
