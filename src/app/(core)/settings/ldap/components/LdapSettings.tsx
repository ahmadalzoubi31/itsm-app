"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlayCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  useGetLdapSettings,
  useSaveLdapSettings,
  useTestLdapSettings,
} from "../hooks/useLdap";
import { LdapSettingsForm } from "./LdapSettingsForm";
import { LdapJsonModal } from "./SamplePreview";
import { showSample } from "../services/ldap.service";
import { ldapSchema } from "../validations/ldap.schema";
import { LdapSettings, DEFAULT_LDAP_SETTINGS } from "../types/ldap.types";

export function LdapSettingsPage() {
  // Data hooks
  const { data: ldapSettings } = useGetLdapSettings();
  const saveLdapMutation = useSaveLdapSettings();
  const testConnectionMutation = useTestLdapSettings();

  // UI state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sampleUsers, setSampleUsers] = useState<any[]>([]);
  // const [connectionStatus, setConnectionStatus] = useState<
  //   "connected" | "disconnected" | "testing"
  // >("disconnected");

  // Form setup
  const form = useForm<LdapSettings>({
    resolver: zodResolver(ldapSchema),
    defaultValues: DEFAULT_LDAP_SETTINGS,
  });

  // Reset form with loaded settings
  useEffect(() => {
    if (ldapSettings) {
      form.reset(ldapSettings);
    }
  }, [ldapSettings]);

  // Connection status from localStorage (optional)
  // useEffect(() => {
  //   const status = localStorage.getItem("ldapTestingResult") as
  //     | "connected"
  //     | "disconnected"
  //     | null;
  //   if (status) setConnectionStatus(status);
  // }, [ldapSettings]);

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
  const onTest = () => {
    toast.info("Testing connection...");
    setTimeout(() => {
      testConnectionMutation.mutate(form.getValues(), {
        onSuccess: () => {
          toast.success("Connection successful");
        },
        onError: (error: any) => {
          toast.error(error?.message || "Connection failed");
        },
      });
    }, 3000);
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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              LDAP Server Configuration
              {/* {connectionStatus === "connected" && (
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
              )} */}
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
                onClick={onTest}
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
          <LdapSettingsForm
            form={form}
            onSave={onSave}
            isSaving={saveLdapMutation.isPending}
          />
        </CardContent>
      </Card>
    </div>
  );
}
