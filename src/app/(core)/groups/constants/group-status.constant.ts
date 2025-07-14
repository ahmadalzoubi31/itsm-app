export enum GroupStatusEnum {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  PENDING = "PENDING",
  SUSPENDED = "SUSPENDED",
  ARCHIVED = "ARCHIVED",
}

export const GROUP_STATUSES = [
  { value: GroupStatusEnum.ACTIVE, label: "Active" },
  { value: GroupStatusEnum.INACTIVE, label: "Inactive" },
  { value: GroupStatusEnum.PENDING, label: "Pending" },
  { value: GroupStatusEnum.SUSPENDED, label: "Suspended" },
  { value: GroupStatusEnum.ARCHIVED, label: "Archived" },
]; 