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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Plus,
  Play,
  Save,
  Settings,
  ArrowRight,
  User,
  Mail,
  Clock,
  CheckCircle,
} from "lucide-react";
import { StepLibraryDialog } from "./components/StepLibraryDialog";
import { StepConfigDialog } from "./components/StepConfigDialog";
import Link from "next/link";

export default function WorkflowPage() {
  const [selectedWorkflow, setSelectedWorkflow] = useState<string | null>(null);
  const [workflowName, setWorkflowName] = useState("");
  const [workflowDescription, setWorkflowDescription] = useState("");
  const [showStepLibrary, setShowStepLibrary] = useState(false);
  const [showStepConfig, setShowStepConfig] = useState(false);
  const [selectedStep, setSelectedStep] = useState<any>(null);
  const [workflowSteps, setWorkflowSteps] = useState<any[]>([]);
  const [isCustomWorkflow, setIsCustomWorkflow] = useState(false);

  const workflowTemplates = [
    {
      id: "hr-onboarding",
      name: "Employee Onboarding",
      description: "Complete new hire onboarding process",
      category: "HR",
      steps: 8,
      avgTime: "3-5 days",
      color: "bg-blue-500",
    },
    {
      id: "expense-reimbursement",
      name: "Expense Reimbursement",
      description: "Process employee expense claims",
      category: "Finance",
      steps: 5,
      avgTime: "1-2 days",
      color: "bg-green-500",
    },
    {
      id: "access-request",
      name: "System Access Request",
      description: "Grant or revoke system access permissions",
      category: "IT",
      steps: 4,
      avgTime: "4-6 hours",
      color: "bg-purple-500",
    },
    {
      id: "contract-review",
      name: "Contract Review",
      description: "Legal review and approval process",
      category: "Legal",
      steps: 6,
      avgTime: "5-7 days",
      color: "bg-red-500",
    },
  ];

  const defaultWorkflowSteps = {
    "hr-onboarding": [
      {
        id: 1,
        name: "Submit Request",
        type: "form",
        icon: User,
        description: "Manager submits new hire information",
      },
      {
        id: 2,
        name: "HR Review",
        type: "approval",
        icon: CheckCircle,
        description: "HR validates request and job details",
      },
      {
        id: 3,
        name: "IT Account Setup",
        type: "task",
        icon: Settings,
        description: "IT creates user accounts and email",
      },
      {
        id: 4,
        name: "Equipment Assignment",
        type: "task",
        icon: Settings,
        description: "Assign laptop, phone, and accessories",
      },
      {
        id: 5,
        name: "Document Collection",
        type: "form",
        icon: User,
        description: "Collect I-9, tax forms, emergency contacts",
      },
      {
        id: 6,
        name: "Background Check",
        type: "external",
        icon: Clock,
        description: "Third-party background verification",
      },
      {
        id: 7,
        name: "Orientation Scheduling",
        type: "task",
        icon: Clock,
        description: "Schedule first day and orientation",
      },
      {
        id: 8,
        name: "Welcome & Follow-up",
        type: "notification",
        icon: Mail,
        description: "Send welcome email and 30-day check-in",
      },
    ],
  };

  const handleWorkflowSelect = (workflowId: string) => {
    setSelectedWorkflow(workflowId);
    setIsCustomWorkflow(false);
    const defaultSteps =
      defaultWorkflowSteps[workflowId as keyof typeof defaultWorkflowSteps] ||
      [];
    setWorkflowSteps([...defaultSteps]);

    // Set default name and description based on template
    const template = workflowTemplates.find((t) => t.id === workflowId);
    if (template) {
      setWorkflowName(template.name);
      setWorkflowDescription(template.description);
    }
  };

  const handleCreateCustomWorkflow = () => {
    setSelectedWorkflow("custom");
    setIsCustomWorkflow(true);
    setWorkflowSteps([]);
    setWorkflowName("");
    setWorkflowDescription("");
  };

  const selectedSteps = workflowSteps;

  const handleAddStep = (newStep: any) => {
    const stepWithId = {
      ...newStep,
      id: Date.now(), // Simple ID generation for demo
    };
    setWorkflowSteps([...workflowSteps, stepWithId]);
  };

  const handleConfigureStep = (step: any) => {
    setSelectedStep(step);
    setShowStepConfig(true);
  };

  const handleSaveStepConfig = (updatedStep: any) => {
    setWorkflowSteps(
      workflowSteps.map((step) =>
        step.id === updatedStep.id ? updatedStep : step
      )
    );
  };

  const handleSaveWorkflow = () => {
    console.log("Saving workflow:", {
      name: workflowName,
      description: workflowDescription,
      steps: workflowSteps,
      isCustom: isCustomWorkflow,
    });
    // TODO: Implement actual save functionality
  };

  const handleDeployWorkflow = () => {
    console.log("Deploying workflow:", {
      name: workflowName,
      description: workflowDescription,
      steps: workflowSteps,
      isCustom: isCustomWorkflow,
    });
    // TODO: Implement actual deploy functionality
  };

  return (
    <>
      <div className="flex flex-row items-center justify-between px-4 lg:px-8">
        <div className="text-2xl font-bold tracking-tight">
          Workflow Designer
          <div className="text-muted-foreground text-sm font-normal">
            Create and customize business process workflows
          </div>
        </div>
        <div className="flex gap-3">
          <Button size="sm" variant="outline" onClick={handleSaveWorkflow}>
            <Save className="mr-2 h-4 w-4" />
            Save Draft
          </Button>
          <Button size="sm" asChild onClick={handleDeployWorkflow}>
            <Link href="/workflows/deploy" className="dark:text-foreground">
              <Play className="mr-2 h-4 w-4" />
              Deploy Workflow
            </Link>
          </Button>
        </div>
      </div>

      <div className="px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Workflow Templates */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Workflow Templates</CardTitle>
                <CardDescription>
                  Choose a template to get started
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {workflowTemplates.map((template) => (
                  <div
                    key={template.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                      selectedWorkflow === template.id
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => handleWorkflowSelect(template.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-3 h-3 rounded-full ${template.color} mt-1.5`}
                      ></div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">
                          {template.name}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">
                          {template.description}
                        </p>
                        <div className="flex items-center gap-4 mt-2">
                          <Badge variant="secondary" className="text-xs">
                            {template.category}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {template.steps} steps
                          </span>
                          <span className="text-xs text-gray-500">
                            {template.avgTime}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                <Button
                  size="sm"
                  variant="outline"
                  className={`w-full mt-4 ${
                    selectedWorkflow === "custom"
                      ? "border-blue-500 bg-blue-50"
                      : ""
                  }`}
                  onClick={handleCreateCustomWorkflow}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create Custom Workflow
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Workflow Designer */}
          <div className="lg:col-span-2">
            {selectedWorkflow ? (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>
                        {isCustomWorkflow
                          ? "Custom Workflow"
                          : workflowTemplates.find(
                              (t) => t.id === selectedWorkflow
                            )?.name + " Workflow"}
                      </CardTitle>
                      <CardDescription>
                        Configure workflow steps and automation rules
                      </CardDescription>
                    </div>
                    <Badge
                      className={
                        isCustomWorkflow
                          ? "bg-purple-100 text-purple-800"
                          : "bg-green-100 text-green-800"
                      }
                    >
                      {isCustomWorkflow ? "Custom" : "Template"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Workflow Properties */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                    <div>
                      <Label htmlFor="workflow-name">Workflow Name</Label>
                      <Input
                        id="workflow-name"
                        value={workflowName}
                        onChange={(e) => setWorkflowName(e.target.value)}
                        placeholder="Enter workflow name"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="department">Department</Label>
                      <Select>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hr">Human Resources</SelectItem>
                          <SelectItem value="finance">Finance</SelectItem>
                          <SelectItem value="it">
                            Information Technology
                          </SelectItem>
                          <SelectItem value="legal">Legal</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={workflowDescription}
                        onChange={(e) => setWorkflowDescription(e.target.value)}
                        placeholder="Describe the workflow purpose and goals"
                        className="mt-1"
                        rows={3}
                      />
                    </div>
                  </div>

                  {/* Workflow Steps */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-4">
                      Workflow Steps
                    </h4>
                    {selectedSteps.length > 0 ? (
                      <div className="space-y-4">
                        {selectedSteps.map((step, index) => (
                          <div
                            key={step.id}
                            className="flex items-center gap-4 p-4 border rounded-lg"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-semibold text-blue-600">
                                {index + 1}
                              </div>
                              <step.icon className="h-5 w-5 text-gray-400" />
                            </div>
                            <div className="flex-1">
                              <h5 className="font-medium text-gray-900">
                                {step.name}
                              </h5>
                              <p className="text-sm text-gray-600">
                                {step.description}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">
                                {step.type}
                              </Badge>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleConfigureStep(step)}
                              >
                                <Settings className="h-4 w-4" />
                              </Button>
                            </div>
                            {index < selectedSteps.length - 1 && (
                              <ArrowRight className="h-4 w-4 text-gray-400" />
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <Settings className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                        <p>
                          No steps added yet. Click "Add Step" to get started.
                        </p>
                      </div>
                    )}

                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full mt-4"
                      onClick={() => setShowStepLibrary(true)}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Step
                    </Button>
                  </div>

                  {/* SLA Configuration */}
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <h5 className="font-medium text-yellow-800 mb-2">
                      Service Level Agreement
                    </h5>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label className="text-sm text-yellow-700">
                          Response Time
                        </Label>
                        <Select>
                          <SelectTrigger className="mt-1 bg-white">
                            <SelectValue placeholder="Select time" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1h">1 hour</SelectItem>
                            <SelectItem value="4h">4 hours</SelectItem>
                            <SelectItem value="1d">1 day</SelectItem>
                            <SelectItem value="2d">2 days</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-sm text-yellow-700">
                          Resolution Time
                        </Label>
                        <Select>
                          <SelectTrigger className="mt-1 bg-white">
                            <SelectValue placeholder="Select time" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1d">1 day</SelectItem>
                            <SelectItem value="3d">3 days</SelectItem>
                            <SelectItem value="5d">5 days</SelectItem>
                            <SelectItem value="10d">10 days</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-sm text-yellow-700">
                          Priority Level
                        </Label>
                        <Select>
                          <SelectTrigger className="mt-1 bg-white">
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="critical">Critical</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="h-96 flex items-center justify-center">
                <div className="text-center">
                  <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Select a Workflow Template
                  </h3>
                  <p className="text-gray-600">
                    Choose a template from the left panel to start designing
                    your workflow
                  </p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Step Library Dialog */}

      <div className="px-4 lg:px-8">
        <StepLibraryDialog
          open={showStepLibrary}
          onOpenChange={setShowStepLibrary}
          onAddStep={handleAddStep}
        />
      </div>

      {/* Step Configuration Dialog */}
      <div className="px-4 lg:px-8">
        <StepConfigDialog
          open={showStepConfig}
          onOpenChange={setShowStepConfig}
          step={selectedStep}
          onSave={handleSaveStepConfig}
        />
      </div>
    </>
  );
}
