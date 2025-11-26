"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useServicesHook } from "./services/_lib/_hooks/useServices.hook";
// import { useRequestCardsHook } from "./services/_lib/_hooks/useRequestCards.hook";
import { Layers, FileText, Plus, Settings } from "lucide-react";
import Link from "next/link";
import { CatalogHeader } from "../_components/CatalogHeader";
import { useCategoriesHook } from "./categories/_lib/_hooks/useCategories";
import { useRequestCards } from "./request-cards/_lib/_hooks/useRequestCards";

export default function CatalogAdminPage() {
  const { services } = useServicesHook();
  const { categories } = useCategoriesHook();
  const { requestCards } = useRequestCards();

  const stats = [
    {
      title: "Total Categories",
      value: categories.length,
      icon: Layers,
      href: "/catalog/admin/categories",
    },
    {
      title: "Total Services",
      value: services.length,
      icon: Layers,
      href: "/catalog/admin/services",
    },
    {
      title: "Request Cards",
      value: requestCards.length,
      icon: FileText,
      href: "/catalog/admin/request-cards",
    },
  ];

  return (
    <div className="px-4 lg:px-8 space-y-6">
      <div className="flex items-center justify-between">
        <CatalogHeader
          title="Catalog Administration"
          description="Manage services and request cards"
        />
        <Button variant="outline" size="sm" asChild>
          <Link href="/catalog">
            <Settings className="h-4 w-4 mr-2" />
            View Catalog
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stat.value}</div>
                <Button
                  size="sm"
                  variant="link"
                  className="p-0 h-auto mt-2"
                  asChild
                >
                  <Link href={stat.href}>View all →</Link>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common administrative tasks</CardDescription>
        </CardHeader>
        <CardContent className="flex gap-4">
          <Button size="sm" variant="outline" asChild>
            <Link href="/catalog/admin/categories/new">
              {/* <Plus className="h-4 w-4 mr-2" /> */}
              New Category
            </Link>
          </Button>
          <Button size="sm" variant="outline" asChild>
            <Link href="/catalog/admin/services/new">
              {/* <Plus className="h-4 w-4 mr-2" /> */}
              New Service
            </Link>
          </Button>
          <Button size="sm" variant="outline" asChild>
            <Link href="/catalog/admin/request-cards/new">
              {/* <Plus className="h-4 w-4 mr-2" /> */}
              New Request Card
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
