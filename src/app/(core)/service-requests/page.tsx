"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

import { ServiceRequestsFilters } from "./components/ServiceRequestsFilters";
import { ServiceCatalog } from "./components/ServiceCatalog";
import { MyRequestsList } from "./components/MyRequestsList";
import { NewServiceRequestDialog } from "./components/NewServiceRequestDialog";
import { useServiceRequests } from "./hooks/useServiceRequests";
import { useServiceCards } from "./hooks/useServiceCards";

export default function ServiceRequests() {
  const {
    serviceRequests,
    isLoading: requestsLoading,
    refetch: refetchRequests,
  } = useServiceRequests();
  const { serviceCards, isLoading: cardsLoading } = useServiceCards();
  const [showNewRequestDialog, setShowNewRequestDialog] = useState(false);
  const [selectedServiceCard, setSelectedServiceCard] = useState<string | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Real service requests from API

  const handleRequestService = (serviceId: string) => {
    console.log("Requesting service:", serviceId);
    setSelectedServiceCard(serviceId);
    setShowNewRequestDialog(true);
  };

  // Filter services based on search and category
  const filteredServices = serviceCards.filter((service) => {
    const matchesSearch =
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || service.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Ensure serviceRequests is always an array
  const safeServiceRequests = Array.isArray(serviceRequests)
    ? serviceRequests
    : [];

  const filteredRequests = safeServiceRequests.filter((request) => {
    const matchesSearch =
      request.serviceName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.id?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || request.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Get unique categories from service cards
  const availableCategories = Array.from(
    new Set(serviceCards.map((card) => card.category))
  );

  return (
    <>
      <div className="flex flex-row items-center justify-between px-4 lg:px-6">
        <div className="text-2xl font-bold tracking-tight">
          Service Requests
          <div className="text-muted-foreground text-sm font-normal">
            Browse and request business services
          </div>
        </div>
        <Button onClick={() => setShowNewRequestDialog(true)}>
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
          availableCategories={availableCategories}
        />
      </div>

      <div className="px-4 lg:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Service Catalog */}
          <div>
            <ServiceCatalog
              services={filteredServices}
              onRequestService={handleRequestService}
              isLoading={cardsLoading}
            />
          </div>

          {/* My Requests */}
          <div>
            <MyRequestsList
              requests={filteredRequests}
              isLoading={requestsLoading}
            />
          </div>
        </div>
      </div>

      <div className="px-4 lg:px-6">
        {/* New Service Request Dialog */}
        <NewServiceRequestDialog
          open={showNewRequestDialog}
          onOpenChange={(open) => {
            setShowNewRequestDialog(open);
            if (!open) setSelectedServiceCard(null);
          }}
          services={serviceCards}
          selectedServiceId={selectedServiceCard}
          onRequestCreated={refetchRequests}
        />
      </div>
    </>
  );
}
