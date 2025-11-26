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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StepTypeConfigurations } from "./StepTypeConfigurations";

interface StepConfigDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  step: any;
  onSave: (updatedStep: any) => void;
}

export const StepConfigDialog = ({
  open,
  onOpenChange,
  step,
  onSave,
}: StepConfigDialogProps) => {
  const [stepName, setStepName] = useState("");
  const [stepDescription, setStepDescription] = useState("");
  const [isRequired, setIsRequired] = useState(true);
  const [assignee, setAssignee] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("medium");
  const [autoComplete, setAutoComplete] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [typeSpecificData, setTypeSpecificData] = useState({});

  useEffect(() => {
    if (step) {
      setStepName(step.name || "");
      setStepDescription(step.description || "");
      setIsRequired(step.isRequired ?? true);
      setAssignee(step.assignee || "");
      setDueDate(step.dueDate || "");
      setPriority(step.priority || "medium");
      setAutoComplete(step.autoComplete || false);
      setNotifications(step.notifications ?? true);
      setTypeSpecificData(step.typeSpecificData || {});
    }
  }, [step]);

  const handleSave = () => {
    const updatedStep = {
      ...step,
      name: stepName,
      description: stepDescription,
      isRequired,
      assignee,
      dueDate,
      priority,
      autoComplete,
      notifications,
      typeSpecificData,
      // Merge type-specific data at the root level for easier access
      ...typeSpecificData,
    };
    onSave(updatedStep);
    onOpenChange(false);
  };

  const handleTypeSpecificDataChange = (data: any) => {
    setTypeSpecificData(data);
  };

  if (!step) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Configure Step: {step.name}</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic">Basic Settings</TabsTrigger>
            <TabsTrigger value="advanced">Advanced Config</TabsTrigger>
            <TabsTrigger value="type-specific">Type-Specific</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-6 mt-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Basic Information</h4>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="step-name">Step Name</Label>
                  <Input
                    id="step-name"
                    value={stepName}
                    onChange={(e) => setStepName(e.target.value)}
                    placeholder="Enter step name"
                  />
                </div>
                <div>
                  <Label htmlFor="step-description">Description</Label>
                  <Textarea
                    id="step-description"
                    value={stepDescription}
                    onChange={(e) => setStepDescription(e.target.value)}
                    placeholder="Describe what this step does"
                    rows={3}
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Assignment & Timing */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Assignment & Timing</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="assignee">Assignee</Label>
                  <Select value={assignee} onValueChange={setAssignee}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select assignee" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="manager">Manager</SelectItem>
                      <SelectItem value="hr">HR Department</SelectItem>
                      <SelectItem value="it">IT Department</SelectItem>
                      <SelectItem value="legal">Legal Department</SelectItem>
                      <SelectItem value="finance">
                        Finance Department
                      </SelectItem>
                      <SelectItem value="requester">Requester</SelectItem>
                      <SelectItem value="system">System (Automated)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <Select value={priority} onValueChange={setPriority}>
                    <SelectTrigger>
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
                <div>
                  <Label htmlFor="due-date">Due Date (Hours)</Label>
                  <Input
                    id="due-date"
                    type="number"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    placeholder="Hours to complete"
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-6 mt-6">
            {/* Step Behavior */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Step Behavior</h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="required">Required Step</Label>
                    <p className="text-sm text-gray-600">
                      This step must be completed to proceed
                    </p>
                  </div>
                  <Switch
                    id="required"
                    checked={isRequired}
                    onCheckedChange={setIsRequired}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="auto-complete">Auto Complete</Label>
                    <p className="text-sm text-gray-600">
                      Automatically complete when conditions are met
                    </p>
                  </div>
                  <Switch
                    id="auto-complete"
                    checked={autoComplete}
                    onCheckedChange={setAutoComplete}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="notifications">Send Notifications</Label>
                    <p className="text-sm text-gray-600">
                      Notify assignees when step is ready
                    </p>
                  </div>
                  <Switch
                    id="notifications"
                    checked={notifications}
                    onCheckedChange={setNotifications}
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="type-specific" className="mt-6">
            <StepTypeConfigurations
              stepType={step.type}
              stepData={typeSpecificData}
              onDataChange={handleTypeSpecificDataChange}
            />
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button size="sm" onClick={handleSave}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
