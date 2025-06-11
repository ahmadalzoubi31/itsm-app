import {
  ArrowUpNarrowWide,
  ArrowDown,
  ArrowRight,
  ArrowUp,
  CheckCircle,
  Circle,
  CircleOff,
  HelpCircle,
  Timer,
} from "lucide-react";

export const labels = [
  {
    value: "bug",
    label: "Bug",
  },
  {
    value: "feature",
    label: "Feature",
  },
  {
    value: "documentation",
    label: "Documentation",
  },
];

export const statuses = [
  {
    value: "new",
    label: "New",
    icon: HelpCircle,
  },
  {
    value: "assigned",
    label: "Assigned",
    icon: Circle,
  },
  {
    value: "on hold",
    label: "On Hold",
    icon: Timer,
  },
  {
    value: "in progress",
    label: "In Progress",
    icon: Timer,
  },
  {
    value: "resolved",
    label: "Resolved",
    icon: CheckCircle,
  },
  {
    value: "closed",
    label: "Closed",
    icon: CheckCircle,
  },
  {
    value: "cancelled",
    label: "Cancelled",
    icon: CircleOff,
  },
];

export const priorities = [
  {
    label: "Low",
    value: "low",
    icon: ArrowDown,
    color: "bg-blue-100 text-blue-800 hover:bg-blue-200",
  },
  {
    label: "Medium",
    value: "medium",
    icon: ArrowRight,

    color: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
  },
  {
    label: "High",
    value: "high",
    icon: ArrowUp,

    color: "bg-orange-100 text-orange-800 hover:bg-orange-200",
  },
  {
    label: "Critical",
    value: "critical",
    icon: ArrowUpNarrowWide,
    color: "bg-red-100 text-red-800 hover:bg-red-200",
  },
];
