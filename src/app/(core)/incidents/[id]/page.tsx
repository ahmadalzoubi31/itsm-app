"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IncidentWithDetails, IncidentStatus, Priority, Impact, Urgency, UserRole, User } from "@/types/globals";
import { getIncidentStatusColor, getPriorityColor, formatIncidentAge, isIncidentBreached } from "@/utils/incident-utils";
import { ReassignIncidentDialog, ReassignmentData } from "../components/ReassignIncidentDialog";
import KnowledgeBaseSection from "../components/KnowledgeBaseSection";

import { ArrowLeft, Clock, User as UserIcon, MessageSquare, History, AlertTriangle, Edit, Save, X, Users } from "lucide-react";
import { toast } from "sonner";

// Mock user for demo
const mockCurrentUser: User = {
  id: "1",
  email: "user@example.com",
  name: "John Doe",
  role: UserRole.SERVICE_DESK,
  createdAt: new Date(),
  updatedAt: new Date(),
};

// Mock users for reassignment
const mockUsers: User[] = [
  { id: "1", name: "John Doe", role: UserRole.SERVICE_DESK, email: "john@example.com", createdAt: new Date(), updatedAt: new Date() },
  { id: "2", name: "Jane Smith", role: UserRole.MANAGER, email: "jane@example.com", createdAt: new Date(), updatedAt: new Date() },
  { id: "3", name: "Mike Johnson", role: UserRole.SERVICE_DESK, email: "mike@example.com", createdAt: new Date(), updatedAt: new Date() },
  { id: "4", name: "Sarah Wilson", role: UserRole.ADMIN, email: "sarah@example.com", createdAt: new Date(), updatedAt: new Date() },
];

// Mock incident data
const createMockIncident = (id: string): IncidentWithDetails => ({
  id,
  number: `INC000${id.padStart(4, "0")}`,
  title: "Email server not responding",
  description:
    "Users are unable to send or receive emails. The server appears to be down since 2 PM. Multiple users from different departments have reported this issue. The issue seems to affect both internal and external email communication.",
  status: IncidentStatus.IN_PROGRESS,
  priority: Priority.HIGH,
  impact: Impact.HIGH,
  urgency: Urgency.MEDIUM,
  category: "Email",
  subcategory: "Server Issues",
  reportedBy: mockCurrentUser,
  assignedTo: mockCurrentUser,
  assignmentGroup: "Infrastructure Team",
  slaBreachTime: new Date(Date.now() + 6 * 60 * 60 * 1000),
  businessService: "Email Service",
  location: "Main Office",
  createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
  updatedAt: new Date(Date.now() - 30 * 60 * 1000),
  comments: [
    {
      id: "1",
      incidentId: id,
      userId: "1",
      comment: "Initial investigation shows the email server is unresponsive. Checking server logs.",
      isPrivate: false,
      createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
      user: mockCurrentUser,
    },
    {
      id: "2",
      incidentId: id,
      userId: "1",
      comment: "Found high CPU usage on the email server. Investigating possible causes.",
      isPrivate: false,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      user: mockCurrentUser,
    },
  ],
  history: [
    {
      id: "1",
      incidentId: id,
      userId: "1",
      field: "status",
      oldValue: "NEW",
      newValue: "IN_PROGRESS",
      createdAt: new Date(Date.now() - 3.5 * 60 * 60 * 1000),
      user: mockCurrentUser,
    },
    {
      id: "2",
      incidentId: id,
      userId: "1",
      field: "assignedTo",
      oldValue: undefined,
      newValue: "John Doe",
      createdAt: new Date(Date.now() - 3.5 * 60 * 60 * 1000),
      user: mockCurrentUser,
    },
  ],
  _count: { comments: 2 },
});

