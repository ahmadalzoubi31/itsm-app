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
});
