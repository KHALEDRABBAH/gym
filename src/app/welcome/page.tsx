import Link from "next/link";
import { ArrowRight, Flame, Dumbbell, Zap, Target } from "lucide-react";

export default function WelcomePage() {
  return (
    <div className="min-h-screen bg-[#0d1017] text-white flex flex-col relative overflow-hidden">
      
      {/* Background Decorative Gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-fuchsia-600/20 rounded-full blur-[120px] pointer-events-none" />
      
      {/* Navbar */}
      <nav className="w-full flex justify-between items-center px-8 py-6 max-w-7xl mx-auto z-10 relative">
        <div className="text-2xl font-black tracking-wide flex items-center gap-2">
          <span className="text-emerald-500">⚡</span> FITNESS HUB
        </div>
        <div className="flex gap-4">
          <Link href="/auth/login" className="px-5 py-2.5 rounded-full font-bold text-sm bg-white/5 hover:bg-white/10 transition-colors border border-white/10">
            Sign In
          </Link>
          <Link href="/auth/register" className="px-5 py-2.5 rounded-full font-bold text-sm bg-indigo-600 hover:bg-indigo-500 transition-colors shadow-[0_0_15px_rgba(79,70,229,0.5)]">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 max-w-4xl mx-auto z-10 relative mt-12 mb-24">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-8 font-bold text-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
          </span>
          v2.0 Enterprise Release
        </div>
        
        <h1 className="text-6xl md:text-8xl font-black mb-6 leading-tight tracking-tight">
          Master Your <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-fuchsia-400 to-orange-400">
            Life & Body
          </span>
        </h1>
        
        <p className="text-xl text-gray-400 mb-10 max-w-2xl font-medium leading-relaxed">
          The ultimate command center for your workouts, habits, prayer, and lifestyle. Stop using 5 different apps and bring everything into one powerful hub.
        </p>
        
        <Link href="/auth/register" className="group px-8 py-4 rounded-full font-black text-lg bg-white text-black hover:scale-105 transition-all duration-300 flex items-center gap-3 shadow-[0_0_30px_rgba(255,255,255,0.3)]">
          Start Your Journey
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </main>

      {/* Features Grid */}
      <section className="bg-[#11141d]/80 border-t border-white/5 py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black mb-4">Everything You Need</h2>
            <p className="text-gray-400">Powerful tracking engines built specifically for high performers.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="glass-card p-8 rounded-2xl flex flex-col gap-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                <Dumbbell className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold">Fitness Engine</h3>
              <p className="text-gray-400 text-sm leading-relaxed">Track progressive overload with an advanced workout builder.</p>
            </div>
            
            <div className="glass-card p-8 rounded-2xl flex flex-col gap-4">
              <div className="w-12 h-12 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center">
                <Flame className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold">Habit Analytics</h3>
              <p className="text-gray-400 text-sm leading-relaxed">Build consistency with heatmaps and streak gamification.</p>
            </div>
            
            <div className="glass-card p-8 rounded-2xl flex flex-col gap-4">
              <div className="w-12 h-12 rounded-xl bg-fuchsia-500/20 text-fuchsia-400 flex items-center justify-center">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold">Life Logging</h3>
              <p className="text-gray-400 text-sm leading-relaxed">Log sleep, daily reviews, and mood to see the full picture.</p>
            </div>

            <div className="glass-card p-8 rounded-2xl flex flex-col gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold">Goal Tracking</h3>
              <p className="text-gray-400 text-sm leading-relaxed">Set macros, track water, and maintain your prayers daily.</p>
            </div>
          </div>
        </div>
      </section>
      
    </div>
  );
}
