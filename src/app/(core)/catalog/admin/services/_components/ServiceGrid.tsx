"use client";

import { Service } from "@/app/(core)/catalog/admin/services/_lib/_types/service.type";
import { ServiceCard } from "./ServiceCard";
import { Package } from "lucide-react";

interface ServiceGridProps {
  services: Service[];
}

export function ServiceGrid({ services }: ServiceGridProps) {
  if (services.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <div className="p-4 rounded-full bg-muted mb-4">
          <Package className="h-12 w-12 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold mb-2">No Services Available</h3>
        <p className="text-muted-foreground max-w-md">
          There are no services in the catalog yet. Please check back later or
          contact your administrator.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {services.map((service) => (
        <ServiceCard key={service.id} service={service} />
      ))}
    </div>
  );
}
