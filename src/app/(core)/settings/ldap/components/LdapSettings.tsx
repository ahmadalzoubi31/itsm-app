"use client";

import { toast } from "sonner";
import {
  CheckCircle,
  XCircle,
  TestTube,
  PlayCircle,
  Badge,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ldapSchema } from "../validations/ldap.schema";
import { useLdapSettings, useSaveLdapSettings } from "../hooks/useLdapSettings";
import {
  useLdapConnectionTest,
  useLdapSampleUsers,
} from "../hooks/useLdapLdapActions";
import { LdapSettings } from "../types";
import { LdapJsonModal } from "./SamplePreview";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@radix-ui/react-select";
import { Separator } from "@radix-ui/react-separator";
import { Switch } from "@radix-ui/react-switch";
import { showSample } from "../services/ldap.service";

export function LdapSettingsPage() {
  // Hooks for data
  const { data: ldapSettings, isLoading } = useLdapSettings();
  const saveLdapMutation = useSaveLdapSettings();
  const testConnectionMutation = useLdapConnectionTest();

  // Local UI state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sampleUsers, setSampleUsers] = useState<any[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<
    "connected" | "disconnected" | "testing"
  >("disconnected");

  // Form setup
  const form = useForm<LdapSettings>({
    resolver: zodResolver(ldapSchema),
    defaultValues: DEFAULT_LDAP_SETTINGS,
  });

  // When LDAP settings loaded, reset form
  useEffect(() => {
    if (ldapSettings) {
      form.reset(ldapSettings);
    }
  }, [ldapSettings]);

  // Connection status based on test result
  useEffect(() => {
    const status = localStorage.getItem("ldapTestingResult") as
      | "connected"
      | "disconnected"
      | null;
    if (status) setConnectionStatus(status);
  }, [ldapSettings]);

  // Save settings
  const onSave = (values: LdapSettings) => {
    saveLdapMutation.mutate(values, {
      onSuccess: () => {
        toast.success("Settings saved successfully");
      },
      onError: (error: any) => {
        toast.error(error?.message || "Failed to save");
      },
    });
  };

  // Test connection
  const onTest = (values: LdapSettings) => {
    setConnectionStatus("testing");
    testConnectionMutation.mutate(values, {
      onSuccess: (res) => {
        setConnectionStatus("connected");
        toast.success("Connection successful");
        localStorage.setItem("ldapTestingResult", "connected");
      },
      onError: (error: any) => {
        setConnectionStatus("disconnected");
        toast.error(error?.message || "Connection failed");
        localStorage.setItem("ldapTestingResult", "disconnected");
      },
    });
  };

  // Preview sample users
  const handlePreviewSample = async () => {
    try {
      const { data } = await showSample();
      if (!data) throw new Error("Failed to show sample");
      setSampleUsers(data);
      setIsModalOpen(true);
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  // Watch form values for "Test Connection"
  const currentValues = form.watch();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              LDAP Server Configuration
              {connectionStatus === "connected" && (
                <Badge className="bg-green-500">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Connected
                </Badge>
              )}
              {connectionStatus === "disconnected" && (
                <Badge variant="destructive">
                  <XCircle className="w-3 h-3 mr-1" />
                  Disconnected
                </Badge>
              )}
              {connectionStatus === "testing" && (
                <Badge variant="secondary">
                  <TestTube className="w-3 h-3 mr-1" />
                  Testing...
                </Badge>
              )}
            </CardTitle>
            <div className="flex items-center gap-2 justify-end">
              <Button
                variant="outline"
                onClick={handlePreviewSample}
                disabled={testConnectionMutation.isPending}
              >
                <PlayCircle className="w-3 h-3 mr-1" />
                Preview Sample
              </Button>
              <Button
                onClick={() => onTest(currentValues)}
                disabled={testConnectionMutation.isPending}
              >
                Test Connection
              </Button>
            </div>
          </div>
          <CardDescription>
            Configure your Active Directory LDAP server
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <LdapJsonModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            users={sampleUsers}
          />
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSave)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="server"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>LDAP Server</FormLabel>
                      <FormControl>
                        <Input placeholder="ldap.example.com" {...field} />
                      </FormControl>
                      <FormDescription>
                        The hostname or IP address of your LDAP server
                      </FormDescription>
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
                        <Input type="number" placeholder="389" {...field} />
                      </FormControl>
                      <FormDescription>
                        Default LDAP port is 389 (636 for LDAPS)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="protocol"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Protocol</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a protocol" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="ldap">LDAP</SelectItem>
                          <SelectItem value="ldaps">LDAPS (SSL/TLS)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Choose LDAP or LDAPS (secure)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="baseDn"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Base DN</FormLabel>
                      <FormControl>
                        <Input placeholder="dc=example,dc=com" {...field} />
                      </FormControl>
                      <FormDescription>
                        Base distinguished name for LDAP searches
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="bindDn"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bind DN</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="cn=admin,dc=example,dc=com"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormDescription>
                        Leave empty for anonymous bind
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="bindPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bind Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormDescription>
                        Password for the bind DN
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="searchFilter"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Search Filter</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="(objectClass=*)"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormDescription>
                      LDAP search filter to find users (e.g.,
                      (objectClass=person))
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="attributes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Attributes</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="cn,mail,displayName,givenName,sn,userPrincipalName"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Comma-separated list of attributes to fetch
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="useSSL"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg p-4 border">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Use SSL/TLS</FormLabel>
                      <FormDescription>
                        Enable secure connection to LDAP server (recommended for
                        production)
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
                name="validateCert"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg p-4 border">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Validate Certificate
                      </FormLabel>
                      <FormDescription>
                        Verify the LDAP server's SSL certificate (recommended
                        for production)
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={!form.watch("useSSL")}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <Separator />
              <div className="flex justify-end">
                <Button type="submit" disabled={saveLdapMutation.isPending}>
                  {saveLdapMutation.isPending ? "Saving..." : "Save Settings"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
