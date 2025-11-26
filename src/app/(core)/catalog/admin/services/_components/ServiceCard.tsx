"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Layers } from "lucide-react";
import Link from "next/link";
import { Service } from "@/app/(core)/catalog/admin/services/_lib/_types/service.type";
import { cn } from "@/lib/utils/cn";

interface ServiceCardProps {
  service: Service;
  className?: string;
}

export function ServiceCard({ service, className }: ServiceCardProps) {
  console.log("🚀 ~ ServiceCard ~ service:", service.id);
  const hasDescription = Boolean(service.description?.trim());

  return (
    <Link
      href={`/catalog/${service.id}`}
      className={cn(
        "block h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-lg",
        className
      )}
      aria-label={`View ${service.name} service details`}
    >
      <Card className="group h-full transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:scale-[1.02] cursor-pointer border-border bg-gradient-to-br from-card to-card/50 hover:from-primary/5 hover:to-card/80 hover:border-primary/20">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3 flex-1 min-w-0">
              <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors shrink-0">
                <Layers className="h-5 w-5 text-primary" aria-hidden="true" />
              </div>
              <div className="flex-1 min-w-0">
                <CardTitle className="text-lg font-semibold leading-tight mb-2 line-clamp-2">
                  {service.name}
                </CardTitle>
                {service.businessLineId && (
                  <Badge variant="secondary" className="text-xs font-medium">
                    {service.businessLineId}
                  </Badge>
                )}
              </div>
            </div>
            <ArrowRight
              className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0 mt-1"
              aria-hidden="true"
            />
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <CardDescription className="line-clamp-2 text-sm leading-relaxed">
            {hasDescription
              ? service.description
              : "Browse available request cards and submit service requests"}
          </CardDescription>
        </CardContent>
      </Card>
    </Link>
  );
}
