"use client";

import { useState } from "react";
import { use } from "react";
import { useRequestCardsByServiceHook } from "@/app/(core)/catalog/admin/request-cards/_lib/_hooks/useRequestCards.hook";
import { useRequestCardSubmissionHook } from "@/app/(core)/catalog/admin/request-cards/_lib/_hooks/useRequestCardSubmission.hook";
import { RequestCardDetailDrawer } from "@/app/(core)/catalog/admin/request-cards/_components/RequestCardDetailDrawer";
import { SubmissionSuccessModal } from "@/app/(core)/catalog/admin/request-cards/_components/SubmissionSuccessModal";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Package } from "lucide-react";
import Link from "next/link";
import { RequestCard } from "@/app/(core)/catalog/admin/request-cards/_lib/_types/request-card.type";
import { toast } from "sonner";
import { CatalogHeader } from "@/app/(core)/catalog/_components/CatalogHeader";
import { RequestCardComponent } from "@/app/(core)/catalog/admin/request-cards/_components/RequestCardComponent";

interface ServiceDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function ServiceDetailPage({ params }: ServiceDetailPageProps) {
  const { id } = use(params);
  const { requestCards, isLoading, error } = useRequestCardsByServiceHook(id);
  const {
    submitRequestCard,
    isSubmitting,
    submittedRequest,
    reset: resetSubmission,
  } = useRequestCardSubmissionHook();

  const [selectedRequestCard, setSelectedRequestCard] =
    useState<RequestCard | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const handleSelectRequestCard = (requestCard: RequestCard) => {
    setSelectedRequestCard(requestCard);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setTimeout(() => setSelectedRequestCard(null), 300);
  };

  const handleSubmit = async (formData: Record<string, any>) => {
    if (!selectedRequestCard) return;

    console.log("formData", formData);
    await submitRequestCard(selectedRequestCard.id, formData);
    handleCloseDrawer();
    setIsSuccessModalOpen(true);
    toast.success("Request submitted successfully!");
  };

  const handleCloseSuccessModal = () => {
    setIsSuccessModalOpen(false);
    resetSubmission();
  };

  if (error) {
    return (
      <div className="px-4 lg:px-8">
        <div className="text-destructive">
          Error loading templates: {error.message}
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="px-4 lg:px-8 space-y-6">
        <Skeleton className="h-10 w-32" />
        <div className="space-y-4">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-5 w-96" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 lg:px-8 space-y-6">
      <Button variant="ghost" size="sm" asChild>
        <Link href="/catalog">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Catalog
        </Link>
      </Button>

      <div>
        <CatalogHeader
          title="Catalog Items"
          description="Select a catalog item to submit your request"
        />
      </div>

      {requestCards.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
          <div className="p-4 rounded-full bg-muted mb-4">
            <Package className="h-12 w-12 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold mb-2">
            No Service Cards Available
          </h3>
          <p className="text-muted-foreground max-w-md">
            There are no active service cards for this service yet.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {requestCards.map((requestCard: RequestCard) => (
            <RequestCardComponent
              key={requestCard.id}
              requestCard={requestCard}
              onSelect={handleSelectRequestCard}
            />
          ))}
        </div>
      )}

      <RequestCardDetailDrawer
        requestCard={selectedRequestCard}
        open={isDrawerOpen}
        onClose={handleCloseDrawer}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />

      <SubmissionSuccessModal
        request={submittedRequest ?? null}
        open={isSuccessModalOpen}
        onClose={handleCloseSuccessModal}
      />
    </div>
  );
}
