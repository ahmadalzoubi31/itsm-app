"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Plus,
  Edit,
  Trash2,
  User,
  Calendar,
  CheckCircle,
  Clock,
  Settings,
  Search,
  Filter,
  MoreVertical,
  Copy,
  Eye,
  FileText,
  Mail,
  Phone,
  Monitor,
  Database,
  Shield,
  Wrench,
  Building,
  CreditCard,
  Users,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ServiceCard } from "./types";
import { useServiceCards } from "./hooks/useServiceCards";
import {
  createServiceCard,
  deleteServiceCard,
  updateServiceCard,
} from "./services/service-card.service";
import { ServiceCardBuilder } from "./components/ServiceCardBuilder";
import { toast } from "sonner";

// Icon mapping function to convert string identifiers to React components
const getIconComponent = (iconIdentifier: any) => {
  // If it's already a valid React component, return it
  if (typeof iconIdentifier === "function") {
    return iconIdentifier;
  }

  // Map string identifiers to icon components
  const iconMap: Record<string, any> = {
    User: User,
    FileText: FileText,
    Mail: Mail,
    Phone: Phone,
    Monitor: Monitor,
    Database: Database,
    Shield: Shield,
    Wrench: Wrench,
    Building: Building,
    CreditCard: CreditCard,
    Users: Users,
    Settings: Settings,
    Calendar: Calendar,
    Clock: Clock,
  };

  // If it's a string, look it up in the map
  if (typeof iconIdentifier === "string" && iconMap[iconIdentifier]) {
    return iconMap[iconIdentifier];
  }

  // Default fallback
  return User;
};

