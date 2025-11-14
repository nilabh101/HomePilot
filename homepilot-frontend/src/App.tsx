import { useState, useEffect } from 'react';
import { Card } from './components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Home, Activity, Shield, Bell, Moon, Sun } from 'lucide-react';
import { TemperatureControl } from './components/TemperatureControl';
import { LightSensor } from './components/LightSensor';
import { SecurityPanel } from './components/SecurityPanel';
import { AlertsList } from './components/AlertsList';
import { RoomCards } from './components/RoomCards';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner@2.0.3';
import { ThemeProvider, useTheme } from './components/ThemeProvider';
import { Button } from './components/ui/button';

export interface Alert {
  id: string;
  type: 'temperature' | 'security' | 'light';
  message: string;
  timestamp: Date;
  severity: 'low' | 'medium' | 'high';
}

export interface Room {
  id: string;
  name: string;
  temperature: number;
  targetTemp: number;
  lightLevel: number;
  isOccupied: boolean;
  autoMode: boolean;
  fanSpeed: number; // 0-100%
}

function Dashboard() {
  const { theme, toggleTheme } = useTheme();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [rooms, setRooms] = useState<Room[]>([
    {
      id: '1',
      name: 'Home',
      temperature: 24.5, // Starting temperature
      targetTemp: 21,    // Target temperature for cooling
      lightLevel: 65,
      isOccupied: true,
      autoMode: true,
      fanSpeed: 45,      // Will be recalculated based on temp
    },
  ]);

  const [alertInterval, setAlertInterval] = useState(1); // hours
  const [securityArmed, setSecurityArmed] = useState(true);

  // Add new alert
  const addAlert = (alert: Omit<Alert, 'id' | 'timestamp'>) => {
    const newAlert: Alert = {
      ...alert,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
    };
    setAlerts((prev) => [newAlert, ...prev].slice(0, 50)); // Keep last 50 alerts
    
    // Show toast notification
    const toastVariant = alert.severity === 'high' ? 'destructive' : 'default';
    toast[alert.severity === 'high' ? 'error' : 'info'](alert.message, {
      description: `${new Date().toLocaleTimeString()}`,
    });
  };

  // Calculate fan speed based on temperature (sensor-driven)
  // Temperature ranges from 16°C (min) to 35°C (max realistic indoor)
  // Fan speed: 0% at 16°C, 100% at 35°C
  const calculateFanSpeed = (temp: number): number => {
    const minTemp = 16;
    const maxTemp = 35;
    
    // Linear mapping: 16°C = 0%, 35°C = 100%
    const fanSpeed = ((temp - minTemp) / (maxTemp - minTemp)) * 100;
    
    // Clamp between 0 and 100
    return Math.max(0, Math.min(100, Math.round(fanSpeed)));
  };

  // Temperature monitoring and alerts
  useEffect(() => {
    const interval = setInterval(() => {
      rooms.forEach((room) => {
        const tempDiff = Math.abs(room.temperature - room.targetTemp);
        const tempStatus = room.temperature > room.targetTemp ? 'above' : room.temperature < room.targetTemp ? 'below' : 'at';
        
        // Send alert for all temperatures at each interval
        addAlert({
          type: 'temperature',
          message: `${room.name}: Temperature ${room.temperature.toFixed(1)}°C (${tempStatus} target ${room.targetTemp}°C) - Fan speed ${room.fanSpeed}%`,
          severity: tempDiff > 5 ? 'high' : tempDiff > 3 ? 'medium' : 'low',
        });
      });
    }, alertInterval * 3600000); // Convert hours to milliseconds

    return () => clearInterval(interval);
  }, [alertInterval, rooms]);

  // Simulate sensor readings - temperature sensor updates
  useEffect(() => {
    const interval = setInterval(() => {
      setRooms((prevRooms) =>
        prevRooms.map((room) => {
          // Simulate sensor reading with realistic fluctuation
          let sensorTemp = room.temperature;
          
          // Random temperature fluctuation from sensor (±0.3°C)
          const sensorNoise = (Math.random() - 0.5) * 0.6;
          sensorTemp += sensorNoise;
          
          // Auto mode: cooling system actively works to reach target
          if (room.autoMode) {
            const diff = room.targetTemp - sensorTemp;
            // Cooling effect is stronger when temperature is higher
            if (Math.abs(diff) > 0.1) {
              sensorTemp += diff * 0.15; // Gradual cooling/heating
            }
          }
          
          // Clamp temperature to realistic range (16-35°C)
          sensorTemp = Math.max(16, Math.min(35, sensorTemp));
          
          // Calculate fan speed based ONLY on temperature sensor reading
          const newFanSpeed = calculateFanSpeed(sensorTemp);
          
          return { 
            ...room, 
            temperature: Math.round(sensorTemp * 10) / 10,
            fanSpeed: newFanSpeed
          };
        })
      );
    }, 2000); // Sensor updates every 2 seconds

    return () => clearInterval(interval);
  }, []);

  // Simulate light sensor readings
  useEffect(() => {
    const interval = setInterval(() => {
      setRooms((prevRooms) =>
        prevRooms.map((room) => {
          // Light sensor reading with realistic changes
          const sensorChange = Math.floor(Math.random() * 8) - 4;
          const newLevel = Math.max(0, Math.min(100, room.lightLevel + sensorChange));
          return { ...room, lightLevel: newLevel };
        })
      );
    }, 4000); // Light sensor updates every 4 seconds

    return () => clearInterval(interval);
  }, []);

  // Security monitoring
  useEffect(() => {
    if (!securityArmed) return;

    const interval = setInterval(() => {
      const randomEvent = Math.random();
      
      if (randomEvent > 0.95) {
        addAlert({
          type: 'security',
          message: 'Motion detected in secured area',
          severity: 'high',
        });
      } else if (randomEvent > 0.92) {
        addAlert({
          type: 'security',
          message: 'Door sensor triggered',
          severity: 'medium',
        });
      }
    }, 20000);

    return () => clearInterval(interval);
  }, [securityArmed]);

  const updateRoomTemp = (roomId: string, targetTemp: number) => {
    setRooms((prev) =>
      prev.map((room) =>
        room.id === roomId ? { ...room, targetTemp } : room
      )
    );
  };

  const toggleAutoMode = (roomId: string) => {
    setRooms((prev) =>
      prev.map((room) =>
        room.id === roomId ? { ...room, autoMode: !room.autoMode } : room
      )
    );
  };

  const avgTemp = rooms.reduce((sum, room) => sum + room.temperature, 0) / rooms.length;
  const avgLight = rooms.reduce((sum, room) => sum + room.lightLevel, 0) / rooms.length;
  const avgFanSpeed = rooms.reduce((sum, room) => sum + room.fanSpeed, 0) / rooms.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-4 md:p-8 transition-colors">
      <Toaster />
      
      <div className="max-w-7xl mx-auto space-y-4 md:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-slate-900 dark:text-slate-100 flex items-center gap-3">
              <Home className="w-6 h-6 md:w-8 md:h-8 text-blue-600 dark:text-blue-400" />
              <span className="text-xl md:text-3xl">Smart Home Dashboard</span>
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1 text-sm md:text-base flex items-center gap-2">
              Monitor and control your home environment
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-400 rounded text-xs">
                <span className="w-1.5 h-1.5 bg-green-500 dark:bg-green-400 rounded-full animate-pulse"></span>
                Sensors Active
              </span>
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 md:w-5 md:h-5 text-slate-600 dark:text-slate-400" />
              <span className="text-slate-900 dark:text-slate-100 text-sm md:text-base">{alerts.length}</span>
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={toggleTheme}
              className="h-9 w-9 dark:border-slate-700"
            >
              {theme === 'light' ? (
                <Moon className="h-4 w-4" />
              ) : (
                <Sun className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="space-y-4 md:space-y-6">
          <TabsList className="grid w-full grid-cols-3 h-auto dark:bg-slate-800">
            <TabsTrigger value="overview" className="flex-col sm:flex-row gap-1 py-2 px-2 sm:px-4 dark:data-[state=active]:bg-slate-700">
              <Home className="w-4 h-4" />
              <span className="text-xs sm:text-sm">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="climate" className="flex-col sm:flex-row gap-1 py-2 px-2 sm:px-4 dark:data-[state=active]:bg-slate-700">
              <Activity className="w-4 h-4" />
              <span className="text-xs sm:text-sm">Climate</span>
            </TabsTrigger>
            <TabsTrigger value="security-alerts" className="flex-col sm:flex-row gap-1 py-2 px-2 sm:px-4 dark:data-[state=active]:bg-slate-700">
              <Shield className="w-4 h-4" />
              <span className="text-xs sm:text-sm">Security & Alerts</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 md:space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              <Card className="p-4 md:p-6 dark:bg-slate-800 dark:border-slate-700">
                <div className="space-y-2">
                  <p className="text-slate-600 dark:text-slate-400 text-sm">Temperature Sensor</p>
                  <p className="text-slate-900 dark:text-slate-100 text-2xl md:text-3xl">{avgTemp.toFixed(1)}°C</p>
                  <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 dark:bg-blue-400 transition-all"
                      style={{ width: `${(avgTemp / 35) * 100}%` }}
                    />
                  </div>
                </div>
              </Card>

              <Card className="p-4 md:p-6 dark:bg-slate-800 dark:border-slate-700 border-cyan-200 dark:border-cyan-900">
                <div className="space-y-2">
                  <p className="text-slate-600 dark:text-slate-400 text-sm">Fan Speed (Auto)</p>
                  <p className="text-cyan-600 dark:text-cyan-400 text-2xl md:text-3xl">{avgFanSpeed.toFixed(0)}%</p>
                  <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-400 to-cyan-600 dark:from-cyan-500 dark:to-cyan-300 transition-all"
                      style={{ width: `${avgFanSpeed}%` }}
                    />
                  </div>
                </div>
              </Card>

              <Card className="p-4 md:p-6 dark:bg-slate-800 dark:border-slate-700">
                <div className="space-y-2">
                  <p className="text-slate-600 dark:text-slate-400 text-sm">Light Sensor</p>
                  <p className="text-slate-900 dark:text-slate-100 text-2xl md:text-3xl">{avgLight.toFixed(0)}%</p>
                  <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-500 dark:bg-yellow-400 transition-all"
                      style={{ width: `${avgLight}%` }}
                    />
                  </div>
                </div>
              </Card>

              <Card className="p-4 md:p-6 dark:bg-slate-800 dark:border-slate-700">
                <div className="space-y-2">
                  <p className="text-slate-600 dark:text-slate-400 text-sm">Security Status</p>
                  <p className="text-slate-900 dark:text-slate-100 text-2xl md:text-3xl">
                    {securityArmed ? 'Armed' : 'Disarmed'}
                  </p>
                  <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        securityArmed ? 'bg-green-500 dark:bg-green-400' : 'bg-red-500 dark:bg-red-400'
                      }`}
                      style={{ width: securityArmed ? '100%' : '0%' }}
                    />
                  </div>
                </div>
              </Card>
            </div>

            <RoomCards
              rooms={rooms}
              onUpdateTemp={updateRoomTemp}
              onToggleAuto={toggleAutoMode}
            />
          </TabsContent>

          <TabsContent value="climate" className="space-y-4 md:space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
              <TemperatureControl
                rooms={rooms}
                onUpdateTemp={updateRoomTemp}
                onToggleAuto={toggleAutoMode}
              />
              <LightSensor rooms={rooms} />
            </div>
          </TabsContent>

          <TabsContent value="security-alerts" className="space-y-4 md:space-y-6">
            <SecurityPanel
              armed={securityArmed}
              onToggleArmed={setSecurityArmed}
              rooms={rooms}
            />
            <AlertsList
              alerts={alerts}
              alertInterval={alertInterval}
              onUpdateInterval={setAlertInterval}
              onClearAlerts={() => setAlerts([])}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <Dashboard />
    </ThemeProvider>
  );
}
