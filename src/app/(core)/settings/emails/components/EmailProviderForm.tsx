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
import {
  Loader2,
  TestTube,
  Eye,
  EyeOff,
  Send,
  Download,
  Settings2,
  ChevronDown,
  ChevronUp,
  Shield,
  ShieldCheck,
  Lock,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { toast } from "sonner";

import { EmailSettings, EmailProtocolEnum, EmailSecurityEnum } from "../types";
import {
  emailSettingsSchema,
  EmailSettingsForm,
} from "../validations/email.schema";
import { useEmailTest, useSaveEmailSettings } from "../hooks/useEmailSettings";
import { useGetOutgoingSettings } from "../hooks/useOutgoingSettings";
import { useGetIncomingSettings } from "../hooks/useIncomingSettings";

// Temporary type for backend compatibility until backend supports new enum
type BackendEmailPayload = Omit<EmailSettingsForm, "outgoing" | "incoming"> & {
  outgoing: Omit<EmailSettingsForm["outgoing"], "secure"> & {
    secure: boolean;
    securityType?: EmailSecurityEnum;
    requireTLS?: boolean;
  };
  incoming: Omit<EmailSettingsForm["incoming"], "secure"> & {
    secure: boolean;
    securityType?: EmailSecurityEnum;
    requireTLS?: boolean;
  };
};

interface EmailProviderFormProps {
  onSuccess?: (settings: EmailSettings) => void;
}

const OUTGOING_PROTOCOL_OPTIONS = [
  {
    value: EmailProtocolEnum.SMTP,
    label: "SMTP",
    description: "Simple Mail Transfer Protocol",
  },
];

const INCOMING_PROTOCOL_OPTIONS = [
  {
    value: EmailProtocolEnum.IMAP,
    label: "IMAP",
    description: "Internet Message Access Protocol",
  },
  {
    value: EmailProtocolEnum.POP3,
    label: "POP3",
    description: "Post Office Protocol 3",
  },
];

const SECURITY_OPTIONS = [
  {
    value: EmailSecurityEnum.NONE,
    label: "No Encryption",
    description: "Unencrypted connection (not recommended)",
    icon: "shield",
    color: "red",
  },
  {
    value: EmailSecurityEnum.SSL_TLS,
    label: "SSL/TLS",
    description: "Encrypted connection from start",
    icon: "shield-check",
    color: "green",
  },
  {
    value: EmailSecurityEnum.STARTTLS,
    label: "STARTTLS",
    description: "Upgrade connection to encrypted",
    icon: "shield-check",
    color: "blue",
  },
];

const DEFAULT_PORTS = {
  [EmailProtocolEnum.SMTP]: {
    [EmailSecurityEnum.NONE]: 25,
    [EmailSecurityEnum.SSL_TLS]: 465,
    [EmailSecurityEnum.STARTTLS]: 587,
  },
  [EmailProtocolEnum.IMAP]: {
    [EmailSecurityEnum.NONE]: 143,
    [EmailSecurityEnum.SSL_TLS]: 993,
    [EmailSecurityEnum.STARTTLS]: 143,
  },
  [EmailProtocolEnum.POP3]: {
    [EmailSecurityEnum.NONE]: 110,
    [EmailSecurityEnum.SSL_TLS]: 995,
    [EmailSecurityEnum.STARTTLS]: 110,
  },
};

export function EmailProviderForm({ onSuccess }: EmailProviderFormProps) {
  // Data hooks
  const { data: outgoingSettings, isLoading: outgoingLoading } =
    useGetOutgoingSettings();
  const { data: incomingSettings, isLoading: incomingLoading } =
    useGetIncomingSettings();
  const saveEmailMutation = useSaveEmailSettings();

  const { testing, testConnection } = useEmailTest();
  const [showOutgoingPassword, setShowOutgoingPassword] = useState(false);
  const [showIncomingPassword, setShowIncomingPassword] = useState(false);
  const [showAdvancedOutgoing, setShowAdvancedOutgoing] = useState(false);
  const [showAdvancedIncoming, setShowAdvancedIncoming] = useState(false);

  const form = useForm<EmailSettingsForm>({
    resolver: zodResolver(emailSettingsSchema),
    defaultValues: {
      outgoing: {
        enabled: false,
        protocol: EmailProtocolEnum.SMTP,
        host: "",
        port: 587,
        secure: EmailSecurityEnum.STARTTLS,
        username: "",
        password: "",
        fromEmail: "",
        fromName: "ITSM System",
        replyTo: "",
        timeout: 30000,
        connectionTimeout: 30000,
        maxConnections: 5,
        rateLimitPerSecond: 14,
      },
      incoming: {
        enabled: false,
        protocol: EmailProtocolEnum.IMAP,
        host: "",
        port: 993,
        secure: EmailSecurityEnum.SSL_TLS,
        username: "",
        password: "",
        pollInterval: 5,
        autoProcessIncidents: false,
        autoAssignTo: "",
        defaultPriority: "medium",
        emailToIncidentMapping: [],
      },
      templates: [],
      testEmail: "",
      lastTestResult: {
        success: false,
        timestamp: new Date(),
        message: "",
        details: {},
      },
    },
  });

  useEffect(() => {
    if (outgoingSettings || incomingSettings) {
      form.reset({
        outgoing: outgoingSettings,
        incoming: incomingSettings,
        templates: [],
        testEmail: "",
        lastTestResult: {
          success: false,
          timestamp: new Date(),
          message: "",
          details: {},
        },
      });
    }
  }, [outgoingSettings, incomingSettings, form]);

  const handleProtocolChange = (
    protocol: EmailProtocolEnum,
    type: "outgoing" | "incoming"
  ) => {
    const currentSecurity = form.watch(`${type}.secure`);
    const port = DEFAULT_PORTS[protocol][currentSecurity];

    form.setValue(`${type}.protocol`, protocol);
    form.setValue(`${type}.port`, port);
  };

  const handleSecurityChange = (
    security: EmailSecurityEnum,
    type: "outgoing" | "incoming"
  ) => {
    const protocol = form.watch(`${type}.protocol`);
    const port = DEFAULT_PORTS[protocol][security];

    form.setValue(`${type}.secure`, security);
    form.setValue(`${type}.port`, port);
  };

  const validatePortSecurityCombination = (
    protocol: EmailProtocolEnum,
    security: EmailSecurityEnum,
    port: number
  ) => {
    const expectedPort = DEFAULT_PORTS[protocol][security];
    const isStandardPort = port === expectedPort;

    // Check for common misconfigurations
    const commonIssues = [];

    if (protocol === EmailProtocolEnum.SMTP) {
      if (security === EmailSecurityEnum.SSL_TLS && port !== 465) {
        commonIssues.push(
          `SSL/TLS typically uses port 465, but you have ${port}`
        );
      }
      if (security === EmailSecurityEnum.STARTTLS && port !== 587) {
        commonIssues.push(
          `STARTTLS typically uses port 587, but you have ${port}`
        );
      }
      if (security === EmailSecurityEnum.NONE && port !== 25 && port !== 587) {
        commonIssues.push(
          `Unencrypted SMTP typically uses port 25 or 587, but you have ${port}`
        );
      }
    }

    if (protocol === EmailProtocolEnum.IMAP) {
      if (security === EmailSecurityEnum.SSL_TLS && port !== 993) {
        commonIssues.push(
          `IMAP SSL/TLS typically uses port 993, but you have ${port}`
        );
      }
      if (security === EmailSecurityEnum.STARTTLS && port !== 143) {
        commonIssues.push(
          `IMAP STARTTLS typically uses port 143, but you have ${port}`
        );
      }
    }

    return {
      isStandardPort,
      expectedPort,
      commonIssues,
      recommendation: !isStandardPort
        ? `Consider using port ${expectedPort} for ${security} with ${protocol}`
        : null,
    };
  };

  const transformDataForBackend = (
    data: EmailSettingsForm
  ): BackendEmailPayload => {
    // Transform the new security enum back to boolean + additional fields for backend compatibility
    const transformedData: BackendEmailPayload = {
      ...data,
      outgoing: {
        ...data.outgoing,
        secure:
          data.outgoing.secure === EmailSecurityEnum.SSL_TLS ||
          data.outgoing.secure === EmailSecurityEnum.STARTTLS,
        securityType: data.outgoing.secure, // Keep the enum for future backend updates
        // For Gmail and other providers that need STARTTLS specifically
        requireTLS: data.outgoing.secure === EmailSecurityEnum.STARTTLS,
      },
      incoming: {
        ...data.incoming,
        secure:
          data.incoming.secure === EmailSecurityEnum.SSL_TLS ||
          data.incoming.secure === EmailSecurityEnum.STARTTLS,
        securityType: data.incoming.secure, // Keep the enum for future backend updates
        // For IMAP/POP3 providers that need STARTTLS specifically
        requireTLS: data.incoming.secure === EmailSecurityEnum.STARTTLS,
      },
    };

    console.log("🚀 ~ transformDataForBackend ~ original:", data);
    console.log("🚀 ~ transformDataForBackend ~ transformed:", transformedData);

    return transformedData;
  };

  const onSubmit = async (data: EmailSettingsForm) => {
    console.log("🚀 ~ onSubmit ~ data:", data);

    // Debug form state
    console.log("🚀 ~ onSubmit ~ form.formState:", form.formState);
    console.log(
      "🚀 ~ onSubmit ~ form.formState.errors:",
      form.formState.errors
    );
    console.log(
      "🚀 ~ onSubmit ~ form.formState.isValid:",
      form.formState.isValid
    );

    // Validate port/security combinations and warn user
    if (data.outgoing.enabled) {
      const outgoingValidation = validatePortSecurityCombination(
        data.outgoing.protocol,
        data.outgoing.secure,
        data.outgoing.port
      );
      console.log("🚀 ~ onSubmit ~ outgoing validation:", outgoingValidation);

      if (outgoingValidation.commonIssues.length > 0) {
        const proceed = confirm(
          `Configuration Warning for Outgoing Email:\n\n${outgoingValidation.commonIssues.join(
            "\n"
          )}\n\n${
            outgoingValidation.recommendation
          }\n\nDo you want to continue anyway?`
        );
        if (!proceed) return;
      }
    }

    if (data.incoming.enabled) {
      const incomingValidation = validatePortSecurityCombination(
        data.incoming.protocol,
        data.incoming.secure,
        data.incoming.port
      );
      console.log("🚀 ~ onSubmit ~ incoming validation:", incomingValidation);

      if (incomingValidation.commonIssues.length > 0) {
        const proceed = confirm(
          `Configuration Warning for Incoming Email:\n\n${incomingValidation.commonIssues.join(
            "\n"
          )}\n\n${
            incomingValidation.recommendation
          }\n\nDo you want to continue anyway?`
        );
        if (!proceed) return;
      }
    }

    try {
      console.log("🚀 ~ onSubmit ~ Calling saveEmailMutation.mutateAsync");
      console.log(
        "🚀 ~ onSubmit ~ Data being sent to backend:",
        JSON.stringify(data, null, 2)
      );

      // Transform data for backend compatibility
      const transformedData = transformDataForBackend(data);

      // Temporary type cast for backend compatibility until backend supports EmailSecurityEnum
      const savedSettings = await saveEmailMutation.mutateAsync(
        transformedData as unknown as Partial<EmailSettings>
      );
      console.log("🚀 ~ onSubmit ~ savedSettings:", savedSettings);

      if (savedSettings && onSuccess) {
        onSuccess(savedSettings);
      }
      toast.success("Email settings saved successfully!");
    } catch (error) {
      console.error("Failed to save email settings:", error);
      toast.error(
        `Failed to save email settings: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("🚀 ~ handleFormSubmit ~ triggered");

    // Check if form is valid
    const isValid = await form.trigger();
    console.log("🚀 ~ handleFormSubmit ~ isValid:", isValid);
    console.log("🚀 ~ handleFormSubmit ~ errors:", form.formState.errors);

    if (isValid) {
      const data = form.getValues();
      console.log("🚀 ~ handleFormSubmit ~ form data:", data);
      await onSubmit(data);
    } else {
      toast.error("Please fix the validation errors before submitting.");
    }
  };

  const handleTestConnection = async () => {
    const outgoingEnabled = form.watch("outgoing.enabled");
    const incomingEnabled = form.watch("incoming.enabled");

    // If no sections are enabled, show an error
    if (!outgoingEnabled && !incomingEnabled) {
      toast.error(
        "Please enable at least one email engine (Outgoing or Incoming) to test the connection"
      );
      return;
    }

    // Use Zod validation - the proper way!
    const isValid = await form.trigger();
    console.log("🚀 ~ handleTestConnection ~ isValid:", isValid);

    if (isValid) {
      await testConnection();
    } else {
      toast.error(
        "Please fix the validation errors before testing the connection"
      );
    }
  };

  if (outgoingLoading || incomingLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-6">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="ml-2">Loading email settings...</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Email Engine Configuration
        </CardTitle>
        <CardDescription>
          Configure your outgoing and incoming email engines for notifications
          and ticket processing
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Form {...form}>
          <form onSubmit={handleFormSubmit} className="space-y-6">
            <Tabs defaultValue="outgoing" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger
                  value="outgoing"
                  className="flex items-center gap-2"
                >
                  <Send className="h-4 w-4" />
                  Outgoing Engine
                </TabsTrigger>
                <TabsTrigger
                  value="incoming"
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Incoming Engine
                </TabsTrigger>
              </TabsList>

              <TabsContent value="outgoing" className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base font-semibold">
                        Outgoing Email Engine
                      </Label>
                      <p className="text-sm text-gray-600">
                        Configure settings for sending emails
                      </p>
                    </div>
                    <FormField
                      control={form.control}
                      name="outgoing.enabled"
                      render={({ field }) => (
                        <FormItem>
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

                  {form.watch("outgoing.enabled") && (
                    <div className="space-y-6">
                      {/* Basic Settings */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Basic Settings</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <FormField
                            control={form.control}
                            name="outgoing.protocol"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>
                                  Protocol{" "}
                                  <span className="text-xs text-red-600 font-medium">
                                    (Required)
                                  </span>
                                </FormLabel>
                                <Select
                                  value={field.value}
                                  onValueChange={(value: EmailProtocolEnum) => {
                                    field.onChange(value);
                                    handleProtocolChange(value, "outgoing");
                                  }}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {OUTGOING_PROTOCOL_OPTIONS.map((option) => (
                                      <SelectItem
                                        key={option.value}
                                        value={option.value}
                                      >
                                        {option.label}
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
                            name="outgoing.host"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>
                                  Host{" "}
                                  <span className="text-xs text-red-600 font-medium">
                                    (Required)
                                  </span>
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    placeholder="smtp.gmail.com"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="outgoing.port"
                            render={({ field }) => {
                              const protocol = form.watch("outgoing.protocol");
                              const security = form.watch("outgoing.secure");
                              // const validation = validatePortSecurityCombination(protocol, security, field.value);

                              return (
                                <FormItem>
                                  <FormLabel>
                                    Port{" "}
                                    <span className="text-xs text-red-600 font-medium">
                                      (Required)
                                    </span>
                                  </FormLabel>
                                  <FormControl>
                                    <div className="relative">
                                      <Input
                                        type="number"
                                        {...field}
                                        onChange={(e) =>
                                          field.onChange(Number(e.target.value))
                                        }
                                      />
                                    </div>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              );
                            }}
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="outgoing.secure"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>
                                  Security{" "}
                                  <span className="text-xs text-red-600 font-medium">
                                    (Required)
                                  </span>
                                </FormLabel>
                                <Select
                                  value={field.value}
                                  onValueChange={(value: EmailSecurityEnum) => {
                                    field.onChange(value);
                                    handleSecurityChange(value, "outgoing");
                                  }}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {SECURITY_OPTIONS.map((option) => (
                                      <SelectItem
                                        key={option.value}
                                        value={option.value}
                                      >
                                        {option.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormDescription>
                                  {field.value === EmailSecurityEnum.SSL_TLS &&
                                    "Recommended for most email providers"}
                                  {field.value === EmailSecurityEnum.STARTTLS &&
                                    "Common for SMTP servers like Gmail"}
                                  {field.value === EmailSecurityEnum.NONE &&
                                    "⚠️ Not recommended - data will be sent unencrypted"}
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      {/* Authentication */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Authentication</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="outgoing.username"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>
                                  Username{" "}
                                  <span className="text-xs text-red-600 font-medium">
                                    (Required)
                                  </span>
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    placeholder="your-email@gmail.com"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="outgoing.password"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>
                                  Password{" "}
                                  <span className="text-xs text-red-600 font-medium">
                                    (Required)
                                  </span>
                                </FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <Input
                                      {...field}
                                      type={
                                        showOutgoingPassword
                                          ? "text"
                                          : "password"
                                      }
                                      placeholder="App Password or Account Password"
                                    />
                                    <Button
                                      size="sm"
                                      type="button"
                                      variant="ghost"
                                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                      onClick={() =>
                                        setShowOutgoingPassword(
                                          !showOutgoingPassword
                                        )
                                      }
                                    >
                                      {showOutgoingPassword ? (
                                        <EyeOff className="h-4 w-4" />
                                      ) : (
                                        <Eye className="h-4 w-4" />
                                      )}
                                    </Button>
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      {/* Email Settings */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Email Settings</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="outgoing.fromEmail"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>
                                  From Email{" "}
                                  <span className="text-xs text-red-600 font-medium">
                                    (Required)
                                  </span>
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    type="email"
                                    placeholder="noreply@yourdomain.com"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="outgoing.fromName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>
                                  From Name{" "}
                                  <span className="text-xs text-red-600 font-medium">
                                    (Required)
                                  </span>
                                </FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="ITSM System" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={form.control}
                          name="outgoing.replyTo"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                Reply-To Email{" "}
                                <span className="text-xs text-green-600 font-medium">
                                  (Optional)
                                </span>
                              </FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  type="email"
                                  placeholder="support@yourdomain.com"
                                />
                              </FormControl>
                              <FormDescription>
                                Email address where replies should be sent
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Advanced Settings */}
                      <Collapsible
                        open={showAdvancedOutgoing}
                        onOpenChange={setShowAdvancedOutgoing}
                      >
                        <CollapsibleTrigger asChild>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="flex items-center gap-2 p-0"
                          >
                            <Settings2 className="h-4 w-4" />
                            Advanced Settings
                            {showAdvancedOutgoing ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                          </Button>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="space-y-4 pt-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="outgoing.timeout"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>
                                    Timeout (ms){" "}
                                    <span className="text-xs text-green-600 font-medium">
                                      (Optional)
                                    </span>
                                  </FormLabel>
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
                                    Connection timeout in milliseconds
                                    (1000-300000)
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="outgoing.connectionTimeout"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>
                                    Connection Timeout (ms){" "}
                                    <span className="text-xs text-green-600 font-medium">
                                      (Optional)
                                    </span>
                                  </FormLabel>
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
                                    Socket connection timeout in milliseconds
                                    (1000-300000)
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="outgoing.maxConnections"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>
                                    Max Connections{" "}
                                    <span className="text-xs text-green-600 font-medium">
                                      (Optional)
                                    </span>
                                  </FormLabel>
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
                                    Maximum number of concurrent connections
                                    (1-100)
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="outgoing.rateLimitPerSecond"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>
                                    Rate Limit (per second){" "}
                                    <span className="text-xs text-green-600 font-medium">
                                      (Optional)
                                    </span>
                                  </FormLabel>
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
                                    Maximum emails per second (1-1000)
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="incoming" className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base font-semibold">
                        Incoming Email Engine
                      </Label>
                      <p className="text-sm text-gray-600">
                        Configure settings for receiving and processing emails
                      </p>
                    </div>
                    <FormField
                      control={form.control}
                      name="incoming.enabled"
                      render={({ field }) => (
                        <FormItem>
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

                  {form.watch("incoming.enabled") && (
                    <div className="space-y-6">
                      {/* Basic Settings */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Basic Settings</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <FormField
                            control={form.control}
                            name="incoming.protocol"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>
                                  Protocol{" "}
                                  <span className="text-xs text-red-600 font-medium">
                                    (Required)
                                  </span>
                                </FormLabel>
                                <Select
                                  value={field.value}
                                  onValueChange={(value: EmailProtocolEnum) => {
                                    field.onChange(value);
                                    handleProtocolChange(value, "incoming");
                                  }}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {INCOMING_PROTOCOL_OPTIONS.map((option) => (
                                      <SelectItem
                                        key={option.value}
                                        value={option.value}
                                      >
                                        {option.label}
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
                            name="incoming.host"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>
                                  Host{" "}
                                  <span className="text-xs text-red-600 font-medium">
                                    (Required)
                                  </span>
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    placeholder="imap.gmail.com"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="incoming.port"
                            render={({ field }) => {
                              const protocol = form.watch("incoming.protocol");
                              const security = form.watch("incoming.secure");
                              const validation =
                                validatePortSecurityCombination(
                                  protocol,
                                  security,
                                  field.value
                                );

                              return (
                                <FormItem>
                                  <FormLabel>
                                    Port{" "}
                                    <span className="text-xs text-red-600 font-medium">
                                      (Required)
                                    </span>
                                  </FormLabel>
                                  <FormControl>
                                    <div className="relative">
                                      <Input
                                        type="number"
                                        {...field}
                                        onChange={(e) =>
                                          field.onChange(Number(e.target.value))
                                        }
                                        className={
                                          !validation.isStandardPort
                                            ? "border-orange-400"
                                            : ""
                                        }
                                      />
                                      {!validation.isStandardPort && (
                                        <div className="absolute right-2 top-2">
                                          <div
                                            className="w-2 h-2 bg-orange-400 rounded-full"
                                            title="Non-standard port for this security setting"
                                          />
                                        </div>
                                      )}
                                    </div>
                                  </FormControl>
                                  {!validation.isStandardPort && (
                                    <FormDescription className="text-orange-600">
                                      ⚠️ {validation.recommendation}
                                    </FormDescription>
                                  )}
                                  <FormMessage />
                                </FormItem>
                              );
                            }}
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="incoming.secure"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>
                                  Security{" "}
                                  <span className="text-xs text-red-600 font-medium">
                                    (Required)
                                  </span>
                                </FormLabel>
                                <Select
                                  value={field.value}
                                  onValueChange={(value: EmailSecurityEnum) => {
                                    field.onChange(value);
                                    handleSecurityChange(value, "incoming");
                                  }}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {SECURITY_OPTIONS.map((option) => (
                                      <SelectItem
                                        key={option.value}
                                        value={option.value}
                                      >
                                        <div className="flex items-center space-x-2">
                                          <div
                                            className={`p-1 rounded-full ${
                                              option.color === "green"
                                                ? "bg-green-500"
                                                : option.color === "blue"
                                                ? "bg-blue-500"
                                                : "bg-red-500"
                                            }`}
                                          >
                                            {option.icon === "shield-check" ? (
                                              <ShieldCheck className="h-3 w-3 text-white" />
                                            ) : (
                                              <Shield className="h-3 w-3 text-white" />
                                            )}
                                          </div>
                                          <div>
                                            <div className="font-medium">
                                              {option.label}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                              {option.description}
                                            </div>
                                          </div>
                                        </div>
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormDescription>
                                  {field.value === EmailSecurityEnum.SSL_TLS &&
                                    "Recommended for IMAP/POP3 connections"}
                                  {field.value === EmailSecurityEnum.STARTTLS &&
                                    "Upgrade to encryption after connection"}
                                  {field.value === EmailSecurityEnum.NONE &&
                                    "⚠️ Not recommended - data will be sent unencrypted"}
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="incoming.pollInterval"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>
                                  Poll Interval (minutes){" "}
                                  <span className="text-xs text-red-600 font-medium">
                                    (Required)
                                  </span>
                                </FormLabel>
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
                                  How often to check for new emails (1-1440
                                  minutes)
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      {/* Authentication */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Authentication</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="incoming.username"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>
                                  Username{" "}
                                  <span className="text-xs text-red-600 font-medium">
                                    (Required)
                                  </span>
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    placeholder="your-email@gmail.com"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="incoming.password"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>
                                  Password{" "}
                                  <span className="text-xs text-red-600 font-medium">
                                    (Required)
                                  </span>
                                </FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <Input
                                      {...field}
                                      type={
                                        showIncomingPassword
                                          ? "text"
                                          : "password"
                                      }
                                      placeholder="App Password or Account Password"
                                    />
                                    <Button
                                      size="sm"
                                      type="button"
                                      variant="ghost"
                                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                      onClick={() =>
                                        setShowIncomingPassword(
                                          !showIncomingPassword
                                        )
                                      }
                                    >
                                      {showIncomingPassword ? (
                                        <EyeOff className="h-4 w-4" />
                                      ) : (
                                        <Eye className="h-4 w-4" />
                                      )}
                                    </Button>
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      {/* Processing Settings */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">
                          Processing Settings
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="incoming.autoProcessIncidents"
                            render={({ field }) => (
                              <FormItem className="flex items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                  <FormLabel className="text-base">
                                    Auto Process Incidents{" "}
                                    <span className="text-xs text-green-600 font-medium">
                                      (Optional)
                                    </span>
                                  </FormLabel>
                                  <FormDescription>
                                    Automatically create incidents from emails
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

                          <FormField
                            control={form.control}
                            name="incoming.defaultPriority"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>
                                  Default Priority{" "}
                                  <span className="text-xs text-red-600 font-medium">
                                    (Required)
                                  </span>
                                </FormLabel>
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

                        <FormField
                          control={form.control}
                          name="incoming.autoAssignTo"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                Auto Assign To{" "}
                                <span className="text-xs text-green-600 font-medium">
                                  (Optional)
                                </span>
                              </FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  placeholder="User ID or email"
                                />
                              </FormControl>
                              <FormDescription>
                                Automatically assign created incidents to this
                                user
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>

            <Separator />

            {/* Provider Configuration Guide */}
            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                <strong>📧 Common Email Provider Settings:</strong>
                <br />
                <strong>Gmail:</strong> SMTP: smtp.gmail.com:587 (STARTTLS) or
                :465 (SSL/TLS) | IMAP: imap.gmail.com:993 (SSL/TLS)
                <br />
                <strong>Outlook:</strong> SMTP: smtp-mail.outlook.com:587
                (STARTTLS) | IMAP: outlook.office365.com:993 (SSL/TLS)
                <br />
                <strong>Yahoo:</strong> SMTP: smtp.mail.yahoo.com:587 (STARTTLS)
                | IMAP: imap.mail.yahoo.com:993 (SSL/TLS)
                <br />
                <br />
                <strong>⚠️ SSL Error Fix:</strong> "wrong version number"
                usually means port/security mismatch. Use the{" "}
                <strong>Diagnose Config</strong> button below for help.
              </AlertDescription>
            </Alert>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <Button
                size="sm"
                type="submit"
                disabled={
                  outgoingLoading ||
                  incomingLoading ||
                  saveEmailMutation.isPending
                }
                onClick={() => console.log("🚀 ~ Submit button clicked")}
              >
                {(outgoingLoading ||
                  incomingLoading ||
                  saveEmailMutation.isPending) && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {saveEmailMutation.isPending
                  ? "Saving..."
                  : "Save Configuration"}
              </Button>

              <Button
                size="sm"
                type="button"
                variant="outline"
                onClick={async () => {
                  console.log("🚀 ~ Manual submit button clicked");
                  const data = form.getValues();
                  console.log("🚀 ~ Manual submit ~ form data:", data);
                  console.log(
                    "🚀 ~ Manual submit ~ form errors:",
                    form.formState.errors
                  );
                  const isValid = await form.trigger();
                  console.log("🚀 ~ Manual submit ~ isValid:", isValid);
                  if (!isValid) {
                    toast.error(
                      "Form validation failed. Check console for details."
                    );
                    return;
                  }
                  await onSubmit(data);
                }}
                disabled={saveEmailMutation.isPending}
              >
                Debug Submit
              </Button>

              <Button
                size="sm"
                type="button"
                variant="ghost"
                onClick={() => {
                  console.log("🚀 ~ Form Debug Info:");
                  console.log("- Form values:", form.getValues());
                  console.log("- Form errors:", form.formState.errors);
                  console.log(
                    "- Form dirty fields:",
                    form.formState.dirtyFields
                  );
                  console.log("- Form is valid:", form.formState.isValid);
                  console.log(
                    "- Outgoing enabled:",
                    form.watch("outgoing.enabled")
                  );
                  console.log(
                    "- Incoming enabled:",
                    form.watch("incoming.enabled")
                  );
                }}
              >
                Debug Info
              </Button>

              <Button
                size="sm"
                type="button"
                variant="ghost"
                onClick={() => {
                  const values = form.getValues();
                  let diagnostics = "📧 Email Configuration Diagnostics:\n\n";

                  if (values.outgoing.enabled) {
                    const outValidation = validatePortSecurityCombination(
                      values.outgoing.protocol,
                      values.outgoing.secure,
                      values.outgoing.port
                    );
                    diagnostics += `🔗 OUTGOING:\n`;
                    diagnostics += `- Protocol: ${values.outgoing.protocol}\n`;
                    diagnostics += `- Security: ${values.outgoing.secure}\n`;
                    diagnostics += `- Port: ${values.outgoing.port}\n`;
                    diagnostics += `- Expected Port: ${outValidation.expectedPort}\n`;
                    diagnostics += `- Standard Config: ${
                      outValidation.isStandardPort ? "Yes ✅" : "No ⚠️"
                    }\n`;
                    if (outValidation.recommendation) {
                      diagnostics += `- Recommendation: ${outValidation.recommendation}\n`;
                    }
                    diagnostics += `\n`;
                  }

                  if (values.incoming.enabled) {
                    const inValidation = validatePortSecurityCombination(
                      values.incoming.protocol,
                      values.incoming.secure,
                      values.incoming.port
                    );
                    diagnostics += `📥 INCOMING:\n`;
                    diagnostics += `- Protocol: ${values.incoming.protocol}\n`;
                    diagnostics += `- Security: ${values.incoming.secure}\n`;
                    diagnostics += `- Port: ${values.incoming.port}\n`;
                    diagnostics += `- Expected Port: ${inValidation.expectedPort}\n`;
                    diagnostics += `- Standard Config: ${
                      inValidation.isStandardPort ? "Yes ✅" : "No ⚠️"
                    }\n`;
                    if (inValidation.recommendation) {
                      diagnostics += `- Recommendation: ${inValidation.recommendation}\n`;
                    }
                  }

                  diagnostics += `\n💡 Common SSL Errors:\n`;
                  diagnostics += `- "wrong version number" = Port/Security mismatch\n`;
                  diagnostics += `- Check if port expects SSL but you're using STARTTLS (or vice versa)\n`;
                  diagnostics += `- Gmail SMTP: Use port 587 with STARTTLS or port 465 with SSL/TLS\n`;

                  alert(diagnostics);
                }}
              >
                Diagnose Config
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
