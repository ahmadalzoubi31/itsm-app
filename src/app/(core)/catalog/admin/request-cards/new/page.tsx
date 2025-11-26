"use client";

import RequestCardForm from "@/app/(core)/catalog/admin/request-cards/_components/RequestCardForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus } from "lucide-react";
import Link from "next/link";
import { CatalogHeader } from "@/app/(core)/catalog/_components/CatalogHeader";

export default function CreateRequestCardPage() {
  return (
    <div className="px-4 lg:px-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/catalog/admin/request-cards">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Request Cards
              </Link>
            </Button>
          </div>
          <CatalogHeader
            title="Create Request Card"
            description="Add a new request card to the catalog"
          />
        </div>
      </div>

      <div className="mt-8">
        <RequestCardForm />
      </div>
    </div>
  );
}
