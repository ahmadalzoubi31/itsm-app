export enum PriorityEnum {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  CRITICAL = "CRITICAL",
}

export const PRIORITIES = [
  {
    label: "Low",
    value: PriorityEnum.LOW,
    color: "bg-blue-100 text-blue-800 hover:bg-blue-200",
  },
  {
    label: "Medium",
    value: PriorityEnum.MEDIUM,
    color: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
  },
  {
    label: "High",
    value: PriorityEnum.HIGH,
    color: "bg-orange-100 text-orange-800 hover:bg-orange-200",
  },
  {
    label: "Critical",
    value: PriorityEnum.CRITICAL,
    color: "bg-red-100 text-red-800 hover:bg-red-200",
  },
];
