import { getNutritionData } from "../actions";
import { NutritionClient } from "@/components/nutrition/NutritionClient";

export default async function NutritionPage({
  searchParams,
}: {
  searchParams: { date?: string }
}) {
  const dateKey = searchParams.date || new Date().toISOString().split('T')[0];
  const { nutritionLog, targetMacros } = await getNutritionData(dateKey);

  return (
    <NutritionClient 
      dateKey={dateKey} 
      nutritionLog={nutritionLog} 
      targetMacros={targetMacros} 
    />
  );
}
