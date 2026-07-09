import { getSleepLog, getReviewLog } from "@/app/actions";
import { LifestyleClient } from "@/components/lifestyle/LifestyleClient";

export default async function LifestylePage({
  searchParams,
}: {
  searchParams: { date?: string };
}) {
  const dateKey = searchParams.date || new Date().toISOString().split("T")[0];
  
  const initialSleep = await getSleepLog(dateKey);
  const initialReview = await getReviewLog(dateKey, "DAILY");

  return (
    <LifestyleClient 
      dateKey={dateKey} 
      initialSleep={initialSleep} 
      initialReview={initialReview} 
    />
  );
}