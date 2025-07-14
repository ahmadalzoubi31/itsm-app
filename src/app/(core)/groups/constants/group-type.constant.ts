export enum GroupTypeEnum {
  SUPPORT = "SUPPORT",
  TECHNICAL = "TECHNICAL",
  MANAGEMENT = "MANAGEMENT",
  ESCALATION = "ESCALATION",
  SPECIALIST = "SPECIALIST",
  GENERAL = "GENERAL",
}

export const GROUP_TYPES = [
  { value: GroupTypeEnum.SUPPORT, label: "Support Group" },
  { value: GroupTypeEnum.TECHNICAL, label: "Technical Team" },
  { value: GroupTypeEnum.MANAGEMENT, label: "Management Team" },
  { value: GroupTypeEnum.ESCALATION, label: "Escalation Team" },
  { value: GroupTypeEnum.SPECIALIST, label: "Specialist Team" },
  { value: GroupTypeEnum.GENERAL, label: "General Team" },
]; 