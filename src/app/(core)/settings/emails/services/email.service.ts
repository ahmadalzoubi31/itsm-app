import { ApiResponse } from "@/types/globals";
import { fetchWithAuth } from "@/utils/fetxhWithAuth";
import { getBackendUrl } from "@/utils/getBackendUrl";
import { 
  EmailSettings,   
  NotificationSettings,
  EmailTemplate,
  EmailTestResult,
  EmailStatistics,
  IncomingEmailEngine
} from "../types";
import { TestEmailForm } from "../validations/email.schema";

// Fetch all email settings
export async function fetchEmailSettings(): Promise<ApiResponse<EmailSettings>> {
  const res = await fetchWithAuth(getBackendUrl("/api/settings/EMAIL"), {
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
): Promise<ApiResponse<EmailSettings>> {
  const body = { type: "EMAIL", jsonValue: payload };
  const res = await fetchWithAuth(getBackendUrl("/api/settings"), {
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
export async function fetchNotificationSettings(): Promise<ApiResponse<NotificationSettings>> {
  const res = await fetchWithAuth(getBackendUrl("/api/settings/EMAIL_NOTIFICATIONS"), {
    credentials: "include",    
  });

  if (!res.ok) {
    const error = await res.json().catch(() => null);
    throw new Error(error?.message || "Failed to fetch notification settings");
  }

  return res.json();
}

export async function saveNotificationSettings(
  payload: Partial<NotificationSettings>
): Promise<ApiResponse<NotificationSettings>> {
  const body = { type: "EMAIL_NOTIFICATIONS", jsonValue: payload };
  const res = await fetchWithAuth(getBackendUrl("/api/settings"), {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => null);
    throw new Error(error?.message || "Failed to save notification settings");
  }
  return res.json();
}

// Email Templates API
export async function fetchEmailTemplates(): Promise<ApiResponse<EmailTemplate[]>> {
  const res = await fetchWithAuth(getBackendUrl("/api/email/templates"), {
    credentials: "include",
  });

  if (!res.ok) {
    const error = await res.json().catch(() => null);
    throw new Error(error?.message || "Failed to fetch email templates");
  }

  return res.json();
}

export async function createEmailTemplate(
  payload: Omit<EmailTemplate, "id" | "createdAt" | "updatedAt">
): Promise<ApiResponse<EmailTemplate>> {
  const res = await fetchWithAuth(getBackendUrl("/api/email/templates"), {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => null);
    throw new Error(error?.message || "Failed to create email template");
  }
  return res.json();
}

export async function updateEmailTemplate(
  id: string,
  payload: Partial<EmailTemplate>
): Promise<ApiResponse<EmailTemplate>> {
  const res = await fetchWithAuth(getBackendUrl(`/api/email/templates/${id}`), {
    method: "PUT",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => null);
    throw new Error(error?.message || "Failed to update email template");
  }
  return res.json();
}

export async function deleteEmailTemplate(id: string): Promise<ApiResponse<void>> {
  const res = await fetchWithAuth(getBackendUrl(`/api/email/templates/${id}`), {
    method: "DELETE",
    credentials: "include",
  });

  if (!res.ok) {
    const error = await res.json().catch(() => null);
    throw new Error(error?.message || "Failed to delete email template");
  }
  return res.json();
}

// Email Testing API
export async function testEmailConnection(): Promise<ApiResponse<EmailTestResult>> {
  const res = await fetchWithAuth(getBackendUrl("/api/email/test-connection"), {
    method: "POST",
    credentials: "include",
  });

  if (!res.ok) {
    const error = await res.json().catch(() => null);
    throw new Error(error?.message || "Failed to test email connection");
  }
  return res.json();
}

export async function sendTestEmail(
  payload: TestEmailForm
): Promise<ApiResponse<EmailTestResult>> {
  const res = await fetchWithAuth(getBackendUrl("/api/email/send-test"), {
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
export async function fetchEmailStatistics(): Promise<ApiResponse<EmailStatistics>> {
  const res = await fetchWithAuth(getBackendUrl("/api/email/statistics"), {
    credentials: "include",
  });

  if (!res.ok) {
    const error = await res.json().catch(() => null);
    throw new Error(error?.message || "Failed to fetch email statistics");
  }

  return res.json();
}

// OAuth Setup APIs
export async function getOAuthAuthorizationUrl(provider: string): Promise<ApiResponse<{ authUrl: string }>> {
  const res = await fetchWithAuth(getBackendUrl(`/api/email/oauth/${provider}/auth-url`), {
    credentials: "include",
  });

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
): Promise<ApiResponse<{ accessToken: string; refreshToken: string }>> {
  const res = await fetchWithAuth(getBackendUrl(`/api/email/oauth/${provider}/exchange`), {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code, state }),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => null);
    throw new Error(error?.message || "Failed to exchange OAuth code");
  }

  return res.json();
}

// Email Queue Management
export async function getEmailQueue(): Promise<ApiResponse<any[]>> {
  const res = await fetchWithAuth(getBackendUrl("/api/email/queue"), {
    credentials: "include",
  });

  if (!res.ok) {
    const error = await res.json().catch(() => null);
    throw new Error(error?.message || "Failed to fetch email queue");
  }

  return res.json();
}

export async function clearEmailQueue(): Promise<ApiResponse<void>> {
  const res = await fetchWithAuth(getBackendUrl("/api/email/queue"), {
    method: "DELETE",
    credentials: "include",
  });

  if (!res.ok) {
    const error = await res.json().catch(() => null);
    throw new Error(error?.message || "Failed to clear email queue");
  }

  return res.json();
}

export async function retryFailedEmails(): Promise<ApiResponse<{ retried: number }>> {
  const res = await fetchWithAuth(getBackendUrl("/api/email/retry-failed"), {
    method: "POST",
    credentials: "include",
  });

  if (!res.ok) {
    const error = await res.json().catch(() => null);
    throw new Error(error?.message || "Failed to retry failed emails");
  }

  return res.json();
} 