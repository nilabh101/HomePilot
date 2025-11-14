import { Card } from './ui/card';
import { Slider } from './ui/slider';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Thermometer, Zap, Fan } from 'lucide-react';
import { Room } from '../App';

interface TemperatureControlProps {
  rooms: Room[];
  onUpdateTemp: (roomId: string, temp: number) => void;
  onToggleAuto: (roomId: string) => void;
}

export function TemperatureControl({
  rooms,
  onUpdateTemp,
  onToggleAuto,
}: TemperatureControlProps) {
  return (
    <Card className="p-4 md:p-6 dark:bg-slate-800 dark:border-slate-700">
      <div className="flex items-center gap-2 mb-4 md:mb-6">
        <Thermometer className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        <div>
          <h2 className="text-slate-900 dark:text-slate-100">Temperature Sensor & Control</h2>
          <p className="text-slate-500 dark:text-slate-400 text-xs">Fan speed automatically adjusts based on sensor readings</p>
        </div>
      </div>

      <div className="space-y-4 md:space-y-6">
        {rooms.map((room) => (
          <div key={room.id} className="space-y-3 pb-4 md:pb-6 border-b border-slate-200 dark:border-slate-700 last:border-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex-1">
                <p className="text-slate-900 dark:text-slate-100">{room.name}</p>
                <p className="text-slate-600 dark:text-slate-400 text-sm">
                  Sensor Reading: {room.temperature.toFixed(1)}°C | Target: {room.targetTemp}°C
                </p>
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex items-center gap-2">
                    <Fan className="w-4 h-4 text-cyan-500 dark:text-cyan-400" />
                    <span className="text-cyan-600 dark:text-cyan-400">
                      Fan: {room.fanSpeed}%
                    </span>
                  </div>
                  <div className="text-slate-400 dark:text-slate-600">•</div>
                  <span className="text-slate-500 dark:text-slate-400 text-xs">
                    {room.temperature < room.targetTemp ? '↓ Cooling to target' : 
                     room.temperature > room.targetTemp ? '↑ Above target' : 
                     '✓ At target'}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Zap
                  className={`w-4 h-4 ${
                    room.autoMode ? 'text-green-500 dark:text-green-400' : 'text-slate-400 dark:text-slate-600'
                  }`}
                />
                <Switch
                  checked={room.autoMode}
                  onCheckedChange={() => onToggleAuto(room.id)}
                />
                <Label className="text-slate-600 dark:text-slate-400 text-sm">Auto</Label>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-slate-600 dark:text-slate-400 text-sm">
                <span>16°C</span>
                <span>30°C</span>
              </div>
              <Slider
                value={[room.targetTemp]}
                onValueChange={(value) => onUpdateTemp(room.id, value[0])}
                min={16}
                max={30}
                step={0.5}
                className="w-full"
              />
            </div>

            {/* Fan speed indicator - sensor driven */}
            <div className="space-y-2 p-3 bg-cyan-50 dark:bg-cyan-950/20 rounded-lg border border-cyan-200 dark:border-cyan-900">
              <div className="flex items-center justify-between">
                <span className="text-slate-600 dark:text-slate-400 text-sm">Fan Speed (Sensor-Driven)</span>
                <span className="text-cyan-600 dark:text-cyan-400">{room.fanSpeed}%</span>
              </div>
              <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-400 to-cyan-600 dark:from-cyan-500 dark:to-cyan-300 transition-all"
                  style={{ width: `${room.fanSpeed}%` }}
                />
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                0% at 16°C → 100% at 35°C
              </p>
            </div>
            
            {/* Temperature status indicator */}
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all ${
                    Math.abs(room.temperature - room.targetTemp) < 1
                      ? 'bg-green-500 dark:bg-green-400'
                      : Math.abs(room.temperature - room.targetTemp) < 2
                      ? 'bg-yellow-500 dark:bg-yellow-400'
                      : 'bg-red-500 dark:bg-red-400'
                  }`}
                  style={{
                    width: `${Math.max(
                      20,
                      100 - Math.abs(room.temperature - room.targetTemp) * 20
                    )}%`,
                  }}
                />
              </div>
              <span className="text-slate-600 dark:text-slate-400 text-sm whitespace-nowrap">
                {Math.abs(room.temperature - room.targetTemp) < 1
                  ? 'Optimal'
                  : 'Adjusting'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