export default function IncidentDetail() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : Array.isArray(params.id) ? params.id[0] : "";
  const [incident, setIncident] = useState<IncidentWithDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [editData, setEditData] = useState({
    status: IncidentStatus.NEW,
    priority: Priority.MEDIUM,
    assignmentGroup: "",
  });

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      if (id) {
        const mockIncident = createMockIncident(id);
        setIncident(mockIncident);
        setEditData({
          status: mockIncident.status,
          priority: mockIncident.priority,
          assignmentGroup: mockIncident.assignmentGroup || "",
        });
      }
      setLoading(false);
    }, 500);
  }, [id]);

  const handleSaveChanges = () => {
    if (!incident) return;

    // Simulate API update
    const updatedIncident = {
      ...incident,
      status: editData.status,
      priority: editData.priority,
      assignmentGroup: editData.assignmentGroup,
      updatedAt: new Date(),
    };

    setIncident(updatedIncident);
    setEditMode(false);

    toast.success("Incident updated successfully");
  };

  const handleAddComment = () => {
    if (!newComment.trim() || !incident) return;

    const comment = {
      id: Date.now().toString(),
      incidentId: incident.id,
      userId: "1",
      comment: newComment,
      isPrivate: false,
      createdAt: new Date(),
      user: mockCurrentUser,
    };

    setIncident({
      ...incident,
      comments: [...incident.comments, comment],
      _count: { comments: incident.comments.length + 1 },
    });

    setNewComment("");

    toast.success("Comment added successfully");
  };

  const handleReassignment = (reassignmentData: ReassignmentData) => {
    if (!incident) return;

    // Find the assigned user
    const assignedUser = reassignmentData.assignedToId ? mockUsers.find((u) => u.id === reassignmentData.assignedToId) : null;

    // Create reassignment history entry
    const reassignmentHistory = {
      id: Date.now().toString(),
      incidentId: incident.id,
      userId: "1",
      field: "assignedTo",
      oldValue: incident.assignedTo?.name || undefined,
      newValue: assignedUser?.name || reassignmentData.assignmentGroup,
      createdAt: new Date(),
      user: mockCurrentUser,
    };

    // Create reassignment comment
    const reassignmentComment = {
      id: (Date.now() + 1).toString(),
      incidentId: incident.id,
      userId: "1",
      comment: `Incident reassigned. Reason: ${reassignmentData.reason}`,
      isPrivate: false,
      createdAt: new Date(),
      user: mockCurrentUser,
    };

    // Update incident
    const updatedIncident: IncidentWithDetails = {
      ...incident,
      assignedTo: assignedUser || incident.assignedTo,
      assignmentGroup: reassignmentData.assignmentGroup || incident.assignmentGroup,
      updatedAt: new Date(),
      comments: [...incident.comments, reassignmentComment],
      history: [...incident.history, reassignmentHistory],
      _count: { comments: incident.comments.length + 1 },
    };

    setIncident(updatedIncident);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!incident) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Incident Not Found</h1>
          <Link href="/">
            <Button>Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>

            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-gray-900">{incident.number}</h1>
              <Badge className={getPriorityColor(incident.priority)}>{incident.priority}</Badge>
              <Badge className={getIncidentStatusColor(incident.status)}>{incident.status.replace("_", " ")}</Badge>
              {isIncidentBreached(incident.slaBreachTime!) && (
                <Badge variant="destructive" className="flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  SLA Breached
                </Badge>
              )}
            </div>

            <div className="ml-auto">
              <ReassignIncidentDialog
                incidentId={incident.id}
                incidentNumber={incident.number}
                currentAssignee={incident.assignedTo?.name}
                onReassign={handleReassignment}
              />
            </div>
          </div>

          <h2 className="text-xl text-gray-700">{incident.title}</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="details">Details & Comments</TabsTrigger>
                <TabsTrigger value="knowledge">Knowledge Base</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-6">
                {/* Incident Details */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Incident Details</CardTitle>
                    <Button variant="outline" size="sm" onClick={() => setEditMode(!editMode)}>
                      {editMode ? (
                        <>
                          <X className="h-4 w-4 mr-2" />
                          Cancel
                        </>
                      ) : (
                        <>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </>
                      )}
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                      <p className="text-gray-600">{incident.description}</p>
                    </div>

                    {editMode ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">status</label>
                            <Select value={editData.status} onValueChange={(value: IncidentStatus) => setEditData({ ...editData, status: value })}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value={IncidentStatus.NEW}>New</SelectItem>
                                <SelectItem value={IncidentStatus.IN_PROGRESS}>In Progress</SelectItem>
                                <SelectItem value={IncidentStatus.ON_HOLD}>On Hold</SelectItem>
                                <SelectItem value={IncidentStatus.RESOLVED}>Resolved</SelectItem>
                                <SelectItem value={IncidentStatus.CLOSED}>Closed</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                            <Select value={editData.priority} onValueChange={(value: Priority) => setEditData({ ...editData, priority: value })}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value={Priority.CRITICAL}>Critical</SelectItem>
                                <SelectItem value={Priority.HIGH}>High</SelectItem>
                                <SelectItem value={Priority.MEDIUM}>Medium</SelectItem>
                                <SelectItem value={Priority.LOW}>Low</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <Button onClick={handleSaveChanges} className="flex items-center gap-2">
                          <Save className="h-4 w-4" />
                          Save Changes
                        </Button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Category:</span>
                          <p className="font-medium">{incident.category}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Impact:</span>
                          <p className="font-medium">{incident.impact}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Urgency:</span>
                          <p className="font-medium">{incident.urgency}</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Comments */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5" />
                      Comments ({incident.comments.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-4">
                      {incident.comments.map((comment) => (
                        <div key={comment.id} className="border-l-2 border-blue-200 pl-4">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-sm">{comment.user.name}</span>
                            <span className="text-xs text-gray-500">{comment.createdAt.toLocaleString()}</span>
                          </div>
                          <p className="text-gray-700">{comment.comment}</p>
                        </div>
                      ))}
                    </div>

                    <div className="border-t pt-4">
                      <Textarea placeholder="Add a comment..." value={newComment} onChange={(e) => setNewComment(e.target.value)} rows={3} />
                      <Button onClick={handleAddComment} className="mt-2" disabled={!newComment.trim()}>
                        Add Comment
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="knowledge">
                <KnowledgeBaseSection
                  incidentTitle={incident.title}
                  incidentDescription={incident.description}
                  incidentCategory={incident.category}
                />
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Assignment Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserIcon className="h-5 w-5" />
                  Assignment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <span className="text-sm text-gray-500">Reported By:</span>
                  <p className="font-medium">{incident.reportedBy.name}</p>
                </div>
                {incident.assignedTo && (
                  <div>
                    <span className="text-sm text-gray-500">Assigned To:</span>
                    <p className="font-medium">{incident.assignedTo.name}</p>
                  </div>
                )}
                {incident.assignmentGroup && (
                  <div>
                    <span className="text-sm text-gray-500">Assignment Group:</span>
                    <p className="font-medium">{incident.assignmentGroup}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Timeline
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <span className="text-sm text-gray-500">Created:</span>
                  <p className="font-medium">{incident.createdAt.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">Age: {formatIncidentAge(incident.createdAt)}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Last Updated:</span>
                  <p className="font-medium">{incident.updatedAt.toLocaleString()}</p>
                </div>
                {incident.slaBreachTime && (
                  <div>
                    <span className="text-sm text-gray-500">SLA Breach Time:</span>
                    <p className={`font-medium ${isIncidentBreached(incident.slaBreachTime) ? "text-red-600" : "text-green-600"}`}>
                      {incident.slaBreachTime.toLocaleString()}
                    </p>
                  </div>
                )}

                {/* History Section */}
                <div className="border-t pt-4">
                  <div className="flex items-center gap-2 mb-3">
                    <History className="h-4 w-4" />
                    <span className="text-sm font-medium text-gray-700">History</span>
                  </div>
                  <div className="space-y-3">
                    {incident.history.map((entry) => (
                      <div key={entry.id} className="text-xs">
                        <div className="flex items-center gap-1 text-gray-500 mb-1">
                          <span>{entry.user.name}</span>
                          <span>•</span>
                          <span>{entry.createdAt.toLocaleString()}</span>
                        </div>
                        <p className="text-gray-700">
                          Changed <span className="font-medium">{entry.field}</span>
                          {entry.oldValue && (
                            <span>
                              {" "}
                              from <span className="font-medium">{entry.oldValue}</span>
                            </span>
                          )}
                          <span>
                            {" "}
                            to <span className="font-medium">{entry.newValue}</span>
                          </span>
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
