"use client";

import { 
  Map, Target, Flame, Calendar, Activity, 
  AlertTriangle, ShieldAlert, BookOpen, Plane, HeartPulse, Clock
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const PHASES = [
  {
    title: "Phase 1: 17.6% → 15% Body Fat",
    duration: "Weeks 1-4",
    calories: "2100 cal (slight deficit)",
    training: "Full body adaptation, learn proper form, build neural connections",
    visuals: "Slight face leanness, clothes fit better, love handles start shrinking",
    indicators: "Consistent gym attendance, strength increasing each session, weight trending down 0.3-0.5kg/week",
    color: "blue"
  },
  {
    title: "Phase 2: 15% → 13% Body Fat",
    duration: "Weeks 5-8",
    calories: "2000 cal (moderate deficit)",
    training: "PPL split fully engaged, increase weight weekly, add cardio 2x/week",
    visuals: "Visible arm veins, face looks leaner, upper abs starting to show, V-taper forming",
    indicators: "Lifts increasing 5-10% monthly, waist measurement dropping, energy stable",
    color: "indigo"
  },
  {
    title: "Phase 3: 13% → 11% Body Fat",
    duration: "Weeks 9-12",
    calories: "1900-2000 cal (controlled deficit)",
    training: "Higher volume, more isolation work, HIIT 1-2x/week, progressive overload continues",
    visuals: "Clear 4-pack abs, chest striations, shoulder caps visible, athletic V-taper, arm definition",
    indicators: "Strength maintained or slowly increasing, abs visible in mirror, motivation high from results",
    color: "purple"
  },
  {
    title: "Phase 4: 11% → 10% Body Fat",
    duration: "Weeks 12-14 (optional push)",
    calories: "1850-1900 cal (aggressive but safe)",
    training: "Maintain intensity, reduce volume slightly, prioritize recovery",
    visuals: "Full 6-pack visible, vascularity in arms and shoulders, oblique lines, Ronaldo/Salah-like physique",
    indicators: "This is the hardest phase — hunger increases, energy may dip. Be patient.",
    color: "pink"
  },
  {
    title: "Phase 5: Lean Muscle Building",
    duration: "Week 14+ (ongoing)",
    calories: "2300-2500 cal (lean bulk +200-300)",
    training: "Focus on progressive overload, heavier weights, compound lifts, surplus calories",
    visuals: "Fuller muscles at low body fat, bigger shoulders/chest/arms, athletic and powerful look",
    indicators: "Weight increases slowly (0.2-0.3kg/week), strength shoots up, measurements increasing",
    color: "emerald"
  }
];

const BODY_FAT = [
  { bf: "17.6%", desc: "Current: Soft midsection, no visible abs, face slightly round. Healthy but not athletic looking." },
  { bf: "15%", desc: "Face starts looking leaner. Love handles shrink noticeably. Upper body starts showing some definition. Clothes fit better." },
  { bf: "13%", desc: "Upper abs visible. Arm veins appear. Face jawline sharper. V-taper forming. Friends/family start noticing changes." },
  { bf: "12%", desc: "Clear 4-pack. Chest and shoulder definition. Oblique lines visible. Starting to look 'athletic' and fit." },
  { bf: "11%", desc: "Full 6-pack in good lighting. Vascularity in arms. Shoulder striations. Similar to a lean football player." },
  { bf: "10%", desc: "Cristiano Ronaldo / Mohamed Salah territory. Full 6-pack always visible. Veins everywhere. Very lean, very athletic." },
];

const FAILURES = [
  { issue: "Skipping gym because 'too busy'", fix: "Schedule gym like a class. Even 30 min is better than 0. Use Emergency Protocol.", prevent: "Set fixed gym times in your calendar. Pack gym bag the night before." },
  { issue: "Not hitting protein target", fix: "Track protein for 2 weeks. Keep whey protein and eggs always available.", prevent: "Meal prep on weekends. Keep protein snacks in your bag." },
  { issue: "Sleeping too late (past midnight)", fix: "Set a hard phone cutoff at 11 PM. Use Night Shift mode. No screens in bed.", prevent: "Create a wind-down routine: Quran > stretch > lights out by 11:30." },
  { issue: "Breaking nail biting streak", fix: "Don't shame yourself. Restart tracking. Identify the trigger (stress? boredom?).", prevent: "Keep hands busy. Use fidget tools. Apply bitter nail polish." },
  { issue: "Losing motivation after Week 3", fix: "This is THE most common failure point. Motivation drops, discipline must take over.", prevent: "Review progress photos weekly. Remember your 'why'. The XP/achievement system helps." },
  { issue: "Comparing to others on social media", fix: "Unfollow unrealistic accounts. Follow only educational fitness creators.", prevent: "Limit Instagram to 15 min/day. Compare yourself to last month's you." },
  { issue: "Weekend binge eating", fix: "Allow 1 relaxed meal/week (not cheat day). Stay within 200 cal of target.", prevent: "Don't restrict too hard on weekdays. 80/20 rule: 80% clean, 20% flexible." },
  { issue: "Getting injured", fix: "STOP training that body part. See a doctor if pain persists. Do alternative exercises.", prevent: "Always warm up. Use proper form. Don't ego lift. Increase weight gradually (5-10%)." },
];

const PROTOCOLS = [
  { title: "📚 Exam Week Protocol", duration: "1-2 weeks", icon: BookOpen, color: "text-blue-400 bg-blue-500/10 border-blue-500/30", items: ["Reduce gym to 3x/week (30 min full body circuits)", "Prioritize sleep (7+ hours NON-NEGOTIABLE)", "Keep protein high (150g) — brain needs it too", "Walk 20 min/day for stress relief", "Skip HIIT — save energy for studying", "Use Pomodoro technique (25 min study / 5 min break)", "No guilt — exams are temporary, consistency is forever"] },
  { title: "✈️ Travel Protocol", duration: "Variable", icon: Plane, color: "text-sky-400 bg-sky-500/10 border-sky-500/30", items: ["Bodyweight workouts: Push-ups, squats, lunges, planks (15 min)", "Walk everywhere — aim for 10,000+ steps", "Focus on protein at every meal (eggs, chicken, fish)", "Maintain sleep schedule as close as possible", "Skip supplements temporarily — they're supplementary", "Do mobility routine daily (10 min)", "Return to normal program within 2 days of coming home"] },
  { title: "🩺 Illness Protocol", duration: "Until recovery", icon: HeartPulse, color: "text-rose-400 bg-rose-500/10 border-rose-500/30", items: ["STOP training if you have fever, chest congestion, or body aches", "Light walking OK if only mild cold (above the neck rule)", "Eat at maintenance calories — your body needs fuel to heal", "Sleep 8-9 hours — recovery is #1 priority", "Stay hydrated (4+ liters)", "Return gradually: 50% intensity first session back, 75% second, 100% third", "Expect to lose some strength — it comes back fast (muscle memory)"] },
  { title: "📅 Busy Week Protocol", duration: "1 week", icon: Clock, color: "text-amber-400 bg-amber-500/10 border-amber-500/30", items: ["Minimum effective dose: 2x gym sessions (full body)", "Each session: Squat, Bench, Row, OHP (4 exercises, 3 sets each)", "Walk 8000+ steps daily", "Hit protein target (this is the ONE thing to never skip)", "Sleep 7+ hours", "Skip tracking everything else — just hit the basics", "Resume full program next week"] },
];

export default function RoadmapPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-12 w-full text-white">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <Badge className="bg-gray-800 text-gray-300 hover:bg-gray-700">🌙 Saved</Badge>
          <Badge className="bg-orange-500/20 text-orange-500 border-orange-500/30 font-bold hover:bg-orange-500/30">🔥 0 Day Streak</Badge>
          <Badge className="bg-teal-500/20 text-teal-400 border-teal-500/30 font-bold hover:bg-teal-500/30">⏳ 75 Days Left</Badge>
        </div>
        <h1 className="text-4xl font-black text-white flex items-center gap-3 tracking-tight">
          <Map className="w-10 h-10 text-teal-500" /> 90-Day Body Transformation
        </h1>
        <p className="text-gray-400 mt-2 text-lg">Your step-by-step roadmap to 10% body fat and peak athleticism.</p>
      </div>

      {/* Phases Timeline */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold flex items-center gap-2 border-b border-gray-800 pb-2">
          <Target className="w-6 h-6 text-indigo-400" /> The Master Plan
        </h2>
        <div className="grid gap-6">
          {PHASES.map((phase, idx) => (
            <Card key={idx} className="bg-[#151923] border-gray-800 relative overflow-hidden group hover:border-gray-600 transition-colors">
              <div className={`absolute top-0 left-0 bottom-0 w-2 bg-${phase.color}-500`} />
              <CardContent className="p-6 pl-8">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">{phase.title}</h3>
                    <Badge variant="outline" className="text-gray-400 border-gray-700 bg-gray-900">{phase.duration}</Badge>
                  </div>
                  <Badge className={`bg-${phase.color}-500/20 text-${phase.color}-400 border-${phase.color}-500/30 shrink-0`}>
                    🔥 {phase.calories}
                  </Badge>
                </div>
                
                <div className="grid md:grid-cols-3 gap-6 mt-6">
                  <div className="space-y-2">
                    <div className="text-sm font-bold text-gray-500 uppercase flex items-center gap-2"><Activity className="w-4 h-4"/> Training</div>
                    <p className="text-gray-300 text-sm leading-relaxed">{phase.training}</p>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm font-bold text-gray-500 uppercase flex items-center gap-2">👀 Visual Changes</div>
                    <p className="text-gray-300 text-sm leading-relaxed">{phase.visuals}</p>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm font-bold text-gray-500 uppercase flex items-center gap-2">📊 Indicators</div>
                    <p className="text-gray-300 text-sm leading-relaxed">{phase.indicators}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Body Fat Visualizer */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold flex items-center gap-2 border-b border-gray-800 pb-2">
          <Activity className="w-6 h-6 text-pink-400" /> Visual Body Fat Guide
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {BODY_FAT.map((bf, idx) => (
            <Card key={idx} className="bg-[#151923] border-gray-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl font-black text-pink-500">{bf.bf}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 text-sm leading-relaxed">{bf.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Failure Analysis */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold flex items-center gap-2 border-b border-gray-800 pb-2">
          <AlertTriangle className="w-6 h-6 text-amber-500" /> Failure Analysis & Prevention
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          {FAILURES.map((f, idx) => (
            <div key={idx} className="bg-[#151923] border border-gray-800 rounded-xl p-5 hover:bg-gray-900/50 transition-colors">
              <h4 className="font-bold text-rose-400 mb-3 flex items-start gap-2">
                <span className="shrink-0 mt-0.5">❌</span> 
                <span>{f.issue}</span>
              </h4>
              <div className="space-y-3 pl-6">
                <div className="text-sm">
                  <span className="font-bold text-amber-400 mr-2">🛠️ Fix:</span>
                  <span className="text-gray-300">{f.fix}</span>
                </div>
                <div className="text-sm">
                  <span className="font-bold text-emerald-400 mr-2">🛡️ Prevent:</span>
                  <span className="text-gray-300">{f.prevent}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Emergency Protocols */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold flex items-center gap-2 border-b border-gray-800 pb-2">
          <ShieldAlert className="w-6 h-6 text-rose-500" /> Emergency Protocols
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {PROTOCOLS.map((protocol, idx) => (
            <Card key={idx} className={`bg-[#151923] border ${protocol.color}`}>
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    {protocol.title}
                  </CardTitle>
                  <Badge variant="outline" className="border-gray-700 bg-gray-900/50 text-gray-400">
                    {protocol.duration}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {protocol.items.map((item, i) => (
                    <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-gray-600 mt-1.5 shrink-0" />
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      
    </div>
  );
}