export default function ServiceCards() {
  const { serviceCards, isLoading, refetch } = useServiceCards();
  const [showBuilder, setShowBuilder] = useState(false);
  const [editingServiceCard, setEditingServiceCard] = useState<
    ServiceCard | undefined
  >(undefined);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const handleCreateService = () => {
    setEditingServiceCard(undefined);
    setShowBuilder(true);
  };

  const handleEditService = (serviceCard: ServiceCard) => {
    setEditingServiceCard(serviceCard);
    setShowBuilder(true);
  };

  const handleSaveService = async (serviceCardData: Partial<ServiceCard>) => {
    try {
      if (editingServiceCard) {
        await updateServiceCard(editingServiceCard.id, serviceCardData);
        toast.success("Service card updated successfully!");
      } else {
        await createServiceCard(serviceCardData);
        toast.success("Service card created successfully!");
      }
      setShowBuilder(false);
      setEditingServiceCard(undefined);
      refetch();
    } catch (error) {
      console.error("Failed to save service card:", error);
      toast.error("Failed to save service card. Please try again.");
    }
  };

  const handleDeleteService = async (serviceId: string) => {
    try {
      await deleteServiceCard(serviceId);
      toast.success("Service card deleted successfully!");
      refetch();
    } catch (error) {
      console.error("Failed to delete service card:", error);
      toast.error("Failed to delete service card. Please try again.");
    }
  };

  const handleDuplicateService = (serviceCard: ServiceCard) => {
    const { id, ...serviceCardWithoutId } = serviceCard;
    const duplicatedCard = {
      ...serviceCardWithoutId,
      name: `${serviceCard.name} (Copy)`,
    };
    setEditingServiceCard(duplicatedCard as ServiceCard);
    setShowBuilder(true);
  };

  // Filter services
  const filteredServices = serviceCards.filter((serviceCard) => {
    const matchesSearch =
      serviceCard.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      serviceCard.description
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      serviceCard.tags?.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesCategory =
      categoryFilter === "all" || serviceCard.category === categoryFilter;

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && serviceCard.isActive) ||
      (statusFilter === "inactive" && !serviceCard.isActive);

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Get unique categories
  const availableCategories = Array.from(
    new Set(serviceCards.map((card) => card.category))
  );

  if (isLoading) {
    return (
      <div className="px-4 lg:px-6">
        <div className="flex flex-row items-center justify-between mb-6">
          <div className="text-2xl font-bold tracking-tight">
            Service Catalog Management
            <div className="text-muted-foreground text-sm font-normal">
              Loading service cards...
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-200 rounded"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-32"></div>
                      <div className="h-3 bg-gray-200 rounded w-16"></div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-row items-center justify-between px-4 lg:px-6">
        <div className="text-2xl font-bold tracking-tight">
          Service Catalog Management
          <div className="text-muted-foreground text-sm font-normal">
            Create and manage services that users can request
          </div>
        </div>
        <Button onClick={handleCreateService}>
          <Plus className="h-4 w-4 mr-2" />
          Create Service Card
        </Button>
      </div>

      {/* Filters */}
      <div className="px-4 lg:px-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search service cards..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="w-full sm:w-48">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {availableCategories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="w-full sm:w-48">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="px-4 lg:px-6">
        {filteredServices.length === 0 ? (
          <div className="text-center py-12">
            <Settings className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm || categoryFilter !== "all" || statusFilter !== "all"
                ? "No matching service cards"
                : "No service cards yet"}
            </h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || categoryFilter !== "all" || statusFilter !== "all"
                ? "Try adjusting your search or filters to find what you're looking for."
                : "Get started by creating your first service card to offer services to users."}
            </p>
            {!searchTerm &&
              categoryFilter === "all" &&
              statusFilter === "all" && (
                <Button onClick={handleCreateService}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Service Card
                </Button>
              )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((serviceCard: ServiceCard) => {
              const IconComponent = getIconComponent(serviceCard.icon);
              return (
                <Card
                  key={serviceCard.id}
                  className={`relative transition-all hover:shadow-md ${
                    !serviceCard.isActive ? "opacity-60" : ""
                  }`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-white">
                          <IconComponent className="h-5 w-5" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">
                            {serviceCard.name}
                          </CardTitle>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="secondary" className="text-xs">
                              {serviceCard.category}
                            </Badge>
                            {serviceCard.tags?.slice(0, 2).map((tag) => (
                              <Badge
                                key={tag}
                                variant="outline"
                                className="text-xs"
                              >
                                {tag}
                              </Badge>
                            ))}
                            {serviceCard.tags &&
                              serviceCard.tags.length > 2 && (
                                <Badge variant="outline" className="text-xs">
                                  +{serviceCard.tags.length - 2}
                                </Badge>
                              )}
                          </div>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="sm" variant="ghost">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleEditService(serviceCard)}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDuplicateService(serviceCard)}
                          >
                            <Copy className="h-4 w-4 mr-2" />
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleDeleteService(serviceCard.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <CardDescription className="line-clamp-2">
                      {serviceCard.description}
                    </CardDescription>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">
                        <Clock className="inline h-3 w-3 mr-1" />
                        {serviceCard.estimatedTime}
                      </span>
                      <span className="text-green-600 font-medium">
                        {serviceCard.price}
                      </span>
                    </div>

                    {serviceCard.workflowId && (
                      <div className="text-xs text-gray-500">
                        Workflow: {serviceCard.workflowId}
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-2">
                      <Badge
                        variant={serviceCard.isActive ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {serviceCard.isActive ? "Active" : "Inactive"}
                      </Badge>

                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        {serviceCard.config?.customFields &&
                          serviceCard.config.customFields.length > 0 && (
                            <span className="flex items-center gap-1">
                              <Settings className="h-3 w-3" />
                              {serviceCard.config.customFields.length} fields
                            </span>
                          )}
                        {serviceCard.config?.approvalWorkflow &&
                          serviceCard.config.approvalWorkflow.length > 0 && (
                            <span className="flex items-center gap-1">
                              <CheckCircle className="h-3 w-3" />
                              {serviceCard.config.approvalWorkflow.length}{" "}
                              approvals
                            </span>
                          )}
                      </div>
                    </div>

                    {serviceCard.usage && (
                      <div className="pt-2 border-t">
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>
                            {serviceCard.usage.totalRequests || 0} requests
                          </span>
                          <span>
                            {serviceCard.usage.successRate || 100}% success
                          </span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Service Card Builder */}
      <ServiceCardBuilder
        serviceCard={editingServiceCard}
        onSave={handleSaveService}
        onCancel={() => {
          setShowBuilder(false);
          setEditingServiceCard(undefined);
        }}
        isOpen={showBuilder}
      />
    </>
  );
}
