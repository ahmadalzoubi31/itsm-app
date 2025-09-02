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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  User,
  Calendar,
  Settings,
  CheckCircle,
  Clock,
  Plus,
  Trash2,
  Edit,
  Eye,
  Save,
  X,
  Sparkles,
  FileText,
  Bell,
  Cog,
  ArrowRight,
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
  ServiceCard,
  ServiceCardConfig,
  FormField,
  ApprovalStep,
  SLAConfig,
} from "../types";
import { FormFieldBuilder } from "../components/FormFieldBuilder";
import { ApprovalWorkflowBuilder } from "../components/ApprovalWorkflowBuilder";
import { SLAConfigBuilder } from "../components/SLAConfigBuilder";
import { NotificationConfigBuilder } from "../components/NotificationConfigBuilder";
import { ServiceCardPreview } from "../components/ServiceCardPreview";

interface ServiceCardBuilderProps {
  serviceCard?: ServiceCard;
  onSave: (serviceCard: Partial<ServiceCard>) => void;
  onCancel: () => void;
  isOpen: boolean;
  trigger?: React.ReactNode;
}

export const ServiceCardBuilder = ({
  serviceCard,
  onSave,
  onCancel,
  isOpen,
  trigger,
}: ServiceCardBuilderProps) => {
  const [activeTab, setActiveTab] = useState("basic");
  const [formData, setFormData] = useState({
    name: serviceCard?.name || "",
    description: serviceCard?.description || "",
    category: serviceCard?.category || "",
    estimatedTime: serviceCard?.estimatedTime || "",
    price: serviceCard?.price || "Free",
    workflowId: serviceCard?.workflowId || "",
    icon: serviceCard?.icon || "User", // Store as string identifier
    isActive: serviceCard?.isActive ?? true,
    visibility: serviceCard?.visibility || "public",
    restrictedToGroups: serviceCard?.restrictedToGroups || [],
    tags: serviceCard?.tags || [],
  });

  const [config, setConfig] = useState<ServiceCardConfig>(
    serviceCard?.config || {
      customFields: [],
      approvalWorkflow: [],
      slaConfig: {
        responseTime: 24,
        resolutionTime: 72,
        escalationSteps: [],
      },
      notifications: {
        onCreate: {
          notifyRequester: true,
          notifyApprovers: true,
        },
        onApproval: {
          notifyRequester: true,
          notifyNextApprover: false,
        },
        onCompletion: {
          notifyRequester: true,
          notifyStakeholders: false,
        },
        onEscalation: {
          notifyManager: false,
        },
      },
    }
  );

  const [showPreview, setShowPreview] = useState(false);

  // Sync form data when serviceCard prop changes
  useEffect(() => {
    if (serviceCard) {
      setFormData({
        name: serviceCard.name || "",
        description: serviceCard.description || "",
        category: serviceCard.category || "",
        estimatedTime: serviceCard.estimatedTime || "",
        price: serviceCard.price || "Free",
        workflowId: serviceCard.workflowId || "",
        icon: serviceCard.icon || "User",
        isActive: serviceCard.isActive ?? true,
        visibility: serviceCard.visibility || "public",
        restrictedToGroups: serviceCard.restrictedToGroups || [],
        tags: serviceCard.tags || [],
      });

      setConfig(
        serviceCard.config || {
          customFields: [],
          approvalWorkflow: [],
          slaConfig: {
            responseTime: 24,
            resolutionTime: 72,
            escalationSteps: [],
          },
          notifications: {
            onCreate: {
              notifyRequester: true,
              notifyApprovers: true,
            },
            onApproval: {
              notifyRequester: true,
              notifyNextApprover: false,
            },
            onCompletion: {
              notifyRequester: true,
              notifyStakeholders: false,
            },
            onEscalation: {
              notifyManager: false,
            },
          },
        }
      );
    } else {
      // Reset to default values when creating new service card
      setFormData({
        name: "",
        description: "",
        category: "",
        estimatedTime: "",
        price: "Free",
        workflowId: "",
        icon: "User",
        isActive: true,
        visibility: "public",
        restrictedToGroups: [],
        tags: [],
      });

      setConfig({
        customFields: [],
        approvalWorkflow: [],
        slaConfig: {
          responseTime: 24,
          resolutionTime: 72,
          escalationSteps: [],
        },
        notifications: {
          onCreate: {
            notifyRequester: true,
            notifyApprovers: true,
          },
          onApproval: {
            notifyRequester: true,
            notifyNextApprover: false,
          },
          onCompletion: {
            notifyRequester: true,
            notifyStakeholders: false,
          },
          onEscalation: {
            notifyManager: false,
          },
        },
      });
    }
  }, [serviceCard]);

  // Reset active tab when opening builder (create or edit)
  useEffect(() => {
    if (isOpen) {
      setActiveTab("basic");
    }
  }, [isOpen]);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleConfigChange = (newConfig: Partial<ServiceCardConfig>) => {
    setConfig((prev) => ({ ...prev, ...newConfig }));
  };

  const handleAddTag = (newTag: string) => {
    if (newTag && !formData.tags.includes(newTag)) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag],
      }));
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleSave = () => {
    const serviceCardData = {
      ...formData,
      config,
    };
    onSave(serviceCardData);
  };

  const validateForm = () => {
    return formData.name.trim() !== "" && formData.category !== "";
  };

  const categories = ["IT", "HR", "Finance", "Legal", "Operations", "Other"];

  // Available icons for service cards
  const availableIcons = [
    { name: "User", component: User, label: "User" },
    { name: "FileText", component: FileText, label: "Document" },
    { name: "Mail", component: Mail, label: "Email" },
    { name: "Phone", component: Phone, label: "Phone" },
    { name: "Monitor", component: Monitor, label: "Computer" },
    { name: "Database", component: Database, label: "Database" },
    { name: "Shield", component: Shield, label: "Security" },
    { name: "Wrench", component: Wrench, label: "Tools" },
    { name: "Building", component: Building, label: "Building" },
    { name: "CreditCard", component: CreditCard, label: "Payment" },
    { name: "Users", component: Users, label: "Team" },
    { name: "Settings", component: Settings, label: "Settings" },
    { name: "Calendar", component: Calendar, label: "Calendar" },
    { name: "Clock", component: Clock, label: "Time" },
  ];

  // Get icon component for display
  const getIconComponent = (iconName: string) => {
    const icon = availableIcons.find((i) => i.name === iconName);
    return icon ? icon.component : User;
  };

  const tabConfig = [
    {
      value: "basic",
      label: "Basic Information",
      icon: FileText,
      description: "Core service details",
    },
    {
      value: "fields",
      label: "Custom Fields",
      icon: Edit,
      description: "Form configuration",
    },
    {
      value: "approval",
      label: "Workflow & SLA",
      icon: CheckCircle,
      description: "Process automation",
    },
    {
      value: "notifications",
      label: "Notifications",
      icon: Bell,
      description: "Communication settings",
    },
    {
      value: "advanced",
      label: "Advanced",
      icon: Cog,
      description: "System integrations",
    },
  ];

  const content = (
    <div className="space-y-8">
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="h-full flex flex-col"
      >
        {/* Modern Tab Navigation */}
        <div className="border-b bg-white px-8 py-4">
          <TabsList className="grid w-full grid-cols-5 bg-gray-100 p-1 rounded-lg h-auto">
            {tabConfig.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.value;

              return (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className={`
                    flex flex-col items-center gap-2 py-3 px-4 rounded-md transition-all duration-200
                    data-[state=active]:bg-white data-[state=active]:shadow-sm
                    data-[state=active]:text-blue-600 hover:text-blue-600
                    ${isActive ? "border border-blue-200" : ""}
                  `}
                >
                  <Icon className="h-4 w-4" />
                  <div className="text-center">
                    <div className="text-xs font-medium">{tab.label}</div>
                    <div className="text-xs text-gray-500 mt-0.5 hidden lg:block">
                      {tab.description}
                    </div>
                  </div>
                </TabsTrigger>
              );
            })}
          </TabsList>
        </div>

        {/* Tab Content Area */}
        <div className="flex-1 overflow-y-auto bg-gray-50">
          <div className="p-8">
            {/* Basic Information Tab */}
            <TabsContent value="basic" className="mt-0 space-y-8">
              <Card className="shadow-sm border-0 bg-white">
                <CardHeader className="pb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <FileText className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-xl text-gray-900">
                        Service Information
                      </CardTitle>
                      <CardDescription className="text-gray-600">
                        Define the core details that users will see when
                        browsing your service
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-8">
                  {/* Primary Information */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-3">
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
                          handleInputChange("name", e.target.value)
                        }
                        className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      />
                      <p className="text-xs text-gray-500">
                        Choose a clear, descriptive name that users will easily
                        understand
                      </p>
                    </div>

                    <div className="space-y-3">
                      <Label
                        htmlFor="category"
                        className="text-sm font-medium text-gray-700"
                      >
                        Category <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={formData.category}
                        onValueChange={(value) =>
                          handleInputChange("category", value)
                        }
                      >
                        <SelectTrigger className="border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                          <SelectValue placeholder="Select service category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-gray-500">
                        Helps users find your service in the catalog
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-3">
                    <Label
                      htmlFor="description"
                      className="text-sm font-medium text-gray-700"
                    >
                      Description <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="description"
                      placeholder="Provide a detailed description of what this service offers, who it's for, and what users can expect..."
                      value={formData.description}
                      onChange={(e) =>
                        handleInputChange("description", e.target.value)
                      }
                      className="min-h-[120px] border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    />
                    <p className="text-xs text-gray-500">
                      A comprehensive description helps users understand exactly
                      what they're requesting
                    </p>
                  </div>

                  {/* Icon Selection */}
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-700">
                        Service Icon
                      </Label>
                      <p className="text-xs text-gray-500 mt-1">
                        Choose an icon that represents your service
                      </p>
                    </div>
                    <div className="grid grid-cols-7 gap-3">
                      {availableIcons.map((icon) => {
                        const IconComponent = icon.component;
                        const isSelected = formData.icon === icon.name;
                        return (
                          <button
                            key={icon.name}
                            type="button"
                            onClick={() => handleInputChange("icon", icon.name)}
                            className={`
                              w-12 h-12 rounded-lg flex items-center justify-center border-2 transition-all
                              ${
                                isSelected
                                  ? "border-blue-500 bg-blue-50 text-blue-600"
                                  : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                              }
                            `}
                            title={icon.label}
                          >
                            <IconComponent className="h-5 w-5" />
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Service Details */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="space-y-3">
                      <Label
                        htmlFor="estimatedTime"
                        className="text-sm font-medium text-gray-700"
                      >
                        Estimated Completion Time
                      </Label>
                      <Input
                        id="estimatedTime"
                        placeholder="e.g., 3-5 business days"
                        value={formData.estimatedTime}
                        onChange={(e) =>
                          handleInputChange("estimatedTime", e.target.value)
                        }
                        className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>

                    <div className="space-y-3">
                      <Label
                        htmlFor="price"
                        className="text-sm font-medium text-gray-700"
                      >
                        Service Cost
                      </Label>
                      <Input
                        id="price"
                        placeholder="Free"
                        value={formData.price}
                        onChange={(e) =>
                          handleInputChange("price", e.target.value)
                        }
                        className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>

                    <div className="space-y-3">
                      <Label
                        htmlFor="workflowId"
                        className="text-sm font-medium text-gray-700"
                      >
                        Workflow ID
                      </Label>
                      <Input
                        id="workflowId"
                        placeholder="auto-generated"
                        value={formData.workflowId}
                        onChange={(e) =>
                          handleInputChange("workflowId", e.target.value)
                        }
                        className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  {/* Tags Section */}
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-700">
                        Service Tags
                      </Label>
                      <p className="text-xs text-gray-500 mt-1">
                        Add relevant tags to help users discover this service
                      </p>
                    </div>

                    {formData.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {formData.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="flex items-center gap-2 bg-blue-50 text-blue-700 hover:bg-blue-100 px-3 py-1"
                          >
                            {tag}
                            <button
                              onClick={() => handleRemoveTag(tag)}
                              className="ml-1 h-4 w-4 hover:bg-blue-200 rounded-full flex items-center justify-center transition-colors"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Input
                        placeholder="Type a tag and press Enter..."
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddTag(e.currentTarget.value);
                            e.currentTarget.value = "";
                          }
                        }}
                        className="flex-1 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={(e) => {
                          const input = e.currentTarget
                            .previousElementSibling as HTMLInputElement;
                          if (input && input.value.trim()) {
                            handleAddTag(input.value.trim());
                            input.value = "";
                          }
                        }}
                        className="border-gray-200 hover:bg-gray-50"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Service Status */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label className="text-sm font-medium text-gray-700">
                          Service Status
                        </Label>
                        <p className="text-sm text-gray-600">
                          Control whether this service is available to users in
                          the catalog
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span
                          className={`text-sm font-medium ${
                            formData.isActive
                              ? "text-green-600"
                              : "text-gray-500"
                          }`}
                        >
                          {formData.isActive ? "Active" : "Inactive"}
                        </span>
                        <Switch
                          checked={formData.isActive}
                          onCheckedChange={(value) =>
                            handleInputChange("isActive", value)
                          }
                          className="data-[state=checked]:bg-green-600"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Custom Fields Tab */}
            <TabsContent value="fields" className="mt-0">
              <FormFieldBuilder
                fields={config.customFields || []}
                onChange={(fields) =>
                  handleConfigChange({ customFields: fields })
                }
              />
            </TabsContent>

            {/* Approval & SLA Tab */}
            <TabsContent value="approval" className="mt-0 space-y-8">
              <ApprovalWorkflowBuilder
                workflow={config.approvalWorkflow || []}
                onChange={(workflow) =>
                  handleConfigChange({ approvalWorkflow: workflow })
                }
              />
              <SLAConfigBuilder
                slaConfig={
                  config.slaConfig || {
                    responseTime: 24,
                    resolutionTime: 72,
                    escalationSteps: [],
                  }
                }
                onChange={(slaConfig) => handleConfigChange({ slaConfig })}
              />
            </TabsContent>

            {/* Notifications Tab */}
            <TabsContent value="notifications" className="mt-0">
              <NotificationConfigBuilder
                notifications={
                  config.notifications || {
                    onCreate: {
                      notifyRequester: true,
                      notifyApprovers: true,
                    },
                    onApproval: {
                      notifyRequester: true,
                      notifyNextApprover: false,
                    },
                    onCompletion: {
                      notifyRequester: true,
                      notifyStakeholders: false,
                    },
                    onEscalation: {
                      notifyManager: false,
                    },
                  }
                }
                onChange={(notifications) =>
                  handleConfigChange({ notifications })
                }
              />
            </TabsContent>

            {/* Advanced Tab */}
            <TabsContent value="advanced" className="mt-0">
              <Card className="shadow-sm border-0 bg-white">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Cog className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <CardTitle className="text-xl text-gray-900">
                        Advanced Configuration
                      </CardTitle>
                      <CardDescription className="text-gray-600">
                        Enterprise features for complex workflows and
                        integrations
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-8 text-center">
                    <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                      <Settings className="h-8 w-8 text-purple-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Advanced Features Coming Soon
                    </h3>
                    <p className="text-gray-600 max-w-md mx-auto mb-6">
                      Auto-assignment rules, external system integrations,
                      custom business logic, and advanced approval conditions
                      will be available here.
                    </p>
                    <div className="flex flex-wrap justify-center gap-2">
                      <Badge variant="outline" className="bg-white">
                        Auto-Assignment
                      </Badge>
                      <Badge variant="outline" className="bg-white">
                        API Integrations
                      </Badge>
                      <Badge variant="outline" className="bg-white">
                        Custom Logic
                      </Badge>
                      <Badge variant="outline" className="bg-white">
                        External Systems
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t bg-white px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {activeTab !== "basic" && (
                <Button
                  variant="outline"
                  onClick={() => {
                    const currentIndex = tabConfig.findIndex(
                      (tab) => tab.value === activeTab
                    );
                    if (currentIndex > 0) {
                      setActiveTab(tabConfig[currentIndex - 1].value);
                    }
                  }}
                  className="border-gray-200 hover:bg-gray-50"
                >
                  Previous
                </Button>
              )}

              {activeTab !== "advanced" && (
                <Button
                  variant="outline"
                  onClick={() => {
                    const currentIndex = tabConfig.findIndex(
                      (tab) => tab.value === activeTab
                    );
                    if (currentIndex < tabConfig.length - 1) {
                      setActiveTab(tabConfig[currentIndex + 1].value);
                    }
                  }}
                  className="border-gray-200 hover:bg-gray-50"
                >
                  Next Step
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              )}

              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPreview(true)}
                className="bg-white hover:bg-gray-50"
              >
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={onCancel}
                className="border-gray-200 hover:bg-gray-50"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={!validateForm()}
                className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
              >
                <Save className="h-4 w-4 mr-2" />
                {serviceCard ? "Update Service" : "Create Service"}
              </Button>
            </div>
          </div>
        </div>
      </Tabs>

      {/* Preview Dialog */}
      <ServiceCardPreview
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        serviceCard={{ ...formData, config }}
      />
    </div>
  );

  return (
    <Drawer open={isOpen} onOpenChange={onCancel}>
      <DrawerContent
        className="h-full overflow-y-auto"
        data-vaul-drawer-direction="right"
      >
        <DrawerHeader className="pb-8 px-8 pt-6 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <DrawerTitle className="text-2xl font-semibold text-gray-900 flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Sparkles className="h-6 w-6 text-blue-600" />
                </div>
                {serviceCard ? "Edit Service Card" : "Create New Service Card"}
              </DrawerTitle>
              <p className="text-gray-600">
                Configure your service offering with custom fields, workflows,
                and automation
              </p>
            </div>
            <div className="text-sm text-gray-500">
              Step {tabConfig.findIndex((tab) => tab.value === activeTab) + 1}{" "}
              of {tabConfig.length}
            </div>
          </div>
        </DrawerHeader>
        <div className="px-6 py-6 overflow-y-auto flex-1">{content}</div>
      </DrawerContent>
    </Drawer>
  );
};
