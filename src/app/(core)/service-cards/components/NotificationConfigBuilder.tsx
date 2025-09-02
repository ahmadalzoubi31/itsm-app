"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Bell,
  Mail,
  Users,
  CheckCircle,
  AlertCircle,
  TrendingUp,
} from "lucide-react";
import { NotificationConfig } from "../types";

interface NotificationConfigBuilderProps {
  notifications: NotificationConfig;
  onChange: (notifications: NotificationConfig) => void;
}

export const NotificationConfigBuilder = ({
  notifications,
  onChange,
}: NotificationConfigBuilderProps) => {
  const handleSectionChange = (
    section: keyof NotificationConfig,
    field: string,
    value: any
  ) => {
    onChange({
      ...notifications,
      [section]: {
        ...notifications[section],
        [field]: value,
      },
    });
  };

  const handleCustomRecipientsChange = (
    section: keyof NotificationConfig,
    value: string
  ) => {
    const recipients = value
      .split(",")
      .map((email) => email.trim())
      .filter((email) => email);
    handleSectionChange(section, "customRecipients", recipients);
  };

  const getCustomRecipientsValue = (section: keyof NotificationConfig) => {
    return notifications[section]?.customRecipients?.join(", ") || "";
  };

  return (
    <div className="space-y-6">
      {/* Request Creation Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Request Creation
          </CardTitle>
          <CardDescription>
            Configure notifications when a new request is submitted
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Switch
                  id="notify-requester-create"
                  checked={notifications.onCreate?.notifyRequester ?? true}
                  onCheckedChange={(checked) =>
                    handleSectionChange("onCreate", "notifyRequester", checked)
                  }
                />
                <Label htmlFor="notify-requester-create">
                  Notify Requester
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="notify-approvers-create"
                  checked={notifications.onCreate?.notifyApprovers ?? true}
                  onCheckedChange={(checked) =>
                    handleSectionChange("onCreate", "notifyApprovers", checked)
                  }
                />
                <Label htmlFor="notify-approvers-create">
                  Notify Approvers
                </Label>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <Label htmlFor="custom-recipients-create">
                  Custom Recipients (comma-separated emails)
                </Label>
                <Input
                  id="custom-recipients-create"
                  value={getCustomRecipientsValue("onCreate")}
                  onChange={(e) =>
                    handleCustomRecipientsChange("onCreate", e.target.value)
                  }
                  placeholder="email1@company.com, email2@company.com"
                />
              </div>
              <div>
                <Label htmlFor="template-create">Email Template ID</Label>
                <Input
                  id="template-create"
                  value={notifications.onCreate?.template || ""}
                  onChange={(e) =>
                    handleSectionChange("onCreate", "template", e.target.value)
                  }
                  placeholder="request-created-template"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Approval Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Approval Process
          </CardTitle>
          <CardDescription>
            Configure notifications during the approval workflow
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Switch
                  id="notify-requester-approval"
                  checked={notifications.onApproval?.notifyRequester ?? true}
                  onCheckedChange={(checked) =>
                    handleSectionChange(
                      "onApproval",
                      "notifyRequester",
                      checked
                    )
                  }
                />
                <Label htmlFor="notify-requester-approval">
                  Notify Requester
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="notify-next-approver"
                  checked={notifications.onApproval?.notifyNextApprover ?? true}
                  onCheckedChange={(checked) =>
                    handleSectionChange(
                      "onApproval",
                      "notifyNextApprover",
                      checked
                    )
                  }
                />
                <Label htmlFor="notify-next-approver">
                  Notify Next Approver
                </Label>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <Label htmlFor="custom-recipients-approval">
                  Custom Recipients
                </Label>
                <Input
                  id="custom-recipients-approval"
                  value={getCustomRecipientsValue("onApproval")}
                  onChange={(e) =>
                    handleCustomRecipientsChange("onApproval", e.target.value)
                  }
                  placeholder="email1@company.com, email2@company.com"
                />
              </div>
              <div>
                <Label htmlFor="template-approval">Email Template ID</Label>
                <Input
                  id="template-approval"
                  value={notifications.onApproval?.template || ""}
                  onChange={(e) =>
                    handleSectionChange(
                      "onApproval",
                      "template",
                      e.target.value
                    )
                  }
                  placeholder="request-approved-template"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Completion Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Request Completion
          </CardTitle>
          <CardDescription>
            Configure notifications when the request is completed
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Switch
                  id="notify-requester-completion"
                  checked={notifications.onCompletion?.notifyRequester ?? true}
                  onCheckedChange={(checked) =>
                    handleSectionChange(
                      "onCompletion",
                      "notifyRequester",
                      checked
                    )
                  }
                />
                <Label htmlFor="notify-requester-completion">
                  Notify Requester
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="notify-stakeholders"
                  checked={
                    notifications.onCompletion?.notifyStakeholders ?? false
                  }
                  onCheckedChange={(checked) =>
                    handleSectionChange(
                      "onCompletion",
                      "notifyStakeholders",
                      checked
                    )
                  }
                />
                <Label htmlFor="notify-stakeholders">Notify Stakeholders</Label>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <Label htmlFor="custom-recipients-completion">
                  Custom Recipients
                </Label>
                <Input
                  id="custom-recipients-completion"
                  value={getCustomRecipientsValue("onCompletion")}
                  onChange={(e) =>
                    handleCustomRecipientsChange("onCompletion", e.target.value)
                  }
                  placeholder="email1@company.com, email2@company.com"
                />
              </div>
              <div>
                <Label htmlFor="template-completion">Email Template ID</Label>
                <Input
                  id="template-completion"
                  value={notifications.onCompletion?.template || ""}
                  onChange={(e) =>
                    handleSectionChange(
                      "onCompletion",
                      "template",
                      e.target.value
                    )
                  }
                  placeholder="request-completed-template"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Escalation Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Escalation Alerts
          </CardTitle>
          <CardDescription>
            Configure notifications when requests are escalated
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Switch
                  id="notify-manager-escalation"
                  checked={notifications.onEscalation?.notifyManager ?? true}
                  onCheckedChange={(checked) =>
                    handleSectionChange(
                      "onEscalation",
                      "notifyManager",
                      checked
                    )
                  }
                />
                <Label htmlFor="notify-manager-escalation">
                  Notify Manager
                </Label>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <Label htmlFor="custom-recipients-escalation">
                  Custom Recipients
                </Label>
                <Input
                  id="custom-recipients-escalation"
                  value={getCustomRecipientsValue("onEscalation")}
                  onChange={(e) =>
                    handleCustomRecipientsChange("onEscalation", e.target.value)
                  }
                  placeholder="email1@company.com, email2@company.com"
                />
              </div>
              <div>
                <Label htmlFor="template-escalation">Email Template ID</Label>
                <Input
                  id="template-escalation"
                  value={notifications.onEscalation?.template || ""}
                  onChange={(e) =>
                    handleSectionChange(
                      "onEscalation",
                      "template",
                      e.target.value
                    )
                  }
                  placeholder="request-escalated-template"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Global Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Global Notification Settings
          </CardTitle>
          <CardDescription>
            Configure general notification preferences
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-800 mb-1">
                  Email Template Configuration
                </h4>
                <p className="text-sm text-blue-700">
                  Email templates should be configured in the Email Templates
                  section of the system settings. Use the template IDs specified
                  above to customize the content and formatting of notification
                  emails.
                </p>
                <p className="text-sm text-blue-700 mt-2">
                  If no template ID is provided, the system will use default
                  templates for each notification type.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
