import { fetchWithAuth } from "@/lib/api/helper/fetchWithAuth";
import { getBackendUrl } from "@/lib/api/helper/getBackendUrl";
import { SETTINGS_ENDPOINTS } from "@/lib/api/endpoints/settings";
import {
  EmailSettings,
  NotificationSettings,
  EmailTemplate,
  EmailTestResult,
  EmailStatistics,
  IncomingEmailEngine,
} from "../types";
import { TestEmailForm } from "../validations/email.schema";

// Fetch all email settings
export async function fetchEmailSettings(): Promise<EmailSettings> {
  const res = await fetchWithAuth(getBackendUrl(SETTINGS_ENDPOINTS.email), {
    credentials: "include",
  });

  if (!res.ok) {
    const error = await res.json().catch(() => null);
    throw new Error(error?.message || "Failed to fetch email settings");
  }

  return res.json();
}

// Save (upsert) complete email settings
export async function saveEmailSettings(
  payload: Partial<EmailSettings>
): Promise<EmailSettings> {
  const body = { type: "EMAIL", jsonValue: payload };
  const res = await fetchWithAuth(getBackendUrl(SETTINGS_ENDPOINTS.email), {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => null);
    throw new Error(error?.message || "Failed to save email settings");
  }
  return res.json();
}

// Notification Settings API
export async function fetchNotificationSettings(): Promise<NotificationSettings> {
  const res = await fetchWithAuth(
    getBackendUrl(SETTINGS_ENDPOINTS.emailNotifications),
    {
      credentials: "include",
    }
  );

  if (!res.ok) {
    const error = await res.json().catch(() => null);
    throw new Error(error?.message || "Failed to fetch notification settings");
  }

  return res.json();
}

export async function saveNotificationSettings(
  payload: Partial<NotificationSettings>
): Promise<NotificationSettings> {
  const body = { type: "EMAIL_NOTIFICATIONS", jsonValue: payload };
  const res = await fetchWithAuth(
    getBackendUrl(SETTINGS_ENDPOINTS.emailNotifications),
    {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }
  );

  if (!res.ok) {
    const error = await res.json().catch(() => null);
    throw new Error(error?.message || "Failed to save notification settings");
  }
  return res.json();
}

// Email Templates API
export async function fetchEmailTemplates(): Promise<EmailTemplate[]> {
  const res = await fetchWithAuth(
    getBackendUrl(SETTINGS_ENDPOINTS.emailTemplates.base),
    {
      credentials: "include",
    }
  );

  if (!res.ok) {
    const error = await res.json().catch(() => null);
    throw new Error(error?.message || "Failed to fetch email templates");
  }

  return res.json();
}

export async function createEmailTemplate(
  payload: Omit<EmailTemplate, "id" | "createdAt" | "updatedAt">
): Promise<EmailTemplate> {
  const res = await fetchWithAuth(
    getBackendUrl(SETTINGS_ENDPOINTS.emailTemplates.base),
    {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }
  );

  if (!res.ok) {
    const error = await res.json().catch(() => null);
    throw new Error(error?.message || "Failed to create email template");
  }
  return res.json();
}

export async function updateEmailTemplate(
  id: string,
  payload: Partial<EmailTemplate>
): Promise<EmailTemplate> {
  const res = await fetchWithAuth(
    getBackendUrl(SETTINGS_ENDPOINTS.emailTemplates.byId(id)),
    {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }
  );

  if (!res.ok) {
    const error = await res.json().catch(() => null);
    throw new Error(error?.message || "Failed to update email template");
  }
  return res.json();
}

export async function deleteEmailTemplate(id: string): Promise<void> {
  const res = await fetchWithAuth(
    getBackendUrl(SETTINGS_ENDPOINTS.emailTemplates.byId(id)),
    {
      method: "DELETE",
      credentials: "include",
    }
  );

  if (!res.ok) {
    const error = await res.json().catch(() => null);
    throw new Error(error?.message || "Failed to delete email template");
  }
  return res.json();
}

// Email Testing API
export async function testEmailConnection(
  id: string
): Promise<EmailTestResult> {
  const res = await fetchWithAuth(
    getBackendUrl(SETTINGS_ENDPOINTS.emailChannels.testConnection(id)),
    {
      method: "POST",
      credentials: "include",
    }
  );

  if (!res.ok) {
    const error = await res.json().catch(() => null);
    throw new Error(error?.message || "Failed to test email connection");
  }
  return res.json();
}

export async function sendTestEmail(
  payload: TestEmailForm
): Promise<EmailTestResult> {
  const res = await fetchWithAuth(getBackendUrl(SETTINGS_ENDPOINTS.email), {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => null);
    throw new Error(error?.message || "Failed to send test email");
  }
  return res.json();
}

// Email Statistics API
export async function fetchEmailStatistics(): Promise<EmailStatistics> {
  const res = await fetchWithAuth(
    getBackendUrl(SETTINGS_ENDPOINTS.emailChannels.base),
    {
      credentials: "include",
    }
  );

  if (!res.ok) {
    const error = await res.json().catch(() => null);
    throw new Error(error?.message || "Failed to fetch email statistics");
  }

  return res.json();
}

// OAuth Setup APIs
export async function getOAuthAuthorizationUrl(
  provider: string
): Promise<{ authUrl: string }> {
  const res = await fetchWithAuth(
    getBackendUrl(SETTINGS_ENDPOINTS.emailChannels.base),
    {
      credentials: "include",
    }
  );

  if (!res.ok) {
    const error = await res.json().catch(() => null);
    throw new Error(error?.message || "Failed to get OAuth authorization URL");
  }

  return res.json();
}

export async function exchangeOAuthCode(
  provider: string,
  code: string,
  state?: string
): Promise<{ accessToken: string; refreshToken: string }> {
  const res = await fetchWithAuth(
    getBackendUrl(SETTINGS_ENDPOINTS.emailChannels.base),
    {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, state }),
    }
  );

  if (!res.ok) {
    const error = await res.json().catch(() => null);
    throw new Error(error?.message || "Failed to exchange OAuth code");
  }

  return res.json();
}

// Email Queue Management
export async function getEmailQueue(): Promise<any[]> {
  const res = await fetchWithAuth(
    getBackendUrl(SETTINGS_ENDPOINTS.emailChannels.base),
    {
      credentials: "include",
    }
  );

  if (!res.ok) {
    const error = await res.json().catch(() => null);
    throw new Error(error?.message || "Failed to fetch email queue");
  }

  return res.json();
}

export async function clearEmailQueue(): Promise<void> {
  const res = await fetchWithAuth(
    getBackendUrl(SETTINGS_ENDPOINTS.emailChannels.base),
    {
      method: "DELETE",
      credentials: "include",
    }
  );

  if (!res.ok) {
    const error = await res.json().catch(() => null);
    throw new Error(error?.message || "Failed to clear email queue");
  }

  return res.json();
}

export async function retryFailedEmails(): Promise<{ retried: number }> {
  const res = await fetchWithAuth(
    getBackendUrl(SETTINGS_ENDPOINTS.emailChannels.base),
    {
      method: "POST",
      credentials: "include",
    }
  );

  if (!res.ok) {
    const error = await res.json().catch(() => null);
    throw new Error(error?.message || "Failed to retry failed emails");
  }

  return res.json();
}
