"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTransition, useState } from "react";
import { logWater } from "@/app/actions";
import { Plus, Minus, Droplets } from "lucide-react";

export function WaterLogger({ currentWater }: { currentWater: number }) {
  const [isPending, startTransition] = useTransition();
  const [customAmount, setCustomAmount] = useState<string>("0.25");

  const addWater = (liters: number) => {
    startTransition(() => {
      const dateKey = new Date().toISOString().split("T")[0];
      logWater(dateKey, liters);
    });
  };

  const handleCustomAdd = () => {
    const val = parseFloat(customAmount);
    if (!isNaN(val) && val > 0) {
      addWater(val);
    }
  };

  const handleCustomSubtract = () => {
    const val = parseFloat(customAmount);
    if (!isNaN(val) && val > 0) {
      addWater(-val);
    }
  };

  return (
    <Card className="col-span-1 bg-gray-900 border-gray-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Droplets className="w-5 h-5 text-cyan-400" />
          Water Log
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center mb-6">
          <span className="text-4xl font-bold text-cyan-400">{currentWater.toFixed(2)} L</span>
          <span className="text-gray-400"> / 3.5 L</span>
        </div>
        
        <div className="flex flex-col gap-4">
          <div className="flex justify-center gap-2">
            <Button 
              disabled={isPending}
              onClick={() => addWater(0.25)}
              variant="outline" 
              className="flex-1 border-cyan-900 text-cyan-400 hover:bg-cyan-900 hover:text-cyan-300"
            >
              + 0.25L
            </Button>
            <Button 
              disabled={isPending}
              onClick={() => addWater(0.5)}
              variant="outline" 
              className="flex-1 border-cyan-900 text-cyan-400 hover:bg-cyan-900 hover:text-cyan-300"
            >
              + 0.5L
            </Button>
          </div>

          <div className="flex items-center gap-2 mt-2">
            <Input 
              type="number" 
              step="0.1" 
              min="0"
              value={customAmount} 
              onChange={(e) => setCustomAmount(e.target.value)}
              className="bg-gray-950 border-gray-800 text-center text-cyan-400 font-bold"
            />
            <span className="text-sm text-gray-500 font-bold">L</span>
            
            <div className="flex gap-1 ml-2">
              <Button 
                disabled={isPending}
                onClick={handleCustomSubtract}
                variant="outline" 
                size="icon"
                className="border-red-900/50 text-red-400 hover:bg-red-900 hover:text-red-300"
              >
                <Minus className="w-4 h-4" />
              </Button>
              <Button 
                disabled={isPending}
                onClick={handleCustomAdd}
                variant="outline" 
                size="icon"
                className="border-cyan-900 text-cyan-400 hover:bg-cyan-900 hover:text-cyan-300"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
