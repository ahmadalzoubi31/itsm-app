"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RequestCard } from "@/app/(core)/catalog/admin/request-cards/_lib/_types";
import { FileText, CheckCircle } from "lucide-react";

interface RequestCardComponentProps {
  requestCard: RequestCard;
  onSelect: (requestCard: RequestCard) => void;
}

export function RequestCardComponent({
  requestCard,
  onSelect,
}: RequestCardComponentProps) {
  const fieldCount = Object.keys(
    requestCard.jsonSchema?.properties || {}
  ).length;

  return (
    <Card className="group h-full transition-all duration-300 hover:shadow-lg border-border bg-gradient-to-br from-card to-card/50 hover:from-primary/5 hover:to-card">
      <CardHeader>
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
            <FileText className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <CardTitle className="text-base">{requestCard.name}</CardTitle>
              {requestCard.active && (
                <Badge variant="outline" className="ml-2">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Active
                </Badge>
              )}
            </div>
            {requestCard.businessLine && (
              <Badge variant="secondary" className="mt-2 text-xs">
                {requestCard.businessLineId}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <CardDescription className="text-sm">
          {fieldCount} {fieldCount === 1 ? "field" : "fields"} to complete
        </CardDescription>
        <Button
          size="sm"
          onClick={() => onSelect(requestCard)}
          className="w-full"
          variant="default"
        >
          Request This Service
        </Button>
      </CardContent>
    </Card>
  );
}
