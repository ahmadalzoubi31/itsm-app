"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { RequestCard } from "@/app/(core)/catalog/admin/request-cards/_lib/_types";
import { DynamicFormRenderer } from "./DynamicFormRenderer";
import { Badge } from "@/components/ui/badge";
import { FileText, Sparkles, CheckCircle2 } from "lucide-react";

interface RequestCardDetailDrawerProps {
  requestCard: RequestCard | null;
  open: boolean;
  onClose: () => void;
  onSubmit: (formData: Record<string, any>) => void;
  isSubmitting?: boolean;
}

export function RequestCardDetailDrawer({
  requestCard,
  open,
  onClose,
  onSubmit,
  isSubmitting = false,
}: RequestCardDetailDrawerProps) {
  if (!requestCard) return null;

  const fieldCount = Object.keys(
    requestCard.jsonSchema?.properties || {}
  ).length;

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-2xl overflow-y-auto p-0 flex flex-col">
        {/* Enhanced Header Section */}
        <div className="relative overflow-hidden border-b bg-gradient-to-br from-primary/5 via-primary/3 to-background">
          <div className="relative p-6 space-y-4">
            <SheetHeader className="space-y-3">
              <div className="flex items-start gap-4">
                <div className="mt-1 p-2.5 rounded-xl bg-primary/10 border border-primary/20 shadow-sm">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-start justify-between gap-4">
                    <SheetTitle className="text-2xl font-semibold leading-tight pr-8">
                      {requestCard.name}
                    </SheetTitle>
                  </div>
                  <SheetDescription className="text-base text-muted-foreground">
                    Complete the form below to submit your request
                  </SheetDescription>
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    {requestCard.businessLineId && (
                      <Badge
                        variant="secondary"
                        className="gap-1.5 px-2.5 py-1 text-xs font-medium"
                      >
                        <Sparkles className="h-3 w-3" />
                        {requestCard.businessLineId}
                      </Badge>
                    )}
                    {requestCard.active && (
                      <Badge
                        variant="outline"
                        className="gap-1.5 px-2.5 py-1 text-xs font-medium border-green-200 text-green-700 dark:border-green-800 dark:text-green-400"
                      >
                        <CheckCircle2 className="h-3 w-3" />
                        Active
                      </Badge>
                    )}
                    <Badge
                      variant="outline"
                      className="gap-1.5 px-2.5 py-1 text-xs font-medium"
                    >
                      {fieldCount} {fieldCount === 1 ? "field" : "fields"}
                    </Badge>
                  </div>
                </div>
              </div>
            </SheetHeader>
          </div>
        </div>

        {/* Form Content Section */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            <DynamicFormRenderer
              jsonSchema={requestCard.jsonSchema}
              defaults={requestCard.defaults}
              onSubmit={onSubmit}
              isSubmitting={isSubmitting}
            />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
