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
  BarChart3,
  TrendingUp,
  Activity,
  Layers,
  Download,
  Upload,
  Grid3X3,
  List,
  Calendar as CalendarIcon,
  Filter as FilterIcon,
  SortAsc,
  RefreshCw,
  Star,
  AlertCircle,
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
import { ServiceCard, ServiceCardStatus, ServiceCardVisibility } from "./types";
import { useServiceCards } from "./hooks/useServiceCards";
import {
  createServiceCard,
  deleteServiceCard,
  updateServiceCard,
} from "./services/service-card.service";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
  const { serviceCards, isLoading, refetch } = useServiceCards();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [sortBy, setSortBy] = useState<
    "name" | "category" | "lastModified" | "usage"
  >("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const handleCreateService = () => {
    router.push("/service-cards/create");
  };

  const handleEditService = (serviceCard: ServiceCard) => {
    // For now, we'll use the same create page but pass the service card data via query params
    // In a real app, you might want a separate edit page or pass data via state
    router.push(`/service-cards/create?edit=${serviceCard.id}`);
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
    // For duplication, we'll navigate to create page with duplicate flag
    // In a real app, you might want to pass the service card data via state
    router.push(`/service-cards/create?duplicate=${serviceCard.id}`);
  };

  // Calculate analytics
  const analytics = {
    totalServices: serviceCards.length,
    activeServices: serviceCards.filter((card) => card.isActive).length,
    totalRequests: serviceCards.reduce(
      (sum, card) => sum + (card.usage?.totalRequests || 0),
      0
    ),
    avgSuccessRate:
      serviceCards.length > 0
        ? Math.round(
            serviceCards.reduce(
              (sum, card) => sum + (card.usage?.successRate || 100),
              0
            ) / serviceCards.length
          )
        : 100,
    mostUsedService: serviceCards.reduce(
      (prev, current) =>
        (prev.usage?.totalRequests || 0) > (current.usage?.totalRequests || 0)
          ? prev
          : current,
      serviceCards[0]
    ),
    categoriesCount: new Set(
      serviceCards.map((card) =>
        typeof card.category === "object" ? card.category?.name : card.category
      )
    ).size,
  };

  // Filter services
  const filteredServices = serviceCards.filter((serviceCard) => {
    const matchesSearch =
      serviceCard.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (serviceCard.description || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      serviceCard.tags?.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesCategory =
      categoryFilter === "all" ||
      (typeof serviceCard.category === "object"
        ? serviceCard.category?.name
        : serviceCard.category) === categoryFilter;

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && serviceCard.isActive) ||
      (statusFilter === "inactive" && !serviceCard.isActive);

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Sort services
  const sortedServices = [...filteredServices].sort((a, b) => {
    let aValue, bValue;

    switch (sortBy) {
      case "name":
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
        break;
      case "category":
        aValue = (
          typeof a.category === "object"
            ? a.category?.name || ""
            : a.category || ""
        ).toLowerCase();
        bValue = (
          typeof b.category === "object"
            ? b.category?.name || ""
            : b.category || ""
        ).toLowerCase();
        break;
      case "lastModified":
        aValue = new Date(a.updatedAt || a.createdAt).getTime();
        bValue = new Date(b.updatedAt || b.createdAt).getTime();
        break;
      case "usage":
        aValue = a.usage?.totalRequests || 0;
        bValue = b.usage?.totalRequests || 0;
        break;
      default:
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
    }

    if (sortOrder === "asc") {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  });

  // Get unique categories
  const availableCategories = Array.from(
    new Set(
      serviceCards
        .map((card) =>
          typeof card.category === "object"
            ? card.category?.name
            : card.category
        )
        .filter(Boolean)
    )
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
    <div className="min-h-screen bg-gray-50">
      {/* Professional Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-4 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Layers className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Service Catalog Management
                  </h1>
                  <p className="text-gray-600">
                    Create, configure, and manage enterprise service offerings
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm">
                <Upload className="h-4 w-4 mr-2" />
                Import
              </Button>
              <Button
                onClick={handleCreateService}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Service Card
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Dashboard */}
      <div className="px-4 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white shadow-sm border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Services
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {analytics.totalServices}
                  </p>
                  <p className="text-sm text-green-600 mt-1">
                    <span className="font-medium">
                      {analytics.activeServices}
                    </span>{" "}
                    active
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <Layers className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Requests
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {analytics.totalRequests.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">All time</p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Success Rate
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {analytics.avgSuccessRate}%
                  </p>
                  <p className="text-sm text-green-600 mt-1">Average</p>
                </div>
                <div className="p-3 bg-emerald-100 rounded-full">
                  <CheckCircle className="h-6 w-6 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Categories
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {analytics.categoriesCount}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Active</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <BarChart3 className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Advanced Filters and Controls */}
      <div className="px-4 lg:px-8">
        <Card className="bg-white shadow-sm border-0 mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by name, description, or tags..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Select
                  value={categoryFilter}
                  onValueChange={setCategoryFilter}
                >
                  <SelectTrigger className="w-full sm:w-40 border-gray-200">
                    <FilterIcon className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Category" />
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

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-32 border-gray-200">
                    <Activity className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={sortBy}
                  onValueChange={(value: any) => setSortBy(value)}
                >
                  <SelectTrigger className="w-full sm:w-36 border-gray-200">
                    <SortAsc className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="category">Category</SelectItem>
                    <SelectItem value="lastModified">Last Modified</SelectItem>
                    <SelectItem value="usage">Usage</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                  }
                  className="border-gray-200"
                >
                  {sortOrder === "asc" ? "↑" : "↓"}
                </Button>
              </div>

              {/* View Toggle */}
              <div className="flex items-center gap-2 border border-gray-200 rounded-md p-1">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="h-8 w-8 p-0"
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "table" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("table")}
                  className="h-8 w-8 p-0"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>

              {/* Refresh */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => refetch()}
                className="border-gray-200"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Services Content */}
      <div className="px-4 lg:px-8">
        {sortedServices.length === 0 ? (
          <Card className="bg-white shadow-sm border-0">
            <CardContent className="text-center py-16">
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                <Settings className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {searchTerm ||
                categoryFilter !== "all" ||
                statusFilter !== "all"
                  ? "No matching service cards found"
                  : "No service cards created yet"}
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                {searchTerm ||
                categoryFilter !== "all" ||
                statusFilter !== "all"
                  ? "Try adjusting your search criteria or filters to find the services you're looking for."
                  : "Start building your service catalog by creating your first service card. Define workflows, custom fields, and automation rules."}
              </p>
              {!searchTerm &&
                categoryFilter === "all" &&
                statusFilter === "all" && (
                  <Button
                    onClick={handleCreateService}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create First Service Card
                  </Button>
                )}
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Results Summary */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-gray-600">
                Showing{" "}
                <span className="font-medium">{sortedServices.length}</span> of{" "}
                <span className="font-medium">{serviceCards.length}</span>{" "}
                service cards
              </p>
              <div className="text-sm text-gray-500">
                Sorted by {sortBy} (
                {sortOrder === "asc" ? "ascending" : "descending"})
              </div>
            </div>

            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {sortedServices.map((serviceCard: ServiceCard) => {
                  const IconComponent = getIconComponent(serviceCard.icon);
                  return (
                    <Card
                      key={serviceCard.id}
                      className={`relative transition-all hover:shadow-lg hover:scale-[1.02] bg-white border-0 shadow-sm ${
                        !serviceCard.isActive ? "opacity-75" : ""
                      }`}
                    >
                      {/* Status Indicator */}
                      <div
                        className={`absolute top-4 right-4 w-3 h-3 rounded-full ${
                          serviceCard.isActive ? "bg-green-500" : "bg-gray-400"
                        }`}
                      />

                      <CardHeader className="pb-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div
                              className={`w-12 h-12 rounded-xl flex items-center justify-center text-white ${
                                serviceCard.isActive
                                  ? "bg-gradient-to-br from-blue-500 to-blue-600"
                                  : "bg-gray-400"
                              }`}
                            >
                              <IconComponent className="h-6 w-6" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <CardTitle className="text-lg font-semibold text-gray-900 truncate">
                                {serviceCard.name}
                              </CardTitle>
                              <div className="flex items-center gap-1 mt-1">
                                <Badge
                                  variant="secondary"
                                  className="text-xs bg-gray-100 text-gray-700 border-0"
                                >
                                  {typeof serviceCard.category === "object"
                                    ? serviceCard.category?.name
                                    : serviceCard.category}
                                </Badge>
                                {serviceCard.usage?.totalRequests &&
                                  serviceCard.usage.totalRequests > 0 && (
                                    <Badge
                                      variant="outline"
                                      className="text-xs border-green-200 text-green-700"
                                    >
                                      <Star className="h-3 w-3 mr-1" />
                                      Popular
                                    </Badge>
                                  )}
                              </div>
                            </div>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0 hover:bg-gray-100"
                              >
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              <DropdownMenuItem
                                onClick={() => handleEditService(serviceCard)}
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Service
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleDuplicateService(serviceCard)
                                }
                              >
                                <Copy className="h-4 w-4 mr-2" />
                                Duplicate
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Eye className="h-4 w-4 mr-2" />
                                View Analytics
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() =>
                                  handleDeleteService(serviceCard.id)
                                }
                                className="text-red-600 focus:text-red-600"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete Service
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        <CardDescription className="text-gray-600 line-clamp-2 text-sm leading-relaxed">
                          {serviceCard.description}
                        </CardDescription>

                        {/* Key Metrics */}
                        <div className="grid grid-cols-2 gap-4 py-3 border-y border-gray-100">
                          <div className="text-center">
                            <div className="text-lg font-semibold text-gray-900">
                              {serviceCard.usage?.totalRequests || 0}
                            </div>
                            <div className="text-xs text-gray-500">
                              Requests
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-semibold text-green-600">
                              {serviceCard.usage?.successRate || 100}%
                            </div>
                            <div className="text-xs text-gray-500">
                              Success Rate
                            </div>
                          </div>
                        </div>

                        {/* Service Details */}
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-500 flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              Duration
                            </span>
                            <span className="font-medium text-gray-900">
                              {serviceCard.estimatedTime || "Not specified"}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-500 flex items-center">
                              <CreditCard className="h-3 w-3 mr-1" />
                              Cost
                            </span>
                            <span className="font-medium text-gray-900">
                              {serviceCard.price}
                            </span>
                          </div>
                        </div>

                        {/* Configuration Summary */}
                        <div className="flex items-center justify-between pt-2">
                          <div className="flex items-center gap-3 text-xs text-gray-500">
                            {serviceCard.config?.customFields &&
                              serviceCard.config.customFields.length > 0 && (
                                <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded">
                                  <Settings className="h-3 w-3" />
                                  {serviceCard.config.customFields.length}{" "}
                                  fields
                                </span>
                              )}
                            {serviceCard.config?.approvalWorkflow &&
                              serviceCard.config.approvalWorkflow.length >
                                0 && (
                                <span className="flex items-center gap-1 bg-blue-50 px-2 py-1 rounded text-blue-600">
                                  <CheckCircle className="h-3 w-3" />
                                  {
                                    serviceCard.config.approvalWorkflow.length
                                  }{" "}
                                  approvals
                                </span>
                              )}
                          </div>
                        </div>

                        {/* Tags */}
                        {serviceCard.tags && serviceCard.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {serviceCard.tags.slice(0, 3).map((tag) => (
                              <Badge
                                key={tag}
                                variant="outline"
                                className="text-xs bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
                              >
                                {tag}
                              </Badge>
                            ))}
                            {serviceCard.tags.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{serviceCard.tags.length - 3} more
                              </Badge>
                            )}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              /* Table View */
              <Card className="bg-white shadow-sm border-0">
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Service
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Category
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Requests
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Success Rate
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Last Modified
                          </th>
                          <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {sortedServices.map((serviceCard: ServiceCard) => {
                          const IconComponent = getIconComponent(
                            serviceCard.icon
                          );
                          return (
                            <tr
                              key={serviceCard.id}
                              className="hover:bg-gray-50 transition-colors"
                            >
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div
                                    className={`w-10 h-10 rounded-lg flex items-center justify-center text-white mr-4 ${
                                      serviceCard.isActive
                                        ? "bg-gradient-to-br from-blue-500 to-blue-600"
                                        : "bg-gray-400"
                                    }`}
                                  >
                                    <IconComponent className="h-5 w-5" />
                                  </div>
                                  <div>
                                    <div className="text-sm font-medium text-gray-900">
                                      {serviceCard.name}
                                    </div>
                                    <div className="text-sm text-gray-500 max-w-xs truncate">
                                      {serviceCard.description}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <Badge
                                  variant="secondary"
                                  className="bg-gray-100 text-gray-700"
                                >
                                  {typeof serviceCard.category === "object"
                                    ? serviceCard.category?.name
                                    : serviceCard.category}
                                </Badge>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div
                                    className={`w-2 h-2 rounded-full mr-2 ${
                                      serviceCard.isActive
                                        ? "bg-green-500"
                                        : "bg-gray-400"
                                    }`}
                                  />
                                  <span
                                    className={`text-sm font-medium ${
                                      serviceCard.isActive
                                        ? "text-green-600"
                                        : "text-gray-500"
                                    }`}
                                  >
                                    {serviceCard.isActive
                                      ? "Active"
                                      : "Inactive"}
                                  </span>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {serviceCard.usage?.totalRequests?.toLocaleString() ||
                                  "0"}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                <div className="flex items-center">
                                  <span
                                    className={`font-medium ${
                                      (serviceCard.usage?.successRate || 100) >=
                                      95
                                        ? "text-green-600"
                                        : (serviceCard.usage?.successRate ||
                                            100) >= 80
                                        ? "text-yellow-600"
                                        : "text-red-600"
                                    }`}
                                  >
                                    {serviceCard.usage?.successRate || 100}%
                                  </span>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {new Date(
                                  serviceCard.updatedAt || serviceCard.createdAt
                                ).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-8 w-8 p-0"
                                    >
                                      <MoreVertical className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem
                                      onClick={() =>
                                        handleEditService(serviceCard)
                                      }
                                    >
                                      <Edit className="h-4 w-4 mr-2" />
                                      Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() =>
                                        handleDuplicateService(serviceCard)
                                      }
                                    >
                                      <Copy className="h-4 w-4 mr-2" />
                                      Duplicate
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                      onClick={() =>
                                        handleDeleteService(serviceCard.id)
                                      }
                                      className="text-red-600"
                                    >
                                      <Trash2 className="h-4 w-4 mr-2" />
                                      Delete
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
}
