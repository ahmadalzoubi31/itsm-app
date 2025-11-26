"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface CatalogHeaderProps {
  title: string;
  description: string;
  searchPlaceholder?: string;
  onSearch?: (query: string) => void;
}

export function CatalogHeader({
  title,
  description,
  searchPlaceholder = "Search services...",
  onSearch,
}: CatalogHeaderProps) {
  return (
    <div className="space-y-4">
      <div className="text-2xl font-bold tracking-tight">
        {title}
        <div className="text-muted-foreground text-sm font-normal">
          {description}
        </div>
      </div>
      {onSearch && (
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder={searchPlaceholder}
            className="pl-10"
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
      )}
    </div>
  );
}
