// import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, AlertCircle } from "lucide-react";

interface MyRequestsListProps {
  requests: any[];
}

export const MyRequestsList = ({ requests }: MyRequestsListProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800";
      case "In Progress":
        return "bg-blue-100 text-blue-800";
      case "Pending Approval":
        return "bg-yellow-100 text-yellow-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800";
      case "Medium":
        return "bg-orange-100 text-orange-800";
      case "Low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "In Progress":
        return <Clock className="h-4 w-4 text-blue-500" />;
      case "Pending Approval":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Requests</CardTitle>
        <CardDescription>Track your service request status</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {requests.map((request) => (
          <div key={request.id} className="p-4 border rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {getStatusIcon(request.status)}
                <span className="font-semibold text-sm">{request.id}</span>
              </div>
              <Badge className={`text-xs ${getStatusColor(request.status)}`}>
                {request.status}
              </Badge>
            </div>
            <h5 className="font-medium text-gray-900">{request.serviceName}</h5>
            <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
              <div className="flex items-center gap-4">
                <span>Requested: {request.requestedDate}</span>
                <Badge className={`${getPriorityColor(request.priority)}`}>
                  {request.priority}
                </Badge>
              </div>
              <span>ETA: {request.estimatedCompletion}</span>
            </div>
          </div>
        ))}
        {requests.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <AlertCircle className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p>No requests found matching your filters.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
