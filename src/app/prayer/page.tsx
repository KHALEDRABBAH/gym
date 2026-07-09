import { getPrayerLog } from "@/app/actions";
import { PrayerClient } from "@/components/prayer/PrayerClient";

const getWeekDays = () => {
  const days = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() - d.getDay() + 1 + i); // Monday start
    days.push(d);
  }
  return days;
};

export default async function PrayerPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const { date } = await searchParams;
  const dateKey = date || new Date().toISOString().split("T")[0];
  const initialLog = await getPrayerLog(dateKey);
  const weekDays = getWeekDays();

  return <PrayerClient initialLog={initialLog} dateKey={dateKey} weekDays={weekDays} />;
}
