export enum IncidentStatus {
    NEW = 'NEW',
    IN_PROGRESS = 'IN_PROGRESS',
    ON_HOLD = 'ON_HOLD',
    RESOLVED = 'RESOLVED',
    CLOSED = 'CLOSED',
    CANCELLED = 'CANCELLED'
  }
  
  export enum Priority {
    CRITICAL = 'CRITICAL',
    HIGH = 'HIGH',
    MEDIUM = 'MEDIUM',
    LOW = 'LOW'
  }
  
  export enum Impact {
    CRITICAL = 'CRITICAL',
    HIGH = 'HIGH',
    MEDIUM = 'MEDIUM',
    LOW = 'LOW'
  }
  
  export enum Urgency {
    CRITICAL = 'CRITICAL',
    HIGH = 'HIGH',
    MEDIUM = 'MEDIUM',
    LOW = 'LOW'
  }
  
  export enum UserRole {
    END_USER = 'END_USER',
    SERVICE_DESK = 'SERVICE_DESK',
    MANAGER = 'MANAGER',
    ADMIN = 'ADMIN'
  }
  
  // Define the basic types that would come from Prisma
  export interface User {
    id: string
    email: string
    name: string
    role: UserRole
    createdAt: Date
    updatedAt: Date
  }
  
  export interface Incident {
    id: string
    number: string
    title: string
    description: string
    status: IncidentStatus
    priority: Priority
    impact: Impact
    urgency: Urgency
    category: string
    subcategory?: string
    assignmentGroup?: string
    resolution?: string
    closeCode?: string
    closeNotes?: string
    slaBreachTime?: Date
    businessService: string
    location?: string
    createdAt: Date
    updatedAt: Date
  }
  
  export interface IncidentComment {
    id: string
    incidentId: string
    userId: string
    comment: string
    isPrivate: boolean
    createdAt: Date
  }
  
  export interface IncidentHistory {
    id: string
    incidentId: string
    userId: string
    field: string
    oldValue?: string
    newValue?: string
    createdAt: Date
  }
  
  export type IncidentWithDetails = Incident & {
    reportedBy: User
    assignedTo?: User | null
    comments: (IncidentComment & { user: User })[]
    history: (IncidentHistory & { user: User })[]
    _count?: {
      comments: number
    }
  }
  
  export interface CreateIncidentDto {
    title: string
    description: string
    category: string
    subcategory?: string
    priority?: Priority
    impact?: Impact
    urgency?: Urgency
    businessService: string
    location?: string
  }
  
  export interface UpdateIncidentDto {
    title?: string
    description?: string
    category?: string
    subcategory?: string
    priority?: Priority
    impact?: Impact
    urgency?: Urgency
    status?: IncidentStatus
    assignmentGroup?: string
    assignedToId?: string
    resolution?: string
    closeCode?: string
    closeNotes?: string
  }
  
  export interface IncidentFilters {
    status?: IncidentStatus[]
    priority?: Priority[]
    assignedToId?: string
    reportedById?: string
    assignmentGroup?: string
    category?: string
    dateFrom?: Date
    dateTo?: Date
    search?: string
  }

  export interface IncidentDashboard {
    id: string,
    number: string,
    title: string,
    description: string,
    status: IncidentStatus,
    priority: Priority,
    category: string,
    subcategory?: string,
    assignedToId?: string,
    assignmentGroup?: string,
    businessService: string,
    reportedById: string,
    reportedBy: string,
    createdAt: Date,
  }
  
  export interface PriorityMatrix {
    impact: Impact
    urgency: Urgency
    priority: Priority
  }
  
  // ITIL v4 Priority Matrix
  export const PRIORITY_MATRIX: PriorityMatrix[] = [
    { impact: Impact.HIGH, urgency: Urgency.HIGH, priority: Priority.CRITICAL },
    { impact: Impact.HIGH, urgency: Urgency.MEDIUM, priority: Priority.HIGH },
    { impact: Impact.HIGH, urgency: Urgency.LOW, priority: Priority.MEDIUM },
    { impact: Impact.MEDIUM, urgency: Urgency.HIGH, priority: Priority.HIGH },
    { impact: Impact.MEDIUM, urgency: Urgency.MEDIUM, priority: Priority.MEDIUM },
    { impact: Impact.MEDIUM, urgency: Urgency.LOW, priority: Priority.LOW },
    { impact: Impact.LOW, urgency: Urgency.HIGH, priority: Priority.MEDIUM },
    { impact: Impact.LOW, urgency: Urgency.MEDIUM, priority: Priority.LOW },
    { impact: Impact.LOW, urgency: Urgency.LOW, priority: Priority.LOW },
  ]

  export interface ReassignmentData {
    assignedToId?: string
    assignmentGroup?: string
    reason: string
  }
  
  export interface BulkReassignDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    selectedIncidents: Array<{ id: string; number: string; title: string }>
    onBulkReassign: (data: ReassignmentData) => void
  }