"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

import { ServiceRequestsFilters } from "./components/ServiceRequestsFilters";
import { ServiceCatalog } from "./components/ServiceCatalog";
import { MyRequestsList } from "./components/MyRequestsList";
import { NewServiceRequestDialog } from "./components/NewServiceRequestDialog";
import { useServiceRequests } from "./hooks/useServiceRequests";

export default function ServiceRequests() {
  const { serviceRequests } = useServiceRequests();
  const [showNewRequestDialog, setShowNewRequestDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Mock active requests
  const activeRequests = [
    {
      id: "REQ-2024-001",
      serviceName: "Employee Onboarding",
      status: "In Progress",
      requestedBy: "Sarah Chen",
      requestedDate: "2024-01-15",
      priority: "High",
      estimatedCompletion: "2024-01-18",
    },
    {
      id: "REQ-2024-002",
      serviceName: "Expense Reimbursement",
      status: "Pending Approval",
      requestedBy: "Mike Johnson",
      requestedDate: "2024-01-15",
      priority: "Medium",
      estimatedCompletion: "2024-01-17",
    },
    {
      id: "REQ-2024-003",
      serviceName: "System Access Request",
      status: "Completed",
      requestedBy: "Alex Rivera",
      requestedDate: "2024-01-14",
      priority: "Low",
      estimatedCompletion: "2024-01-14",
    },
  ];

  const handleRequestService = (serviceId: string) => {
    console.log("Requesting service:", serviceId);
    setShowNewRequestDialog(true);
  };

  // Filter services to only show active ones
  const activeServices = serviceRequests.filter(
    (service: any) => service.isActive
  );

  const filteredServices = activeServices.filter((service: any) => {
    const matchesSearch =
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || service.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const filteredRequests = activeRequests.filter((request) => {
    const matchesSearch =
      request.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || request.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-row items-center justify-between px-4 lg:px-6">
        <div className="text-2xl font-bold tracking-tight">
          Service Requests
          <div className="text-muted-foreground text-sm font-normal">
            Browse and request business services
          </div>
        </div>
        <Button size="sm" onClick={() => setShowNewRequestDialog(true)}>
          Create Request
        </Button>
      </div>
      <div className="px-4 lg:px-6">
        {/* Search and Filters */}
        <ServiceRequestsFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          categoryFilter={categoryFilter}
          onCategoryFilterChange={setCategoryFilter}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
        />
      </div>

      <div className="px-4 lg:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Service Catalog */}
          <div>
            <ServiceCatalog
              services={filteredServices}
              onRequestService={handleRequestService}
            />
          </div>

          {/* My Requests */}
          <div>
            <MyRequestsList requests={filteredRequests} />
          </div>
        </div>
      </div>

      <div className="px-4 lg:px-6">
        {/* New Service Request Dialog */}
        <NewServiceRequestDialog
          open={showNewRequestDialog}
          onOpenChange={setShowNewRequestDialog}
          services={activeServices}
        />
      </div>
    </div>
  );
}
