import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, AlertCircle } from "lucide-react";

interface ServiceCatalogProps {
  services: any[];
  onRequestService: (serviceId: string) => void;
}

export const ServiceCatalog = ({
  services,
  onRequestService,
}: ServiceCatalogProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Service Catalog</CardTitle>
        <CardDescription>Available services you can request</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {services.map((service) => (
          <div
            key={service.id}
            className="p-4 border rounded-lg hover:shadow-md transition-all"
          >
            <div className="flex items-start gap-4">
              <div
                className={`w-10 h-10 rounded-lg ${service.color} flex items-center justify-center text-white`}
              >
                <service.icon className="h-5 w-5" />
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
        ))}
        {services.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <AlertCircle className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p>No services found matching your filters.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
