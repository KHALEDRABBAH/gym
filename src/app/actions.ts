"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { getServerSession } from "@/lib/auth";

import { redirect } from "next/navigation";

export async function getSessionUserId() {
  const session = await getServerSession();
  if (!session?.user?.id) redirect("/welcome");
  return session.user.id;
}

// --- GAMIFICATION HELPERS ---
import { calculateLevelFromXp, XP_REWARDS } from "@/lib/gamification";

export async function awardXP(userId: string, amount: number) {
  const user = await db.user.findUnique({ where: { id: userId } });
  if (!user) return;
  
  const newXp = Math.max(0, user.xp + amount);
  const newLevel = calculateLevelFromXp(newXp);
  
  await db.user.update({
    where: { id: userId },
    data: { xp: newXp, level: newLevel }
  });
}

// --- DAILY TASKS ACTIONS ---
export async function getDailyTasks(dateKey: string) {
  const userId = await getSessionUserId();
  return db.dailyTask.findMany({
    where: { userId, date: dateKey },
    orderBy: { id: 'asc' }
  });
}

export async function addDailyTask(dateKey: string, title: string, category: string = "General") {
  const userId = await getSessionUserId();
  const task = await db.dailyTask.create({
    data: { userId, date: dateKey, title, category, completed: false }
  });
  revalidatePath("/daily-tasks");
  return task;
}

export async function toggleDailyTask(taskId: string, completed: boolean) {
  const userId = await getSessionUserId();
  await db.dailyTask.updateMany({
    where: { id: taskId, userId },
    data: { completed }
  });
  revalidatePath("/daily-tasks");
}

export async function deleteDailyTask(taskId: string) {
  const userId = await getSessionUserId();
  await db.dailyTask.deleteMany({
    where: { id: taskId, userId }
  });
  revalidatePath("/daily-tasks");
}

// --- HABITS ACTIONS ---
export async function getHabitsRange(startDateKey: string, endDateKey: string) {
  const userId = await getSessionUserId();
  return db.habitLog.findMany({
    where: { 
      userId, 
      date: { gte: startDateKey, lte: endDateKey } 
    }
  });
}

export async function toggleHabit(dateKey: string, habitId: string, habitName: string, completed: boolean) {
  const userId = await getSessionUserId();
  
  await db.habitLog.upsert({
    where: {
      userId_date_habitId: { userId, date: dateKey, habitId }
    },
    update: { completed, habitName },
    create: { userId, date: dateKey, habitId, habitName, completed }
  });

  // Gamification: Give XP
  await awardXP(userId, completed ? XP_REWARDS.HABIT_COMPLETED : -XP_REWARDS.HABIT_COMPLETED);

  revalidatePath("/habits");
  revalidatePath("/");
}

// --- PRAYER ACTIONS ---
export async function getPrayerLog(dateKey: string) {
  const userId = await getSessionUserId();
  let log = await db.prayerLog.findUnique({
    where: { userId_date: { userId, date: dateKey } }
  });

  if (!log) {
    log = await db.prayerLog.create({
      data: { userId, date: dateKey }
    });
  }
  return log;
}

export async function togglePrayer(dateKey: string, prayer: string, completed: boolean) {
  const userId = await getSessionUserId();
  const log = await db.prayerLog.upsert({
    where: { userId_date: { userId, date: dateKey } },
    update: { [prayer]: completed },
    create: { userId, date: dateKey, [prayer]: completed }
  });
  
  // Basic gamification: award XP per prayer
  await awardXP(userId, completed ? (XP_REWARDS.PRAYERS_COMPLETED / 5) : -(XP_REWARDS.PRAYERS_COMPLETED / 5));

  revalidatePath("/prayer");
}

// --- REVIEW ACTIONS ---
export async function getReviewLog(dateKey: string, type: "DAILY" | "WEEKLY") {
  const userId = await getSessionUserId();
  let log = await db.reviewLog.findUnique({
    where: { userId_date_type: { userId, date: dateKey, type } }
  });

  if (!log) {
    log = await db.reviewLog.create({
      data: { userId, date: dateKey, type }
    });
  }
  return log;
}

export async function updateReviewLog(dateKey: string, type: "DAILY" | "WEEKLY", wins: string | null, improvements: string | null, notes: string | null) {
  const userId = await getSessionUserId();
  
  const updateData: any = {};
  if (wins !== null) updateData.wins = wins;
  if (improvements !== null) updateData.improvements = improvements;
  if (notes !== null) updateData.notes = notes;

  const isNew = !await db.reviewLog.findUnique({ where: { userId_date_type: { userId, date: dateKey, type } } });

  await db.reviewLog.upsert({
    where: { userId_date_type: { userId, date: dateKey, type } },
    update: updateData,
    create: { userId, date: dateKey, type, ...updateData }
  });
  
  if (isNew && (wins || improvements || notes)) {
    await awardXP(userId, XP_REWARDS.JOURNAL_ENTRY);
  }
  revalidatePath("/lifestyle");
}

// --- SLEEP ACTIONS ---
export async function getSleepLog(dateKey: string) {
  const userId = await getSessionUserId();
  let log = await db.sleepLog.findUnique({
    where: { userId_date: { userId, date: dateKey } }
  });

  if (!log) {
    log = await db.sleepLog.create({
      data: { userId, date: dateKey }
    });
  }
  return log;
}

