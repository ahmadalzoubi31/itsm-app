"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  User,
  AlertTriangle,
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
} from "lucide-react";
import { toast } from "sonner";
import { createServiceRequest } from "../services/request.service";
import { ServiceRequest } from "../types";
import { ServiceCard, FormField } from "../../service-cards/types";

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

interface NewServiceRequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  services: ServiceCard[];
  selectedServiceId?: string | null;
  onRequestCreated?: () => void;
}

export const NewServiceRequestDialog = ({
  open,
  onOpenChange,
  services,
  selectedServiceId,
  onRequestCreated,
}: NewServiceRequestDialogProps) => {
  const [selectedService, setSelectedService] = useState<string>("");
  const [customFieldValues, setCustomFieldValues] = useState<
    Record<string, any>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pre-select service when selectedServiceId is provided
  useEffect(() => {
    if (selectedServiceId && services.find((s) => s.id === selectedServiceId)) {
      setSelectedService(selectedServiceId);
    }
  }, [selectedServiceId, services]);

  // Reset custom field values when service changes
  useEffect(() => {
    setCustomFieldValues({});
  }, [selectedService]);

  const resetForm = () => {
    setSelectedService("");
    setCustomFieldValues({});
    setIsSubmitting(false);
  };

  const handleSubmit = async () => {
    const selectedServiceData = services.find((s) => s.id === selectedService);
    if (!selectedServiceData) return;

    setIsSubmitting(true);

    try {
      const requestData: Partial<ServiceRequest> = {
        serviceId: selectedServiceData.id,
        serviceName: selectedServiceData.name,
        title: selectedServiceData.name, // Use service name as title
        priority: "medium", // Default priority
        businessJustification: "Service request via catalog", // Default justification
        requiredDate: "", // Optional
        additionalDetails: "", // Optional
        customFieldValues,
        status: "Submitted",
        progress: 0,
        workflowId: selectedServiceData.workflowId,
        workflowStatus: "Not Started",
      };

      await createServiceRequest(requestData);

      toast.success(
        `Your ${selectedServiceData.name} request has been submitted successfully!`
      );

      resetForm();
      onOpenChange(false);
      onRequestCreated?.(); // Refresh the requests list
    } catch (error) {
      console.error("Failed to create service request:", error);
      toast.error("Failed to submit request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  const selectedServiceData = services.find((s) => s.id === selectedService);

  const handleCustomFieldChange = (fieldId: string, value: any) => {
    setCustomFieldValues((prev) => ({
      ...prev,
      [fieldId]: value,
    }));
  };

  const renderCustomField = (field: FormField) => {
    const value = customFieldValues[field.id] || field.defaultValue || "";

    switch (field.type) {
      case "text":
      case "email":
        return (
          <div key={field.id}>
            <Label htmlFor={field.id}>
              {field.label}{" "}
              {field.required && <span className="text-red-500">*</span>}
            </Label>
            <Input
              id={field.id}
              type={field.type}
              value={value}
              onChange={(e) =>
                handleCustomFieldChange(field.id, e.target.value)
              }
              placeholder={field.placeholder}
              className="mt-1"
            />
            {field.helpText && (
              <p className="text-xs text-gray-500 mt-1">{field.helpText}</p>
            )}
          </div>
        );

      case "textarea":
        return (
          <div key={field.id}>
            <Label htmlFor={field.id}>
              {field.label}{" "}
              {field.required && <span className="text-red-500">*</span>}
            </Label>
            <Textarea
              id={field.id}
              value={value}
              onChange={(e) =>
                handleCustomFieldChange(field.id, e.target.value)
              }
              placeholder={field.placeholder}
              className="mt-1"
              rows={3}
            />
            {field.helpText && (
              <p className="text-xs text-gray-500 mt-1">{field.helpText}</p>
            )}
          </div>
        );

      case "select":
        return (
          <div key={field.id}>
            <Label htmlFor={field.id}>
              {field.label}{" "}
              {field.required && <span className="text-red-500">*</span>}
            </Label>
            <Select
              value={value}
              onValueChange={(newValue) =>
                handleCustomFieldChange(field.id, newValue)
              }
            >
              <SelectTrigger className="mt-1">
                <SelectValue
                  placeholder={field.placeholder || "Select an option"}
                />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {field.helpText && (
              <p className="text-xs text-gray-500 mt-1">{field.helpText}</p>
            )}
          </div>
        );

      case "number":
        return (
          <div key={field.id}>
            <Label htmlFor={field.id}>
              {field.label}{" "}
              {field.required && <span className="text-red-500">*</span>}
            </Label>
            <Input
              id={field.id}
              type="number"
              value={value}
              onChange={(e) =>
                handleCustomFieldChange(field.id, e.target.value)
              }
              placeholder={field.placeholder}
              className="mt-1"
            />
            {field.helpText && (
              <p className="text-xs text-gray-500 mt-1">{field.helpText}</p>
            )}
          </div>
        );

      case "date":
        return (
          <div key={field.id}>
            <Label htmlFor={field.id}>
              {field.label}{" "}
              {field.required && <span className="text-red-500">*</span>}
            </Label>
            <Input
              id={field.id}
              type="date"
              value={value}
              onChange={(e) =>
                handleCustomFieldChange(field.id, e.target.value)
              }
              className="mt-1"
            />
            {field.helpText && (
              <p className="text-xs text-gray-500 mt-1">{field.helpText}</p>
            )}
          </div>
        );

      case "checkbox":
        return (
          <div key={field.id} className="flex items-center space-x-2">
            <Checkbox
              id={field.id}
              checked={Boolean(value)}
              onCheckedChange={(checked) =>
                handleCustomFieldChange(field.id, checked)
              }
            />
            <Label htmlFor={field.id} className="text-sm font-normal">
              {field.label}{" "}
              {field.required && <span className="text-red-500">*</span>}
            </Label>
            {field.helpText && (
              <p className="text-xs text-gray-500">{field.helpText}</p>
            )}
          </div>
        );

      case "radio":
        return (
          <div key={field.id}>
            <Label>
              {field.label}{" "}
              {field.required && <span className="text-red-500">*</span>}
            </Label>
            <RadioGroup
              value={value}
              onValueChange={(newValue) =>
                handleCustomFieldChange(field.id, newValue)
              }
              className="mt-2"
            >
              {field.options?.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem
                    value={option.value}
                    id={`${field.id}-${option.value}`}
                  />
                  <Label htmlFor={`${field.id}-${option.value}`}>
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
            {field.helpText && (
              <p className="text-xs text-gray-500 mt-1">{field.helpText}</p>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>New Service Request</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Service Selection */}
          <div className="space-y-3">
            <Label>Select Service</Label>
            <div className="grid grid-cols-1 gap-3 max-h-60 overflow-y-auto">
              {services.map((service) => {
                const IconComponent = getIconComponent(service.icon);
                return (
                  <div
                    key={service.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-all ${
                      selectedService === service.id
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => setSelectedService(service.id)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-primary flex items-center justify-center text-white">
                        <IconComponent className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{service.name}</h4>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="text-xs">
                              {service.category}
                            </Badge>
                            <span className="text-xs text-gray-500">
                              {service.estimatedTime}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {service.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {selectedService && (
            <>
              {/* Custom Fields */}
              {selectedServiceData?.config?.customFields &&
                selectedServiceData.config.customFields.length > 0 && (
                  <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-900">
                      Request Information
                    </h4>
                    <div className="space-y-4">
                      {selectedServiceData.config.customFields.map((field) =>
                        renderCustomField(field)
                      )}
                    </div>
                  </div>
                )}

              {/* Service Information */}
              {selectedServiceData && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h5 className="font-medium text-blue-800 mb-2">
                    Service Information
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-blue-600" />
                      <span className="text-blue-700">
                        <strong>Estimated Time:</strong>{" "}
                        {selectedServiceData.estimatedTime}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-blue-600" />
                      <span className="text-blue-700">
                        <strong>Department:</strong>{" "}
                        {selectedServiceData.category}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-blue-600" />
                      <span className="text-blue-700">
                        <strong>Cost:</strong> {selectedServiceData.price}
                      </span>
                    </div>
                  </div>
                  {selectedServiceData.workflowId && (
                    <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800">
                      <AlertTriangle className="inline h-3 w-3 mr-1" />
                      Once submitted, this request will automatically trigger
                      the workflow "{selectedServiceData.workflowId}" and notify
                      the relevant teams.
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={
              !selectedService ||
              isSubmitting ||
              (selectedServiceData?.config?.customFields?.some(
                (field) => field.required && !customFieldValues[field.id]
              ) ??
                false)
            }
          >
            {isSubmitting ? "Submitting..." : "Submit Request"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
