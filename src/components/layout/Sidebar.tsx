"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, Dumbbell, Utensils, BookOpen, LineChart, Settings,
  CheckSquare, Flame, PieChart, Moon, FolderHeart, GraduationCap, 
  Map, Coffee, CalendarCheck, Trophy
} from "lucide-react";
import { cn } from "@/lib/utils";
import { XPBar } from "./XPBar";

// Use an inline SVG for Mosque since Lucide might not have a perfect one in older versions, 
// but wait, Moon or MoonStar is a good fallback for Faith/Islamic themes, or we can use a generic icon.
// We'll use Moon for Prayer & Faith.

const sidebarSections = [
  {
    title: "OVERVIEW",
    items: [
      { name: "Dashboard", href: "/", icon: Home },
      { name: "Daily Tasks", href: "/daily-tasks", icon: CheckSquare },
    ]
  },
  {
    title: "TRACKING",
    items: [
      { name: "Habits", href: "/habits", icon: Flame },
      { name: "Progress", href: "/progress", icon: LineChart },
      { name: "Analytics", href: "/analytics", icon: PieChart },
    ]
  },
  {
    title: "LIFE AREAS",
    items: [
      { name: "Prayer & Faith", href: "/prayer", icon: Moon },
      { name: "Fitness & Health", href: "/fitness", icon: Dumbbell },
      { name: "Exercise Library", href: "/exercise-library", icon: FolderHeart },
      { name: "Nutrition", href: "/nutrition", icon: Utensils },
      { name: "Learning", href: "/learning", icon: GraduationCap },
      { name: "Roadmap", href: "/roadmap", icon: Map },
      { name: "Lifestyle", href: "/lifestyle", icon: Coffee },
    ]
  },
  {
    title: "PLANNING",
    items: [
      { name: "Achievements", href: "/achievements", icon: Trophy },
      { name: "Settings", href: "/settings", icon: Settings },
    ]
  }
];

export function Sidebar({ xp = 0, streak = 0, name = "User" }: { xp?: number, streak?: number, name?: string }) {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-64 flex-col bg-[#11141d] border-r border-gray-800 text-white overflow-hidden">
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent">
        <div className="flex h-16 items-center px-6">
          <h1 className="text-xl font-bold text-white tracking-wide flex items-center gap-2">
            <span className="text-emerald-500">⚡</span> FITNESS HUB
          </h1>
        </div>
        
        <nav className="flex-1 space-y-6 px-3 py-4">
          {sidebarSections.map((section) => (
            <div key={section.title}>
              <h3 className="px-3 text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                {section.title}
              </h3>
              <div className="space-y-1">
                {section.items.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        isActive
                          ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                          : "text-gray-400 hover:bg-gray-800/50 hover:text-white border border-transparent",
                        "group flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-all"
                      )}
                    >
                      <item.icon
                        className={cn(
                          isActive ? "text-indigo-400" : "text-gray-500 group-hover:text-gray-400",
                          "mr-3 h-4 w-4 flex-shrink-0"
                        )}
                        aria-hidden="true"
                      />
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>
      
      <div className="flex-shrink-0 p-4 border-t border-gray-800 bg-[#0d1017]">
        <XPBar xp={xp} streak={streak} />
        
        <div className="flex items-center gap-3 mt-4">
          <div className="w-10 h-10 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center text-sm font-bold uppercase shadow-inner">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Khaled" alt="Avatar" className="w-full h-full rounded-full opacity-80" />
          </div>
          <div>
            <p className="text-sm font-bold truncate w-32 text-gray-200">User Info</p>
            <p className="text-xs text-gray-500 truncate">@fitness.info</p>
          </div>
        </div>
      </div>
    </div>
  );
}
