import { EXERCISE_DB, WORKOUT_SCHEDULE } from "@/lib/data/exercises";
import { ExerciseCard } from "@/components/fitness/ExerciseCard";
import { WorkoutList } from "@/components/fitness/WorkoutList";
import { WorkoutLogClient } from "@/components/fitness/WorkoutLogClient";
import { WorkoutProgressDashboard } from "@/components/fitness/WorkoutProgressDashboard";
import { Card, CardContent } from "@/components/ui/card";
import { getWorkoutLog } from "@/app/actions";

export default async function FitnessPage({
  searchParams,
}: {
  searchParams: { date?: string };
}) {
  const dateKey = searchParams.date || new Date().toISOString().split("T")[0];
  const selectedDate = new Date(dateKey);
  
  const dayIndex = selectedDate.getDay();
  const schedule = WORKOUT_SCHEDULE[dayIndex as keyof typeof WORKOUT_SCHEDULE];
  
  if (!schedule) return null;

  const exercises = schedule.exerciseKeys.map(key => ({
    id: key,
    ...EXERCISE_DB[key as keyof typeof EXERCISE_DB]
  })).filter(ex => ex.name);

  let bannerSrc = "";
  if (schedule.name.includes("Upper")) bannerSrc = "/images/workouts/workout_upper_day_1781645066563.png";
  else if (schedule.name.includes("Lower")) bannerSrc = "/images/workouts/workout_lower_day_1781645076445.png";
  else if (schedule.name.includes("Push")) bannerSrc = "/images/workouts/workout_push_day_1781645037838.png";
  else if (schedule.name.includes("Pull")) bannerSrc = "/images/workouts/workout_pull_day_1781645047645.png";
  else if (schedule.name.includes("Legs")) bannerSrc = "/images/workouts/workout_leg_day_1781645057302.png";

  const scheduleNameText = schedule.name.replace(/<[^>]+>/g, '').replace(/.*?(?=Upper|Lower|REST|Pull|Push|Legs)/, '');
  const cleanName = scheduleNameText.split('الجزء')[0].split('سحب')[0].split('دفع')[0].split('رجل')[0].split('يوم')[0].trim();

  // Fetch db workout log
  const workoutLogData = await getWorkoutLog(dateKey);

  return (
    <div className="flex flex-col gap-8 pb-12">
      {bannerSrc && (
        <div className="w-full rounded-2xl overflow-hidden relative shadow-lg shrink-0 bg-[#0d1117]">
          <img src={bannerSrc} alt="Workout Banner" className="w-full h-auto object-contain" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#11141d] via-transparent to-transparent flex flex-col justify-end p-6">
            <p className="text-indigo-400 font-bold mb-1 tracking-wider uppercase text-sm drop-shadow-md">Today's Protocol • {schedule.type}</p>
            <h1 className="text-2xl md:text-4xl font-black text-white drop-shadow-lg" dangerouslySetInnerHTML={{ __html: schedule.name }}></h1>
          </div>
        </div>
      )}

      {!bannerSrc && (
        <div className="bg-indigo-900/30 border border-indigo-500/30 p-6 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <p className="text-indigo-400 font-bold mb-1 tracking-wider uppercase text-sm">Today's Protocol • {schedule.type}</p>
            <h1 className="text-3xl font-black text-white" dangerouslySetInnerHTML={{ __html: schedule.name }}></h1>
          </div>
          <div className="bg-black/40 px-4 py-2 rounded-lg text-sm text-gray-300">
            <strong>{exercises.length}</strong> Exercises Scheduled
          </div>
        </div>
      )}

      {exercises.length === 0 ? (
        <Card className="bg-gray-900 border-gray-800 border-dashed mt-4">
          <CardContent className="flex items-center justify-center p-12 text-gray-500">
            No specific exercises mapped for today. Enjoy your rest!
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="mt-2">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span>🏋️</span> 
                <span className="en-only">Today's Workout</span>
                <span className="ar-only">تمرين اليوم</span>
              </div>
              <div className="text-sm font-normal text-gray-400">
                {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })} — <span dangerouslySetInnerHTML={{ __html: schedule.name.split('—')[1] || cleanName }}></span>
              </div>
            </h2>
            
            <WorkoutList exercises={exercises} />
            <WorkoutLogClient exercises={exercises} initialLog={workoutLogData} dateKey={dateKey} scheduleType={schedule.name} />
            {/* Keeping progress dashboard as is for now, although it will need real data later */}
            <WorkoutProgressDashboard exercises={exercises} />
          </div>

          <div className="mt-8 pt-8 border-t border-gray-800/50">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <span>🎬</span> Today's Exercise Tutorials — Watch Before You Lift
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {exercises.map((ex) => (
                <ExerciseCard key={`card-${ex.id}`} exercise={ex} />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
