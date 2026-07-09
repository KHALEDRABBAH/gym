export const XP_REWARDS = {
  WORKOUT_COMPLETED: 50,
  HABIT_COMPLETED: 10,
  PRAYERS_COMPLETED: 20,
  MEAL_LOGGED: 15,
  SLEEP_LOGGED: 10,
  WATER_GOAL_REACHED: 15,
  JOURNAL_ENTRY: 20,
};

// Calculate required XP for the next level
// Simple curve: Level 1 = 0, Level 2 = 100, Level 3 = 250, Level 4 = 450, Level N = (N-1) * 100 * (1 + (N-2) * 0.5)
export function getXpRequiredForLevel(level: number): number {
  if (level <= 1) return 0;
  return Math.floor((level - 1) * 100 * (1 + (level - 2) * 0.25));
}

// Calculate the current level based on total XP
export function calculateLevelFromXp(xp: number): number {
  let level = 1;
  while (xp >= getXpRequiredForLevel(level + 1)) {
    level++;
  }
  return level;
}

// Calculate how much XP is needed for the next level from the current total
export function getNextLevelProgress(xp: number): { 
  currentLevel: number, 
  currentLevelXp: number, 
  nextLevelXp: number, 
  progressPercentage: number 
} {
  const currentLevel = calculateLevelFromXp(xp);
  const currentLevelBaseXp = getXpRequiredForLevel(currentLevel);
  const nextLevelXp = getXpRequiredForLevel(currentLevel + 1);
  
  const xpIntoCurrentLevel = xp - currentLevelBaseXp;
  const xpNeededForNext = nextLevelXp - currentLevelBaseXp;
  
  const progressPercentage = Math.min(100, Math.max(0, (xpIntoCurrentLevel / xpNeededForNext) * 100));
  
  return {
    currentLevel,
    currentLevelXp: xpIntoCurrentLevel,
    nextLevelXp: xpNeededForNext,
    progressPercentage
  };
}
