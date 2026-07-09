import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, TrendingUp, AlertTriangle } from "lucide-react";

export function InsightsEngine({ sleepData, workoutData }: { sleepData: any[], workoutData: any[] }) {
  // Simple insight generation logic based on data
  const avgSleep = sleepData.length 
    ? (sleepData.reduce((acc, val) => acc + val.hours, 0) / sleepData.length).toFixed(1)
    : "0";
  
  const totalVolume = workoutData.reduce((acc, val) => acc + val.volume, 0);

  return (
    <Card className="glass-card bg-gradient-to-br from-[#151923]/90 to-[#0d1017]/90 relative overflow-hidden">
      {/* Decorative Blur */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-[50px] pointer-events-none" />
      
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Sparkles className="w-5 h-5 text-amber-400" /> 
          AI Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        
        <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
          <div className="mt-0.5 bg-indigo-500/20 p-1.5 rounded-lg text-indigo-400">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-gray-200">Volume is Up!</h4>
            <p className="text-xs text-gray-400 mt-1">
              You've moved a total of <strong className="text-indigo-400">{totalVolume.toLocaleString()} kg</strong> over the last 14 days. Keep the momentum going!
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
          <div className="mt-0.5 bg-amber-500/20 p-1.5 rounded-lg text-amber-400">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-gray-200">Sleep Recovery</h4>
            <p className="text-xs text-gray-400 mt-1">
              You're averaging <strong className="text-amber-400">{avgSleep} hours</strong> of sleep. Aim for 7.5h minimum to maximize muscle recovery and daily energy.
            </p>
          </div>
        </div>
        
      </CardContent>
    </Card>
  );
}
