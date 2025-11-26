export const STATUS = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
} as const;

export type StatusEnum = (typeof STATUS)[keyof typeof STATUS];

export const STATUS_OPTIONS = [
  { value: STATUS.ACTIVE, label: "Active" },
  { value: STATUS.INACTIVE, label: "Inactive" },
  { value: STATUS.PENDING, label: "Pending" },
  { value: STATUS.APPROVED, label: "Approved" },
  { value: STATUS.REJECTED, label: "Rejected" },
] as const;
