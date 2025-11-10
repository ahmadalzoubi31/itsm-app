import React from "react";
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
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StepTypeConfigProps {
  stepType: string;
  stepData: any;
  onDataChange: (data: any) => void;
}

export const StepTypeConfigurations = ({
  stepType,
  stepData,
  onDataChange,
}: StepTypeConfigProps) => {
  const updateData = (key: string, value: any) => {
    onDataChange({ ...stepData, [key]: value });
  };

  const renderFormConfig = () => (
    <div className="space-y-4">
      <div>
        <Label>Form Fields</Label>
        <Textarea
          placeholder="Define form fields (one per line)"
          value={stepData.formFields || ""}
          onChange={(e) => updateData("formFields", e.target.value)}
          rows={4}
        />
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          checked={stepData.requiresValidation || false}
          onCheckedChange={(checked) =>
            updateData("requiresValidation", checked)
          }
        />
        <Label>Requires field validation</Label>
      </div>
      <div>
        <Label>Submit Action</Label>
        <Select
          value={stepData.submitAction || "continue"}
          onValueChange={(value) => updateData("submitAction", value)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="continue">Continue to next step</SelectItem>
            <SelectItem value="review">Send for review</SelectItem>
            <SelectItem value="save">Save as draft</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  const renderApprovalConfig = () => (
    <div className="space-y-4">
      <div>
        <Label>Approval Type</Label>
        <Select
          value={stepData.approvalType || "single"}
          onValueChange={(value) => updateData("approvalType", value)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="single">Single approver</SelectItem>
            <SelectItem value="multiple">Multiple approvers</SelectItem>
            <SelectItem value="majority">Majority vote</SelectItem>
            <SelectItem value="unanimous">Unanimous approval</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Escalation Rules</Label>
        <Textarea
          placeholder="Define escalation conditions and actions"
          value={stepData.escalationRules || ""}
          onChange={(e) => updateData("escalationRules", e.target.value)}
          rows={3}
        />
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          checked={stepData.allowDelegation || false}
          onCheckedChange={(checked) => updateData("allowDelegation", checked)}
        />
        <Label>Allow approval delegation</Label>
      </div>
    </div>
  );

  const renderTaskConfig = () => (
    <div className="space-y-4">
      <div>
        <Label>Task Instructions</Label>
        <Textarea
          placeholder="Detailed instructions for completing this task"
          value={stepData.instructions || ""}
          onChange={(e) => updateData("instructions", e.target.value)}
          rows={4}
        />
      </div>
      <div>
        <Label>Task Type</Label>
        <Select
          value={stepData.taskType || "manual"}
          onValueChange={(value) => updateData("taskType", value)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="manual">Manual task</SelectItem>
            <SelectItem value="automated">Automated task</SelectItem>
            <SelectItem value="system">System integration</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          checked={stepData.requiresEvidence || false}
          onCheckedChange={(checked) => updateData("requiresEvidence", checked)}
        />
        <Label>Requires completion evidence</Label>
      </div>
    </div>
  );

  const renderNotificationConfig = () => (
    <div className="space-y-4">
      <div>
        <Label>Notification Type</Label>
        <Select
          value={stepData.notificationType || "email"}
          onValueChange={(value) => updateData("notificationType", value)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="email">Email</SelectItem>
            <SelectItem value="sms">SMS</SelectItem>
            <SelectItem value="slack">Slack</SelectItem>
            <SelectItem value="push">Push notification</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Message Template</Label>
        <Textarea
          placeholder="Notification message template"
          value={stepData.messageTemplate || ""}
          onChange={(e) => updateData("messageTemplate", e.target.value)}
          rows={3}
        />
      </div>
      <div>
        <Label>Recipients</Label>
        <Input
          placeholder="Define recipients (comma-separated)"
          value={stepData.recipients || ""}
          onChange={(e) => updateData("recipients", e.target.value)}
        />
      </div>
    </div>
  );

  const renderExternalConfig = () => (
    <div className="space-y-4">
      <div>
        <Label>External Service</Label>
        <Select
          value={stepData.externalService || "api"}
          onValueChange={(value) => updateData("externalService", value)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="api">REST API</SelectItem>
            <SelectItem value="webhook">Webhook</SelectItem>
            <SelectItem value="thirdparty">Third-party service</SelectItem>
            <SelectItem value="database">External database</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Endpoint/URL</Label>
        <Input
          placeholder="External service endpoint"
          value={stepData.endpoint || ""}
          onChange={(e) => updateData("endpoint", e.target.value)}
        />
      </div>
      <div>
        <Label>Request Configuration</Label>
        <Textarea
          placeholder="JSON configuration for the external request"
          value={stepData.requestConfig || ""}
          onChange={(e) => updateData("requestConfig", e.target.value)}
          rows={4}
        />
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          checked={stepData.requiresAuth || false}
          onCheckedChange={(checked) => updateData("requiresAuth", checked)}
        />
        <Label>Requires authentication</Label>
      </div>
    </div>
  );

  const renderWaitConfig = () => (
    <div className="space-y-4">
      <div>
        <Label>Wait Type</Label>
        <Select
          value={stepData.waitType || "timer"}
          onValueChange={(value) => updateData("waitType", value)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="timer">Timer-based</SelectItem>
            <SelectItem value="condition">Condition-based</SelectItem>
            <SelectItem value="event">Event-based</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {stepData.waitType === "timer" && (
        <div>
          <Label>Wait Duration (hours)</Label>
          <Input
            type="number"
            placeholder="Hours to wait"
            value={stepData.waitDuration || ""}
            onChange={(e) => updateData("waitDuration", e.target.value)}
          />
        </div>
      )}
      {stepData.waitType === "condition" && (
        <div>
          <Label>Wait Condition</Label>
          <Textarea
            placeholder="Define the condition to wait for"
            value={stepData.waitCondition || ""}
            onChange={(e) => updateData("waitCondition", e.target.value)}
            rows={3}
          />
        </div>
      )}
    </div>
  );

  const renderDatabaseConfig = () => (
    <div className="space-y-4">
      <div>
        <Label>Database Operation</Label>
        <Select
          value={stepData.operation || "create"}
          onValueChange={(value) => updateData("operation", value)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="create">Create record</SelectItem>
            <SelectItem value="update">Update record</SelectItem>
            <SelectItem value="delete">Delete record</SelectItem>
            <SelectItem value="query">Query records</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Table/Entity</Label>
        <Input
          placeholder="Database table or entity name"
          value={stepData.tableName || ""}
          onChange={(e) => updateData("tableName", e.target.value)}
        />
      </div>
      <div>
        <Label>Data Mapping</Label>
        <Textarea
          placeholder="Define how workflow data maps to database fields"
          value={stepData.dataMapping || ""}
          onChange={(e) => updateData("dataMapping", e.target.value)}
          rows={4}
        />
      </div>
    </div>
  );

  const renderAlertConfig = () => (
    <div className="space-y-4">
      <div>
        <Label>Alert Severity</Label>
        <Select
          value={stepData.severity || "medium"}
          onValueChange={(value) => updateData("severity", value)}
        >
          <SelectTrigger>
            <SelectValue />
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
        <Label>Alert Conditions</Label>
        <Textarea
          placeholder="Define conditions that trigger this alert"
          value={stepData.alertConditions || ""}
          onChange={(e) => updateData("alertConditions", e.target.value)}
          rows={3}
        />
      </div>
      <div>
        <Label>Alert Recipients</Label>
        <Input
          placeholder="Who should receive this alert"
          value={stepData.alertRecipients || ""}
          onChange={(e) => updateData("alertRecipients", e.target.value)}
        />
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          checked={stepData.requiresAcknowledgment || false}
          onCheckedChange={(checked) =>
            updateData("requiresAcknowledgment", checked)
          }
        />
        <Label>Requires acknowledgment</Label>
      </div>
    </div>
  );

  const getConfigComponent = () => {
    switch (stepType) {
      case "form":
        return renderFormConfig();
      case "approval":
        return renderApprovalConfig();
      case "task":
        return renderTaskConfig();
      case "notification":
        return renderNotificationConfig();
      case "external":
        return renderExternalConfig();
      case "wait":
        return renderWaitConfig();
      case "database":
        return renderDatabaseConfig();
      case "alert":
        return renderAlertConfig();
      default:
        return (
          <div className="text-center py-4 text-gray-500">
            No specific configuration available for this step type.
          </div>
        );
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Badge variant="outline">{stepType}</Badge>
          Step Configuration
        </CardTitle>
      </CardHeader>
      <CardContent>{getConfigComponent()}</CardContent>
    </Card>
  );
};
