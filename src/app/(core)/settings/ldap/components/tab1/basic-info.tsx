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
import { useForm, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useGetBasicInfo, useTestBasicInfo } from "../../hooks/useLdap";
import { BasicInfoForm } from "./basic-info-form";
import { LdapJsonModal } from "./SamplePreview";
import { showSample } from "../../services/ldap.service";
import { ldapSchema } from "../../validations/ldap.schema";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import z from "zod";
import { SearchScopeEnum } from "@/lib/types/globals";
import { ProtocolEnum } from "../../constants/protocol.constant";
import { BasicInfo } from "../../types";

const BasicInfoPage = () => {
  // Data hooks
  const { data: ldapSettings, isLoading } = useGetBasicInfo();

  const testConnectionMutation = useTestBasicInfo();

  // UI state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sampleUsers, setSampleUsers] = useState<any[]>([]);

  // Form setup
  const form = useForm<z.infer<typeof ldapSchema>>({
    resolver: zodResolver(ldapSchema) as Resolver<z.infer<typeof ldapSchema>>,
    defaultValues: {
      server: "",
      port: 389,
      protocol: ProtocolEnum.LDAP,
      baseDN: "",
      bindDN: "",
      bindPassword: "",
      userSearchBase: "",
      userSearchFilter: "(objectClass=user)",
      userSearchScope: SearchScopeEnum.SUBTREE,
      attributes: {},
      isEnabled: true,
      secureConnection: false,
      allowSelfSignedCert: false,
      groupMappings: {},
      roleMappings: {},
      syncIntervalMinutes: 300,
      autoSync: true,
      deactivateRemovedUsers: false,
      connectionTimeout: 5000,
      pageSizeLimit: 1000,
      name: "",
    },
  });

  // Reset form with loaded settings
  useEffect(() => {
    if (ldapSettings && ldapSettings?.length! > 0) {
      const settings = ldapSettings[0];
      form.setValue("name", settings.name || "");
      form.setValue("server", settings.server || "");
      form.setValue("port", settings.port || 389);
      // Convert protocol to lowercase for form (backend sends lowercase)
      form.setValue("protocol", (settings.protocol || "ldap").toLowerCase());
      form.setValue("baseDN", settings.baseDN || "");
      form.setValue("bindDN", settings.bindDN || "");
      form.setValue("bindPassword", settings.bindPassword || "");
      form.setValue("userSearchBase", settings.userSearchBase || "");
      form.setValue(
        "userSearchFilter",
        settings.userSearchFilter || "(objectClass=user)"
      );
      // Convert userSearchScope from backend format (lowercase) to form format
      // Backend sends lowercase ("sub", "one", "base")
      // Form stores as string matching SEARCH_SCOPES values ("SUB", "ONE_LEVEL", "BASE")
      const scope = settings.userSearchScope || "sub";
      const scopeMap: Record<string, string> = {
        sub: "SUB", // Map to SUB to match SEARCH_SCOPES constant used in Select
        one: "ONE_LEVEL",
        base: "BASE",
      };
      form.setValue("userSearchScope", scopeMap[scope.toLowerCase()] || "SUB");
      form.setValue("attributes", settings.attributes || {});
      form.setValue("isEnabled", settings.isEnabled ?? true);
      form.setValue("groupMappings", settings.groupMappings || {});
      form.setValue("roleMappings", settings.roleMappings || {});
      form.setValue("secureConnection", settings.secureConnection ?? false);
      form.setValue(
        "allowSelfSignedCert",
        settings.allowSelfSignedCert ?? false
      );
      // form.setValue("syncIntervalMinutes", se ?? 300);
      // form.setValue("autoSync", settings.autoSync ?? true);
      form.setValue(
        "deactivateRemovedUsers",
        settings.deactivateRemovedUsers ?? false
      );
      form.setValue("connectionTimeout", settings.connectionTimeout ?? 5000);
      form.setValue("pageSizeLimit", settings.pageSizeLimit ?? 1000);
    }
  }, [ldapSettings]);

  // Test connection
  const onTest = () => {
    const formValues = form.getValues() as Partial<BasicInfo>;
    // Include config ID if available
    const configId =
      ldapSettings && ldapSettings.length > 0 ? ldapSettings[0].id : undefined;

    const testPayload = {
      ...formValues,
      ...(configId && { id: configId }),
    };

    const promise = () =>
      new Promise((resolve, reject) =>
        testConnectionMutation.mutate(testPayload, {
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
      // Use config ID from loaded settings if available, otherwise use form values
      const configId =
        ldapSettings && ldapSettings.length > 0
          ? ldapSettings[0].id
          : undefined;

      // If no saved config exists, we need to save first or use form values
      // For now, try with configId if available
      const data = await showSample(configId);
      if (!data) throw new Error("Failed to show sample");
      setSampleUsers(data);
      setIsModalOpen(true);
    } catch (e: any) {
      toast.error(
        e.message ||
        "Failed to fetch sample users. Please ensure LDAP configuration is saved and valid."
      );
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
                <div
                  key={index}
                  className="flex flex-row items-center justify-between rounded-lg p-4 border"
                >
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
          <div className="flex justify-end px-4 lg:px-8 py-4">
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
                size="sm"
                variant="outline"
                onClick={onPreviewSample}
                disabled={testConnectionMutation.isPending}
              >
                <PlayCircle className="w-3 h-3 mr-1" />
                Preview Sample
              </Button>
              <Button
                size="sm"
                onClick={onTest}
                disabled={
                  testConnectionMutation.isPending ||
                  !(
                    ldapSettings &&
                    ldapSettings.length > 0 &&
                    ldapSettings[0].id
                  )
                }
                title={
                  !(
                    ldapSettings &&
                    ldapSettings.length > 0 &&
                    ldapSettings[0].id
                  )
                    ? "Please save your configuration first before testing"
                    : ""
                }
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
          <BasicInfoForm
            form={form}
            configId={
              ldapSettings && ldapSettings.length > 0
                ? ldapSettings[0].id
                : undefined
            }
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default BasicInfoPage;
