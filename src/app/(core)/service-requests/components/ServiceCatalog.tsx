import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Clock,
  AlertCircle,
  User,
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
  Settings,
  Calendar,
} from "lucide-react";
import { ServiceCard } from "../../service-cards/types";

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

interface ServiceCatalogProps {
  services: ServiceCard[];
  onRequestService: (serviceId: string) => void;
  isLoading?: boolean;
}

export const ServiceCatalog = ({
  services,
  onRequestService,
  isLoading = false,
}: ServiceCatalogProps) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Service Catalog</CardTitle>
          <CardDescription>Available services you can request</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-4 border rounded-lg">
              <div className="flex items-start gap-4">
                <Skeleton className="w-10 h-10 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-3 w-[300px]" />
                  <div className="flex items-center gap-4 mt-3">
                    <Skeleton className="h-5 w-[60px]" />
                    <Skeleton className="h-3 w-[80px]" />
                    <Skeleton className="h-3 w-[50px]" />
                  </div>
                </div>
                <Skeleton className="h-8 w-[80px]" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Service Catalog</CardTitle>
        <CardDescription>Available services you can request</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {services.map((service) => {
          const IconComponent = getIconComponent(service.icon);
          return (
            <div
              key={service.id}
              className="p-4 border rounded-lg hover:shadow-md transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-white">
                  <IconComponent className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {service.name}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">
                        {service.description}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => onRequestService(service.id)}
                    >
                      Request
                    </Button>
                  </div>
                  <div className="flex items-center gap-4 mt-3">
                    <Badge variant="secondary" className="text-xs">
                      {service.category}
                    </Badge>
                    <span className="text-xs text-gray-500">
                      <Clock className="inline h-3 w-3 mr-1" />
                      {service.estimatedTime}
                    </span>
                    <span className="text-xs text-green-600 font-medium">
                      {service.price}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        {services.length === 0 && !isLoading && (
          <div className="text-center py-8 text-gray-500">
            <AlertCircle className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p>No services found matching your filters.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
