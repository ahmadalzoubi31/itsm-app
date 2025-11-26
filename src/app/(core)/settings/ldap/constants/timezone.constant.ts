export const TIMEZONES = [
  { value: "UTC", label: "UTC (Coordinated Universal Time)" },
  { value: "Asia/Amman", label: "Jordan Time (UTC+3) – Asia/Amman" },
  { value: "Asia/Riyadh", label: "Saudi Arabia Time (UTC+3) – Asia/Riyadh" },
  { value: "Asia/Dubai", label: "UAE Time (UTC+4) – Asia/Dubai" },
  { value: "Africa/Cairo", label: "Egypt Time (UTC+2) – Africa/Cairo" },
  { value: "Europe/Istanbul", label: "Turkey Time (UTC+3) – Europe/Istanbul" },
  { value: "Asia/Tehran", label: "Iran Time (UTC+3:30) – Asia/Tehran" },
  { value: "Asia/Jerusalem", label: "Israel Time (UTC+3) – Asia/Jerusalem" },
  { value: "America/New_York", label: "EST (UTC-5) – America/New_York" },
  { value: "America/Los_Angeles", label: "PST (UTC-8) – America/Los_Angeles" },
  { value: "America/Chicago", label: "CST (UTC-6) – America/Chicago" },
  { value: "America/Denver", label: "MST (UTC-7) – America/Denver" },
  { value: "Europe/London", label: "GMT (UTC+0) – Europe/London" },
  { value: "Asia/Kolkata", label: "IST (UTC+5:30) – Asia/Kolkata" },
  { value: "Asia/Tokyo", label: "JST (UTC+9) – Asia/Tokyo" },
  { value: "Australia/Sydney", label: "AEST (UTC+10) – Australia/Sydney" },
  { value: "Europe/Berlin", label: "CET (UTC+1) – Europe/Berlin" },
] as const;

export type TimezoneValue = (typeof TIMEZONES)[number]["value"];
