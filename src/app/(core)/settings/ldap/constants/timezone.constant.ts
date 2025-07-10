export const TIMEZONES = [
  { value: "UTC", label: "UTC" },
  //   { value: "UTC", label: "UTC (Coordinated Universal Time)" },
  { value: "EST", label: "EST" },
  //   { value: "EST", label: "EST (Eastern Standard Time)" },
  { value: "PST", label: "PST" },
  //   { value: "PST", label: "PST (Pacific Standard Time)" },
  { value: "GMT", label: "GMT" },
  //   { value: "GMT", label: "GMT (Greenwich Mean Time)" },
  { value: "CST", label: "CST" },
  //   { value: "CST", label: "CST (Central Standard Time)" },
  { value: "MST", label: "MST" },
  //   { value: "MST", label: "MST (Mountain Standard Time)" },
  { value: "IST", label: "IST" },
  //   { value: "IST", label: "IST (Indian Standard Time)" },
  { value: "JST", label: "JST" },
  //   { value: "JST", label: "JST (Japan Standard Time)" },
  { value: "AEST", label: "AEST" },
  //   { value: "AEST", label: "AEST (Australian Eastern Standard Time)" },
  { value: "CET", label: "CET" },
  //   { value: "CET", label: "CET (Central European Time)" },
] as const;

export type TimezoneValue = (typeof TIMEZONES)[number]["value"];
