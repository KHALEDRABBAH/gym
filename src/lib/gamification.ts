export const LEVEL_THRESHOLDS = [
  0,      // Level 1
  100,    // Level 2
  300,    // Level 3
  600,    // Level 4
  1000,   // Level 5
  1500,   // Level 6
  2100,   // Level 7
  2800,   // Level 8
  3600,   // Level 9
  4500,   // Level 10
  5500,   // Level 11
  6600,   // Level 12
  7800,   // Level 13
  9100,   // Level 14
  10500,  // Level 15 (Max in standard logic)
];

export const XP_REWARDS = {
  HABIT_COMPLETED: 50,
  WORKOUT_COMPLETED: 200,
  MEAL_LOGGED: 25,
  WATER_LOGGED: 10,
  STUDY_SESSION: 100,
  STREAK_BONUS: 50
};

export function getLevelFromXP(xp: number): number {
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= LEVEL_THRESHOLDS[i]) {
      return i + 1;
    }
  }
  return 1;
}

export function getXPForNextLevel(currentLevel: number): number {
  if (currentLevel >= LEVEL_THRESHOLDS.length) {
    return LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1] + 2000; // Arbitrary max level gap
  }
  return LEVEL_THRESHOLDS[currentLevel];
}

export function getLevelTitle(level: number): string {
  if (level < 3) return "Novice";
  if (level < 6) return "Apprentice";
  if (level < 10) return "Warrior";
  if (level < 15) return "Master";
  return "Titan";
}
