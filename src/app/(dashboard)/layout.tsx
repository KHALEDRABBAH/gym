import { Sidebar } from "@/components/layout/Sidebar";
import { getDashboardData } from "@/app/actions";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { LanguageToggle } from "@/components/layout/LanguageToggle";
import { TopCalendar } from "@/components/layout/TopCalendar";
import { RestTimer } from "@/components/fitness/RestTimer";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await getDashboardData();

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar xp={user.xp} streak={user.streak} name={user.name || undefined} />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-16 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-8 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm shrink-0">
          <div className="flex-1"></div>
          <div className="flex items-center gap-4">
            <div className="px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 text-sm font-bold flex items-center gap-2 border border-orange-200 dark:border-orange-500/20">
              🔥 {user.streak} Day Streak
            </div>
            <LanguageToggle />
            <ThemeToggle />
          </div>
        </header>
        <TopCalendar />
        <main className="flex-1 overflow-y-auto p-8 relative">
          {children}
        </main>
      </div>
      <RestTimer />
    </div>
  );
}
