import { useState } from "react";
import { useApp } from "../contexts/AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Switch } from "../components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Textarea } from "../components/ui/textarea";
import { storageService } from "../services/storageService";
import { useNotifications } from "../hooks/useNotifications";
import { 
  Settings as SettingsIcon, 
  Moon, 
  Sun, 
  Bell, 
  Clock, 
  Download, 
  Upload, 
  Trash2,
  User,
  Database
} from "lucide-react";

export default function Settings() {
  const { 
    profile, 
    settings, 
    theme, 
    updateProfile, 
    updateSettings,
    refreshData 
  } = useApp();
  
  const { showNotification, requestPermission } = useNotifications();
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  const handleProfileUpdate = async (updates: any) => {
    await updateProfile(updates);
    showNotification('Profile Updated', 'Your profile has been saved successfully');
  };

  const handleSettingsUpdate = async (updates: any) => {
    await updateSettings(updates);
    showNotification('Settings Updated', 'Your preferences have been saved');
  };

  const handleNotificationPermission = async () => {
    const granted = await requestPermission();
    if (granted) {
      await handleSettingsUpdate({ notifications: true });
      showNotification('Notifications Enabled', 'You will now receive reminders and updates');
    } else {
      showNotification('Permission Denied', 'Please enable notifications in your browser settings', 'warning');
    }
  };

  const handleExportData = async () => {
    try {
      setIsExporting(true);
      const data = await storageService.exportData();
      
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `streakify-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      showNotification('Data Exported', 'Your data has been downloaded successfully');
    } catch (error) {
      showNotification('Export Failed', 'Failed to export your data', 'error');
    } finally {
      setIsExporting(false);
    }
  };

  const handleImportData = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsImporting(true);
      const text = await file.text();
      await storageService.importData(text);
      await refreshData();
      
      showNotification('Data Imported', 'Your data has been restored successfully');
    } catch (error) {
      showNotification('Import Failed', 'Failed to import the selected file', 'error');
    } finally {
      setIsImporting(false);
      // Reset file input
      event.target.value = '';
    }
  };

  const handleClearData = async () => {
    if (window.confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      try {
        await storageService.clearAllData();
        window.location.reload();
      } catch (error) {
        showNotification('Clear Failed', 'Failed to clear data', 'error');
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Settings</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Customize your Streakify experience
          </p>
        </div>
      </div>

      {/* Profile Settings */}
      <Card className="card-hover border-aqua-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800 dark:text-white flex items-center">
            <User className="w-5 h-5 mr-2" />
            Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="name">Display Name</Label>
            <Input
              id="name"
              value={profile?.name || ''}
              onChange={(e) => handleProfileUpdate({ name: e.target.value })}
              placeholder="Enter your name"
            />
          </div>
        </CardContent>
      </Card>

      {/* Appearance Settings */}
      <Card className="card-hover border-aqua-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800 dark:text-white flex items-center">
            {theme === 'light' ? (
              <Sun className="w-5 h-5 mr-2" />
            ) : (
              <Moon className="w-5 h-5 mr-2" />
            )}
            Appearance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="theme">Dark Mode</Label>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Switch between light and dark themes
              </p>
            </div>
            <Switch
              id="theme"
              checked={theme === 'dark'}
              onCheckedChange={(checked) => 
                handleSettingsUpdate({ theme: checked ? 'dark' : 'light' })
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card className="card-hover border-aqua-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800 dark:text-white flex items-center">
            <Bell className="w-5 h-5 mr-2" />
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="notifications">Enable Notifications</Label>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Receive reminders and achievement notifications
              </p>
            </div>
            <Switch
              id="notifications"
              checked={settings.notifications}
              onCheckedChange={(checked) => {
                if (checked) {
                  handleNotificationPermission();
                } else {
                  handleSettingsUpdate({ notifications: false });
                }
              }}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="sound">Sound Effects</Label>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Play sounds for notifications and timer alerts
              </p>
            </div>
            <Switch
              id="sound"
              checked={settings.soundEnabled}
              onCheckedChange={(checked) => 
                handleSettingsUpdate({ soundEnabled: checked })
              }
            />
          </div>

          <div>
            <Label htmlFor="reminderTime">Daily Goal Reminder</Label>
            <Input
              id="reminderTime"
              type="time"
              value={settings.dailyGoalReminderTime}
              onChange={(e) => 
                handleSettingsUpdate({ dailyGoalReminderTime: e.target.value })
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Pomodoro Settings */}
      <Card className="card-hover border-aqua-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800 dark:text-white flex items-center">
            <Clock className="w-5 h-5 mr-2" />
            Pomodoro Timer
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="pomodoroLength">Focus Duration (minutes)</Label>
              <Input
                id="pomodoroLength"
                type="number"
                min={5}
                max={60}
                value={settings.pomodoroLength}
                onChange={(e) => 
                  handleSettingsUpdate({ pomodoroLength: parseInt(e.target.value) })
                }
              />
            </div>
            <div>
              <Label htmlFor="shortBreak">Short Break (minutes)</Label>
              <Input
                id="shortBreak"
                type="number"
                min={1}
                max={30}
                value={settings.shortBreakLength}
                onChange={(e) => 
                  handleSettingsUpdate({ shortBreakLength: parseInt(e.target.value) })
                }
              />
            </div>
            <div>
              <Label htmlFor="longBreak">Long Break (minutes)</Label>
              <Input
                id="longBreak"
                type="number"
                min={5}
                max={60}
                value={settings.longBreakLength}
                onChange={(e) => 
                  handleSettingsUpdate({ longBreakLength: parseInt(e.target.value) })
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card className="card-hover border-aqua-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800 dark:text-white flex items-center">
            <Database className="w-5 h-5 mr-2" />
            Data Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-gray-800 dark:text-white mb-2">
                Export Data
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Download a backup of all your data as a JSON file
              </p>
              <Button
                onClick={handleExportData}
                disabled={isExporting}
                className="w-full bg-aqua-500 hover:bg-aqua-600 text-white"
              >
                <Download className="w-4 h-4 mr-2" />
                {isExporting ? 'Exporting...' : 'Export Data'}
              </Button>
            </div>

            <div>
              <h4 className="font-medium text-gray-800 dark:text-white mb-2">
                Import Data
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Restore your data from a previously exported backup file
              </p>
              <div className="relative">
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportData}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={isImporting}
                />
                <Button
                  variant="outline"
                  disabled={isImporting}
                  className="w-full"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {isImporting ? 'Importing...' : 'Import Data'}
                </Button>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <h4 className="font-medium text-gray-800 dark:text-white mb-2">
              Reset All Data
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Permanently delete all your data. This action cannot be undone.
            </p>
            <Button
              onClick={handleClearData}
              variant="destructive"
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear All Data
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* App Information */}
      <Card className="card-hover border-aqua-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800 dark:text-white flex items-center">
            <SettingsIcon className="w-5 h-5 mr-2" />
            About Streakify
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Version</span>
              <span className="text-gray-800 dark:text-white">1.0.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Storage Type</span>
              <span className="text-gray-800 dark:text-white">Local Storage</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Offline Support</span>
              <span className="text-gray-800 dark:text-white">✅ Enabled</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">PWA Installed</span>
              <span className="text-gray-800 dark:text-white">
                {window.matchMedia('(display-mode: standalone)').matches ? '✅ Yes' : '❌ No'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
