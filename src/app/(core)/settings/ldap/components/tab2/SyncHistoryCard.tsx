"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  Clock,
  CalendarDays,
  Users,
  Timer,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  XCircle,
  ChevronDown,
  ChevronUp,
  UserPlus,
  UserCheck,
  UserMinus,
  UserX,
  AlertTriangle,
  PlayCircle,
  Calendar,
} from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import { SyncHistory } from "../../types";
import { SyncStatusEnum } from "../../constants/sync-status.constant";

interface SyncHistoryProps {
  syncHistoryList: SyncHistory[];
  onRefresh?: () => void;
  isRefreshing?: boolean;
  isAutoRefreshing?: boolean;
}

const SyncHistoryCard = ({
  syncHistoryList,
  onRefresh,
  isRefreshing = false,
  isAutoRefreshing = false,
}: SyncHistoryProps) => {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status.toUpperCase()) {
      case SyncStatusEnum.SUCCESS:
        return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      case SyncStatusEnum.ERROR:
        return <XCircle className="w-4 h-4 text-red-600" />;
      case SyncStatusEnum.IN_PROGRESS:
        return <RefreshCw className="w-4 h-4 text-blue-600 animate-spin" />;
      default:
        return <AlertCircle className="w-4 h-4 text-yellow-600" />;
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status.toUpperCase()) {
      case SyncStatusEnum.SUCCESS:
        return "default";
      case SyncStatusEnum.ERROR:
        return "destructive";
      case SyncStatusEnum.IN_PROGRESS:
        return "secondary";
      default:
        return "outline";
    }
  };

  const getTriggerLabel = (trigger?: string) => {
    switch (trigger) {
      case "manual":
        return "Manual";
      case "scheduled":
        return "Scheduled";
      case "automatic":
        return "Automatic";
      default:
        return "Unknown";
    }
  };

  const getTriggerIcon = (trigger?: string) => {
    switch (trigger) {
      case "manual":
        return <PlayCircle className="w-3.5 h-3.5" />;
      case "scheduled":
        return <Calendar className="w-3.5 h-3.5" />;
      case "automatic":
        return <RefreshCw className="w-3.5 h-3.5" />;
      default:
        return <Activity className="w-3.5 h-3.5" />;
    }
  };
  return (
    <Card className="lg:col-span-2 border shadow-sm gap-0">
      <CardHeader className="pb-4 border-b">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Activity className="w-5 h-5 text-primary" />
              Sync History
            </CardTitle>
            <CardDescription className="mt-1">
              Recent synchronization activities and their status
            </CardDescription>
          </div>
          <div className="flex items-center gap-3">
            {syncHistoryList?.length !== undefined &&
              syncHistoryList?.length !== null &&
              syncHistoryList?.length > 0 && (
                <span className="text-sm text-muted-foreground">
                  {syncHistoryList?.length}{" "}
                  {syncHistoryList?.length === 1 ? "entry" : "entries"}
                </span>
              )}
            {onRefresh && (
              <div className="flex items-center gap-2">
                {isAutoRefreshing && (
                  <span className="text-xs text-muted-foreground">
                    Auto-refreshing...
                  </span>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={onRefresh}
                  disabled={isRefreshing}
                  className="h-8 gap-2"
                >
                  <RefreshCw
                    className={`w-4 h-4 ${
                      isRefreshing || isAutoRefreshing ? "animate-spin" : ""
                    }`}
                  />
                  Refresh
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {syncHistoryList?.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
            <div className="relative mb-5">
              <div className="absolute inset-0 bg-primary/10 rounded-full animate-pulse"></div>
              <Clock className="w-12 h-12 text-primary relative z-10" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-foreground">
              No sync history yet
            </h3>
            <p className="text-muted-foreground max-w-md">
              Your synchronization activities will appear here once you start
              syncing with your LDAP server.
            </p>
          </div>
        ) : (
          <div className="max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-thumb-rounded-full">
            <div className="divide-y divide-border/50">
              {syncHistoryList?.map((entry) => {
                const isExpanded = expandedIds.has(entry.id);
                const hasDetails =
                  entry.usersAdded !== undefined ||
                  entry.usersUpdated !== undefined ||
                  entry.usersDeactivated !== undefined ||
                  entry.usersSkipped !== undefined ||
                  entry.errors !== undefined ||
                  entry.trigger ||
                  entry.syncEndTime ||
                  entry.errorDetails;

                return (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="group relative px-6 py-4 hover:bg-muted/30 transition-colors duration-200"
                  >
                    <div className="flex items-start gap-4">
                      <div className="mt-0.5 flex-shrink-0">
                        <div className="rounded-full p-1.5 bg-background border shadow-sm">
                          {getStatusIcon(entry.status)}
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                          <p className="text-sm font-medium text-foreground leading-tight">
                            {entry.details}
                          </p>
                          <div className="flex items-center gap-2 self-start sm:self-center">
                            <Badge
                              variant={getStatusVariant(entry.status)}
                              className="text-xs font-semibold px-3 py-1"
                            >
                              {entry.status === SyncStatusEnum.IN_PROGRESS
                                ? "🔄 In Progress"
                                : entry.status === SyncStatusEnum.SUCCESS
                                ? "✅ Completed"
                                : entry.status === SyncStatusEnum.ERROR
                                ? "❌ Failed"
                                : "Unknown"}
                            </Badge>
                            {hasDetails && (
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-6 w-6 p-0"
                                onClick={() => toggleExpand(entry.id)}
                              >
                                {isExpanded ? (
                                  <ChevronUp className="w-4 h-4" />
                                ) : (
                                  <ChevronDown className="w-4 h-4" />
                                )}
                              </Button>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground mb-2">
                          <div className="flex items-center gap-1.5">
                            <CalendarDays className="w-3.5 h-3.5 opacity-70" />
                            <span>
                              {(() => {
                                if (!entry.timestamp) return "N/A";
                                const date =
                                  entry.timestamp instanceof Date
                                    ? entry.timestamp
                                    : new Date(entry.timestamp);
                                return isNaN(date.getTime())
                                  ? "Invalid date"
                                  : format(date, "yyyy-MM-dd HH:mm:ss");
                              })()}
                            </span>
                          </div>

                          {entry.usersFetched !== null &&
                            entry.usersFetched !== undefined && (
                              <div className="flex items-center gap-1.5">
                                <Users className="w-3.5 h-3.5 opacity-70" />
                                <span>
                                  {entry.usersFetched.toLocaleString()}{" "}
                                  processed
                                </span>
                              </div>
                            )}

                          {entry.duration && (
                            <div className="flex items-center gap-1.5">
                              <Timer className="w-3.5 h-3.5 opacity-70" />
                              <span>{entry.duration}s</span>
                            </div>
                          )}

                          {entry.trigger && (
                            <div className="flex items-center gap-1.5">
                              {getTriggerIcon(entry.trigger)}
                              <span>{getTriggerLabel(entry.trigger)}</span>
                            </div>
                          )}
                        </div>

                        <AnimatePresence>
                          {isExpanded && hasDetails && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden"
                            >
                              <div className="pt-3 mt-3 border-t border-border/50 space-y-2">
                                {/* User Statistics */}
                                {(entry.usersAdded !== undefined ||
                                  entry.usersUpdated !== undefined ||
                                  entry.usersDeactivated !== undefined ||
                                  entry.usersSkipped !== undefined) && (
                                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                    {entry.usersAdded !== undefined &&
                                      entry.usersAdded > 0 && (
                                        <div className="flex items-center gap-1.5 text-xs">
                                          <UserPlus className="w-3.5 h-3.5 text-green-600" />
                                          <span className="text-muted-foreground">
                                            Added:
                                          </span>
                                          <span className="font-medium text-green-600">
                                            {entry.usersAdded.toLocaleString()}
                                          </span>
                                        </div>
                                      )}
                                    {entry.usersUpdated !== undefined &&
                                      entry.usersUpdated > 0 && (
                                        <div className="flex items-center gap-1.5 text-xs">
                                          <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                                          <span className="text-muted-foreground">
                                            Updated:
                                          </span>
                                          <span className="font-medium text-blue-600">
                                            {entry.usersUpdated.toLocaleString()}
                                          </span>
                                        </div>
                                      )}
                                    {entry.usersDeactivated !== undefined &&
                                      entry.usersDeactivated > 0 && (
                                        <div className="flex items-center gap-1.5 text-xs">
                                          <UserMinus className="w-3.5 h-3.5 text-orange-600" />
                                          <span className="text-muted-foreground">
                                            Deactivated:
                                          </span>
                                          <span className="font-medium text-orange-600">
                                            {entry.usersDeactivated.toLocaleString()}
                                          </span>
                                        </div>
                                      )}
                                    {entry.usersSkipped !== undefined &&
                                      entry.usersSkipped > 0 && (
                                        <div className="flex items-center gap-1.5 text-xs">
                                          <UserX className="w-3.5 h-3.5 text-gray-600" />
                                          <span className="text-muted-foreground">
                                            Skipped:
                                          </span>
                                          <span className="font-medium text-gray-600">
                                            {entry.usersSkipped.toLocaleString()}
                                          </span>
                                        </div>
                                      )}
                                  </div>
                                )}

                                {/* Errors */}
                                {entry.errors !== undefined &&
                                  entry.errors > 0 && (
                                    <div className="flex items-start gap-1.5 text-xs">
                                      <AlertTriangle className="w-3.5 h-3.5 text-red-600 mt-0.5 flex-shrink-0" />
                                      <div className="flex-1">
                                        <span className="text-muted-foreground">
                                          Errors:{" "}
                                        </span>
                                        <span className="font-medium text-red-600">
                                          {entry.errors.toLocaleString()}
                                        </span>
                                      </div>
                                    </div>
                                  )}

                                {/* End Time */}
                                {entry.syncEndTime && (
                                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                    <Clock className="w-3.5 h-3.5 opacity-70" />
                                    <span>
                                      Ended:{" "}
                                      {format(
                                        entry.syncEndTime instanceof Date
                                          ? entry.syncEndTime
                                          : new Date(entry.syncEndTime),
                                        "yyyy-MM-dd HH:mm:ss"
                                      )}
                                    </span>
                                  </div>
                                )}

                                {/* Error Details */}
                                {entry.errorDetails && (
                                  <div className="mt-2 p-2 bg-destructive/10 border border-destructive/20 rounded-md">
                                    <div className="flex items-start gap-1.5 text-xs">
                                      <AlertCircle className="w-3.5 h-3.5 text-destructive mt-0.5 flex-shrink-0" />
                                      <div className="flex-1">
                                        <span className="font-medium text-destructive mb-1 block">
                                          Error Details:
                                        </span>
                                        <p className="text-muted-foreground whitespace-pre-wrap break-words">
                                          {entry.errorDetails}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border/30 to-transparent"></div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SyncHistoryCard;
