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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Loader2, Mail, Inbox, Clock, Settings } from "lucide-react";

import { EMAIL_SECURITY_OPTIONS } from "../constants/email-security.constant";
import {
  EmailProtocolEnum,
  EmailSecurityEnum,
  IncomingEmailEngine,
} from "../types";
import { incomingEmailEngineSchema } from "../validations/email.schema";

interface IncomingEmailFormProps {
  onSuccess?: (settings: IncomingEmailEngine) => void;
}

export function IncomingEmailForm({ onSuccess }: IncomingEmailFormProps) {
  const { settings, loading, saving, saveSettings } =
    useIncomingEmailSettings();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<IncomingEmailEngine>({
    resolver: zodResolver(incomingEmailEngineSchema),
    defaultValues: {
      enabled: false,
      protocol: EmailProtocolEnum.IMAP,
      host: "",
      port: 993,
      secure: EmailSecurityEnum.SSL_TLS,
      username: "",
      password: "",
      pollInterval: 5,
      autoProcessIncidents: false,
      defaultPriority: "medium",
      emailToIncidentMapping: [],
    },
  });

  useEffect(() => {
    if (settings) {
      form.reset(settings);
    }
  }, [settings, form]);

  const onSubmit = async (data: IncomingEmailEngine) => {
    try {
      const savedSettings = await saveSettings(data);
      if (savedSettings && onSuccess) {
        onSuccess(savedSettings);
      }
    } catch (error) {
      console.error("Failed to save incoming email settings:", error);
    }
  };

  const addEmailMapping = () => {
    const currentMappings = form.getValues("emailToIncidentMapping");
    form.setValue("emailToIncidentMapping", [
      ...currentMappings,
      {
        subjectRegex: "",
        bodyRegex: "",
        categoryMapping: "",
        priorityMapping: "medium",
      },
    ]);
  };

  const removeEmailMapping = (index: number) => {
    const currentMappings = form.getValues("emailToIncidentMapping");
    form.setValue(
      "emailToIncidentMapping",
      currentMappings.filter((_, i) => i !== index)
    );
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-6">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="ml-2">Loading incoming email settings...</span>
        </CardContent>
      </Card>
    );
  }

  const watchedMappings = form.watch("emailToIncidentMapping");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Inbox className="h-5 w-5" />
          Incoming Email Configuration
        </CardTitle>
        <CardDescription>
          Configure email monitoring to automatically create incidents from
          incoming emails
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Enable Incoming Email */}
            <FormField
              control={form.control}
              name="enabled"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Enable Incoming Email Processing
                    </FormLabel>
                    <FormDescription>
                      Monitor emails and automatically process them into
                      incidents
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
                <Alert>
                  <Mail className="h-4 w-4" />
                  <AlertDescription>
                    Configure IMAP settings to monitor an email account for
                    incoming messages. These emails will be processed according
                    to your mapping rules.
                  </AlertDescription>
                </Alert>

                <Separator />

                {/* IMAP Configuration */}
                <div className="space-y-4">
                  <h4 className="font-medium flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    IMAP Configuration
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="host"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>IMAP Host</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="imap.example.com" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="port"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Port</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="secure"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Security</FormLabel>
                          <Select
                            value={field.value.toString()}
                            onValueChange={(value) =>
                              field.onChange(value === "true")
                            }
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {EMAIL_SECURITY_OPTIONS.map((option) => (
                                <SelectItem
                                  key={option.value}
                                  value={option.value}
                                >
                                  <div>
                                    <div className="font-medium">
                                      {option.label}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                      {option.description}
                                    </div>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="pollInterval"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Poll Interval (minutes)</FormLabel>
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
                            How often to check for new emails
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Username or email" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                {...field}
                                type={showPassword ? "text" : "password"}
                                placeholder="Password or app password"
                              />
                              <Button
                                size="sm"
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                onClick={() => setShowPassword(!showPassword)}
                              >
                                {showPassword ? "Hide" : "Show"}
                              </Button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <Separator />

                {/* Processing Settings */}
                <div className="space-y-4">
                  <h4 className="font-medium flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Processing Settings
                  </h4>

                  <FormField
                    control={form.control}
                    name="autoProcessIncidents"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Auto-Create Incidents
                          </FormLabel>
                          <FormDescription>
                            Automatically create incidents from incoming emails
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="defaultPriority"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Default Priority</FormLabel>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="low">Low</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="high">High</SelectItem>
                              <SelectItem value="critical">Critical</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="autoAssignTo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Auto-Assign To (Optional)</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="user@example.com" />
                          </FormControl>
                          <FormDescription>
                            Default assignee for auto-created incidents
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <Separator />

                {/* Email Mapping Rules */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Email Mapping Rules</h4>
                    <Button type="button" onClick={addEmailMapping} size="sm">
                      Add Mapping Rule
                    </Button>
                  </div>

                  {watchedMappings.length === 0 ? (
                    <div className="text-center p-8 border-2 border-dashed border-gray-300 rounded-lg">
                      <Mail className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600">
                        No mapping rules configured
                      </p>
                      <p className="text-sm text-gray-500">
                        Add rules to automatically categorize incoming emails
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {watchedMappings.map((mapping, index) => (
                        <Card key={index} className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h5 className="font-medium">Rule {index + 1}</h5>
                            <Button
                              size="sm"
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => removeEmailMapping(index)}
                            >
                              Remove
                            </Button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <FormField
                              control={form.control}
                              name={`emailToIncidentMapping.${index}.subjectRegex`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Subject Pattern</FormLabel>
                                  <FormControl>
                                    <Input
                                      {...field}
                                      placeholder=".*urgent.*|.*critical.*"
                                    />
                                  </FormControl>
                                  <FormDescription>
                                    Regex pattern to match email subjects
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name={`emailToIncidentMapping.${index}.bodyRegex`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Body Pattern</FormLabel>
                                  <FormControl>
                                    <Input
                                      {...field}
                                      placeholder=".*server.*down.*"
                                    />
                                  </FormControl>
                                  <FormDescription>
                                    Regex pattern to match email content
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name={`emailToIncidentMapping.${index}.categoryMapping`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Category</FormLabel>
                                  <FormControl>
                                    <Input
                                      {...field}
                                      placeholder="Infrastructure"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name={`emailToIncidentMapping.${index}.priorityMapping`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Priority</FormLabel>
                                  <Select
                                    value={field.value}
                                    onValueChange={field.onChange}
                                  >
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="low">Low</SelectItem>
                                      <SelectItem value="medium">
                                        Medium
                                      </SelectItem>
                                      <SelectItem value="high">High</SelectItem>
                                      <SelectItem value="critical">
                                        Critical
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}

            <Separator />

            {/* Actions */}
            <div className="flex justify-end">
              <Button size="sm" type="submit" disabled={saving}>
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Incoming Email Settings
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

function useIncomingEmailSettings(): {
  settings: any;
  loading: any;
  saving: any;
  saveSettings: any;
} {
  throw new Error("Function not implemented.");
}
