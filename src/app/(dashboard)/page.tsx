import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Flame } from "lucide-react";
import { getDashboardData } from "@/app/actions";
import { HabitRow } from "@/components/dashboard/HabitRow";
import { AnalyticsCharts } from "@/components/dashboard/AnalyticsCharts";
import { InsightsEngine } from "@/components/dashboard/InsightsEngine";

export default async function Dashboard() {
  const { user, todayHabits, sleepData, workoutData } = await getDashboardData();

  return (
    <div className="flex flex-col gap-8 w-full pb-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-white mb-2">Welcome back, {user.name}</h1>
          <p className="text-gray-400 font-medium">Level {user.level || 1} Titan • {user.xp || 0} XP</p>
        </div>
        <Badge variant="default" className="bg-orange-500/10 text-orange-400 border border-orange-500/20 hover:bg-orange-500/20 text-sm py-1.5 px-4 font-bold shadow-[0_0_15px_rgba(249,115,22,0.15)]">
          <Flame className="w-4 h-4 mr-1.5" />
          {user.streak || 0} Day Streak
        </Badge>
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-3 gap-6 w-full">
        
        {/* Left Column (Charts & Analytics) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <AnalyticsCharts sleepData={sleepData} workoutData={workoutData} />
          
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-gray-200">Today's Habits</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {todayHabits && todayHabits.length > 0 ? (
                    todayHabits.map((habit: any) => (
                      <HabitRow 
                        key={habit.id} 
                        id={habit.habitId} 
                        name={habit.habitName} 
                        completed={habit.completed} 
                      />
                    ))
                  ) : (
                    <div className="text-center py-6 text-gray-500 text-sm border border-dashed border-gray-800 rounded-lg">
                      No habits tracked today yet.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <InsightsEngine sleepData={sleepData} workoutData={workoutData} />
          </div>
        </div>

        {/* Right Column (Side Panels) */}
        <div className="flex flex-col gap-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-gray-200">Next Workout</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2">
                <h3 className="text-xl font-bold text-neon-fuchsia">Pull Day</h3>
                <p className="text-sm text-gray-400 mb-4">Hypertrophy Focus</p>
                
                <ul className="space-y-3 text-sm font-medium">
                  <li className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-gray-200">Deadlift</span> <span className="text-fuchsia-400">3 x 5-8</span>
                  </li>
                  <li className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-gray-200">Lat Pulldown</span> <span className="text-fuchsia-400">3 x 10-12</span>
                  </li>
                  <li className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-gray-200">Barbell Row</span> <span className="text-fuchsia-400">3 x 8-10</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-200">Bicep Curls</span> <span className="text-fuchsia-400">4 x 12-15</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
