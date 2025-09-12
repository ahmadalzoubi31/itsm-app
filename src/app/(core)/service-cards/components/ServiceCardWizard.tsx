"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import {
  User,
  Calendar,
  Settings,
  CheckCircle,
  Clock,
  Plus,
  ArrowRight,
  ArrowLeft,
  Save,
  X,
  Sparkles,
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
  Zap,
  Target,
  Workflow,
  Bell,
  Eye,
  Lightbulb,
  Rocket,
  Star,
  CheckSquare,
} from "lucide-react";
import {
  ServiceCard,
  ServiceCardConfig,
} from "../types";

interface ServiceCardWizardProps {
  serviceCard?: ServiceCard;
  onSave: (serviceCard: Partial<ServiceCard>) => void;
  onCancel: () => void;
  isOpen: boolean;
}

// Service Templates
const serviceTemplates = [
  {
    id: "it-access",
    name: "IT Access Request",
    description: "Grant access to systems, applications, or resources",
    category: "IT",
    icon: "Shield",
    estimatedTime: "2-3 business days",
    price: "Free",
    tags: ["access", "security", "permissions"],
    color: "blue",
    popular: true,
    config: {
      customFields: [
        {
          id: "system",
          label: "System/Application",
          type: "select" as const,
          required: true,
          options: [
            { label: "Active Directory", value: "ad" },
            { label: "VPN Access", value: "vpn" },
            { label: "Email System", value: "email" },
          ],
          validationRules: [],
        },
        {
          id: "business_justification",
          label: "Business Justification",
          type: "textarea" as const,
          required: true,
          validationRules: [],
        },
      ],
      approvalWorkflow: [
        {
          id: "manager",
          name: "Manager Approval",
          approverRole: "manager",
          isRequired: true,
          order: 1,
        },
        {
          id: "it_security",
          name: "IT Security Review",
          approverRole: "it_security",
          isRequired: true,
          order: 2,
        },
      ],
      slaConfig: {
        responseTime: 4,
        resolutionTime: 48,
        escalationSteps: [],
      },
      notifications: {
        onCreate: { notifyRequester: true, notifyApprovers: true },
        onApproval: { notifyRequester: true, notifyNextApprover: true },
        onCompletion: { notifyRequester: true, notifyStakeholders: false },
        onEscalation: { notifyManager: true },
      },
    },
  },
  {
    id: "hr-onboarding",
    name: "Employee Onboarding",
    description: "Complete onboarding process for new employees",
    category: "HR",
    icon: "Users",
    estimatedTime: "5-7 business days",
    price: "Free",
    tags: ["onboarding", "new-hire", "setup"],
    color: "green",
    popular: true,
    config: {
      customFields: [
        {
          id: "start_date",
          label: "Start Date",
          type: "date" as const,
          required: true,
          validationRules: [],
        },
        {
          id: "department",
          label: "Department",
          type: "select" as const,
          required: true,
          options: [
            { label: "Engineering", value: "engineering" },
            { label: "Sales", value: "sales" },
            { label: "Marketing", value: "marketing" },
            { label: "HR", value: "hr" },
          ],
          validationRules: [],
        },
        {
          id: "equipment_needed",
          label: "Equipment Needed",
          type: "multiselect" as const,
          required: false,
          options: [
            { label: "Laptop", value: "laptop" },
            { label: "Monitor", value: "monitor" },
            { label: "Phone", value: "phone" },
          ],
          validationRules: [],
        },
      ],
      approvalWorkflow: [
        {
          id: "hr_review",
          name: "HR Review",
          approverRole: "hr",
          isRequired: true,
          order: 1,
        },
      ],
      slaConfig: {
        responseTime: 24,
        resolutionTime: 120,
        escalationSteps: [],
      },
      notifications: {
        onCreate: { notifyRequester: true, notifyApprovers: true },
        onApproval: { notifyRequester: true, notifyNextApprover: false },
        onCompletion: { notifyRequester: true, notifyStakeholders: true },
        onEscalation: { notifyManager: true },
      },
    },
  },
  {
    id: "procurement",
    name: "Procurement Request",
    description: "Request purchase of goods or services",
    category: "Finance",
    icon: "CreditCard",
    estimatedTime: "3-5 business days",
    price: "Free",
    tags: ["purchase", "procurement", "approval"],
    color: "purple",
    config: {
      customFields: [
        {
          id: "item_description",
          label: "Item Description",
          type: "textarea" as const,
          required: true,
          validationRules: [],
        },
        {
          id: "estimated_cost",
          label: "Estimated Cost",
          type: "number" as const,
          required: true,
          validationRules: [],
        },
        {
          id: "vendor",
          label: "Preferred Vendor",
          type: "text" as const,
          required: false,
          validationRules: [],
        },
      ],
      approvalWorkflow: [
        {
          id: "budget_approval",
          name: "Budget Approval",
          approverRole: "finance",
          isRequired: true,
          order: 1,
        },
      ],
      slaConfig: {
        responseTime: 8,
        resolutionTime: 72,
        escalationSteps: [],
      },
      notifications: {
        onCreate: { notifyRequester: true, notifyApprovers: true },
        onApproval: { notifyRequester: true, notifyNextApprover: false },
        onCompletion: { notifyRequester: true, notifyStakeholders: false },
        onEscalation: { notifyManager: true },
      },
    },
  },
  {
    id: "custom",
    name: "Start from Scratch",
    description: "Create a completely custom service card",
    category: "",
    icon: "Sparkles",
    estimatedTime: "",
    price: "Free",
    tags: [],
    color: "gray",
    config: {
      customFields: [],
      approvalWorkflow: [],
      slaConfig: {
        responseTime: 24,
        resolutionTime: 72,
        escalationSteps: [],
      },
      notifications: {
        onCreate: { notifyRequester: true, notifyApprovers: true },
        onApproval: { notifyRequester: true, notifyNextApprover: false },
        onCompletion: { notifyRequester: true, notifyStakeholders: false },
        onEscalation: { notifyManager: false },
      },
    },
  },
];

