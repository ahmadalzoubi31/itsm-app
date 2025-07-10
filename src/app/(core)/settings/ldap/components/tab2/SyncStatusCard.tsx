"use client";

import { toast } from "sonner";
import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Clock, Calendar, Play, Pause } from "lucide-react";
import { useState } from "react";

import { SyncSettings } from "../../types";
import { useCancelLdapSync, useSyncLdapUsers } from "../../hooks/useSync";
import { SyncHistory } from "../../types";
import { format } from "date-fns";

interface SyncScheduleFormProps {
  form: UseFormReturn<SyncSettings>;
  syncHistoryList: SyncHistory[];
}

const SyncStatusCard = ({ form, syncHistoryList }: SyncScheduleFormProps) => {
  // Data hooks
  const syncLdapMutation = useSyncLdapUsers();
  const cancelLdapSyncMutation = useCancelLdapSync();

  // UI state
  const [lastSync, setLastSync] = useState(
    syncHistoryList?.[0]?.timestamp
      ? format(syncHistoryList?.[0]?.timestamp, "yyyy-MM-dd HH:mm:ss")
      : "Never"
  );
  const [nextSync, setNextSync] = useState("Not scheduled");
  const [syncProgress, setSyncProgress] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  // Form Actions
  const onSync = async () => {
    setIsRunning(true);
    setSyncProgress(10);

    syncLdapMutation.mutate(undefined, {
      onSuccess: (data) => {
        const usersFetched = data?.data?.users.length || 0;

        setSyncProgress(100);
        setIsRunning(false);
        toast.success(`LDAP search completed found: (${usersFetched} users)`);
      },
      onError: () => {
        setSyncProgress(0);
        setIsRunning(false);

        toast.error("Failed to synchronize users from LDAP");
      },
    });
  };

  // Generate pause sync function
  const handlePauseSync = () => {
    cancelLdapSyncMutation.mutate(undefined, {
      onSuccess: () => {
        setIsRunning(false);
        setSyncProgress(0);
        toast.success("Sync operation cancelled successfully");
      },
      onError: () => {
        toast.error("Failed to cancel sync operation");
      },
    });
  };

  return (
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
            <Badge
              variant={form.getValues("enabled") ? "default" : "secondary"}
            >
              {form.getValues("enabled") ? "Enabled" : "Disabled"}
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
            onClick={onSync}
            size="sm"
            disabled={isRunning || syncLdapMutation.isPending}
            className="flex items-center gap-2"
          >
            <Play className="w-4 h-4" />
            Start Manual Sync
          </Button>
          <Button
            variant="outline"
            onClick={handlePauseSync}
            size="sm"
            disabled={!isRunning}
            className="flex items-center gap-2"
          >
            <Pause className="w-4 h-4" />
            Pause Sync
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SyncStatusCard;
