"use client";

import { useState, useEffect } from "react";
import { FrequencyEnum } from "../../constants/frequency.constant";
import { toast } from "sonner";
import { BasicInfo, SyncSettings } from "../../types";
import { SyncScheduleForm } from "./SyncScheduleForm";
import { zodResolver } from "@hookform/resolvers/zod";
import { syncSchema } from "../../validations/sync.schema";
import {
  DEFAULT_LDAP_SETTINGS,
  DEFAULT_SYNC_SETTINGS,
} from "../../constants/default.constant";
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
  const configId = syncSettings?.[0]?.id;
  const {
    data: syncHistory,
    isLoading: syncHistoryLoading,
    isFetching: syncHistoryFetching,
    refetch: refetchSyncHistory,
  } = useGetSyncHistory(configId);
  const saveSyncMutation = useSaveSyncSettings();
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<SyncSettings>({
    resolver: zodResolver(syncSchema) as any, // Type assertion needed due to passthrough() in schema
    defaultValues: DEFAULT_SYNC_SETTINGS,
  });

  useEffect(() => {
    if (syncSettings && syncSettings.length > 0) {
      const settings = syncSettings[0] as unknown as SyncSettings;
      // Normalize null values to undefined before resetting form
      const normalizedSettings: Partial<SyncSettings> = {
        ...settings,
        // Ensure frequency is set and is a valid FrequencyEnum value
        frequency:
          settings.frequency &&
          Object.values(FrequencyEnum).includes(
            settings.frequency as FrequencyEnum
          )
            ? settings.frequency
            : FrequencyEnum.DAILY,
        syncTime: settings.syncTime === null ? undefined : settings.syncTime,
        syncMinute:
          settings.syncMinute === null ? undefined : settings.syncMinute,
        daysOfWeek:
          settings.daysOfWeek === null ? undefined : settings.daysOfWeek,
        daysOfMonth:
          settings.daysOfMonth === null ? undefined : settings.daysOfMonth,
      };
      form.reset(normalizedSettings as SyncSettings);
    }
  }, [syncSettings, form]);

  // Handle frequency change to set appropriate defaults
  useEffect(() => {
    const frequency = form.watch("frequency");
    const currentValues = form.getValues();

    switch (frequency) {
      case FrequencyEnum.HOURLY:
        if (
          currentValues.syncMinute === undefined ||
          currentValues.syncMinute === null
        ) {
          form.setValue("syncMinute", 0);
        }
        break;
      case FrequencyEnum.WEEKLY:
        if (
          !currentValues.daysOfWeek ||
          currentValues.daysOfWeek.length === 0
        ) {
          form.setValue("daysOfWeek", [0]); // Sunday by default
        }
        break;
      case FrequencyEnum.MONTHLY:
        if (
          !currentValues.daysOfMonth ||
          currentValues.daysOfMonth.length === 0
        ) {
          form.setValue("daysOfMonth", [1]); // 1st day of month by default
        }
        break;
    }
  }, [form.watch("frequency")]);

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
        <SyncStatusCard
          form={form}
          syncHistoryList={syncHistory || []}
          configId={configId}
        />
      )}
      {isLoading ? (
        <SyncScheduleFormSkeleton />
      ) : (
        <SyncScheduleForm form={form} onSave={onSave} isSaving={isSaving} />
      )}
      {syncHistoryLoading ? (
        <SyncHistoryCardSkeleton />
      ) : (
        <SyncHistoryCard
          syncHistoryList={syncHistory || []}
          onRefresh={() => refetchSyncHistory()}
          isRefreshing={syncHistoryLoading}
          isAutoRefreshing={syncHistoryFetching && !syncHistoryLoading}
        />
      )}
    </div>
  );
}

export default SyncSchedule;
