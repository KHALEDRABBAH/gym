"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PlayCircle, Clock, BookOpen, LayoutDashboard } from "lucide-react";
import { PomodoroTimer } from "@/components/learning/PomodoroTimer";
import { COURSES } from "@/lib/data/courses";
import { useState } from "react";

const CATEGORIES = ["All", "Fitness", "Nutrition", "Mental", "Posture", "Arabic"];

export default function LearningPage() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredCourses = COURSES.filter(course => {
    if (activeCategory === "All") return true;
    return course.category.toLowerCase() === activeCategory.toLowerCase();
  });

  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Learning Hub</h1>
          <p className="text-gray-400 mt-1">Curated Resources & Focus Mode</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <PomodoroTimer />
        
        <Card className="bg-gray-900 border-gray-800 md:col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LayoutDashboard className="w-5 h-5 text-indigo-400" /> 
              Categories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(cat => (
                <Button
                  key={cat}
                  variant={activeCategory === cat ? "default" : "outline"}
                  className={activeCategory === cat ? "bg-indigo-600 hover:bg-indigo-700" : "bg-transparent border-gray-800 hover:bg-gray-800 text-gray-300"}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-4">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-indigo-400" /> 
          Course Curriculum
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredCourses.map((course, idx) => (
            <Card key={idx} className="bg-gray-900 border-gray-800 flex flex-col hover:border-indigo-500/50 transition-colors">
              <CardContent className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <Badge variant="secondary" className="bg-indigo-900/50 text-indigo-300 capitalize">
                    {course.category}
                  </Badge>
                  <span className={`text-xs font-bold px-2 py-1 rounded ${
                    course.level.includes('Beginner') || course.level.includes('مبتدئ') ? 'bg-green-900/50 text-green-400' :
                    course.level.includes('Advanced') || course.level.includes('متقدم') ? 'bg-red-900/50 text-red-400' :
                    'bg-orange-900/50 text-orange-400'
                  }`}>
                    {course.level.replace(/<[^>]+>/g, '').split('مبتدئ')[0].split('متوسط')[0].split('متقدم')[0].split('كل المستويات')[0].trim()}
                  </span>
                </div>
                
                <h3 className="font-bold text-lg text-white mb-2 leading-tight" dangerouslySetInnerHTML={{ __html: course.title }}></h3>
                <p className="text-sm text-gray-400 mb-4 flex-1 line-clamp-3" dangerouslySetInnerHTML={{ __html: course.desc }}></p>
                
                <div className="flex items-center justify-between text-xs text-gray-500 border-t border-gray-800 pt-4 mt-auto">
                  <div className="font-medium text-gray-300">
                    {course.provider}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {course.duration.replace(/<[^>]+>/g, '').split('أسابيع')[0].split('قناة')[0].split('يوم')[0].split('دقيقة')[0].split('بودكاست')[0].trim()}
                  </div>
                </div>
              </CardContent>
              <div className="px-6 pb-6 pt-0">
                <Button 
                  className="w-full bg-indigo-600 hover:bg-indigo-700" 
                  onClick={() => window.open(course.url, '_blank')}
                >
                  <PlayCircle className="w-4 h-4 mr-2" /> Start Learning
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
