"use client";

import { use } from "react";
import { ServiceForm } from "../../_components/form/ServiceForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface EditServicePageProps {
  params: Promise<{ id: string }>;
}

export default function EditServicePage({ params }: EditServicePageProps) {
  const { id } = use(params);

  return (
    <div className="px-4 lg:px-8 space-y-6 max-w-3xl mx-auto">
      <div>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/catalog/admin/services">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Services
          </Link>
        </Button>
      </div>

      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Service</h1>
        <p className="text-muted-foreground mt-2">Update service information</p>
      </div>

      <div className="px-[2rem] lg:px-8">
        <ServiceForm id={id} />
      </div>
    </div>
  );
}
