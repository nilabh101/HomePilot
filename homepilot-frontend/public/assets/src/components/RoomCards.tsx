import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Thermometer, Sun, Users, Zap, Fan } from 'lucide-react';
import { Room } from '../App';

interface RoomCardsProps {
  rooms: Room[];
  onUpdateTemp: (roomId: string, temp: number) => void;
  onToggleAuto: (roomId: string) => void;
}

export function RoomCards({ rooms }: RoomCardsProps) {
  return (
    <div className="max-w-2xl mx-auto">
      {rooms.map((room) => (
        <Card
          key={room.id}
          className="p-4 md:p-6 hover:shadow-lg transition-shadow bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 dark:border-slate-700"
        >
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-slate-900 dark:text-slate-100">{room.name}</h3>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <Badge variant={room.isOccupied ? 'default' : 'secondary'} className="text-xs">
                    <Users className="w-3 h-3 mr-1" />
                    {room.isOccupied ? 'Occupied' : 'Empty'}
                  </Badge>
                  {room.autoMode && (
                    <Badge variant="outline" className="bg-green-50 dark:bg-green-950 dark:border-green-800 text-xs">
                      <Zap className="w-3 h-3 mr-1 text-green-600 dark:text-green-400" />
                      Auto
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 md:p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                <div className="flex items-center gap-2">
                  <Thermometer className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-slate-600 dark:text-slate-400 text-sm">Temperature</span>
                </div>
                <span className="text-slate-900 dark:text-slate-100">{room.temperature.toFixed(1)}°C</span>
              </div>

              <div className="flex items-center justify-between p-2 md:p-3 bg-cyan-50 dark:bg-cyan-950/30 rounded-lg border border-cyan-200 dark:border-cyan-900">
                <div className="flex items-center gap-2">
                  <Fan className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                  <span className="text-slate-600 dark:text-slate-400 text-sm">Fan (Auto)</span>
                </div>
                <span className="text-cyan-600 dark:text-cyan-400">{room.fanSpeed}%</span>
              </div>

              <div className="flex items-center justify-between p-2 md:p-3 bg-yellow-50 dark:bg-yellow-950/30 rounded-lg">
                <div className="flex items-center gap-2">
                  <Sun className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                  <span className="text-slate-600 dark:text-slate-400 text-sm">Light</span>
                </div>
                <span className="text-slate-900 dark:text-slate-100">{room.lightLevel}%</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between text-slate-600 dark:text-slate-400 text-sm">
                <span>Target Temp</span>
                <span className="text-slate-900 dark:text-slate-100">{room.targetTemp}°C</span>
              </div>
              <div className="mt-2 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all ${
                    Math.abs(room.temperature - room.targetTemp) < 1
                      ? 'bg-green-500 dark:bg-green-400'
                      : 'bg-yellow-500 dark:bg-yellow-400'
                  }`}
                  style={{
                    width: `${Math.min(
                      100,
                      100 - Math.abs(room.temperature - room.targetTemp) * 20
                    )}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
