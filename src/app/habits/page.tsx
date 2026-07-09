import { getHabitsRange } from "@/app/actions";
import { HabitsClient } from "@/components/habits/HabitsClient";

const getPast7Days = (endDateString: string) => {
  const endDate = new Date(endDateString);
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(endDate);
    d.setDate(d.getDate() - i);
    days.push(d);
  }
  return days;
};

export default async function HabitsPage({
  searchParams,
}: {
  searchParams: { date?: string };
}) {
  const dateKey = searchParams.date || new Date().toISOString().split("T")[0];
  const past7Days = getPast7Days(dateKey);
  
  const startDateKey = past7Days[0].toISOString().split("T")[0];
  const endDateKey = past7Days[6].toISOString().split("T")[0];

  const initialHabitLogs = await getHabitsRange(startDateKey, endDateKey);

  return <HabitsClient initialHabitLogs={initialHabitLogs} past7Days={past7Days} />;
}