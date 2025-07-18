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
} from "../../hooks/useLdap";
import { LdapSettingsForm } from "./LdapSettingsForm";
import { LdapJsonModal } from "./SamplePreview";
import { showSample } from "../../services/ldap.service";
import { ldapSchema } from "../../validations/ldap.schema";
import { LdapSettings } from "../../types";
import { DEFAULT_LDAP_SETTINGS } from "../../constants/default.constant";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

export function LdapSettingsPage() {
  // Data hooks
  const { data: ldapSettings, isLoading } = useGetLdapSettings();
  const saveLdapMutation = useSaveLdapSettings();
  const testConnectionMutation = useTestLdapSettings();

  // UI state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sampleUsers, setSampleUsers] = useState<any[]>([]);

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
    const promise = () =>
      new Promise((resolve, reject) =>
        testConnectionMutation.mutate(form.getValues(), {
          onSuccess: () => {
            resolve("Connection successful");
          },
          onError: (error: any) => {
            reject(error?.message || "Connection failed");
          },
        })
      );

    toast.promise(promise, {
      loading: "Loading...",
      success: (data) => {
        return `${data}`;
      },
      error: (error) => {
        return `${error}`;
      },
    });
  };

  // Preview sample users
  const onPreviewSample = async () => {
    try {
      const { data } = await showSample();
      if (!data) throw new Error("Failed to show sample");
      setSampleUsers(data);
      setIsModalOpen(true);
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  
  // Loading skeleton
  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <Skeleton className="h-6 w-64" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-9 w-32" />
                <Skeleton className="h-9 w-32" />
              </div>
            </div>
            <Skeleton className="h-4 w-96 mt-2" />
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 9 }).map((_, index) => (
                <div key={index} className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-3 w-48" />
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-3 w-48" />
            </div>

            <div className="space-y-4">
              {Array.from({ length: 2 }).map((_, index) => (
                <div key={index} className="flex flex-row items-center justify-between rounded-lg p-4 border">
                  <div className="space-y-0.5">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-3 w-64" />
                  </div>
                  <Skeleton className="h-6 w-11" />
                </div>
              ))}
            </div>
          </CardContent>
          <Separator />
          <div className="flex justify-end px-4 lg:px-6 py-4">
            <Skeleton className="h-9 w-32" />
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              LDAP Server Configuration
            </CardTitle>
            <div className="flex items-center gap-2 justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={onPreviewSample}
                disabled={testConnectionMutation.isPending}
              >
                <PlayCircle className="w-3 h-3 mr-1" />
                Preview Sample
              </Button>
              <Button
                onClick={onTest}
                size="sm"
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
        <Separator />

        <div className="flex justify-end px-4 lg:px-6">
          <Button
            disabled={saveLdapMutation.isPending}
            size="sm"
            onClick={() => onSave(form.getValues())}
          >
            {saveLdapMutation.isPending ? "Saving..." : "Save Settings"}
          </Button>
        </div>
      </Card>
    </div>
  );
}
