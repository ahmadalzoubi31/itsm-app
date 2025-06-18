import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  IncidentWithDetails,
  IncidentStatus,
  Priority,
  User,
} from "@/types/globals";
import {
  getIncidentStatusColor,
  getPriorityColor,
  formatIncidentAge,
  isIncidentBreached,
} from "@/utils/incident-utils";
import { AlertTriangle, Users, Search, Filter, Clock } from "lucide-react";
import { toast } from "sonner";

interface IncidentListProps {
  incidents: IncidentWithDetails[];
  loading?: boolean;
  onFiltersChange?: (filters: any) => void;
}

interface BulkReassignmentData {
  assignedToId?: string;
  assignmentGroup?: string;
  reason: string;
}

function IncidentList({
  incidents,
  loading = false,
  onFiltersChange,
}: IncidentListProps) {
  const [selectedIncidents, setSelectedIncidents] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [stateFilter, setStateFilter] = useState<string>("ALL");
  const [priorityFilter, setPriorityFilter] = useState<string>("ALL");

  // Filter incidents based on local status
  const filteredIncidents = incidents.filter((incident) => {
    const matchesSearch =
      incident.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      incident.number.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesState =
      stateFilter === "ALL" || incident.status === stateFilter;
    const matchesPriority =
      priorityFilter === "ALL" || incident.priority === priorityFilter;

    return matchesSearch && matchesState && matchesPriority;
  });

  const handleSelectIncident = (incidentId: string, checked: boolean) => {
    if (checked) {
      setSelectedIncidents([...selectedIncidents, incidentId]);
    } else {
      setSelectedIncidents(selectedIncidents.filter((id) => id !== incidentId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIncidents(filteredIncidents.map((incident) => incident.id));
    } else {
      setSelectedIncidents([]);
    }
  };

  const handleBulkReassignment = (reassignmentData: BulkReassignmentData) => {
    console.log(
      "Bulk reassigning incidents:",
      selectedIncidents,
      reassignmentData
    );
    setSelectedIncidents([]);

    toast.success(`${selectedIncidents.length} incidents have been reassigned`);
  };

  const getAssignedToName = (incident: IncidentWithDetails) => {
    if (incident.assignedTo) {
      return incident.assignedTo.name;
    }
    const assignedUser = "";
    return assignedUser || "Unassigned";
  };

  const formatCreatedDate = (createdAt: Date) => {
    return new Date(createdAt).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDueDate = (slaBreachTime: Date | undefined) => {
    if (!slaBreachTime) return "No SLA";

    const now = new Date();
    const diffMs = slaBreachTime.getTime() - now.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffMs < 0) {
      const overdueDays = Math.floor(Math.abs(diffMs) / (1000 * 60 * 60 * 24));
      const overdueHours = Math.floor(Math.abs(diffMs) / (1000 * 60 * 60)) % 24;
      return `Overdue by ${overdueDays}d ${overdueHours}h`;
    }

    if (diffDays > 0) {
      return `${diffDays}d ${diffHours % 24}h remaining`;
    }
    return `${diffHours}h remaining`;
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search incidents..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <Select value={stateFilter} onValueChange={setStateFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All States</SelectItem>
                <SelectItem value={IncidentStatus.NEW}>New</SelectItem>
                <SelectItem value={IncidentStatus.IN_PROGRESS}>
                  In Progress
                </SelectItem>
                <SelectItem value={IncidentStatus.ON_HOLD}>On Hold</SelectItem>
                <SelectItem value={IncidentStatus.RESOLVED}>
                  Resolved
                </SelectItem>
                <SelectItem value={IncidentStatus.CLOSED}>Closed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Priorities</SelectItem>
                <SelectItem value={Priority.CRITICAL}>Critical</SelectItem>
                <SelectItem value={Priority.HIGH}>High</SelectItem>
                <SelectItem value={Priority.MEDIUM}>Medium</SelectItem>
                <SelectItem value={Priority.LOW}>Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Incidents Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Incidents ({filteredIncidents.length})</CardTitle>
            {selectedIncidents.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  handleBulkReassignment({ reason: "Bulk reassignment" })
                }
              >
                <Users className="h-4 w-4 mr-2" />
                Bulk Reassign ({selectedIncidents.length})
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={
                        selectedIncidents.length === filteredIncidents.length &&
                        filteredIncidents.length > 0
                      }
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Number</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Assigned To</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Due Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredIncidents.length > 0 ? (
                  filteredIncidents.map((incident) => (
                    <TableRow key={incident.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedIncidents.includes(incident.id)}
                          onCheckedChange={(checked) =>
                            handleSelectIncident(
                              incident.id,
                              checked as boolean
                            )
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Link href={`/incidents/${incident.id}`}>
                            <span className="font-medium text-blue-600 hover:text-blue-800">
                              {incident.number}
                            </span>
                          </Link>
                          {incident.slaBreachTime &&
                            isIncidentBreached(incident.slaBreachTime) && (
                              <Badge
                                variant="destructive"
                                className="flex items-center gap-1"
                              >
                                <AlertTriangle className="h-3 w-3" />
                                SLA
                              </Badge>
                            )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{incident.title}</div>
                          <div className="text-sm text-muted-foreground truncate max-w-xs">
                            {incident.description}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={getIncidentStatusColor(incident.status)}
                        >
                          {incident.status.replace("_", " ")}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getPriorityColor(incident.priority)}>
                          {incident.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">
                          {getAssignedToName(incident)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {formatCreatedDate(incident.createdAt)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          <span
                            className={`text-sm ${
                              incident.slaBreachTime &&
                              isIncidentBreached(incident.slaBreachTime)
                                ? "text-red-600 font-medium"
                                : "text-muted-foreground"
                            }`}
                          >
                            {formatDueDate(incident.slaBreachTime)}
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="text-center py-8 text-muted-foreground"
                    >
                      No incidents found matching your criteria.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default IncidentList;
