"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Bell, Users, Mail, Settings } from "lucide-react";

import { NotificationSettings } from "../types";
import {
  notificationSettingsSchema,
  NotificationSettingsForm as NotificationForm,
} from "../validations/email.schema";
import {
  useGetNotificationSettings,
  useSaveNotificationSettings,
} from "../hooks/useNotificationSettings";
import {
  NOTIFICATION_TYPES,
  NotificationTypeEnum,
} from "../constants/notification-type.constant";
import { NOTIFICATION_CATEGORIES } from "../constants/notification-category.constant";
import { PRIORITY_LEVELS } from "../constants/email-priority.constant";

interface NotificationSettingsFormProps {
  onSuccess?: (settings: NotificationSettings) => void;
}

export function NotificationSettingsForm({
  onSuccess,
}: NotificationSettingsFormProps) {
  const {
    data: notifications,
    isLoading: loading,
    isError: error,
  } = useGetNotificationSettings();
  const { mutate: saveNotifcationSettings, isPending: saving } =
    useSaveNotificationSettings();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const form = useForm<NotificationForm>({
    resolver: zodResolver(notificationSettingsSchema),
    defaultValues: {
      enabled: true,
      notificationTypes: [],
      defaultRecipients: [],
      urgentRecipients: [],
      ccRecipients: [],
      bccRecipients: [],
      subjectPrefix: "[ITSM]",
      includeAttachments: false,
      maxAttachmentSize: 10,
      retryAttempts: 3,
      retryDelay: 60,
      batchSize: 50,
      throttleLimit: 100,
    },
  });

  useEffect(() => {
    if (notifications) {
      form.reset(notifications);
    }
  }, [notifications, form]);

  const onSubmit = async (data: NotificationForm) => {
    try {
      saveNotifcationSettings(data);
      if (onSuccess) {
        onSuccess(data);
      }
    } catch (error) {
      console.error("Failed to save notification settings:", error);
    }
  };

  const filteredNotifications = NOTIFICATION_TYPES.filter(
    (notification) =>
      selectedCategory === "all" || notification.category === selectedCategory
  );

  const handleNotificationToggle = (
    notificationType: NotificationTypeEnum,
    checked: boolean
  ) => {
    const currentTypes = form.getValues("notificationTypes");
    if (checked) {
      form.setValue("notificationTypes", [...currentTypes, notificationType]);
    } else {
      form.setValue(
        "notificationTypes",
        currentTypes.filter((type) => type !== notificationType)
      );
    }
  };

  const addRecipient = (
    field:
      | "defaultRecipients"
      | "urgentRecipients"
      | "ccRecipients"
      | "bccRecipients",
    email: string
  ) => {
    if (email && /\S+@\S+\.\S+/.test(email)) {
      const current = form.getValues(field);
      if (!current.includes(email)) {
        form.setValue(field, [...current, email]);
      }
    }
  };

  const removeRecipient = (
    field:
      | "defaultRecipients"
      | "urgentRecipients"
      | "ccRecipients"
      | "bccRecipients",
    email: string
  ) => {
    const current = form.getValues(field);
    form.setValue(
      field,
      current.filter((recipient) => recipient !== email)
    );
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-6">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="ml-2">Loading notification settings...</span>
        </CardContent>
      </Card>
    );
  }

  const watchedNotificationTypes = form.watch("notificationTypes");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Notification Settings
        </CardTitle>
        <CardDescription>
          Configure email notifications for different events and activities
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Enable Notifications */}
            <FormField
              control={form.control}
              name="enabled"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Enable Email Notifications
                    </FormLabel>
                    <FormDescription>
                      Turn on email notifications for system events
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {form.watch("enabled") && (
              <>
                {/* Notification Types */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Notification Types</Label>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        type="button"
                        variant={
                          selectedCategory === "all" ? "default" : "outline"
                        }
                        onClick={() => setSelectedCategory("all")}
                      >
                        All
                      </Button>
                      {NOTIFICATION_CATEGORIES.map((category) => (
                        <Button
                          key={category}
                          type="button"
                          variant={
                            selectedCategory === category
                              ? "default"
                              : "outline"
                          }
                          size="sm"
                          onClick={() => setSelectedCategory(category)}
                        >
                          {category}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    {filteredNotifications.map((notification) => {
                      const isSelected = watchedNotificationTypes.includes(
                        notification.value
                      );
                      const priorityColor =
                        PRIORITY_LEVELS.find(
                          (p) => p.value === notification.priority
                        )?.color || "gray";

                      return (
                        <div
                          key={notification.value}
                          className={`p-4 border rounded-lg transition-all ${
                            isSelected
                              ? "border-blue-300 bg-blue-50"
                              : "border-gray-200"
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3">
                              <Checkbox
                                checked={isSelected}
                                onCheckedChange={(checked) =>
                                  handleNotificationToggle(
                                    notification.value,
                                    checked as boolean
                                  )
                                }
                              />
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">
                                    {notification.label}
                                  </span>
                                  <Badge
                                    variant="outline"
                                    className={`text-xs text-${priorityColor}-600 border-${priorityColor}-300`}
                                  >
                                    {notification.priority}
                                  </Badge>
                                </div>
                                <p className="text-sm text-gray-600">
                                  {notification.description}
                                </p>
                                <Badge variant="secondary" className="text-xs">
                                  {notification.category}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <Separator />

                {/* Recipients Configuration */}
                <div className="space-y-6">
                  <h4 className="font-medium flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Email Recipients
                  </h4>

                  {/* Default Recipients */}
                  <div className="space-y-3">
                    <Label>Default Recipients</Label>
                    <FormDescription>
                      Email addresses that will receive all enabled
                      notifications
                    </FormDescription>
                    <RecipientManager
                      recipients={form.watch("defaultRecipients")}
                      onAdd={(email) =>
                        addRecipient("defaultRecipients", email)
                      }
                      onRemove={(email) =>
                        removeRecipient("defaultRecipients", email)
                      }
                      placeholder="admin@example.com"
                    />
                  </div>

                  {/* Urgent Recipients */}
                  <div className="space-y-3">
                    <Label>Urgent Recipients</Label>
                    <FormDescription>
                      Additional recipients for high priority and critical
                      notifications
                    </FormDescription>
                    <RecipientManager
                      recipients={form.watch("urgentRecipients")}
                      onAdd={(email) => addRecipient("urgentRecipients", email)}
                      onRemove={(email) =>
                        removeRecipient("urgentRecipients", email)
                      }
                      placeholder="manager@example.com"
                    />
                  </div>

                  {/* CC Recipients */}
                  <div className="space-y-3">
                    <Label>CC Recipients</Label>
                    <FormDescription>
                      Recipients who will be CC'd on all notifications
                    </FormDescription>
                    <RecipientManager
                      recipients={form.watch("ccRecipients")}
                      onAdd={(email) => addRecipient("ccRecipients", email)}
                      onRemove={(email) =>
                        removeRecipient("ccRecipients", email)
                      }
                      placeholder="team@example.com"
                    />
                  </div>
                </div>

                <Separator />

                {/* Email Configuration */}
                <div className="space-y-4">
                  <h4 className="font-medium flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email Configuration
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="subjectPrefix"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Subject Prefix</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="[ITSM]" />
                          </FormControl>
                          <FormDescription>
                            Prefix added to all notification email subjects
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="maxAttachmentSize"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Max Attachment Size (MB)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
                              }
                            />
                          </FormControl>
                          <FormDescription>
                            Maximum size for email attachments
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="includeAttachments"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Include Attachments
                          </FormLabel>
                          <FormDescription>
                            Attach relevant files to notification emails when
                            applicable
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <Separator />

                {/* Advanced Settings */}
                <div className="space-y-4">
                  <h4 className="font-medium flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    Advanced Settings
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="retryAttempts"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Retry Attempts</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
                              }
                            />
                          </FormControl>
                          <FormDescription>
                            Number of retry attempts for failed emails
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="retryDelay"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Retry Delay (seconds)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
                              }
                            />
                          </FormControl>
                          <FormDescription>
                            Delay between retry attempts
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="batchSize"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Batch Size</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
                              }
                            />
                          </FormControl>
                          <FormDescription>
                            Number of emails to send in each batch
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="throttleLimit"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Rate Limit (emails/minute)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
                              }
                            />
                          </FormControl>
                          <FormDescription>
                            Maximum emails to send per minute
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </>
            )}

            <Separator />

            {/* Actions */}
            <div className="flex justify-end">
              <Button size="sm" type="submit" disabled={saving}>
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Notification Settings
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

// Helper component for managing email recipients
interface RecipientManagerProps {
  recipients: string[];
  onAdd: (email: string) => void;
  onRemove: (email: string) => void;
  placeholder?: string;
}

function RecipientManager({
  recipients,
  onAdd,
  onRemove,
  placeholder,
}: RecipientManagerProps) {
  const [newEmail, setNewEmail] = useState("");

  const handleAdd = () => {
    if (newEmail.trim()) {
      onAdd(newEmail.trim());
      setNewEmail("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Input
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          type="email"
        />
        <Button type="button" onClick={handleAdd} size="sm">
          Add
        </Button>
      </div>

      {recipients.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {recipients.map((email, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="px-3 py-1 cursor-pointer hover:bg-red-100"
              onClick={() => onRemove(email)}
            >
              {email}
              <span className="ml-2 text-red-500">×</span>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