const iconMap = {
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
  Clock,
  Sparkles,
};

const getIconComponent = (iconName: string) => {
  return iconMap[iconName as keyof typeof iconMap] || User;
};

export const ServiceCardWizard = ({
  serviceCard,
  onSave,
  onCancel,
  isOpen,
}: ServiceCardWizardProps) => {
  const [step, setStep] = useState(serviceCard ? 2 : 1); // Start at step 2 if editing
  const [selectedTemplate, setSelectedTemplate] = useState<typeof serviceTemplates[0] | null>(null);
  const [formData, setFormData] = useState({
    name: serviceCard?.name || "",
    description: serviceCard?.description || "",
    category: serviceCard?.category || "",
    estimatedTime: serviceCard?.estimatedTime || "",
    price: serviceCard?.price || "Free",
    workflowId: serviceCard?.workflowId || "",
    icon: serviceCard?.icon || "User",
    isActive: serviceCard?.isActive ?? true,
    visibility: serviceCard?.visibility || "public",
    restrictedToGroups: serviceCard?.restrictedToGroups || [],
    tags: serviceCard?.tags || [],
  });

  const [config, setConfig] = useState<ServiceCardConfig>(
    serviceCard?.config || serviceTemplates[3].config // Default to custom template
  );

  // Auto-populate from template
  useEffect(() => {
    if (selectedTemplate && selectedTemplate.id !== "custom") {
      setFormData({
        name: selectedTemplate.name,
        description: selectedTemplate.description,
        category: selectedTemplate.category,
        estimatedTime: selectedTemplate.estimatedTime,
        price: selectedTemplate.price,
        workflowId: "",
        icon: selectedTemplate.icon,
        isActive: true,
        visibility: "public",
        restrictedToGroups: [],
        tags: selectedTemplate.tags,
      });
      setConfig(selectedTemplate.config);
    }
  }, [selectedTemplate]);

  const steps = [
    {
      id: 1,
      title: "Choose Template",
      description: "Start with a pre-configured template or create from scratch",
      icon: Target,
    },
    {
      id: 2,
      title: "Basic Details",
      description: "Define your service name, description, and basic settings",
      icon: FileText,
    },
    {
      id: 3,
      title: "Configuration",
      description: "Set up workflows, approvals, and custom fields",
      icon: Settings,
    },
    {
      id: 4,
      title: "Review & Launch",
      description: "Preview your service and make it available to users",
      icon: Rocket,
    },
  ];

  const currentStepIndex = steps.findIndex((s) => s.id === step);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  const handleNext = () => {
    if (step < steps.length) {
      setStep(step + 1);
    }
  };

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSave = () => {
    const serviceCardData = {
      ...formData,
      config,
    };
    onSave(serviceCardData);
  };

  const validateCurrentStep = () => {
    switch (step) {
      case 1:
        return selectedTemplate !== null;
      case 2:
        return formData.name.trim() !== "" && formData.category !== "";
      case 3:
        return true; // Configuration is optional
      case 4:
        return true;
      default:
        return false;
    }
  };

  const categories = ["IT", "HR", "Finance", "Legal", "Operations", "Other"];

  return (
    <Dialog open={isOpen} onOpenChange={onCancel}>
      <DialogContent className="max-w-6xl h-[90vh] p-0 overflow-hidden">
        <DialogHeader className="px-8 py-6 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <DialogTitle className="text-2xl font-semibold text-gray-900 flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Sparkles className="h-6 w-6 text-blue-600" />
                </div>
                {serviceCard ? "Edit Service Card" : "Create New Service Card"}
              </DialogTitle>
              <p className="text-gray-600">
                {steps.find((s) => s.id === step)?.description}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onCancel}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                Step {step} of {steps.length}
              </span>
              <span className="text-sm text-gray-500">{Math.round(progress)}% complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Step Navigation */}
          <div className="flex items-center justify-between mt-4">
            {steps.map((stepItem, index) => {
              const Icon = stepItem.icon;
              const isActive = stepItem.id === step;
              const isCompleted = stepItem.id < step;

              return (
                <div
                  key={stepItem.id}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                    isActive
                      ? "bg-blue-100 text-blue-700"
                      : isCompleted
                      ? "bg-green-100 text-green-700"
                      : "text-gray-500"
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    <Icon className="h-5 w-5" />
                  )}
                  <span className="text-sm font-medium hidden md:block">
                    {stepItem.title}
                  </span>
                </div>
              );
            })}
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          {/* Step 1: Template Selection */}
          {step === 1 && (
            <div className="p-8">
              <div className="text-center mb-8">
                <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <Target className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Choose Your Starting Point
                </h3>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Select a pre-configured template to get started quickly, or create a custom service from scratch.
                  Templates include common workflows, fields, and approval processes.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {serviceTemplates.map((template) => {
                  const IconComponent = getIconComponent(template.icon);
                  const isSelected = selectedTemplate?.id === template.id;

                  return (
                    <Card
                      key={template.id}
                      className={`cursor-pointer transition-all hover:shadow-lg ${
                        isSelected
                          ? "ring-2 ring-blue-500 bg-blue-50 border-blue-200"
                          : "hover:shadow-md"
                      }`}
                      onClick={() => setSelectedTemplate(template)}
                    >
                      <CardHeader className="pb-4">
                        <div className="flex items-center justify-between">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white ${
                            template.color === "blue" ? "bg-gradient-to-br from-blue-500 to-blue-600" :
                            template.color === "green" ? "bg-gradient-to-br from-green-500 to-green-600" :
                            template.color === "purple" ? "bg-gradient-to-br from-purple-500 to-purple-600" :
                            "bg-gradient-to-br from-gray-500 to-gray-600"
                          }`}>
                            <IconComponent className="h-6 w-6" />
                          </div>
                          {template.popular && (
                            <Badge className="bg-orange-100 text-orange-700 border-orange-200">
                              <Star className="h-3 w-3 mr-1" />
                              Popular
                            </Badge>
                          )}
                        </div>
                        <CardTitle className="text-lg">{template.name}</CardTitle>
                        <CardDescription className="text-sm">
                          {template.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {template.category && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Building className="h-4 w-4" />
                            {template.category}
                          </div>
                        )}
                        {template.estimatedTime && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Clock className="h-4 w-4" />
                            {template.estimatedTime}
                          </div>
                        )}
                        {template.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {template.tags.slice(0, 3).map((tag) => (
                              <Badge
                                key={tag}
                                variant="outline"
                                className="text-xs"
                              >
                                {tag}
                              </Badge>
                            ))}
                            {template.tags.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{template.tags.length - 3}
                              </Badge>
                            )}
                          </div>
                        )}
                        {isSelected && (
                          <div className="flex items-center gap-2 text-blue-600 text-sm font-medium">
                            <CheckCircle className="h-4 w-4" />
                            Selected
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 2: Basic Details */}
          {step === 2 && (
            <div className="p-8">
              <div className="max-w-4xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Form */}
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                          Service Name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="name"
                          placeholder="e.g., Employee Onboarding Request"
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                          Description <span className="text-red-500">*</span>
                        </Label>
                        <Textarea
                          id="description"
                          placeholder="Provide a clear description of what this service offers..."
                          value={formData.description}
                          onChange={(e) =>
                            setFormData({ ...formData, description: e.target.value })
                          }
                          className="mt-1 min-h-[100px]"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium text-gray-700">
                            Category <span className="text-red-500">*</span>
                          </Label>
                          <Select
                            value={formData.category}
                            onValueChange={(value) =>
                              setFormData({ ...formData, category: value })
                            }
                          >
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              {categories.map((category) => (
                                <SelectItem key={category} value={category}>
                                  {category}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label className="text-sm font-medium text-gray-700">
                            Estimated Time
                          </Label>
                          <Input
                            placeholder="e.g., 2-3 business days"
                            value={formData.estimatedTime}
                            onChange={(e) =>
                              setFormData({ ...formData, estimatedTime: e.target.value })
                            }
                            className="mt-1"
                          />
                        </div>
                      </div>

                      <div>
                        <Label className="text-sm font-medium text-gray-700">
                          Service Icon
                        </Label>
                        <div className="grid grid-cols-8 gap-2 mt-2">
                          {Object.entries(iconMap).map(([name, IconComponent]) => {
                            const isSelected = formData.icon === name;
                            return (
                              <button
                                key={name}
                                type="button"
                                onClick={() => setFormData({ ...formData, icon: name })}
                                className={`w-10 h-10 rounded-lg flex items-center justify-center border-2 transition-all ${
                                  isSelected
                                    ? "border-blue-500 bg-blue-50 text-blue-600"
                                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                                }`}
                              >
                                <IconComponent className="h-5 w-5" />
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Live Preview */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Eye className="h-5 w-5" />
                      Live Preview
                    </h4>
                    <Card className="bg-white shadow-sm">
                      <CardHeader className="pb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white">
                            {(() => {
                              const IconComponent = getIconComponent(formData.icon);
                              return <IconComponent className="h-6 w-6" />;
                            })()}
                          </div>
                          <div>
                            <CardTitle className="text-lg">
                              {formData.name || "Service Name"}
                            </CardTitle>
                            {formData.category && (
                              <Badge variant="secondary" className="text-xs mt-1">
                                {formData.category}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <CardDescription>
                          {formData.description || "Service description will appear here..."}
                        </CardDescription>
                        {formData.estimatedTime && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Clock className="h-4 w-4" />
                            {formData.estimatedTime}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Configuration */}
          {step === 3 && (
            <div className="p-8">
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                  <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                    <Settings className="h-8 w-8 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Configuration Summary
                  </h3>
                  <p className="text-gray-600">
                    Review and customize the workflow, approvals, and fields for your service.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Custom Fields */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Custom Fields
                      </CardTitle>
                      <CardDescription>
                        Form fields users will fill out
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {config.customFields.length > 0 ? (
                          config.customFields.map((field, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm">
                              <CheckSquare className="h-4 w-4 text-green-600" />
                              <span>{field.label}</span>
                              {field.required && (
                                <Badge variant="outline" className="text-xs">Required</Badge>
                              )}
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-gray-500">No custom fields configured</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Approval Workflow */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Workflow className="h-5 w-5" />
                        Approval Workflow
                      </CardTitle>
                      <CardDescription>
                        Who needs to approve requests
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {config.approvalWorkflow.length > 0 ? (
                          config.approvalWorkflow.map((step, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm">
                              <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs flex items-center justify-center font-medium">
                                {step.order}
                              </div>
                              <span>{step.name}</span>
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-gray-500">No approval workflow configured</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* SLA & Notifications */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Bell className="h-5 w-5" />
                        SLA & Notifications
                      </CardTitle>
                      <CardDescription>
                        Response times and alerts
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-blue-600" />
                          <span>Response: {config.slaConfig.responseTime}h</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span>Resolution: {config.slaConfig.resolutionTime}h</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Bell className="h-4 w-4 text-purple-600" />
                          <span>Notifications enabled</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="mt-8 p-6 bg-blue-50 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Lightbulb className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-900 mb-1">
                        Want to customize further?
                      </h4>
                      <p className="text-blue-700 text-sm">
                        You can modify these settings after creating the service card. 
                        The current configuration provides a solid foundation to get started.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Review & Launch */}
          {step === 4 && (
            <div className="p-8">
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                  <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <Rocket className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Ready to Launch!
                  </h3>
                  <p className="text-gray-600">
                    Review your service card one final time before making it available to users.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Service Summary */}
                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <FileText className="h-5 w-5" />
                          Service Details
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div>
                          <Label className="text-sm font-medium text-gray-500">Name</Label>
                          <p className="text-gray-900">{formData.name}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-500">Description</Label>
                          <p className="text-gray-900 text-sm">{formData.description}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label className="text-sm font-medium text-gray-500">Category</Label>
                            <p className="text-gray-900">{formData.category}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-gray-500">Estimated Time</Label>
                            <p className="text-gray-900">{formData.estimatedTime || "Not specified"}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Settings className="h-5 w-5" />
                          Configuration
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div>
                            <div className="text-2xl font-bold text-blue-600">
                              {config.customFields.length}
                            </div>
                            <div className="text-xs text-gray-500">Custom Fields</div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-green-600">
                              {config.approvalWorkflow.length}
                            </div>
                            <div className="text-xs text-gray-500">Approval Steps</div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-purple-600">
                              {config.slaConfig.responseTime}h
                            </div>
                            <div className="text-xs text-gray-500">Response SLA</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Final Preview */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">
                      How it will look to users:
                    </h4>
                    <Card className="shadow-lg">
                      <CardHeader className="pb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white">
                            {(() => {
                              const IconComponent = getIconComponent(formData.icon);
                              return <IconComponent className="h-6 w-6" />;
                            })()}
                          </div>
                          <div>
                            <CardTitle className="text-lg">{formData.name}</CardTitle>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="secondary" className="text-xs">
                                {formData.category}
                              </Badge>
                              <Badge className="text-xs bg-green-100 text-green-700">
                                Active
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <CardDescription>{formData.description}</CardDescription>
                        
                        <div className="grid grid-cols-2 gap-4 py-3 border-y border-gray-100">
                          <div className="text-center">
                            <div className="text-lg font-semibold text-gray-900">0</div>
                            <div className="text-xs text-gray-500">Requests</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-semibold text-green-600">100%</div>
                            <div className="text-xs text-gray-500">Success Rate</div>
                          </div>
                        </div>

                        {formData.estimatedTime && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Clock className="h-4 w-4" />
                            {formData.estimatedTime}
                          </div>
                        )}

                        <Button className="w-full bg-blue-600 hover:bg-blue-700">
                          Request This Service
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t bg-white px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {step > 1 && (
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Previous
                </Button>
              )}
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={onCancel}
              >
                Cancel
              </Button>
              
              {step < steps.length ? (
                <Button
                  onClick={handleNext}
                  disabled={!validateCurrentStep()}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
                >
                  Next Step
                  <ArrowRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleSave}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                >
                  <Save className="h-4 w-4" />
                  {serviceCard ? "Update Service" : "Create Service"}
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
