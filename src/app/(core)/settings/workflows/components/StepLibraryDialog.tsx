import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Search,
  User,
  Mail,
  Clock,
  CheckCircle,
  Settings,
  FileText,
  AlertTriangle,
  Send,
  Database,
  Code,
  Shield,
} from "lucide-react";

interface StepLibraryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddStep: (step: any) => void;
}

export const StepLibraryDialog = ({
  open,
  onOpenChange,
  onAddStep,
}: StepLibraryDialogProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const stepLibrary = [
    // Form Steps
    {
      id: "form-basic",
      name: "Basic Form",
      type: "form",
      icon: User,
      description: "Collect basic user information",
      category: "Forms",
    },
    {
      id: "form-contact",
      name: "Contact Information",
      type: "form",
      icon: Mail,
      description: "Gather contact details",
      category: "Forms",
    },
    {
      id: "form-document",
      name: "Document Upload",
      type: "form",
      icon: FileText,
      description: "Allow file uploads",
      category: "Forms",
    },

    // Approval Steps
    {
      id: "approval-manager",
      name: "Manager Approval",
      type: "approval",
      icon: CheckCircle,
      description: "Requires manager approval",
      category: "Approvals",
    },
    {
      id: "approval-hr",
      name: "HR Review",
      type: "approval",
      icon: CheckCircle,
      description: "HR department review",
      category: "Approvals",
    },
    {
      id: "approval-legal",
      name: "Legal Review",
      type: "approval",
      icon: Shield,
      description: "Legal team approval",
      category: "Approvals",
    },

    // Task Steps
    {
      id: "task-setup",
      name: "Account Setup",
      type: "task",
      icon: Settings,
      description: "Setup user accounts",
      category: "Tasks",
    },
    {
      id: "task-equipment",
      name: "Equipment Assignment",
      type: "task",
      icon: Settings,
      description: "Assign equipment",
      category: "Tasks",
    },
    {
      id: "task-training",
      name: "Training Assignment",
      type: "task",
      icon: Settings,
      description: "Assign training modules",
      category: "Tasks",
    },

    // Notification Steps
    {
      id: "notification-email",
      name: "Email Notification",
      type: "notification",
      icon: Mail,
      description: "Send email notification",
      category: "Notifications",
    },
    {
      id: "notification-sms",
      name: "SMS Notification",
      type: "notification",
      icon: Send,
      description: "Send SMS notification",
      category: "Notifications",
    },
    {
      id: "notification-slack",
      name: "Slack Message",
      type: "notification",
      icon: Send,
      description: "Send Slack message",
      category: "Notifications",
    },

    // External Steps
    {
      id: "external-background",
      name: "Background Check",
      type: "external",
      icon: Clock,
      description: "Third-party background check",
      category: "External",
    },
    {
      id: "external-payment",
      name: "Payment Processing",
      type: "external",
      icon: Clock,
      description: "Process payment",
      category: "External",
    },
    {
      id: "external-api",
      name: "API Integration",
      type: "external",
      icon: Code,
      description: "External API call",
      category: "External",
    },

    // Wait Steps
    {
      id: "wait-timer",
      name: "Timer Wait",
      type: "wait",
      icon: Clock,
      description: "Wait for specified time",
      category: "Wait",
    },
    {
      id: "wait-condition",
      name: "Condition Wait",
      type: "wait",
      icon: Clock,
      description: "Wait for condition",
      category: "Wait",
    },

    // Database Steps
    {
      id: "database-create",
      name: "Create Record",
      type: "database",
      icon: Database,
      description: "Create database record",
      category: "Database",
    },
    {
      id: "database-update",
      name: "Update Record",
      type: "database",
      icon: Database,
      description: "Update database record",
      category: "Database",
    },

    // Alert Steps
    {
      id: "alert-warning",
      name: "Warning Alert",
      type: "alert",
      icon: AlertTriangle,
      description: "Send warning alert",
      category: "Alerts",
    },
    {
      id: "alert-escalation",
      name: "Escalation Alert",
      type: "alert",
      icon: AlertTriangle,
      description: "Escalate to supervisor",
      category: "Alerts",
    },
  ];

  const filteredSteps = stepLibrary.filter(
    (step) =>
      step.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      step.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      step.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const categories = [...new Set(stepLibrary.map((step) => step.category))];

  const getStepsByCategory = (category: string) => {
    return filteredSteps.filter((step) => step.category === category);
  };

  const handleAddStep = (step: any) => {
    const newStep = {
      id: Date.now(),
      name: step.name,
      type: step.type,
      icon: step.icon,
      description: step.description,
      category: step.category,
    };
    onAddStep(newStep);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Step Library</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search steps..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Step Categories */}
          <ScrollArea className="h-96">
            <div className="space-y-6">
              {categories.map((category) => {
                const categorySteps = getStepsByCategory(category);
                if (categorySteps.length === 0) return null;

                return (
                  <div key={category}>
                    <h4 className="font-semibold text-gray-900 mb-3">
                      {category}
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {categorySteps.map((step) => (
                        <div
                          key={step.id}
                          className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                          onClick={() => handleAddStep(step)}
                        >
                          <div className="flex items-start gap-3">
                            <step.icon className="h-5 w-5 text-gray-400 mt-0.5" />
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h5 className="font-medium text-gray-900">
                                  {step.name}
                                </h5>
                                <Badge variant="outline" className="text-xs">
                                  {step.type}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600">
                                {step.description}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
};
