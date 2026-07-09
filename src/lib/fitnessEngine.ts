// Advanced Fitness Engine Algorithm

export interface UserStats {
  bodyWeight: number;
  bodyFatPercentage: number;
  experienceLevel: "beginner" | "intermediate" | "advanced";
}

export interface ExerciseSet {
  reps: number;
  weight: number;
  rpe?: number; // Rate of Perceived Exertion (1-10)
}

/**
 * Calculates Estimated 1 Rep Max (1RM) using the Epley formula
 * 1RM = Weight * (1 + 0.0333 * Reps)
 */
export function calculate1RM(weight: number, reps: number): number {
  if (reps === 1) return weight;
  return Math.round(weight * (1 + 0.0333 * reps) * 10) / 10;
}

/**
 * Calculates progressive overload recommendation for the next session
 * Rules:
 * - If user hit target reps across all sets with RPE < 8, increase weight by 2.5% or 2.5kg.
 * - If user failed target reps, keep weight and focus on hitting reps.
 */
export function suggestNextSessionLoad(
  currentWeight: number,
  completedSets: ExerciseSet[],
  targetReps: number
): { recommendedWeight: number; notes: string } {
  const allSetsHitTarget = completedSets.every((set) => set.reps >= targetReps);
  const avgRPE = completedSets.reduce((acc, set) => acc + (set.rpe || 8), 0) / completedSets.length;

  if (allSetsHitTarget && avgRPE < 9) {
    const increment = currentWeight > 50 ? 2.5 : 1.25; // Smaller jumps for upper body/lower weights
    return {
      recommendedWeight: currentWeight + increment,
      notes: "Target achieved. Increase weight.",
    };
  }

  if (!allSetsHitTarget) {
    return {
      recommendedWeight: currentWeight,
      notes: "Did not hit rep target. Maintain weight and push for reps.",
    };
  }

  return {
    recommendedWeight: currentWeight,
    notes: "Target hit but RPE is high. Maintain weight to focus on form.",
  };
}

/**
 * Calculates total volume for a workout session
 */
export function calculateSessionVolume(sets: ExerciseSet[]): number {
  return sets.reduce((total, set) => total + set.reps * set.weight, 0);
}
