import { IncidentStatus, Priority, Impact, Urgency } from "@/types/globals";
import { z } from "zod";

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const incidentSchema = z.object({
  id: z.string(),
  number: z.string(),
  title: z.string(),
  description: z.string(),
  status: z.enum([
    IncidentStatus.NEW,
    IncidentStatus.ASSIGNED,
    IncidentStatus.IN_PROGRESS,
    IncidentStatus.ON_HOLD,
    IncidentStatus.RESOLVED,
    IncidentStatus.CLOSED,
    IncidentStatus.CANCELLED,
  ]),
  priority: z.enum([
    Priority.CRITICAL,
    Priority.HIGH,
    Priority.MEDIUM,
    Priority.LOW,
  ]),
  impact: z.enum([Impact.CRITICAL, Impact.HIGH, Impact.MEDIUM, Impact.LOW]),
  urgency: z.enum([
    Urgency.CRITICAL,
    Urgency.HIGH,
    Urgency.MEDIUM,
    Urgency.LOW,
  ]),
  category: z.string(),
  subcategory: z.string().optional(),
  assignmentGroup: z.string().optional(),
  resolution: z.string().optional(),
  closeCode: z.string().optional(),
  closeNotes: z.string().optional(),
  slaBreachTime: z
    .string()
    .transform((value) => new Date(value))
    .optional(),
  businessService: z.string(),
  location: z.string().optional(),
  createdAt: z.string().transform((value) => new Date(value)),
  updatedAt: z.string().transform((value) => new Date(value)),
  reportedBy: z.string(),
  assignedTo: z.string().optional(),
  comments: z.array(z.string()).optional(),
  history: z.array(z.string()).optional(),
  _count: z.object({ comments: z.number() }).optional(),
});

export type Incident = z.infer<typeof incidentSchema>;
