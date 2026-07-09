"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { getServerSession } from "@/lib/auth";

export async function getSessionUserId() {
  const session = await getServerSession();
  if (!session?.user?.id) throw new Error("Unauthorized");
  return session.user.id;
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
  await db.user.update({
    where: { id: userId },
    data: { xp: { increment: completed ? 10 : -10 } }
  });

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
  await db.prayerLog.upsert({
    where: { userId_date: { userId, date: dateKey } },
    update: { [prayer]: completed },
    create: { userId, date: dateKey, [prayer]: completed }
  });
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

  await db.reviewLog.upsert({
    where: { userId_date_type: { userId, date: dateKey, type } },
    update: updateData,
    create: { userId, date: dateKey, type, ...updateData }
  });
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

// --- NUTRITION ACTIONS (MOCKS) ---
export async function getNutritionData(dateKey?: string) {
  return { 
    nutritionLog: { waterLiters: 0, calories: 0, protein: 0, carbs: 0, fat: 0 },
    targetMacros: { calories: 2500, protein: 180, carbs: 250, fat: 80 }
  };
}
export async function logWater(dateKey: string, liters: number) {}
