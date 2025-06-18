import { Impact, Urgency, Priority, IncidentStatus } from "@/types/globals";
import { PRIORITY_MATRIX } from "@/types/globals";

export function calculatePriority(impact: Impact, urgency: Urgency): Priority {
  const match = PRIORITY_MATRIX.find(
    (m: any) => m.impact === impact && m.urgency === urgency
  );
  return match?.priority || Priority.MEDIUM;
}

export function generateIncidentNumber(): string {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.random().toString(36).substr(2, 3).toUpperCase();
  return `INC${timestamp}${random}`;
}

export function calculateSLABreachTime(
  priority: Priority,
  startTime: Date
): Date {
  const slaMinutes = {
    [Priority.CRITICAL]: 240, // 4 hours
    [Priority.HIGH]: 480, // 8 hours
    [Priority.MEDIUM]: 1440, // 24 hours
    [Priority.LOW]: 2880, // 48 hours
  };

  const minutes = slaMinutes[priority];
  return new Date(startTime.getTime() + minutes * 60 * 1000);
}

// export function getIncidentStatusLabel(status: string): string {
//   const labels = {
//     [IncidentStatus.NEW]: 'New',
//     [IncidentStatus.IN_PROGRESS]: 'In Progress',
//     [IncidentStatus.ON_HOLD]: 'On Hold',
//     [IncidentStatus.RESOLVED]: 'Resolved',
//     [IncidentStatus.CLOSED]: 'Closed',
//     [IncidentStatus.CANCELLED]: 'Cancelled'
//   }
//   return labels[status as IncidentStatus] || 'Unknown'
// }

export function getIncidentStatusColor(status: IncidentStatus): string {
  const colors = {
    [IncidentStatus.NEW]: "bg-blue-100 text-blue-800",
    [IncidentStatus.ASSIGNED]: "bg-blue-100 text-blue-800",
    [IncidentStatus.IN_PROGRESS]: "bg-yellow-100 text-yellow-800",
    [IncidentStatus.ON_HOLD]: "bg-orange-100 text-orange-800",
    [IncidentStatus.RESOLVED]: "bg-green-100 text-green-800",
    [IncidentStatus.CLOSED]: "bg-gray-100 text-gray-800",
    [IncidentStatus.CANCELLED]: "bg-red-100 text-red-800",
  };
  return colors[status] || "bg-gray-100 text-gray-800";
}

export function getPriorityColor(priority: Priority): string {
  const colors = {
    [Priority.CRITICAL]: "bg-red-100 text-red-800 hover:bg-red-200",
    [Priority.HIGH]: "bg-orange-100 text-orange-800 hover:bg-orange-200",
    [Priority.MEDIUM]: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
    [Priority.LOW]: "bg-blue-100 text-blue-800 hover:bg-blue-200",
  };
  return colors[priority] || "bg-gray-500 text-white";
}

export function isIncidentBreached(breachTime: Date | null): boolean {
  if (!breachTime) return false;
  return new Date() > breachTime;
}

export function formatIncidentAge(createdAt: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - createdAt.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays > 0) {
    return `${diffDays}d ${diffHours % 24}h`;
  }
  return `${diffHours}h`;
}
