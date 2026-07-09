"use client";

import { useState, useTransition } from "react";
import { CheckSquare, Plus, MoreVertical, Check, Circle, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { addDailyTask, toggleDailyTask, deleteDailyTask } from "@/app/actions";
import type { DailyTask } from "@prisma/client";

export function DailyTasksClient({ initialTasks, dateKey }: { initialTasks: DailyTask[], dateKey: string }) {
  const [newTask, setNewTask] = useState("");
  const [isPending, startTransition] = useTransition();
  // Using simple local state for optimistic UI during transition
  const [tasks, setTasks] = useState<DailyTask[]>(initialTasks);

  const handleToggle = (task: DailyTask) => {
    // Optimistic UI
    setTasks(current => current.map(t => t.id === task.id ? { ...t, completed: !t.completed } : t));
    startTransition(() => {
      toggleDailyTask(task.id, !task.completed);
    });
  };

  const handleDelete = (id: string) => {
    setTasks(current => current.filter(t => t.id !== id));
    startTransition(() => {
      deleteDailyTask(id);
    });
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    
    const title = newTask;
    setNewTask("");
    
    // Quick optimistic addition
    const tempId = `temp-${Date.now()}`;
    const optimisticTask: DailyTask = {
      id: tempId,
      userId: "temp",
      date: dateKey,
      title,
      category: "General",
      completed: false
    };
    
    setTasks(current => [...current, optimisticTask]);
    
    startTransition(async () => {
      const created = await addDailyTask(dateKey, title);
      setTasks(current => current.map(t => t.id === tempId ? created : t));
    });
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

      <form onSubmit={handleAdd} className="flex gap-4">
        <Input 
          value={newTask}
          onChange={e => setNewTask(e.target.value)}
          placeholder="What needs to be done?" 
          className="bg-[#151923] border-gray-800 text-white h-14 text-lg rounded-xl focus-visible:ring-indigo-500"
          disabled={isPending && newTask === ""}
        />
        <Button type="submit" disabled={!newTask.trim() || isPending} className="h-14 px-8 bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-lg shadow-indigo-500/20 font-bold">
          <Plus className="w-5 h-5 mr-2" /> Add Task
        </Button>
      </form>

      <div className="grid md:grid-cols-2 gap-8">
        
        {/* To Do */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
            <Circle className="w-5 h-5 text-orange-500" /> To Do
          </h2>
          {tasks.filter(t => !t.completed).map(task => (
            <Card key={task.id} className="bg-[#151923] border-gray-800 hover:border-gray-700 transition-colors group">
              <CardContent className="p-4 flex items-center gap-4">
                <button onClick={() => handleToggle(task)} className="w-6 h-6 rounded border border-gray-600 flex items-center justify-center hover:border-indigo-500 transition-colors">
                  <Check className="w-4 h-4 opacity-0 text-indigo-500" />
                </button>
                <div className="flex-1">
                  <p className="font-medium text-gray-200">{task.title}</p>
                </div>
                <button onClick={() => handleDelete(task.id)} className="text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Trash2 className="w-4 h-4" />
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
                <button onClick={() => handleToggle(task)} className="w-6 h-6 rounded border border-emerald-500 bg-emerald-500/20 flex items-center justify-center text-emerald-500">
                  <Check className="w-4 h-4" />
                </button>
                <div className="flex-1">
                  <p className="font-medium text-gray-500 line-through">{task.title}</p>
                </div>
                <button onClick={() => handleDelete(task.id)} className="text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Trash2 className="w-4 h-4" />
                </button>
              </CardContent>
            </Card>
          ))}
        </div>
        
      </div>
    </div>
  );
}
