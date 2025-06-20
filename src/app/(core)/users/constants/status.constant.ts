import { Status } from "../enums/status.enum";

export const statuses = [
  { value: Status.ACTIVE, label: "Active" },
  { value: Status.INACTIVE, label: "Inactive" },
  { value: Status.PENDING, label: "Pending" },
  { value: Status.APPROVED, label: "Approved" },
  { value: Status.REJECTED, label: "Rejected" },
] as const;
