"use client";

import { useState, useTransition, useEffect } from "react";
import { CheckSquare, Plus, Check, Circle, Trash2, Play, Pause } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { addDailyTask, toggleDailyTask, deleteDailyTask, updateTaskTime } from "@/app/actions";
import type { DailyTask } from "@prisma/client";

function TaskTimer({ task, onTimeUpdate }: { task: DailyTask, onTimeUpdate: (id: string, timeSpent: number) => void }) {
  const [isActive, setIsActive] = useState(false);
  const [timeSpent, setTimeSpent] = useState(task.timeSpent || 0);
  const durationInSeconds = (task.duration || 0) * 60;
  
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && durationInSeconds > 0 && timeSpent < durationInSeconds) {
      interval = setInterval(() => {
        setTimeSpent(t => t + 1);
      }, 1000);
    } else if (timeSpent >= durationInSeconds && isActive) {
      setIsActive(false);
      onTimeUpdate(task.id, timeSpent);
    }
    return () => clearInterval(interval);
  }, [isActive, timeSpent, durationInSeconds, task.id, onTimeUpdate]);

  // Debounced save when paused
  useEffect(() => {
    if (!isActive && timeSpent !== (task.timeSpent || 0)) {
       onTimeUpdate(task.id, timeSpent);
    }
  }, [isActive, timeSpent, task.timeSpent, task.id, onTimeUpdate]);

  if (!task.duration) return null;

  const timeLeft = Math.max(0, durationInSeconds - timeSpent);
  const minutes = Math.floor(timeLeft / 60).toString().padStart(2, "0");
  const seconds = (timeLeft % 60).toString().padStart(2, "0");

  return (
    <div className="flex items-center gap-3 bg-gray-900/50 px-3 py-1.5 rounded-lg border border-gray-800">
      <span className="font-mono text-sm text-indigo-400 font-bold tracking-wider">
        {minutes}:{seconds}
      </span>
      <button 
        onClick={() => setIsActive(!isActive)} 
        className="text-gray-400 hover:text-white transition-colors"
        disabled={timeLeft === 0}
      >
        {isActive ? <Pause className="w-4 h-4 text-orange-400" /> : <Play className="w-4 h-4 text-emerald-400" />}
      </button>
    </div>
  );
}

export function DailyTasksClient({ initialTasks, dateKey }: { initialTasks: DailyTask[], dateKey: string }) {
  const [newTask, setNewTask] = useState("");
  const [newDuration, setNewDuration] = useState("");
  const [isPending, startTransition] = useTransition();
  const [tasks, setTasks] = useState<DailyTask[]>(initialTasks);

  const handleToggle = (task: DailyTask) => {
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

  const handleTimeUpdate = (id: string, timeSpent: number) => {
    startTransition(() => {
      updateTaskTime(id, timeSpent);
    });
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    
    const title = newTask;
    const duration = newDuration ? parseInt(newDuration, 10) : null;
    
    setNewTask("");
    setNewDuration("");
    
    const tempId = `temp-${Date.now()}`;
    const optimisticTask: DailyTask = {
      id: tempId,
      userId: "temp",
      date: dateKey,
      title,
      category: "General",
      completed: false,
      duration,
      timeSpent: 0
    };
    
    setTasks(current => [...current, optimisticTask]);
    
    startTransition(async () => {
      const created = await addDailyTask(dateKey, title, "General", duration || undefined);
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
          className="bg-[#151923] border-gray-800 text-white h-14 text-lg rounded-xl focus-visible:ring-indigo-500 flex-1"
          disabled={isPending && newTask === ""}
        />
        <Input 
          type="number"
          min="1"
          value={newDuration}
          onChange={e => setNewDuration(e.target.value)}
          placeholder="Min (e.g. 30)" 
          className="bg-[#151923] border-gray-800 text-white h-14 text-lg rounded-xl focus-visible:ring-indigo-500 w-32"
          disabled={isPending}
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
                <button onClick={() => handleToggle(task)} className="w-6 h-6 rounded border border-gray-600 flex items-center justify-center hover:border-indigo-500 transition-colors shrink-0">
                  <Check className="w-4 h-4 opacity-0 text-indigo-500" />
                </button>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-200 truncate">{task.title}</p>
                </div>
                {!task.completed && task.duration && (
                  <TaskTimer task={task} onTimeUpdate={handleTimeUpdate} />
                )}
                <button onClick={() => handleDelete(task.id)} className="text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
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
                <button onClick={() => handleToggle(task)} className="w-6 h-6 rounded border border-emerald-500 bg-emerald-500/20 flex items-center justify-center text-emerald-500 shrink-0">
                  <Check className="w-4 h-4" />
                </button>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-500 line-through truncate">{task.title}</p>
                </div>
                <button onClick={() => handleDelete(task.id)} className="text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
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
