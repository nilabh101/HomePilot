import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Bell, Thermometer, Shield, Sun, Trash2, Clock } from 'lucide-react';
import { Alert } from '../App';

interface AlertsListProps {
  alerts: Alert[];
  alertInterval: number;
  onUpdateInterval: (interval: number) => void;
  onClearAlerts: () => void;
}

export function AlertsList({
  alerts,
  alertInterval,
  onUpdateInterval,
  onClearAlerts,
}: AlertsListProps) {
  const getAlertIcon = (type: Alert['type']) => {
    switch (type) {
      case 'temperature':
        return <Thermometer className="w-4 h-4" />;
      case 'security':
        return <Shield className="w-4 h-4" />;
      case 'light':
        return <Sun className="w-4 h-4" />;
    }
  };

  const getSeverityColor = (severity: Alert['severity']) => {
    switch (severity) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'default';
      case 'low':
        return 'secondary';
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <Card className="p-4 md:p-6 dark:bg-slate-800 dark:border-slate-700">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 md:mb-6">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h2 className="text-slate-900 dark:text-slate-100">Alert Settings</h2>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onClearAlerts}
            disabled={alerts.length === 0}
            className="dark:border-slate-600"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Clear All
          </Button>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="interval" className="flex items-center gap-2 dark:text-slate-200">
              <Clock className="w-4 h-4" />
              Temperature Alert Interval
            </Label>
            <div className="flex items-center gap-4">
              <Input
                id="interval"
                type="number"
                min="0.1"
                max="24"
                step="0.1"
                value={alertInterval}
                onChange={(e) => onUpdateInterval(Number(e.target.value))}
                className="w-32 dark:bg-slate-900 dark:border-slate-700"
              />
              <span className="text-slate-600 dark:text-slate-400">hours</span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              Temperature alerts will be sent every {alertInterval} {alertInterval === 1 ? 'hour' : 'hours'} when temperature
              deviates from target
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-4 md:p-6 dark:bg-slate-800 dark:border-slate-700">
        <div className="mb-4">
          <h2 className="text-slate-900 dark:text-slate-100 mb-1">Recent Alerts</h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm">
            {alerts.length} total alert{alerts.length !== 1 ? 's' : ''}
          </p>
        </div>

        <div className="space-y-3 max-h-[400px] md:max-h-[600px] overflow-y-auto">
          {alerts.length === 0 ? (
            <div className="text-center py-8 md:py-12">
              <Bell className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
              <p className="text-slate-600 dark:text-slate-400">No alerts yet</p>
              <p className="text-slate-500 dark:text-slate-500 text-sm">
                Alerts will appear here when triggered
              </p>
            </div>
          ) : (
            alerts.map((alert) => (
              <div
                key={alert.id}
                className="flex items-start gap-3 p-3 md:p-4 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors"
              >
                <div
                  className={`p-2 rounded-lg ${
                    alert.severity === 'high'
                      ? 'bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400'
                      : alert.severity === 'medium'
                      ? 'bg-yellow-100 dark:bg-yellow-950/50 text-yellow-600 dark:text-yellow-400'
                      : 'bg-blue-100 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400'
                  }`}
                >
                  {getAlertIcon(alert.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-1">
                    <p className="text-slate-900 dark:text-slate-100 text-sm md:text-base">{alert.message}</p>
                    <Badge variant={getSeverityColor(alert.severity)} className="shrink-0 w-fit text-xs">
                      {alert.severity}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 text-xs md:text-sm">
                    <Badge variant="outline" className="capitalize text-xs dark:border-slate-600">
                      {alert.type}
                    </Badge>
                    <span>•</span>
                    <span>{alert.timestamp.toLocaleTimeString()}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}
