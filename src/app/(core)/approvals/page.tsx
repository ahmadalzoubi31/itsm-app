"use client";

import { ApprovalList } from "./components/ApprovalList";
import {
  usePendingApprovals,
  useApproveRequest,
  useRejectRequest,
} from "./hooks/useApprovals";
import { Card, CardContent } from "@/components/ui/card";
import {
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  Filter,
  Search,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";

export default function ApprovalsPage() {
  const { data: approvals, isLoading } = usePendingApprovals();
  const approveMutation = useApproveRequest();
  const rejectMutation = useRejectRequest();
  const [searchQuery, setSearchQuery] = useState("");

  const handleApprove = (requestId: string, justification?: string) => {
    approveMutation.mutate({ requestId, dto: { justification } });
  };

  const handleReject = (requestId: string, justification: string) => {
    rejectMutation.mutate({ requestId, dto: { justification } });
  };

  // Filter approvals based on search query
  const filteredApprovals = useMemo(() => {
    if (!approvals) return [];
    if (!searchQuery.trim()) return approvals;

    const query = searchQuery.toLowerCase();
    return approvals.filter(
      (approval) =>
        approval.request.number.toLowerCase().includes(query) ||
        approval.request.title.toLowerCase().includes(query) ||
        approval.request.description?.toLowerCase().includes(query) ||
        approval.request.requester?.displayName.toLowerCase().includes(query) ||
        approval.request.requester?.username.toLowerCase().includes(query)
    );
  }, [approvals, searchQuery]);

  const stats = useMemo(() => {
    const total = approvals?.length || 0;
    return {
      total,
      urgent: 0, // You can add urgency logic later
      thisWeek: total, // You can filter by date later
    };
  }, [approvals]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Hero Section */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
            Approvals
          </h1>
          <p className="text-muted-foreground text-lg">
            Review and manage pending approval requests
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="border-l-4 border-l-blue-500 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Pending Approvals
                  </p>
                  <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                    {isLoading ? (
                      <span className="animate-pulse">--</span>
                    ) : (
                      stats.total
                    )}
                  </p>
                </div>
                <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <Clock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-amber-500 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Requires Attention
                  </p>
                  <p className="text-3xl font-bold text-amber-600 dark:text-amber-400">
                    {isLoading ? (
                      <span className="animate-pulse">--</span>
                    ) : (
                      stats.urgent
                    )}
                  </p>
                </div>
                <div className="h-12 w-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                  <AlertCircle className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    This Week
                  </p>
                  <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                    {isLoading ? (
                      <span className="animate-pulse">--</span>
                    ) : (
                      stats.thisWeek
                    )}
                  </p>
                </div>
                <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters Bar */}
        <Card className="shadow-sm">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by request number, title, or requester..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" className="sm:w-auto">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>
            {searchQuery && (
              <div className="mt-3 flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  Found {filteredApprovals.length} result
                  {filteredApprovals.length !== 1 ? "s" : ""}
                </span>
                {filteredApprovals.length < (approvals?.length || 0) && (
                  <Badge variant="secondary" className="text-xs">
                    Filtered
                  </Badge>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Approvals List */}
        <div className="space-y-4">
          <ApprovalList
            approvals={filteredApprovals}
            onApprove={handleApprove}
            onReject={handleReject}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}
