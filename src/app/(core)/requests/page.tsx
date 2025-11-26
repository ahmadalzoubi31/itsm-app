"use client";

import { useState, useMemo } from "react";
import { useRequests } from "./hooks/useRequests";
import { RequestCard } from "./components/RequestCard";
import { RequestListItem } from "./components/RequestListItem";
import { RequestTableView } from "./components/RequestTableView";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Inbox, Plus, LayoutGrid, List, Table2 } from "lucide-react";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Request, RequestStatus } from "./_lib/_types";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

type LayoutView = "card" | "list" | "table";

// Active statuses: Submitted, Assigned, InProgress
const ACTIVE_STATUSES: RequestStatus[] = [
  RequestStatus.SUBMITTED,
  RequestStatus.ASSIGNED,
  RequestStatus.IN_PROGRESS,
  RequestStatus.WAITING_APPROVAL,
];

// Past statuses: Resolved, Closed
const PAST_STATUSES: RequestStatus[] = [
  RequestStatus.RESOLVED,
  RequestStatus.CLOSED,
];

function filterRequests(
  requests: Request[],
  searchQuery: string,
  statusFilter: string
): Request[] {
  let filtered = [...requests];

  // Status filter
  if (statusFilter !== "all") {
    filtered = filtered.filter((req) => req.status === statusFilter);
  }

  // Search filter
  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase();
    filtered = filtered.filter(
      (req) =>
        req.title.toLowerCase().includes(query) ||
        req.description?.toLowerCase().includes(query) ||
        req.id.toLowerCase().includes(query) ||
        req.number?.toLowerCase().includes(query)
    );
  }

  return filtered;
}

interface RequestSectionProps {
  title: string;
  requests: Request[];
  layoutView: LayoutView;
  emptyMessage: string;
}

function RequestSection({
  title,
  requests,
  layoutView,
  emptyMessage,
}: RequestSectionProps) {
  if (requests.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {title && (
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">{title}</h2>
          <span className="text-sm text-muted-foreground">
            {requests.length} {requests.length === 1 ? "request" : "requests"}
          </span>
        </div>
      )}

      {layoutView === "card" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {requests.map((request) => (
            <RequestCard key={request.id} request={request} />
          ))}
        </div>
      )}

      {layoutView === "list" && (
        <div className="space-y-4">
          {requests.map((request) => (
            <RequestListItem key={request.id} request={request} />
          ))}
        </div>
      )}

      {layoutView === "table" && <RequestTableView requests={requests} />}
    </div>
  );
}

export default function RequestsPage() {
  const { requests, isLoading, error } = useRequests();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [layoutView, setLayoutView] = useState<LayoutView>("card");
  const [activeTab, setActiveTab] = useState<"active" | "past">("active");

  const { activeRequests, pastRequests } = useMemo(() => {
    const allRequests = requests?.items || [];
    const filtered = filterRequests(allRequests, searchQuery, statusFilter);

    const active = filtered.filter((req) =>
      ACTIVE_STATUSES.includes(req.status as RequestStatus)
    );

    const past = filtered.filter((req) =>
      PAST_STATUSES.includes(req.status as RequestStatus)
    );

    return { activeRequests: active, pastRequests: past };
  }, [requests, searchQuery, statusFilter]);

  if (error) {
    return (
      <div className="px-4 lg:px-8">
        <div className="text-destructive">
          Error loading requests: {error.message}
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="px-4 lg:px-8 space-y-6">
        <div className="space-y-4">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-5 w-96" />
          <div className="flex gap-4">
            <Skeleton className="h-10 w-full max-w-md" />
            <Skeleton className="h-10 w-40" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-64 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 lg:px-8 space-y-6">
      <div className="flex items-center justify-between">
        <div className="text-2xl font-bold tracking-tight">
          My Requests
          <div className="text-muted-foreground text-sm font-normal">
            Track and manage your submitted requests
          </div>
        </div>
        <Button size="sm" asChild>
          <Link href="/catalog">
            <Plus className="h-4 w-4 mr-2" />
            New Request
          </Link>
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search requests..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="Submitted">Submitted</SelectItem>
            <SelectItem value="Assigned">Assigned</SelectItem>
            <SelectItem value="InProgress">In Progress</SelectItem>
            <SelectItem value="Resolved">Resolved</SelectItem>
            <SelectItem value="Closed">Closed</SelectItem>
          </SelectContent>
        </Select>
        <ToggleGroup
          type="single"
          value={layoutView}
          onValueChange={(value) => value && setLayoutView(value as LayoutView)}
          className="border rounded-lg p-1"
        >
          <ToggleGroupItem value="card" aria-label="Card view" size="sm">
            <LayoutGrid className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="list" aria-label="List view" size="sm">
            <List className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="table" aria-label="Table view" size="sm">
            <Table2 className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {activeRequests.length === 0 && pastRequests.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
          <div className="p-4 rounded-full bg-muted mb-4">
            <Inbox className="h-12 w-12 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No Requests Found</h3>
          <p className="text-muted-foreground max-w-md mb-6">
            {searchQuery || statusFilter !== "all"
              ? "No requests match your filters. Try adjusting your search."
              : "You haven't submitted any requests yet. Browse the catalog to get started."}
          </p>
          {!searchQuery && statusFilter === "all" && (
            <Button size="sm" asChild>
              <Link href="/catalog">Browse Catalog</Link>
            </Button>
          )}
        </div>
      ) : (
        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as "active" | "past")}
          className="w-full"
        >
          <TabsList>
            <TabsTrigger value="active">
              Active
              {activeRequests.length > 0 && (
                <span className="ml-2 text-xs text-muted-foreground">
                  ({activeRequests.length})
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="past">
              Past
              {pastRequests.length > 0 && (
                <span className="ml-2 text-xs text-muted-foreground">
                  ({pastRequests.length})
                </span>
              )}
            </TabsTrigger>
          </TabsList>
          <TabsContent value="active" className="mt-6">
            {activeRequests.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                <div className="p-4 rounded-full bg-muted mb-4">
                  <Inbox className="h-12 w-12 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  No Active Requests
                </h3>
                <p className="text-muted-foreground max-w-md">
                  {searchQuery || statusFilter !== "all"
                    ? "No active requests match your filters."
                    : "You don't have any active requests at the moment."}
                </p>
              </div>
            ) : (
              <RequestSection
                title=""
                requests={activeRequests}
                layoutView={layoutView}
                emptyMessage="No active requests"
              />
            )}
          </TabsContent>
          <TabsContent value="past" className="mt-6">
            {pastRequests.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                <div className="p-4 rounded-full bg-muted mb-4">
                  <Inbox className="h-12 w-12 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No Past Requests</h3>
                <p className="text-muted-foreground max-w-md">
                  {searchQuery || statusFilter !== "all"
                    ? "No past requests match your filters."
                    : "You don't have any past requests."}
                </p>
              </div>
            ) : (
              <RequestSection
                title=""
                requests={pastRequests}
                layoutView={layoutView}
                emptyMessage="No past requests"
              />
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
