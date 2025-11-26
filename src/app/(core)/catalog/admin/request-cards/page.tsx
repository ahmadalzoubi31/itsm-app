"use client";

import { useState, useEffect } from "react";
import RequestCardTable from "./_components/RequestCardTable";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

import { useServicesHook } from "../services/_lib/_hooks/useServices.hook";
import { fetchRequestCardsByService } from "./_lib/_services/request-card.service";
import { CatalogHeader } from "../../_components/CatalogHeader";
import { RequestCard } from "./_lib/_types";

export default function RequestCardsManagementPage() {
  const [requestCards, setRequestCards] = useState<RequestCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Fetch all services and their templates
    const loadTemplates = async () => {
      try {
        setIsLoading(true);
        const { services } = useServicesHook();

        // Fetch service cards for each service
        const allRequestCards: RequestCard[] = [];
        for (const service of services) {
          try {
            const requestCards = await fetchRequestCardsByService(service.id);
            allRequestCards.push(...requestCards);
          } catch (err) {
            // Skip services that fail or have no service cards
            console.warn(
              `Failed to fetch service cards for service ${service.id}:`,
              err
            );
          }
        }

        setRequestCards(allRequestCards);
      } catch (err) {
        setError(err as Error);
        toast.error("Failed to load templates");
      } finally {
        setIsLoading(false);
      }
    };

    loadTemplates();
  }, []);

  if (error) {
    return (
      <div className="px-4 lg:px-8">
        <div className="text-destructive">
          Error loading templates: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 lg:px-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/catalog/admin">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Admin
              </Link>
            </Button>
          </div>
          <CatalogHeader
            title="Request Cards"
            description="Manage request cards and their configurations"
          />
        </div>
        <Button size="sm" asChild>
          <Link href="/catalog/admin/request-cards/create">
            <Plus className="h-4 w-4 mr-2" />
            Create Request Card
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      ) : (
        <RequestCardTable requestCards={requestCards} />
      )}
    </div>
  );
}
