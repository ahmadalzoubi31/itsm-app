import { z } from "zod";
import { 
  EmailProtocolEnum,
  EmailSecurityEnum,
} from "../types";
import { NotificationTypeEnum } from "../constants/notification-type.constant";
import { EmailTemplateTypeEnum } from "../constants/email-template.constant";

// Base validation schemas
export const emailSchema = z.string().email("Invalid email address");

export const portSchema = z.number()
  .min(1, "Port must be greater than 0")
  .max(65535, "Port must be less than 65536");

export const timeoutSchema = z.number()
  .min(1000, "Timeout must be at least 1 second")
  .max(300000, "Timeout cannot exceed 5 minutes");

// Outgoing Email Engine Schema
export const outgoingEmailEngineSchema = z.object({
  enabled: z.boolean(),
  protocol: z.nativeEnum(EmailProtocolEnum),
  host: z.string(),
  port: portSchema,
  secure: z.nativeEnum(EmailSecurityEnum),
  username: z.string(),
  password: z.string(),
  fromEmail: z.string(),
  fromName: z.string(),
  replyTo: emailSchema.optional().or(z.literal("")),
  timeout: timeoutSchema,
  connectionTimeout: timeoutSchema,
  maxConnections: z.number().min(1).max(100),
  rateLimitPerSecond: z.number().min(1).max(1000)
}).refine((data) => {
  // Only validate required fields when enabled
  if (!data.enabled) return true;
  
  return (
    data.host.trim().length > 0 &&
    data.username.trim().length > 0 &&
    data.password.trim().length > 0 &&
    data.fromEmail.trim().length > 0 &&
    data.fromName.trim().length > 0 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.fromEmail)
  );
}, {
  message: "All required fields must be filled and valid when outgoing email is enabled"
});

// Incoming Email Engine Schema
export const incomingEmailEngineSchema = z.object({
  enabled: z.boolean(),
  protocol: z.nativeEnum(EmailProtocolEnum),
  host: z.string(),
  port: portSchema,
  secure: z.nativeEnum(EmailSecurityEnum),
  username: z.string(),
  password: z.string(),
  pollInterval: z.number().min(1).max(1440),
  autoProcessIncidents: z.boolean(),
  autoAssignTo: z.string().optional(),
  defaultPriority: z.string(),
  emailToIncidentMapping: z.array(z.object({
    subjectRegex: z.string(),
    bodyRegex: z.string(),
    categoryMapping: z.string(),
    priorityMapping: z.string()
  }))
}).refine((data) => {
  // Only validate required fields when enabled
  if (!data.enabled) return true;
  
  return (
    data.host.trim().length > 0 &&
    data.username.trim().length > 0 &&
    data.password.trim().length > 0 &&
    data.defaultPriority.trim().length > 0
  );
}, {
  message: "All required fields must be filled when incoming email is enabled"
});

// Notification Settings Schema
export const notificationSettingsSchema = z.object({
  enabled: z.boolean(),
  notificationTypes: z.array(z.nativeEnum(NotificationTypeEnum)),
  defaultRecipients: z.array(emailSchema),
  urgentRecipients: z.array(emailSchema),
  ccRecipients: z.array(emailSchema),
  bccRecipients: z.array(emailSchema),
  subjectPrefix: z.string().max(50, "Subject prefix too long"),
  includeAttachments: z.boolean(),
  maxAttachmentSize: z.number().min(1).max(100),
  retryAttempts: z.number().min(0).max(10),
  retryDelay: z.number().min(1).max(3600),
  batchSize: z.number().min(1).max(1000),
  throttleLimit: z.number().min(1).max(10000)
});

// Email Template Schema
export const emailTemplateSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Template name is required").max(100),
  type: z.nativeEnum(EmailTemplateTypeEnum),
  subject: z.string().min(1, "Subject is required").max(998),
  htmlBody: z.string().min(1, "HTML body is required"),
  textBody: z.string().min(1, "Text body is required"),
  variables: z.array(z.string()),
  isActive: z.boolean(),
  language: z.string().min(2).max(5)
});

// Main Email Settings Schema
export const emailSettingsSchema = z.object({
  outgoing: outgoingEmailEngineSchema,
  incoming: incomingEmailEngineSchema,
  templates: z.array(emailTemplateSchema),
  testEmail: emailSchema.optional().or(z.literal("")),
  lastTestResult: z.object({
    success: z.boolean(),
    timestamp: z.date(),
    message: z.string(),
    details: z.any().optional()
  }).optional()
});


// Test Email Schema
export const testEmailSchema = z.object({
  to: emailSchema,
  subject: z.string().min(1, "Subject is required").max(998),
  body: z.string().min(1, "Body is required"),
  isHtml: z.boolean().default(false) as z.ZodType<boolean>
});

// Email Statistics Schema
export const emailStatisticsSchema = z.object({
  totalSent: z.number().min(0),
  totalFailed: z.number().min(0),
  last24Hours: z.number().min(0),
  last7Days: z.number().min(0),
  lastMonth: z.number().min(0),
  deliveryRate: z.number().min(0).max(100),
  averageDeliveryTime: z.number().min(0),
  lastSentAt: z.date().optional()
});

// Type inference
export type OutgoingEmailEngineForm = z.infer<typeof outgoingEmailEngineSchema>;
export type IncomingEmailEngineForm = z.infer<typeof incomingEmailEngineSchema>;
export type NotificationSettingsForm = z.infer<typeof notificationSettingsSchema>;
export type EmailTemplateForm = z.infer<typeof emailTemplateSchema>;
export type EmailSettingsForm = z.infer<typeof emailSettingsSchema>;
export type TestEmailForm = z.infer<typeof testEmailSchema>; 