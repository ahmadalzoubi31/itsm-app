import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
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
} from "lucide-react";
import { format } from "date-fns";
import { SyncHistory } from "../../types";
import { SyncStatusEnum } from "../../constants/sync-status.constant";

interface SyncHistoryProps {
  syncHistoryList: SyncHistory[];
}

const SyncHistoryCard = ({ syncHistoryList }: SyncHistoryProps) => {
  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "success":
        return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      case "error": 
        return <XCircle className="w-4 h-4 text-red-600" />;
      case "in-progress":
        return <RefreshCw className="w-4 h-4 text-blue-600 animate-spin" />;
      default:
        return <AlertCircle className="w-4 h-4 text-yellow-600" />;
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "success":
        return "default";
      case "error":
        return "destructive";
      case "in-progress":
        return "secondary";
      default:
        return "outline";
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
          {syncHistoryList?.length !== undefined &&
            syncHistoryList?.length !== null &&
            syncHistoryList?.length > 0 && (
              <span className="text-sm text-muted-foreground">
                {syncHistoryList?.length}{" "}
                {syncHistoryList?.length === 1 ? "entry" : "entries"}
              </span>
            )}
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
              {syncHistoryList?.map((entry) => (
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
                        <Badge
                          variant={getStatusVariant(entry.status)}
                          className="text-xs font-medium px-2 py-0.5 self-start sm:self-center"
                        >
                          {entry.status === SyncStatusEnum.IN_PROGRESS
                            ? "In Progress"
                            : entry.status === SyncStatusEnum.SUCCESS
                            ? "Completed"
                            : "Failed"}
                        </Badge>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <CalendarDays className="w-3.5 h-3.5 opacity-70" />
                          <span>
                            {format(entry.timestamp, "yyyy-MM-dd HH:mm:ss")}
                          </span>
                        </div>

                        {entry.usersFetched !== null &&
                          entry.usersFetched !== undefined && (
                            <div className="flex items-center gap-1.5">
                              <Users className="w-3.5 h-3.5 opacity-70" />
                              <span>
                                {entry.usersFetched.toLocaleString()} users
                              </span>
                            </div>
                          )}

                        {entry.duration && (
                          <div className="flex items-center gap-1.5">
                            <Timer className="w-3.5 h-3.5 opacity-70" />
                            <span>{entry.duration}s</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border/30 to-transparent"></div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SyncHistoryCard;
