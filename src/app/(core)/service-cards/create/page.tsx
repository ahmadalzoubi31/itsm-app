"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
  Target,
  Workflow,
  Bell,
  Eye,
  Lightbulb,
  Rocket,
  Star,
  CheckSquare,
  Home,
  Layers,
} from "lucide-react";
import {
  ServiceCard,
  ServiceCardConfig,
  ServiceCardStatus,
  ServiceCardVisibility,
  ServiceCategory,
  CreateServiceCardDto,
} from "../types";
import {
  createServiceCard,
  fetchServiceCategories,
} from "../services/service-card.service";
import { toast } from "sonner";

// Service Templates (same as wizard)
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

export default function CreateServiceCard() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [selectedTemplate, setSelectedTemplate] = useState<
    (typeof serviceTemplates)[0] | null
  >(null);
  const [isCreating, setIsCreating] = useState(false);

  const [formData, setFormData] = useState<Partial<CreateServiceCardDto>>({
    name: "",
    description: "",
    categoryId: "",
    status: ServiceCardStatus.DRAFT,
    visibility: ServiceCardVisibility.INTERNAL,
    estimatedTime: "",
    price: "Free",
    icon: "User",
    isActive: true,
    displayOrder: 0,
    tags: [],
    requestFormSchema: {},
    approvalWorkflowId: "",
    slaId: "",
    assignedGroupId: "",
    supportContact: "",
  });

  const [availableCategories, setAvailableCategories] = useState<
    ServiceCategory[]
  >([]);

  const [config, setConfig] = useState<ServiceCardConfig>(
    serviceTemplates[3].config
  );

  // Load available categories
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await fetchServiceCategories();
        if (response.success) {
          setAvailableCategories(response.data);
        }
      } catch (error) {
        console.error("Failed to load categories:", error);
      }
    };
    loadCategories();
  }, []);

  // Auto-populate from template
  useEffect(() => {
    if (selectedTemplate && selectedTemplate.id !== "custom") {
      // Find matching category ID
      const categoryId =
        availableCategories.find(
          (cat) => cat.name === selectedTemplate.category
        )?.id || "";

      setFormData({
        name: selectedTemplate.name,
        description: selectedTemplate.description,
        categoryId: categoryId,
        status: ServiceCardStatus.DRAFT,
        visibility: ServiceCardVisibility.INTERNAL,
        estimatedTime: selectedTemplate.estimatedTime,
        price: selectedTemplate.price,
        icon: selectedTemplate.icon,
        isActive: true,
        displayOrder: 0,
        tags: selectedTemplate.tags,
        requestFormSchema: selectedTemplate.config,
        approvalWorkflowId: "",
        slaId: "",
        assignedGroupId: "",
        supportContact: "",
      });
      setConfig(selectedTemplate.config);
    }
  }, [selectedTemplate, availableCategories]);

  const steps = [
    {
      id: 1,
      title: "Choose Template",
      description:
        "Start with a pre-configured template or create from scratch",
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

  const handleSave = async () => {
    try {
      setIsCreating(true);
      const serviceCardData: Partial<ServiceCard> = {
        ...formData,
        requestFormSchema: config, // Map legacy config to new schema
      };
      await createServiceCard(serviceCardData);
      toast.success("Service card created successfully!");
      router.push("/service-cards");
    } catch (error) {
      console.error("Failed to create service card:", error);
      toast.error("Failed to create service card. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  const validateCurrentStep = () => {
    switch (step) {
      case 1:
        return selectedTemplate !== null;
      case 2:
        return formData.name?.trim() !== "" && formData.categoryId !== "";
      case 3:
        return true;
      case 4:
        return true;
      default:
        return false;
    }
  };

  // Categories are now loaded from the backend

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-4 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/service-cards")}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Service Cards
              </Button>
              <div className="h-6 w-px bg-gray-300" />
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Sparkles className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                      Create New Service Card
                    </h1>
                    <p className="text-gray-600">
                      {steps.find((s) => s.id === step)?.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <Button
              variant="outline"
              onClick={() => router.push("/service-cards")}
              className="flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              Cancel
            </Button>
          </div>

          {/* Progress Section */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-700">
                Step {step} of {steps.length}
              </span>
              <span className="text-sm text-gray-500">
                {Math.round(progress)}% complete
              </span>
            </div>
            <Progress value={progress} className="h-3 mb-6" />

            {/* Step Navigation */}
            <div className="flex items-center justify-between">
              {steps.map((stepItem, index) => {
                const Icon = stepItem.icon;
                const isActive = stepItem.id === step;
                const isCompleted = stepItem.id < step;

                return (
                  <div
                    key={stepItem.id}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all flex-1 mx-2 ${
                      isActive
                        ? "bg-blue-100 text-blue-700 border-2 border-blue-200"
                        : isCompleted
                        ? "bg-green-100 text-green-700 border-2 border-green-200"
                        : "bg-gray-100 text-gray-500 border-2 border-gray-200"
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle className="h-6 w-6" />
                    ) : (
                      <Icon className="h-6 w-6" />
                    )}
                    <div>
                      <div className="font-medium">{stepItem.title}</div>
                      <div className="text-xs opacity-75">
                        {stepItem.description}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {/* Step 1: Template Selection */}
        {step === 1 && (
          <div className="p-8">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-12">
                <div className="mx-auto w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                  <Target className="h-10 w-10 text-blue-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Choose Your Starting Point
                </h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                  Select a pre-configured template to get started quickly, or
                  create a custom service from scratch. Templates include common
                  workflows, fields, and approval processes.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {serviceTemplates.map((template) => {
                  const IconComponent = getIconComponent(template.icon);
                  const isSelected = selectedTemplate?.id === template.id;

                  return (
                    <Card
                      key={template.id}
                      className={`cursor-pointer transition-all hover:shadow-xl hover:scale-105 ${
                        isSelected
                          ? "ring-4 ring-blue-500 bg-blue-50 border-blue-200 shadow-xl scale-105"
                          : "hover:shadow-lg"
                      }`}
                      onClick={() => setSelectedTemplate(template)}
                    >
                      <CardHeader className="pb-4">
                        <div className="flex items-center justify-between mb-4">
                          <div
                            className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white ${
                              template.color === "blue"
                                ? "bg-gradient-to-br from-blue-500 to-blue-600"
                                : template.color === "green"
                                ? "bg-gradient-to-br from-green-500 to-green-600"
                                : template.color === "purple"
                                ? "bg-gradient-to-br from-purple-500 to-purple-600"
                                : "bg-gradient-to-br from-gray-500 to-gray-600"
                            }`}
                          >
                            <IconComponent className="h-8 w-8" />
                          </div>
                          {template.popular && (
                            <Badge className="bg-orange-100 text-orange-700 border-orange-200">
                              <Star className="h-3 w-3 mr-1" />
                              Popular
                            </Badge>
                          )}
                        </div>
                        <CardTitle className="text-xl mb-2">
                          {template.name}
                        </CardTitle>
                        <CardDescription className="text-sm leading-relaxed">
                          {template.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
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
                          <div className="flex items-center gap-2 text-blue-600 text-sm font-medium pt-2 border-t border-blue-200">
                            <CheckCircle className="h-4 w-4" />
                            Selected Template
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Basic Details */}
        {step === 2 && (
          <div className="p-8">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Form */}
                <div className="space-y-8">
                  <Card className="shadow-sm">
                    <CardHeader>
                      <CardTitle className="text-xl flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Service Information
                      </CardTitle>
                      <CardDescription>
                        Define the core details that users will see when
                        browsing your service
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        <Label
                          htmlFor="name"
                          className="text-sm font-medium text-gray-700"
                        >
                          Service Name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="name"
                          placeholder="e.g., Employee Onboarding Request"
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                          className="mt-2 h-12 text-lg"
                        />
                      </div>

                      <div>
                        <Label
                          htmlFor="description"
                          className="text-sm font-medium text-gray-700"
                        >
                          Description <span className="text-red-500">*</span>
                        </Label>
                        <Textarea
                          id="description"
                          placeholder="Provide a clear description of what this service offers..."
                          value={formData.description}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              description: e.target.value,
                            })
                          }
                          className="mt-2 min-h-[120px] text-base"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium text-gray-700">
                            Category <span className="text-red-500">*</span>
                          </Label>
                          <Select
                            value={formData.categoryId}
                            onValueChange={(value) =>
                              setFormData({ ...formData, categoryId: value })
                            }
                          >
                            <SelectTrigger className="mt-2 h-12">
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              {availableCategories.map((category) => (
                                <SelectItem
                                  key={category.id}
                                  value={category.id}
                                >
                                  {category.name}
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
                              setFormData({
                                ...formData,
                                estimatedTime: e.target.value,
                              })
                            }
                            className="mt-2 h-12"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium text-gray-700">
                            Status
                          </Label>
                          <Select
                            value={formData.status}
                            onValueChange={(value: ServiceCardStatus) =>
                              setFormData({ ...formData, status: value })
                            }
                          >
                            <SelectTrigger className="mt-2 h-12">
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value={ServiceCardStatus.DRAFT}>
                                Draft
                              </SelectItem>
                              <SelectItem value={ServiceCardStatus.PUBLISHED}>
                                Published
                              </SelectItem>
                              <SelectItem value={ServiceCardStatus.RETIRED}>
                                Retired
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label className="text-sm font-medium text-gray-700">
                            Visibility
                          </Label>
                          <Select
                            value={formData.visibility}
                            onValueChange={(value: ServiceCardVisibility) =>
                              setFormData({ ...formData, visibility: value })
                            }
                          >
                            <SelectTrigger className="mt-2 h-12">
                              <SelectValue placeholder="Select visibility" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value={ServiceCardVisibility.PUBLIC}>
                                Public
                              </SelectItem>
                              <SelectItem
                                value={ServiceCardVisibility.INTERNAL}
                              >
                                Internal
                              </SelectItem>
                              <SelectItem
                                value={ServiceCardVisibility.RESTRICTED}
                              >
                                Restricted
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div>
                        <Label
                          htmlFor="supportContact"
                          className="text-sm font-medium text-gray-700"
                        >
                          Support Contact
                        </Label>
                        <Input
                          id="supportContact"
                          placeholder="e.g., support@company.com or +1-555-123-4567"
                          value={formData.supportContact || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              supportContact: e.target.value,
                            })
                          }
                          className="mt-2 h-12"
                        />
                      </div>

                      <div>
                        <Label className="text-sm font-medium text-gray-700">
                          Service Icon
                        </Label>
                        <div className="grid grid-cols-10 gap-2 mt-3">
                          {Object.entries(iconMap).map(
                            ([name, IconComponent]) => {
                              const isSelected = formData.icon === name;
                              return (
                                <button
                                  key={name}
                                  type="button"
                                  onClick={() =>
                                    setFormData({ ...formData, icon: name })
                                  }
                                  className={`w-12 h-12 rounded-xl flex items-center justify-center border-2 transition-all ${
                                    isSelected
                                      ? "border-blue-500 bg-blue-50 text-blue-600 scale-110"
                                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                                  }`}
                                >
                                  <IconComponent className="h-6 w-6" />
                                </button>
                              );
                            }
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Live Preview */}
                <div className="bg-gray-100 rounded-2xl p-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                    <Eye className="h-6 w-6" />
                    Live Preview
                  </h3>
                  <Card className="bg-white shadow-lg">
                    <CardHeader className="pb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white">
                          {(() => {
                            const IconComponent = getIconComponent(
                              formData.icon
                            );
                            return <IconComponent className="h-8 w-8" />;
                          })()}
                        </div>
                        <div>
                          <CardTitle className="text-xl">
                            {formData.name || "Service Name"}
                          </CardTitle>
                          {formData.categoryId && (
                            <Badge variant="secondary" className="text-sm mt-2">
                              {availableCategories.find(
                                (cat) => cat.id === formData.categoryId
                              )?.name || "Unknown"}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <CardDescription className="text-base leading-relaxed">
                        {formData.description ||
                          "Service description will appear here..."}
                      </CardDescription>

                      <div className="grid grid-cols-2 gap-4 py-4 border-y border-gray-100">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-gray-900">
                            0
                          </div>
                          <div className="text-sm text-gray-500">Requests</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">
                            100%
                          </div>
                          <div className="text-sm text-gray-500">
                            Success Rate
                          </div>
                        </div>
                      </div>

                      {formData.estimatedTime && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Clock className="h-4 w-4" />
                          {formData.estimatedTime}
                        </div>
                      )}

                      <Button className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-base">
                        Request This Service
                      </Button>
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
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <div className="mx-auto w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mb-6">
                  <Settings className="h-10 w-10 text-purple-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Configuration Summary
                </h2>
                <p className="text-lg text-gray-600">
                  Review and customize the workflow, approvals, and fields for
                  your service.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Custom Fields */}
                <Card className="shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                        <FileText className="h-5 w-5 text-blue-600" />
                      </div>
                      Custom Fields
                    </CardTitle>
                    <CardDescription>
                      Form fields users will fill out when requesting this
                      service
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {config.customFields.length > 0 ? (
                        config.customFields.map((field, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                          >
                            <CheckSquare className="h-5 w-5 text-green-600" />
                            <div className="flex-1">
                              <div className="font-medium text-gray-900">
                                {field.label}
                              </div>
                              <div className="text-sm text-gray-500 capitalize">
                                {field.type}
                              </div>
                            </div>
                            {field.required && (
                              <Badge
                                variant="outline"
                                className="text-xs bg-red-50 text-red-700 border-red-200"
                              >
                                Required
                              </Badge>
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                          <p className="text-sm">No custom fields configured</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Approval Workflow */}
                <Card className="shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                        <Workflow className="h-5 w-5 text-green-600" />
                      </div>
                      Approval Workflow
                    </CardTitle>
                    <CardDescription>
                      Who needs to approve requests for this service
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {config.approvalWorkflow.length > 0 ? (
                        config.approvalWorkflow.map((step, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                          >
                            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 text-sm flex items-center justify-center font-bold">
                              {step.order}
                            </div>
                            <div className="flex-1">
                              <div className="font-medium text-gray-900">
                                {step.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {step.approverRole}
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          <Workflow className="h-8 w-8 mx-auto mb-2 opacity-50" />
                          <p className="text-sm">
                            No approval workflow configured
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* SLA & Notifications */}
                <Card className="shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                        <Bell className="h-5 w-5 text-purple-600" />
                      </div>
                      SLA & Notifications
                    </CardTitle>
                    <CardDescription>
                      Response times and communication settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3 mb-2">
                          <Clock className="h-5 w-5 text-blue-600" />
                          <span className="font-medium text-gray-900">
                            Response Time
                          </span>
                        </div>
                        <div className="text-2xl font-bold text-blue-600">
                          {config.slaConfig.responseTime}h
                        </div>
                      </div>

                      <div className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3 mb-2">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          <span className="font-medium text-gray-900">
                            Resolution Time
                          </span>
                        </div>
                        <div className="text-2xl font-bold text-green-600">
                          {config.slaConfig.resolutionTime}h
                        </div>
                      </div>

                      <div className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Bell className="h-5 w-5 text-purple-600" />
                          <span className="font-medium text-gray-900">
                            Notifications
                          </span>
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          Configured for all workflow events
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="mt-12 p-8 bg-blue-50 rounded-2xl">
                <div className="flex items-start gap-4">
                  <Lightbulb className="h-8 w-8 text-blue-600 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold text-blue-900 mb-2">
                      Want to customize further?
                    </h3>
                    <p className="text-blue-700 leading-relaxed">
                      You can modify these settings after creating the service
                      card. The current configuration provides a solid
                      foundation to get started with your service offering.
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
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                  <Rocket className="h-10 w-10 text-green-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Ready to Launch! 🚀
                </h2>
                <p className="text-lg text-gray-600">
                  Review your service card one final time before making it
                  available to users.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Service Summary */}
                <div className="space-y-8">
                  <Card className="shadow-sm">
                    <CardHeader>
                      <CardTitle className="text-xl flex items-center gap-3">
                        <FileText className="h-6 w-6" />
                        Service Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        <Label className="text-sm font-medium text-gray-500">
                          Name
                        </Label>
                        <p className="text-lg font-medium text-gray-900 mt-1">
                          {formData.name}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-500">
                          Description
                        </Label>
                        <p className="text-gray-900 mt-1 leading-relaxed">
                          {formData.description}
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <Label className="text-sm font-medium text-gray-500">
                            Category
                          </Label>
                          <p className="text-gray-900 mt-1">
                            {availableCategories.find(
                              (cat) => cat.id === formData.categoryId
                            )?.name || "Not selected"}
                          </p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-500">
                            Estimated Time
                          </Label>
                          <p className="text-gray-900 mt-1">
                            {formData.estimatedTime || "Not specified"}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="shadow-sm">
                    <CardHeader>
                      <CardTitle className="text-xl flex items-center gap-3">
                        <Settings className="h-6 w-6" />
                        Configuration Summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-3 gap-6 text-center">
                        <div className="p-4 bg-blue-50 rounded-xl">
                          <div className="text-3xl font-bold text-blue-600 mb-1">
                            {config.customFields.length}
                          </div>
                          <div className="text-sm text-gray-600">
                            Custom Fields
                          </div>
                        </div>
                        <div className="p-4 bg-green-50 rounded-xl">
                          <div className="text-3xl font-bold text-green-600 mb-1">
                            {config.approvalWorkflow.length}
                          </div>
                          <div className="text-sm text-gray-600">
                            Approval Steps
                          </div>
                        </div>
                        <div className="p-4 bg-purple-50 rounded-xl">
                          <div className="text-3xl font-bold text-purple-600 mb-1">
                            {config.slaConfig.responseTime}h
                          </div>
                          <div className="text-sm text-gray-600">
                            Response SLA
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Final Preview */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">
                    How it will look to users:
                  </h3>
                  <Card className="shadow-2xl border-2 border-gray-200">
                    <CardHeader className="pb-6">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white">
                          {(() => {
                            const IconComponent = getIconComponent(
                              formData.icon
                            );
                            return <IconComponent className="h-8 w-8" />;
                          })()}
                        </div>
                        <div>
                          <CardTitle className="text-xl">
                            {formData.name}
                          </CardTitle>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="secondary" className="text-sm">
                              {availableCategories.find(
                                (cat) => cat.id === formData.categoryId
                              )?.name || "Unknown"}
                            </Badge>
                            <Badge className="text-sm bg-green-100 text-green-700">
                              Active
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <CardDescription className="text-base leading-relaxed">
                        {formData.description}
                      </CardDescription>

                      <div className="grid grid-cols-2 gap-6 py-4 border-y border-gray-100">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-gray-900">
                            0
                          </div>
                          <div className="text-sm text-gray-500">Requests</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">
                            100%
                          </div>
                          <div className="text-sm text-gray-500">
                            Success Rate
                          </div>
                        </div>
                      </div>

                      {formData.estimatedTime && (
                        <div className="flex items-center gap-3 text-gray-600">
                          <Clock className="h-5 w-5" />
                          <span>{formData.estimatedTime}</span>
                        </div>
                      )}

                      <Button className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-base font-medium">
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
      <div className="border-t bg-white px-8 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {step > 1 && (
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  className="flex items-center gap-2 h-12 px-6"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Previous Step
                </Button>
              )}
            </div>

            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={() => router.push("/service-cards")}
                className="h-12 px-6"
              >
                Cancel
              </Button>

              {step < steps.length ? (
                <Button
                  onClick={handleNext}
                  disabled={!validateCurrentStep()}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 h-12 px-8 text-base"
                >
                  Next Step
                  <ArrowRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleSave}
                  disabled={isCreating}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700 h-12 px-8 text-base"
                >
                  {isCreating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Create Service Card
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
