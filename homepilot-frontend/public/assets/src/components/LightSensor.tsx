import { Card } from './ui/card';
import { Sun, Moon } from 'lucide-react';
import { Room } from '../App';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useState, useEffect } from 'react';

interface LightSensorProps {
  rooms: Room[];
}

interface LightData {
  time: string;
  [key: string]: number | string;
}

export function LightSensor({ rooms }: LightSensorProps) {
  const [chartData, setChartData] = useState<LightData[]>([]);

  useEffect(() => {
    const updateChart = () => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      });

      const newDataPoint: LightData = {
        time: timeStr,
      };

      rooms.forEach((room) => {
        newDataPoint[room.name] = room.lightLevel;
      });

      setChartData((prev) => {
        const updated = [...prev, newDataPoint];
        return updated.slice(-10); // Keep last 10 data points
      });
    };

    updateChart();
    const interval = setInterval(updateChart, 5000);

    return () => clearInterval(interval);
  }, [rooms]);

  const colors = ['#3b82f6', '#f59e0b', '#10b981', '#8b5cf6'];

  return (
    <Card className="p-4 md:p-6 dark:bg-slate-800 dark:border-slate-700">
      <div className="flex items-center gap-2 mb-4 md:mb-6">
        <Sun className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
        <div>
          <h2 className="text-slate-900 dark:text-slate-100">Light Sensors</h2>
          <p className="text-slate-500 dark:text-slate-400 text-xs">Real-time ambient light monitoring</p>
        </div>
      </div>

      <div className="space-y-4 md:space-y-6">
        {/* Current levels */}
        <div className="max-w-md mx-auto">
          {rooms.map((room) => (
            <div key={room.id} className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-slate-900 dark:text-slate-100">{room.name}</p>
                <div className="flex items-center gap-2">
                  {room.lightLevel > 50 ? (
                    <Sun className="w-5 h-5 text-yellow-500 dark:text-yellow-400" />
                  ) : (
                    <Moon className="w-5 h-5 text-slate-400 dark:text-slate-500" />
                  )}
                  <span className="text-slate-900 dark:text-slate-100">{room.lightLevel}%</span>
                </div>
              </div>
              <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-slate-400 to-yellow-400 dark:from-slate-600 dark:to-yellow-500 transition-all"
                  style={{ width: `${room.lightLevel}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Chart */}
        {chartData.length > 0 && (
          <div className="space-y-2">
            <p className="text-slate-600 dark:text-slate-400 text-sm">Light Level History</p>
            <div className="h-48 md:h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-slate-200 dark:text-slate-700" />
                  <XAxis
                    dataKey="time"
                    tick={{ fontSize: 12, fill: 'currentColor' }}
                    className="text-slate-600 dark:text-slate-400"
                    stroke="currentColor"
                  />
                  <YAxis
                    domain={[0, 100]}
                    tick={{ fontSize: 12, fill: 'currentColor' }}
                    className="text-slate-600 dark:text-slate-400"
                    stroke="currentColor"
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--background)',
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                    }}
                    labelStyle={{ color: 'var(--foreground)' }}
                  />
                  {rooms.map((room, index) => (
                    <Line
                      key={room.id}
                      type="monotone"
                      dataKey={room.name}
                      stroke={colors[index % colors.length]}
                      strokeWidth={2}
                      dot={false}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
