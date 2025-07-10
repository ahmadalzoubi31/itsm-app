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
import { SyncScheduleFormSkeleton } from "./skeletons/SyncScheduleFormSkeleton";
import { SyncStatusCardSkeleton } from "./skeletons/SyncStatusCardSkeleton";
import { SyncHistoryCardSkeleton } from "./skeletons/SyncHistoryCardSkeleton";

export function SyncSchedule() {
  const { data: syncSettings, isLoading } = useGetSyncSettings();
  const { data: syncHistory, isLoading: syncHistoryLoading } =
    useGetSyncHistory();
  const saveSyncMutation = useSaveSyncSettings();
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<SyncSettings>({
    resolver: zodResolver(syncSchema),
    defaultValues: DEFAULT_SYNC_SETTINGS,
  });

  useEffect(() => {
    if (syncSettings) form.reset(syncSettings);
  }, [syncSettings]);

  const onSave = async (values: SyncSettings) => {
    setIsSaving(true);
    try {
      await saveSyncMutation.mutateAsync(values);
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
      {syncHistoryLoading ? (
        <SyncStatusCardSkeleton />
      ) : (
        <SyncStatusCard form={form} syncHistoryList={syncHistory || []} />
      )}
      {isLoading ? (
        <SyncScheduleFormSkeleton />
      ) : (
        <SyncScheduleForm form={form} onSave={onSave} isSaving={isSaving} />
      )}
      {syncHistoryLoading ? (
        <SyncHistoryCardSkeleton />
      ) : (
        <SyncHistoryCard syncHistoryList={syncHistory || []} />
      )}
    </div>
  );
}

export default SyncSchedule;
