"use client";

import { useState, useMemo } from "react";
import { useServicesHook } from "./admin/services/_lib/_hooks/useServices.hook";

import { CatalogHeader } from "./_components/CatalogHeader";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import Link from "next/link";
import { ServiceGrid } from "./admin/services/_components/ServiceGrid";

export default function CatalogPage() {
  const { services, error } = useServicesHook();
  const [searchQuery, setSearchQuery] = useState("");

  // const filteredServices = useMemo(() => {
  //   if (!searchQuery.trim()) return services;

  //   const query = searchQuery.toLowerCase();
  //   return services.filter(
  //     (service) =>
  //       service.name.toLowerCase().includes(query) ||
  //       service.description?.toLowerCase().includes(query) ||
  //       service.key.toLowerCase().includes(query)
  //   );
  // }, [services, searchQuery]);

  if (error) {
    return (
      <div className="px-4 lg:px-8">
        <div className="text-destructive">
          Error loading services: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 lg:px-8 space-y-6">
      <div className="flex items-center justify-between">
        <CatalogHeader
          title="Service Catalog"
          description="Browse and request services from the catalog"
          searchPlaceholder="Search services..."
          onSearch={setSearchQuery}
        />
        <Button variant="outline" size="sm" asChild>
          <Link href="/catalog/admin">
            <Settings className="h-4 w-4 mr-2" />
            Admin
          </Link>
        </Button>
      </div>

      <ServiceGrid services={services} />
    </div>
  );
}