export async function updateSleepLog(dateKey: string, hours: number, quality: number) {
  const userId = await getSessionUserId();
  await db.sleepLog.upsert({
    where: { userId_date: { userId, date: dateKey } },
    update: { hours, quality },
    create: { userId, date: dateKey, hours, quality }
  });
  revalidatePath("/lifestyle");
}

// --- DASHBOARD ACTIONS ---
export async function getDashboardData() {
  const userId = await getSessionUserId();
  const dateKey = new Date().toISOString().split("T")[0];

  const user = await db.user.findUnique({ where: { id: userId } });
  
  // Today's Habits
  const todayHabits = await db.habitLog.findMany({
    where: { userId, date: dateKey }
  });

  // Last 7 Days of Sleep
  const last7Days = Array.from({length: 7}, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d.toISOString().split("T")[0];
  }).reverse();

  const sleepLogs = await db.sleepLog.findMany({
    where: { userId, date: { in: last7Days } },
    orderBy: { date: 'asc' }
  });

  const sleepData = last7Days.map(date => {
    const log = sleepLogs.find((l: any) => l.date === date);
    return {
      date: date.slice(5), // MM-DD
      hours: log?.hours || 0,
      quality: log?.quality || 0,
    };
  });

  // Recent Workouts (Last 14 Days)
  const last14Days = Array.from({length: 14}, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d.toISOString().split("T")[0];
  }).reverse();

  const workouts = await db.workoutLog.findMany({
    where: { userId, date: { in: last14Days } },
    include: { exercises: true }
  });

  const workoutData = last14Days.map(date => {
    const log = workouts.find((l: any) => l.date === date);
    let volume = 0;
    if (log && log.exercises) {
      log.exercises.forEach((set: any) => volume += (set.weight * set.reps));
    }
    return {
      date: date.slice(5),
      volume
    };
  });

  return { 
    user: user || { name: 'Guest', streak: 0, xp: 0, level: 1 },
    todayHabits,
    sleepData,
    workoutData
  };
}

// --- WORKOUT ACTIONS ---
export async function getWorkoutLog(dateKey: string) {
  const userId = await getSessionUserId();
  let log = await db.workoutLog.findUnique({
    where: { userId_date: { userId, date: dateKey } },
    include: { exercises: true }
  });

  return log;
}

export async function saveWorkoutSet(dateKey: string, workoutType: string, exerciseId: string, exerciseName: string, setIndex: number, weight: number, reps: number) {
  const userId = await getSessionUserId();
  
  let workout = await db.workoutLog.findUnique({
    where: { userId_date: { userId, date: dateKey } }
  });

  if (!workout) {
    workout = await db.workoutLog.create({
      data: { userId, date: dateKey, workoutType }
    });
    // Gamification: Give XP for starting a workout
    await awardXP(userId, XP_REWARDS.WORKOUT_COMPLETED);
  }

  // Find existing set
  const existingSet = await db.exerciseSet.findFirst({
    where: { workoutLogId: workout.id, exerciseId, setIndex }
  });

  if (existingSet) {
    await db.exerciseSet.update({
      where: { id: existingSet.id },
      data: { weight, reps }
    });
  } else {
    await db.exerciseSet.create({
      data: { workoutLogId: workout.id, exerciseId, exerciseName, setIndex, weight, reps }
    });
  }
}

export async function clearWorkoutLog(dateKey: string) {
  const userId = await getSessionUserId();
  await db.workoutLog.deleteMany({
    where: { userId, date: dateKey }
  });
  revalidatePath("/fitness");
}

export async function getUserProfile() {
  const userId = await getSessionUserId();
  return db.user.findUnique({ where: { id: userId } });
}

// --- NUTRITION ACTIONS ---
export async function getNutritionData(dateKey: string) {
  const userId = await getSessionUserId();
  
  let log = await db.nutritionLog.findUnique({
    where: { userId_date: { userId, date: dateKey } }
  });

  if (!log) {
    log = await db.nutritionLog.create({
      data: { userId, date: dateKey }
    });
  }

  // TODO: Let user customize targets in their profile. Hardcoded for now.
  const targetMacros = { calories: 2500, protein: 180, carbs: 250, fat: 80 };

  return { nutritionLog: log, targetMacros };
}

export async function updateNutritionLog(dateKey: string, data: { calories: number, protein: number, carbs: number, fat: number }) {
  const userId = await getSessionUserId();
  
  await db.nutritionLog.upsert({
    where: { userId_date: { userId, date: dateKey } },
    update: data,
    create: { userId, date: dateKey, ...data }
  });

  // Gamification: Give XP for logging a meal
  await awardXP(userId, XP_REWARDS.MEAL_LOGGED);

  revalidatePath("/nutrition");
  revalidatePath("/");
}

export async function logWater(dateKey: string, liters: number) {
  const userId = await getSessionUserId();
  
  const log = await db.nutritionLog.findUnique({
    where: { userId_date: { userId, date: dateKey } }
  });

  const newWater = Math.max(0, (log?.waterLiters || 0) + liters);

  await db.nutritionLog.upsert({
    where: { userId_date: { userId, date: dateKey } },
    update: { waterLiters: newWater },
    create: { userId, date: dateKey, waterLiters: newWater }
  });

  // Award XP if hit goal (e.g. 3.5L)
  if ((log?.waterLiters || 0) < 3.5 && newWater >= 3.5) {
    await awardXP(userId, XP_REWARDS.WATER_GOAL_REACHED);
  }

  revalidatePath("/nutrition");
  revalidatePath("/");
}
