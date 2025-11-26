"use client";

import { use } from "react";
import RequestCardForm from "../../components/RequestCardForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { CatalogHeader } from "@/app/(core)/catalog/components/CatalogHeader";

interface EditRequestCardPageProps {
  params: Promise<{ id: string }>;
}

export default function EditRequestCardPage({
  params,
}: EditRequestCardPageProps) {
  const { id } = use(params);

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
            title="Edit Request Card"
            description="Update request card information and schema"
          />
        </div>
      </div>

      <div className="mt-8">
        <RequestCardForm id={id} />
      </div>
    </div>
  );
}
