import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Activity, Droplets, Utensils, Moon, Flame } from "lucide-react";
import { HeatmapCalendar } from "@/components/dashboard/HeatmapCalendar";
import { DashboardCalendar } from "@/components/dashboard/DashboardCalendar";
import { HabitGrid } from "@/components/habits/HabitGrid";
import { WeightChart } from "@/components/progress/WeightChart";
import { getDashboardData } from "./actions";
import { HabitRow } from "@/components/dashboard/HabitRow";

export default async function Dashboard() {
  const { user, habits } = await getDashboardData();

  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user.name}</h1>
          <p className="text-gray-400 mt-1">Level {user.level} Titan • {user.xp} XP</p>
        </div>
        <Badge variant="default" className="bg-orange-500 hover:bg-orange-600 text-sm py-1 px-3">
          <Flame className="w-4 h-4 mr-1" />
          {user.streak} Day Streak
        </Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard 
          title="Calories" 
          icon={<Utensils className="h-4 w-4 text-muted-foreground" />} 
          value="1,850" 
          subtitle="of 2,400 kcal"
          progress={77}
          color="bg-blue-500"
        />
        <MetricCard 
          title="Protein" 
          icon={<Utensils className="h-4 w-4 text-muted-foreground" />} 
          value="140g" 
          subtitle="of 160g"
          progress={87}
          color="bg-red-500"
        />
        <MetricCard 
          title="Water" 
          icon={<Droplets className="h-4 w-4 text-muted-foreground" />} 
          value="2.5L" 
          subtitle="of 3.5L"
          progress={71}
          color="bg-cyan-500"
        />
        <MetricCard 
          title="Active Energy" 
          icon={<Activity className="h-4 w-4 text-muted-foreground" />} 
          value="650 kcal" 
          subtitle="Goal: 500 kcal"
          progress={100}
          color="bg-green-500"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="lg:col-span-4">
          <HeatmapCalendar />
        </div>
        <div className="lg:col-span-3">
          <DashboardCalendar />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <WeightChart />
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle>Daily Habits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {habits.map((habit: any) => (
                <HabitRow 
                  key={habit.id} 
                  id={habit.id} 
                  name={habit.habitType} 
                  completed={habit.completed} 
                />
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3 bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle>Next Workout</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              <h3 className="text-xl font-bold text-indigo-400">Pull Day (Hypertrophy)</h3>
              <p className="text-sm text-gray-400 mb-4">Back, Biceps, and Rear Delts</p>
              
              <ul className="space-y-2 text-sm">
                <li className="flex justify-between">
                  <span>Deadlift</span> <span className="text-gray-400">3 x 5-8</span>
                </li>
                <li className="flex justify-between">
                  <span>Lat Pulldown</span> <span className="text-gray-400">3 x 10-12</span>
                </li>
                <li className="flex justify-between">
                  <span>Barbell Row</span> <span className="text-gray-400">3 x 8-10</span>
                </li>
                <li className="flex justify-between">
                  <span>Bicep Curls</span> <span className="text-gray-400">4 x 12-15</span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      <HabitGrid />
    </div>
  );
}

function MetricCard({ title, icon, value, subtitle, progress, color }: any) {
  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {title}
        </CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground mb-4">
          {subtitle}
        </p>
        <Progress value={progress} className={`h-2 ${color}`} />
      </CardContent>
    </Card>
  );
}
