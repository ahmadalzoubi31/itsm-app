import { z } from "zod";
import { FrequencyEnum } from "../constants/frequency.constant";

export const syncSchema = z.object({
  enabled: z.boolean(),
  frequency: z.enum([
    FrequencyEnum.HOURLY,
    FrequencyEnum.DAILY,
    FrequencyEnum.WEEKLY,
    FrequencyEnum.MONTHLY,
  ]),
  syncTime: z.string(),
  timezone: z.string(),
  retryAttempts: z.number(),
  retryInterval: z.number(),
  fullSyncInterval: z.number(),
  // Frequency-specific fields
  syncMinute: z.number().min(0).max(59).optional(),
  daysOfWeek: z.array(z.number().min(0).max(6)).min(1).optional(),
  daysOfMonth: z.array(z.number().min(1).max(31)).min(1).optional(),
}).refine((data) => {
  // Conditional validation based on frequency
  if (data.frequency === FrequencyEnum.HOURLY && data.syncMinute === undefined) {
    return false;
  }
  if (data.frequency === FrequencyEnum.WEEKLY && (!data.daysOfWeek || data.daysOfWeek.length === 0)) {
    return false;
  }
  if (data.frequency === FrequencyEnum.MONTHLY && (!data.daysOfMonth || data.daysOfMonth.length === 0)) {
    return false;
  }
  return true;
}, {
  message: "Required fields missing for selected frequency",
});
