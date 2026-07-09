"use server";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { calculateMacros } from "@/lib/nutritionEngine";

const prisma = new PrismaClient();
const MOCK_USER_ID = "00000000-0000-0000-0000-000000000000";

// --- DASHBOARD ACTIONS ---
export async function getDashboardData() {
  let user = await prisma.user.findUnique({
    where: { email: "admin@commandcenter.local" },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        id: MOCK_USER_ID,
        email: "admin@commandcenter.local",
        name: "Khaled Rabbah",
        weight: 78.5,
        bodyFat: 18.2,
        targetWeight: 70.0,
        targetBodyFat: 11.0,
      }
    });
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let habits = await prisma.habitLog.findMany({
    where: { userId: user.id, date: { gte: today } }
  });

  if (habits.length === 0) {
    const defaultHabits = ["Morning Prayer (Fajr)", "Read 10 pages of Quran", "Gym Workout", "Study (1 hr)", "Sleep by 11:00 PM"];
    await prisma.habitLog.createMany({
      data: defaultHabits.map(h => ({
        userId: user.id,
        habitType: h,
        date: new Date(),
        completed: false
      }))
    });
    habits = await prisma.habitLog.findMany({
      where: { userId: user.id, date: { gte: today } }
    });
  }

  return { user, habits };
}

export async function toggleHabit(habitId: string, completed: boolean) {
  const MOCK_USER_ID = "00000000-0000-0000-0000-000000000000";
  
  await prisma.habitLog.update({
    where: { id: habitId },
    data: { completed }
  });
  
  // Award XP for completion
  await prisma.user.update({
    where: { id: MOCK_USER_ID },
    data: {
      xp: {
        increment: completed ? 50 : -50
      }
    }
  });
  
  revalidatePath("/");
}

// --- NUTRITION ACTIONS ---
export async function getNutritionData() {
  const user = await prisma.user.findUnique({ where: { id: MOCK_USER_ID } });
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let nutritionLog = await prisma.nutritionLog.findFirst({
    where: { userId: MOCK_USER_ID, date: { gte: today } }
  });

  if (!nutritionLog) {
    nutritionLog = await prisma.nutritionLog.create({
      data: { userId: MOCK_USER_ID, date: new Date() }
    });
  }

  // Calculate dynamic macros using the engine
  const targetMacros = calculateMacros({
    age: 22,
    gender: "male",
    weightKg: user?.weight || 78.5,
    heightCm: 180,
    activityLevel: 1.55,
    goal: "cut"
  });

  return { nutritionLog, targetMacros };
}

export async function logWater(liters: number) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const log = await prisma.nutritionLog.findFirst({
    where: { userId: MOCK_USER_ID, date: { gte: today } }
  });

  if (log) {
    await prisma.nutritionLog.update({
      where: { id: log.id },
      data: { waterLiters: { increment: liters } }
    });
    revalidatePath("/nutrition");
    revalidatePath("/");
  }
}

// --- FITNESS ACTIONS ---
export async function getFitnessData() {
  // Mock data for UI currently
  return {
    streak: 4,
    volume: 12450,
    est1RM: 115
  };
}
