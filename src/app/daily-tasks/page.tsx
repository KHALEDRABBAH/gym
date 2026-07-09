import { getDailyTasks } from "@/app/actions";
import { DailyTasksClient } from "@/components/daily-tasks/DailyTasksClient";

export default async function DailyTasksPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const { date } = await searchParams;
  const dateKey = date || new Date().toISOString().split("T")[0];
  const initialTasks = await getDailyTasks(dateKey);

  return <DailyTasksClient initialTasks={initialTasks} dateKey={dateKey} />;
}