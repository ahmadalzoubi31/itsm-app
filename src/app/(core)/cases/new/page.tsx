"use client";

import { CaseForm } from "../components/CaseForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NewCasePage() {
  return (
    <div className="px-4 lg:px-8 space-y-6">
      <div className="flex items-center justify-between">
        <div className="text-2xl font-bold tracking-tight">
          Create New Case
          <div className="text-muted-foreground text-sm font-normal">
            Create a new case to track and manage issues
          </div>
        </div>
        <Button size="sm" variant="outline" asChild>
          <Link href="/cases">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Cases
          </Link>
        </Button>
      </div>

      <CaseForm />
    </div>
  );
}
