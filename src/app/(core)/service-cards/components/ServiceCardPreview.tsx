"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Clock,
  User,
  Users,
  AlertTriangle,
  Calendar,
  DollarSign,
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
  Settings,
} from "lucide-react";

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

interface ServiceCardPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  serviceCard: any;
}

export const ServiceCardPreview = ({
  isOpen,
  onClose,
  serviceCard,
}: ServiceCardPreviewProps) => {
  const IconComponent = getIconComponent(serviceCard.icon);

  const renderFormField = (field: any) => {
    switch (field.type) {
      case "text":
      case "email":
      case "number":
        return (
          <div key={field.id} className="space-y-2">
            <Label>
              {field.label}{" "}
              {field.required && <span className="text-red-500">*</span>}
            </Label>
            <Input placeholder={field.placeholder} disabled type={field.type} />
            {field.helpText && (
              <p className="text-xs text-gray-500">{field.helpText}</p>
            )}
          </div>
        );

      case "textarea":
        return (
          <div key={field.id} className="space-y-2">
            <Label>
              {field.label}{" "}
              {field.required && <span className="text-red-500">*</span>}
            </Label>
            <Textarea placeholder={field.placeholder} disabled rows={3} />
            {field.helpText && (
              <p className="text-xs text-gray-500">{field.helpText}</p>
            )}
          </div>
        );

      case "select":
        return (
          <div key={field.id} className="space-y-2">
            <Label>
              {field.label}{" "}
              {field.required && <span className="text-red-500">*</span>}
            </Label>
            <Select disabled>
              <SelectTrigger>
                <SelectValue
                  placeholder={field.placeholder || "Select an option"}
                />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map((option: any) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {field.helpText && (
              <p className="text-xs text-gray-500">{field.helpText}</p>
            )}
          </div>
        );

      case "radio":
        return (
          <div key={field.id} className="space-y-2">
            <Label>
              {field.label}{" "}
              {field.required && <span className="text-red-500">*</span>}
            </Label>
            <RadioGroup disabled>
              {field.options?.map((option: any) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={option.value} />
                  <Label htmlFor={option.value}>{option.label}</Label>
                </div>
              ))}
            </RadioGroup>
            {field.helpText && (
              <p className="text-xs text-gray-500">{field.helpText}</p>
            )}
          </div>
        );

      case "checkbox":
        return (
          <div key={field.id} className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox id={field.id} disabled />
              <Label htmlFor={field.id}>
                {field.label}{" "}
                {field.required && <span className="text-red-500">*</span>}
              </Label>
            </div>
            {field.helpText && (
              <p className="text-xs text-gray-500">{field.helpText}</p>
            )}
          </div>
        );

      case "date":
        return (
          <div key={field.id} className="space-y-2">
            <Label>
              {field.label}{" "}
              {field.required && <span className="text-red-500">*</span>}
            </Label>
            <Input type="date" disabled />
            {field.helpText && (
              <p className="text-xs text-gray-500">{field.helpText}</p>
            )}
          </div>
        );

      case "file":
        return (
          <div key={field.id} className="space-y-2">
            <Label>
              {field.label}{" "}
              {field.required && <span className="text-red-500">*</span>}
            </Label>
            <Input type="file" disabled />
            {field.helpText && (
              <p className="text-xs text-gray-500">{field.helpText}</p>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Service Card Preview
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Service Card Display */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center text-white">
                  <IconComponent className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-xl">{serviceCard.name}</CardTitle>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary">{serviceCard.category}</Badge>
                    {serviceCard.tags?.map((tag: string) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                <Button size="lg">Request Service</Button>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base mb-4">
                {serviceCard.description}
              </CardDescription>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-xs text-gray-500">Estimated Time</p>
                    <p className="text-sm font-medium">
                      {serviceCard.estimatedTime}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-xs text-gray-500">Cost</p>
                    <p className="text-sm font-medium">{serviceCard.price}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-xs text-gray-500">Department</p>
                    <p className="text-sm font-medium">
                      {serviceCard.category}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-xs text-gray-500">Workflow</p>
                    <p className="text-sm font-medium">
                      {serviceCard.workflowId || "Auto"}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Request Form Preview */}
          {serviceCard.config?.customFields &&
            serviceCard.config.customFields.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Request Form</CardTitle>
                  <CardDescription>
                    Additional information that users will be asked to provide
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {serviceCard.config.customFields.map(renderFormField)}
                </CardContent>
              </Card>
            )}

          {/* Approval Workflow Preview */}
          {serviceCard.config?.approvalWorkflow &&
            serviceCard.config.approvalWorkflow.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Approval Workflow</CardTitle>
                  <CardDescription>
                    This request will go through the following approval steps
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {serviceCard.config.approvalWorkflow.map(
                      (step: any, index: number) => (
                        <div
                          key={step.id}
                          className="flex items-center gap-3 p-3 border rounded-lg"
                        >
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-sm font-medium text-blue-600">
                              {index + 1}
                            </span>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium">{step.name}</h4>
                            <p className="text-sm text-gray-600">
                              {step.approverRole
                                ? `Approver: ${step.approverRole}`
                                : "Custom approvers"}
                            </p>
                          </div>
                          {step.isRequired ? (
                            <Badge variant="destructive" className="text-xs">
                              Required
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="text-xs">
                              Optional
                            </Badge>
                          )}
                        </div>
                      )
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

          {/* SLA Information */}
          {serviceCard.config?.slaConfig && (
            <Card>
              <CardHeader>
                <CardTitle>Service Level Agreement</CardTitle>
                <CardDescription>
                  Expected response and resolution times
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-4 w-4 text-blue-600" />
                      <span className="font-medium">Response Time</span>
                    </div>
                    <p className="text-2xl font-bold text-blue-600">
                      {serviceCard.config.slaConfig.responseTime}h
                    </p>
                    <p className="text-xs text-gray-500">
                      Maximum time for initial response
                    </p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="h-4 w-4 text-green-600" />
                      <span className="font-medium">Resolution Time</span>
                    </div>
                    <p className="text-2xl font-bold text-green-600">
                      {serviceCard.config.slaConfig.resolutionTime}h
                    </p>
                    <p className="text-xs text-gray-500">
                      Maximum time for completion
                    </p>
                  </div>
                </div>

                {serviceCard.config.slaConfig.escalationSteps &&
                  serviceCard.config.slaConfig.escalationSteps.length > 0 && (
                    <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="h-4 w-4 text-yellow-600" />
                        <span className="font-medium text-yellow-800">
                          Escalation Policy
                        </span>
                      </div>
                      <p className="text-sm text-yellow-700">
                        If response or resolution times are at risk, this
                        request will be automatically escalated through{" "}
                        {serviceCard.config.slaConfig.escalationSteps.length}{" "}
                        level(s).
                      </p>
                    </div>
                  )}
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
