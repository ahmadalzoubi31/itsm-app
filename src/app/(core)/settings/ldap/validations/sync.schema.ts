import { z } from "zod";
import { FrequencyEnum } from "../constants/frequency.constant";

// Helper to normalize null to undefined
const nullToUndefined = <T extends z.ZodTypeAny>(schema: T) =>
  z.preprocess((val) => (val === null ? undefined : val), schema);

// Schema for sync fields only - used with BasicInfo type
// Using passthrough() to allow other BasicInfo fields to pass through
export const syncSchema = z
  .object({
    enabled: z.boolean(),
    frequency: z.enum([
      FrequencyEnum.HOURLY,
      FrequencyEnum.DAILY,
      FrequencyEnum.WEEKLY,
      FrequencyEnum.MONTHLY,
    ]),
    syncTime: nullToUndefined(z.string().optional()), // Handle null values
    timezone: z.string().min(1, "Timezone is required"),
    retryAttempts: z.number().min(1).max(10),
    retryInterval: z.number().min(5).max(120),
    fullSyncInterval: z.number().min(1).max(30),
    // Frequency-specific fields - handle null values
    syncMinute: nullToUndefined(z.number().min(0).max(59).optional()),
    daysOfWeek: nullToUndefined(
      z.array(z.number().min(0).max(6)).min(1).optional()
    ),
    daysOfMonth: nullToUndefined(
      z.array(z.number().min(1).max(31)).min(1).optional()
    ),
  })
  .passthrough()
  .superRefine((data, ctx) => {
    // Conditional validation based on frequency
    // Note: null values are normalized to undefined by preprocess
    if (data.frequency === FrequencyEnum.HOURLY) {
      if (data.syncMinute === undefined) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Sync minute is required for hourly frequency",
          path: ["syncMinute"],
        });
      }
    } else {
      // For DAILY, WEEKLY, and MONTHLY, syncTime is required
      if (!data.syncTime || data.syncTime.trim().length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Sync time is required",
          path: ["syncTime"],
        });
      }
    }
    if (data.frequency === FrequencyEnum.WEEKLY) {
      if (!data.daysOfWeek || data.daysOfWeek.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "At least one day of week is required for weekly frequency",
          path: ["daysOfWeek"],
        });
      }
    }
    if (data.frequency === FrequencyEnum.MONTHLY) {
      if (!data.daysOfMonth || data.daysOfMonth.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "At least one day of month is required for monthly frequency",
          path: ["daysOfMonth"],
        });
      }
    }
  });
