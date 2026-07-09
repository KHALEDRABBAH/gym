// Advanced Nutrition Engine Algorithm

export interface UserMetrics {
  age: number;
  gender: "male" | "female";
  weightKg: number;
  heightCm: number;
  activityLevel: 1.2 | 1.375 | 1.55 | 1.725 | 1.9;
  goal: "cut" | "maintain" | "bulk";
}

/**
 * Calculates Basal Metabolic Rate (BMR) using the Mifflin-St Jeor Equation
 */
export function calculateBMR(metrics: UserMetrics): number {
  const { weightKg, heightCm, age, gender } = metrics;
  let bmr = 10 * weightKg + 6.25 * heightCm - 5 * age;
  
  if (gender === "male") {
    bmr += 5;
  } else {
    bmr -= 161;
  }
  
  return bmr;
}

/**
 * Calculates Total Daily Energy Expenditure (TDEE)
 */
export function calculateTDEE(metrics: UserMetrics): number {
  const bmr = calculateBMR(metrics);
  return bmr * metrics.activityLevel;
}

/**
 * Calculates optimal Macros based on user goal and TDEE
 * Returns Macros in Grams
 */
export function calculateMacros(metrics: UserMetrics): {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
} {
  const tdee = calculateTDEE(metrics);
  let targetCalories = tdee;

  if (metrics.goal === "cut") {
    targetCalories = tdee - 500; // Standard 500 kcal deficit
  } else if (metrics.goal === "bulk") {
    targetCalories = tdee + 300; // Standard 300 kcal surplus for lean bulk
  }

  // Protein: High for both cut and bulk (approx 2.2g per kg of bodyweight)
  const proteinGrams = metrics.weightKg * 2.2;
  const proteinCalories = proteinGrams * 4;

  // Fat: Approx 25% of total calories
  const fatCalories = targetCalories * 0.25;
  const fatGrams = fatCalories / 9;

  // Carbs: The rest of the calories
  const carbsCalories = targetCalories - proteinCalories - fatCalories;
  const carbsGrams = carbsCalories / 4;

  return {
    calories: Math.round(targetCalories),
    protein: Math.round(proteinGrams),
    carbs: Math.round(carbsGrams),
    fat: Math.round(fatGrams),
  };
}
