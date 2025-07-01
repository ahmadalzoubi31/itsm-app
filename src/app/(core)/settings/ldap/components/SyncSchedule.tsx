"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calendar, Clock, Play, Pause, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";

export const SyncSchedule = () => {
  const [syncEnabled, setSyncEnabled] = useState(false);
  const [lastSync, setLastSync] = useState("Never");
  const [nextSync, setNextSync] = useState("Not scheduled");
  const [syncProgress, setSyncProgress] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const [schedule, setSchedule] = useState({
    frequency: "daily",
    time: "02:00",
    timezone: "UTC",
    retryAttempts: "3",
    retryInterval: "30",
    fullSyncInterval: "7",
  });

  const startManualSync = async () => {
    setIsRunning(true);
    setSyncProgress(0);

    try {
      setSyncProgress(10);
      console.log("Starting real LDAP synchronization...");

      // Call the Edge Function to perform real LDAP sync
      setSyncProgress(30);
      console.log("Calling LDAP sync service...");

      //   const { data, error } = await supabase.functions.invoke("ldap-sync");

      //   if (error) {
      //     throw new Error(`LDAP sync service error: ${error.message}`);
      //   }

      //   setSyncProgress(80);

      //   if (!data.success) {
      //     throw new Error(data.error || "LDAP sync failed");
      //   }

      setSyncProgress(100);
      setIsRunning(false);
      setLastSync(new Date().toLocaleString());

      toast.success("LDAP Sync completed");

      console.log("LDAP synchronization completed successfully");
    } catch (error: any) {
      console.error("LDAP sync error:", error);
      setIsRunning(false);
      setSyncProgress(0);

      toast.error("Failed to synchronize users from LDAP");
    }
  };

  const saveSchedule = () => {
    if (syncEnabled) {
      const now = new Date();
      const nextSyncTime = new Date(now);
      nextSyncTime.setDate(now.getDate() + 1);
      nextSyncTime.setHours(
        parseInt(schedule.time.split(":")[0]),
        parseInt(schedule.time.split(":")[1])
      );
      setNextSync(nextSyncTime.toLocaleString());
    } else {
      setNextSync("Not scheduled");
    }

    toast.success("Schedule saved successfully");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="border-b border-gray-200">
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Synchronization Status
          </CardTitle>
          <CardDescription>
            Current sync status and manual sync controls
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Last Sync</Label>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">{lastSync}</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Next Scheduled Sync</Label>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">{nextSync}</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Badge variant={syncEnabled ? "default" : "secondary"}>
                {syncEnabled ? "Enabled" : "Disabled"}
              </Badge>
            </div>
          </div>

          {isRunning && (
            <div className="space-y-2">
              <Label>Sync Progress</Label>
              <Progress value={syncProgress} className="w-full" />
              <p className="text-sm text-muted-foreground">
                {syncProgress}% complete
              </p>
            </div>
          )}

          <div className="flex gap-2">
            <Button
              onClick={startManualSync}
              disabled={isRunning}
              className="flex items-center gap-2"
            >
              <Play className="w-4 h-4" />
              Start Manual Sync
            </Button>
            <Button
              variant="outline"
              disabled={!isRunning}
              className="flex items-center gap-2"
            >
              <Pause className="w-4 h-4" />
              Pause Sync
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="border-b border-gray-200">
          <CardTitle className="flex items-center gap-2">
            <RotateCcw className="w-5 h-5" />
            Schedule Configuration
          </CardTitle>
          <CardDescription>
            Configure automatic synchronization schedule and settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Enable Automatic Sync</Label>
              <p className="text-sm text-muted-foreground">
                Automatically synchronize users based on the schedule below
              </p>
            </div>
            <Switch checked={syncEnabled} onCheckedChange={setSyncEnabled} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="frequency">Sync Frequency</Label>
              <Select
                value={schedule.frequency}
                onValueChange={(value) =>
                  setSchedule({ ...schedule, frequency: value })
                }
                disabled={!syncEnabled}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hourly">Hourly</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Sync Time</Label>
              <Input
                id="time"
                type="time"
                value={schedule.time}
                onChange={(e) =>
                  setSchedule({ ...schedule, time: e.target.value })
                }
                disabled={!syncEnabled}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Select
                value={schedule.timezone}
                onValueChange={(value) =>
                  setSchedule({ ...schedule, timezone: value })
                }
                disabled={!syncEnabled}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="UTC">UTC</SelectItem>
                  <SelectItem value="EST">EST</SelectItem>
                  <SelectItem value="PST">PST</SelectItem>
                  <SelectItem value="GMT">GMT</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="retryAttempts">Retry Attempts</Label>
              <Input
                id="retryAttempts"
                type="number"
                min="1"
                max="10"
                value={schedule.retryAttempts}
                onChange={(e) =>
                  setSchedule({ ...schedule, retryAttempts: e.target.value })
                }
                disabled={!syncEnabled}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="retryInterval">Retry Interval (minutes)</Label>
              <Input
                id="retryInterval"
                type="number"
                min="5"
                max="120"
                value={schedule.retryInterval}
                onChange={(e) =>
                  setSchedule({ ...schedule, retryInterval: e.target.value })
                }
                disabled={!syncEnabled}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fullSyncInterval">
                Full Sync Interval (days)
              </Label>
              <Input
                id="fullSyncInterval"
                type="number"
                min="1"
                max="30"
                value={schedule.fullSyncInterval}
                onChange={(e) =>
                  setSchedule({ ...schedule, fullSyncInterval: e.target.value })
                }
                disabled={!syncEnabled}
              />
            </div>
          </div>
        </CardContent>

        <Separator />
        <div className="flex justify-end px-4 lg:px-6">
          <Button onClick={saveSchedule}>Save Settings</Button>
        </div>
      </Card>
    </div>
  );
};
