"use client";

import { useState } from "react";
import { CheckSquare, Plus, MoreVertical, Check, Circle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLocalStorage } from "@/lib/hooks/useLocalStorage";
import { useDate } from "@/lib/context/DateContext";

type Task = {
  id: number;
  title: string;
  category: string;
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
};

const INITIAL_TASKS: Task[] = [
  { id: 1, title: "Review Weekly Goals", category: "Planning", priority: "high", completed: false },
  { id: 2, title: "Finish Next.js Project", category: "Work", priority: "high", completed: false },
  { id: 3, title: "Read 20 pages of Book", category: "Learning", priority: "medium", completed: false },
  { id: 4, title: "Call family", category: "Lifestyle", priority: "low", completed: false },
];

export default function DailyTasksPage() {
  const { dateKey } = useDate();
  const [tasks, setTasks] = useLocalStorage<Task[]>(`fitness_hub_tasks_${dateKey}`, INITIAL_TASKS);
  const [newTask, setNewTask] = useState("");

  const toggleTask = (id: number) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    setTasks([
      ...tasks,
      { id: Date.now(), title: newTask, category: "Inbox", priority: "medium", completed: false }
    ]);
    setNewTask("");
  };

  const priorityColors = {
    high: "bg-red-500/20 text-red-500 border-red-500/30",
    medium: "bg-orange-500/20 text-orange-500 border-orange-500/30",
    low: "bg-emerald-500/20 text-emerald-500 border-emerald-500/30"
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12 w-full text-white">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white">Daily Tasks</h1>
          <p className="text-gray-400 mt-1">Organize your day efficiently.</p>
        </div>
        <Badge className="bg-indigo-500/20 text-indigo-400 border-indigo-500/30 text-sm px-4 py-1">
          {tasks.filter(t => t.completed).length} / {tasks.length} Completed
        </Badge>
      </div>

      {/* Add Task Input */}
      <form onSubmit={addTask} className="flex gap-4">
        <Input 
          value={newTask}
          onChange={e => setNewTask(e.target.value)}
          placeholder="What needs to be done?" 
          className="bg-[#151923] border-gray-800 text-white h-14 text-lg rounded-xl focus-visible:ring-indigo-500"
        />
        <Button type="submit" className="h-14 px-8 bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-lg shadow-indigo-500/20 font-bold">
          <Plus className="w-5 h-5 mr-2" /> Add Task
        </Button>
      </form>

      {/* Task List */}
      <div className="grid md:grid-cols-2 gap-8">
        
        {/* In Progress */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
            <Circle className="w-5 h-5 text-orange-500" /> To Do
          </h2>
          {tasks.filter(t => !t.completed).map(task => (
            <Card key={task.id} className="bg-[#151923] border-gray-800 hover:border-gray-700 transition-colors group">
              <CardContent className="p-4 flex items-center gap-4">
                <button onClick={() => toggleTask(task.id)} className="w-6 h-6 rounded border border-gray-600 flex items-center justify-center hover:border-indigo-500 transition-colors">
                  <Check className="w-4 h-4 opacity-0 text-indigo-500" />
                </button>
                <div className="flex-1">
                  <p className="font-medium text-gray-200">{task.title}</p>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="outline" className="text-xs border-gray-700 text-gray-400 bg-gray-900">
                      {task.category}
                    </Badge>
                    <Badge variant="outline" className={`text-xs ${priorityColors[task.priority]}`}>
                      {task.priority}
                    </Badge>
                  </div>
                </div>
                <button className="text-gray-600 hover:text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </CardContent>
            </Card>
          ))}
          {tasks.filter(t => !t.completed).length === 0 && (
            <div className="text-center p-8 border border-dashed border-gray-800 rounded-xl text-gray-500">
              No tasks left. You're all caught up!
            </div>
          )}
        </div>

        {/* Completed */}
        <div className="space-y-4 opacity-60">
          <h2 className="text-xl font-bold flex items-center gap-2 mb-4 text-gray-400">
            <CheckSquare className="w-5 h-5 text-emerald-500" /> Completed
          </h2>
          {tasks.filter(t => t.completed).map(task => (
            <Card key={task.id} className="bg-[#151923] border-emerald-900/30 group">
              <CardContent className="p-4 flex items-center gap-4">
                <button onClick={() => toggleTask(task.id)} className="w-6 h-6 rounded border border-emerald-500 bg-emerald-500/20 flex items-center justify-center text-emerald-500">
                  <Check className="w-4 h-4" />
                </button>
                <div className="flex-1">
                  <p className="font-medium text-gray-500 line-through">{task.title}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
      </div>
    </div>
  );
}