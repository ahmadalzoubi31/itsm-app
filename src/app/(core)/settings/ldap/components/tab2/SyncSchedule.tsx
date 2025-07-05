"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";

import { SyncSettings } from "../../types";
import { SyncScheduleForm } from "./SyncScheduleForm";
import { zodResolver } from "@hookform/resolvers/zod";
import { syncSchema } from "../../validations/sync.schema";
import { DEFAULT_SYNC_SETTINGS } from "../../constants/default.constant";

import {
  useSaveSyncSettings,
  useGetSyncSettings,
  useGetSyncHistory,
} from "../../hooks/useSync";
import { useForm } from "react-hook-form";
import SyncStatusCard from "./SyncStatusCard";
import SyncHistoryCard from "./SyncHistoryCard";

// Skeletons
import { SyncScheduleFormSkeleton } from "./skeletons/SyncScheduleFormSkeleton";
import { SyncStatusCardSkeleton } from "./skeletons/SyncStatusCardSkeleton";
import { SyncHistoryCardSkeleton } from "./skeletons/SyncHistoryCardSkeleton";

export const SyncSchedule = () => {
  // Data hooks
  const { data: syncSettings, isLoading } = useGetSyncSettings();
  const { data: syncHistory, isLoading: syncHistoryLoading } =
    useGetSyncHistory();
  const saveSyncMutation = useSaveSyncSettings();

  // UI state
  const [isSaving, setIsSaving] = useState(false);

  // Form setup
  const form = useForm<SyncSettings>({
    resolver: zodResolver(syncSchema),
    defaultValues: DEFAULT_SYNC_SETTINGS,
  });

  // Reset form with loaded settings
  useEffect(() => {
    if (syncSettings) {
      form.reset(syncSettings);
    }
  }, [syncSettings]);

  const onSave = async (values: SyncSettings) => {
    setIsSaving(true);
    try {
      await saveSyncMutation.mutateAsync(values);

      if (values.enabled) {
        const now = new Date();
        const nextSyncTime = new Date(now);
        nextSyncTime.setDate(now.getDate() + 1);
        nextSyncTime.setHours(
          parseInt(values.syncTime.split(":")[0]),
          parseInt(values.syncTime.split(":")[1])
        );
        // setNextSync(nextSyncTime.toLocaleString());
      } else {
        // setNextSync("Not scheduled");
      }

      // In a real app, you would call your API here
      // await saveSyncMutation.mutateAsync(values);

      toast.success("Schedule saved successfully");
    } catch (error) {
      toast.error("Failed to save schedule");
      console.error("Error saving schedule:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Sync Status */}
      {syncHistoryLoading ? (
        <SyncStatusCardSkeleton />
      ) : (
        <SyncStatusCard form={form} syncHistoryList={syncHistory || []} />
      )}

      {/* Sync Schedule */}
      {isLoading ? (
        <SyncScheduleFormSkeleton />
      ) : (
        <SyncScheduleForm form={form} onSave={onSave} isSaving={isSaving} />
      )}

      {/* Sync History */}
      {syncHistoryLoading ? (
        <SyncHistoryCardSkeleton />
      ) : (
        <SyncHistoryCard syncHistoryList={syncHistory || []} />
      )}
    </div>
  );
};
