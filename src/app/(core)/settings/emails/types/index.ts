
import { NotificationTypeEnum } from "../constants/notification-type.constant";
import { EmailTemplateTypeEnum } from "../constants/email-template.constant";

export enum EmailProtocolEnum {
  SMTP = "SMTP",
  IMAP = "IMAP",
  POP3 = "POP3"
}

export enum EmailSecurityEnum {
  NONE = "NONE",
  SSL_TLS = "SSL_TLS",
  STARTTLS = "STARTTLS"
}

export type OutgoingEmailEngine = {
  enabled: boolean;
  protocol: EmailProtocolEnum;
  host: string;
  port: number;
  secure: EmailSecurityEnum;
  username: string;
  password: string;
  fromEmail: string;
  fromName: string;
  replyTo?: string;
  timeout: number;
  connectionTimeout: number;
  maxConnections: number;
  rateLimitPerSecond: number;
};

export type IncomingEmailEngine = {
  enabled: boolean;
  protocol: EmailProtocolEnum;
  host: string;
  port: number;
  secure: EmailSecurityEnum;
  username: string;
  password: string;
  pollInterval: number; // in minutes
  autoProcessIncidents: boolean;
  autoAssignTo?: string;
  defaultPriority: string;
  emailToIncidentMapping: {
    subjectRegex: string;
    bodyRegex: string;
    categoryMapping: string;
    priorityMapping: string;
  }[];
};

export type NotificationSettings = {
  enabled: boolean;
  notificationTypes: NotificationTypeEnum[];
  defaultRecipients: string[];
  urgentRecipients: string[];
  ccRecipients: string[];
  bccRecipients: string[];
  subjectPrefix: string;
  includeAttachments: boolean;
  maxAttachmentSize: number; // in MB
  retryAttempts: number;
  retryDelay: number; // in seconds
  batchSize: number;
  throttleLimit: number; // emails per minute
};

export type EmailTemplate = {
  name: string;
  type: EmailTemplateTypeEnum;
  subject: string;
  htmlBody: string;
  textBody: string;
  variables: string[];
  isActive: boolean;
  language: string;
};

export type EmailSettings = {
  outgoing: OutgoingEmailEngine;
  incoming: IncomingEmailEngine;
  templates: EmailTemplate[];
  testEmail: string;
  lastTestResult?: {
    success: boolean;
    timestamp: Date;
    message: string;
    details?: any;
  };
};


export type EmailTestResult = {
  success: boolean;
  message: string;
  details?: {
    messageId?: string;
    response?: string;
    error?: string;
    duration?: number;
  };
};

export type EmailStatistics = {
  totalSent: number;
  totalFailed: number;
  last24Hours: number;
  last7Days: number;
  lastMonth: number;
  deliveryRate: number;
  averageDeliveryTime: number;
  lastSentAt?: Date;
}; 