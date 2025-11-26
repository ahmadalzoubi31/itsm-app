"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import { CaseForm } from "../../components/CaseForm";
import { useCase } from "../../hooks/useCases";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

interface EditCasePageProps {
  params: Promise<{ id: string }>;
}

export default function EditCasePage({ params }: EditCasePageProps) {
  const { id } = use(params);
  const { case: caseData, isLoading, error } = useCase(id);

  if (error) {
    return (
      <div className="px-4 lg:px-8">
        <div className="text-destructive">
          Error loading case: {error.message}
        </div>
        <Button size="sm" variant="outline" className="mt-4" asChild>
          <Link href="/cases">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Cases
          </Link>
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="px-4 lg:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-96" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (!caseData) {
    notFound();
  }

  return (
    <div className="px-4 lg:px-8 space-y-6">
      <div className="flex items-center justify-between">
        <div className="text-2xl font-bold tracking-tight">
          Edit Case
          <div className="text-muted-foreground text-sm font-normal">
            Modify case details and information
          </div>
        </div>
        <Button size="sm" variant="outline" asChild>
          <Link href={`/cases/${id}`}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Case
          </Link>
        </Button>
      </div>

      <CaseForm id={id} />
    </div>
  );
}
