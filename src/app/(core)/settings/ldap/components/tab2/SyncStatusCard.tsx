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
import { Badge } from "@/components/ui/badge";
import { Clock, Calendar, Play, Pause, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";

import { BasicInfo, SyncSettings } from "../../types";
import {
  useCancelLdapSync,
  useSyncLdapUsers,
  useGetSyncStatus,
} from "../../hooks/useSync";
import { SyncHistory } from "../../types";
import { format } from "date-fns";

interface SyncScheduleFormProps {
  form: UseFormReturn<SyncSettings>;
  syncHistoryList: SyncHistory[];
  configId?: string;
}

const SyncStatusCard = ({
  form,
  syncHistoryList,
  configId,
}: SyncScheduleFormProps) => {
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
  const [isRunning, setIsRunning] = useState(false);
  const [currentSyncId, setCurrentSyncId] = useState<string | null>(null);
  const [syncStats, setSyncStats] = useState<{
    totalUsers: number; // Total users from AD
    usersAdded: number;
    usersUpdated: number;
    usersDeactivated: number;
    usersSkipped: number;
    errors: number;
    status: string;
  } | null>(null);

  // Poll sync status when sync is running
  // Continue polling until status is completed, failed, or cancelled
  const shouldPoll =
    !!currentSyncId && (isRunning || syncStats?.status === "in_progress");
  const syncStatusQuery = useGetSyncStatus(
    currentSyncId || undefined,
    shouldPoll
  );

  // Update sync stats when status is fetched
  useEffect(() => {
    if (syncStatusQuery.data) {
      const data = syncStatusQuery.data;
      const totalUsers = data.usersProcessed || 0;
      const usersAdded = data.usersAdded || 0;
      const usersUpdated = data.usersUpdated || 0;
      const usersDeactivated = data.usersDeactivated || 0;
      const usersSkipped = data.usersSkipped || 0;
      const errors = data.errors || 0;
      const status = data.status || "unknown";

      setSyncStats({
        totalUsers,
        usersAdded,
        usersUpdated,
        usersDeactivated,
        usersSkipped,
        errors,
        status,
      });

      // Handle status changes
      if (status === "completed") {
        setIsRunning(false);
        // Keep currentSyncId to continue showing stats, but stop polling
        // We'll stop polling by setting isRunning to false
        toast.success("LDAP sync completed successfully");
      } else if (status === "failed" || status === "cancelled") {
        setIsRunning(false);
        // Keep stats visible even after failure/cancellation
        if (status === "failed") {
          toast.error("LDAP sync failed");
        } else {
          toast.info("LDAP sync cancelled");
        }
      }
    }
  }, [syncStatusQuery.data]);

  // Load last sync stats on mount if available
  const lastSyncId = syncHistoryList?.[0]?.id;
  const lastSyncStatusQuery = useGetSyncStatus(
    lastSyncId,
    !isRunning && !currentSyncId && !!lastSyncId && !syncStats
  );

  // Update sync stats from last sync if available
  useEffect(() => {
    if (
      lastSyncStatusQuery.data &&
      !isRunning &&
      !currentSyncId &&
      !syncStats
    ) {
      const data = lastSyncStatusQuery.data;
      const totalUsers = data.usersProcessed || 0;
      const usersAdded = data.usersAdded || 0;
      const usersUpdated = data.usersUpdated || 0;
      const usersDeactivated = data.usersDeactivated || 0;
      const usersSkipped = data.usersSkipped || 0;
      const errors = data.errors || 0;
      const status = data.status || "unknown";

      setSyncStats({
        totalUsers,
        usersAdded,
        usersUpdated,
        usersDeactivated,
        usersSkipped,
        errors,
        status,
      });
    }
  }, [lastSyncStatusQuery.data, isRunning, currentSyncId, syncStats]);

  // Update last sync when history changes
  useEffect(() => {
    if (syncHistoryList?.[0]?.timestamp) {
      setLastSync(format(syncHistoryList[0].timestamp, "yyyy-MM-dd HH:mm:ss"));
    }
  }, [syncHistoryList]);

  // Form Actions
  const onSync = async () => {
    if (!configId) {
      toast.error(
        "Configuration ID is required. Please save your LDAP settings first."
      );
      return;
    }

    setIsRunning(true);
    setSyncStats(null);

    syncLdapMutation.mutate(configId, {
      onSuccess: (data) => {
        // Extract sync ID from response
        const syncId = data?.id || data?.data?.id;
        if (syncId) {
          setCurrentSyncId(syncId);
          toast.success("LDAP sync started successfully");
        } else {
          // Fallback for older API responses
          const usersFetched = data?.data?.users?.length || 0;
          setIsRunning(false);
          toast.success(`LDAP search completed found: (${usersFetched} users)`);
        }
      },
      onError: (e) => {
        setIsRunning(false);
        setCurrentSyncId(null);
        setSyncStats(null);
        toast.error(e?.message || "Failed to synchronize users from LDAP");
      },
    });
  };

  // Generate pause sync function
  const handlePauseSync = () => {
    cancelLdapSyncMutation.mutate(configId, {
      onSuccess: () => {
        setIsRunning(false);
        // Keep syncStats visible to show cancellation status
        // Don't clear currentSyncId immediately to allow final status fetch
        toast.success("Sync operation cancelled successfully");
      },
      onError: (e) => {
        toast.error(e?.message || "Failed to cancel sync operation");
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
              <span className="text-sm font-medium">{lastSync}</span>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Next Scheduled Sync</Label>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">{nextSync}</span>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Schedule Status</Label>
            <Badge
              variant={form.getValues("enabled") ? "default" : "secondary"}
              className="text-sm px-3 py-1"
            >
              {form.getValues("enabled") ? "Enabled" : "Disabled"}
            </Badge>
          </div>
        </div>

        <div className="flex gap-2 pt-2 border-t border-gray-200">
          <Button
            size="sm"
            onClick={onSync}
            size="sm"
            disabled={isRunning || syncLdapMutation.isPending || !configId}
            className="flex items-center gap-2"
          >
            {syncLdapMutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Play className="w-4 h-4" />
            )}
            Start Manual Sync
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handlePauseSync}
            size="sm"
            disabled={
              !isRunning || !configId || cancelLdapSyncMutation.isPending
            }
            className="flex items-center gap-2"
          >
            {cancelLdapSyncMutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Pause className="w-4 h-4" />
            )}
            Pause Sync
          </Button>
        </div>

        {(isRunning || syncStats) && (
          <div className="space-y-4 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold">
                {isRunning ? "Current Sync Status" : "Last Sync Results"}
              </Label>
              {syncStatusQuery.isFetching && isRunning && (
                <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
              )}
            </div>
            {syncStats && (
              <>
                {/* Prominent Status Badge */}
                {syncStats.status && (
                  <div className="flex items-center gap-3 pb-2">
                    <Badge
                      variant={
                        syncStats.status === "completed"
                          ? "default"
                          : syncStats.status === "failed"
                          ? "destructive"
                          : syncStats.status === "cancelled"
                          ? "secondary"
                          : syncStats.status === "in_progress"
                          ? "secondary"
                          : "outline"
                      }
                      className="text-sm font-semibold px-4 py-1.5"
                    >
                      {syncStats.status === "in_progress"
                        ? "🔄 In Progress"
                        : syncStats.status === "completed"
                        ? "✅ Completed"
                        : syncStats.status === "failed"
                        ? "❌ Failed"
                        : syncStats.status === "cancelled"
                        ? "⏸️ Cancelled"
                        : syncStats.status}
                    </Badge>
                    {syncStats.totalUsers > 0 && (
                      <span className="text-sm text-muted-foreground">
                        {syncStats.totalUsers} users processed
                      </span>
                    )}
                  </div>
                )}

                {/* Statistics Grid */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="space-y-1">
                    <span className="text-xs text-muted-foreground">Added</span>
                    <div className="text-sm font-semibold text-green-600 dark:text-green-500">
                      {syncStats.usersAdded}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs text-muted-foreground">
                      Updated
                    </span>
                    <div className="text-sm font-semibold text-blue-600 dark:text-blue-500">
                      {syncStats.usersUpdated}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs text-muted-foreground">
                      Deactivated
                    </span>
                    <div className="text-sm font-semibold text-orange-600 dark:text-orange-500">
                      {syncStats.usersDeactivated}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs text-muted-foreground">
                      Skipped
                    </span>
                    <div className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                      {syncStats.usersSkipped}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs text-muted-foreground">
                      Errors
                    </span>
                    <div className="text-sm font-semibold text-red-600 dark:text-red-500">
                      {syncStats.errors}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SyncStatusCard;
