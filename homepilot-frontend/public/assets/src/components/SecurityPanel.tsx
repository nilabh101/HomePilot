import { Card } from './ui/card';
import { Switch } from './ui/switch';
import { Badge } from './ui/badge';
import { Shield, Camera, Lock, Users } from 'lucide-react';
import { Room } from '../App';

interface SecurityPanelProps {
  armed: boolean;
  onToggleArmed: (armed: boolean) => void;
  rooms: Room[];
}

export function SecurityPanel({ armed, onToggleArmed, rooms }: SecurityPanelProps) {
  const occupiedRooms = rooms.filter((r) => r.isOccupied).length;

  return (
    <div className="space-y-4 md:space-y-6">
      <Card className="p-4 md:p-6 dark:bg-slate-800 dark:border-slate-700">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 md:mb-6">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h2 className="text-slate-900 dark:text-slate-100">Security System</h2>
          </div>
          <Badge variant={armed ? 'default' : 'secondary'}>
            {armed ? 'Armed' : 'Disarmed'}
          </Badge>
        </div>

        <div className="space-y-4 md:space-y-6">
          <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
            <div className="space-y-1">
              <p className="text-slate-900 dark:text-slate-100">System Status</p>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                {armed ? 'All sensors active' : 'System inactive'}
              </p>
            </div>
            <Switch checked={armed} onCheckedChange={onToggleArmed} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            <Card className="p-4 bg-gradient-to-br from-blue-50 to-white dark:from-blue-950/30 dark:to-slate-800 dark:border-slate-700">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                  <Camera className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">Cameras</p>
                  <p className="text-slate-900 dark:text-slate-100">4 Active</p>
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-gradient-to-br from-green-50 to-white dark:from-green-950/30 dark:to-slate-800 dark:border-slate-700">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg">
                  <Lock className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">Door Locks</p>
                  <p className="text-slate-900 dark:text-slate-100">All Secured</p>
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-gradient-to-br from-purple-50 to-white dark:from-purple-950/30 dark:to-slate-800 dark:border-slate-700 sm:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
                  <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">Occupancy</p>
                  <p className="text-slate-900 dark:text-slate-100">{occupiedRooms ? 'Occupied' : 'Empty'}</p>
                </div>
              </div>
            </Card>
          </div>

          <div className="space-y-3">
            <p className="text-slate-900 dark:text-slate-100">Room Monitoring</p>
            <div className="max-w-2xl mx-auto">
              {rooms.map((room) => (
                <div
                  key={room.id}
                  className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        room.isOccupied ? 'bg-green-500 dark:bg-green-400' : 'bg-slate-300 dark:bg-slate-600'
                      }`}
                    />
                    <p className="text-slate-900 dark:text-slate-100">{room.name}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant="outline">
                      {room.isOccupied ? 'Occupied' : 'Empty'}
                    </Badge>
                    <Camera className="w-5 h-5 text-slate-400 dark:text-slate-500" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
