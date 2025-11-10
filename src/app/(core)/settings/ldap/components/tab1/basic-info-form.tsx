"use client";

import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { UseFormReturn } from "react-hook-form";
import { PROTOCOLS } from "../../constants/protocol.constant";
import { SEARCH_SCOPES } from "../../constants/search-scope.constant";
import { BasicInfo } from "../../types";
import { ldapSchema } from "../../validations/ldap.schema";
import z from "zod";
import { toast } from "sonner";
import { useSaveBasicInfo } from "../../hooks/useLdap";

type Props = {
  form: UseFormReturn<z.infer<typeof ldapSchema>>;
};

export const BasicInfoForm = ({ form }: Props) => {
  const saveLdapMutation = useSaveBasicInfo();

  // Save settings
  const onSave = () => {
    const values = form.getValues();
    console.log("🚀 ~ onSave ~ values:", values);
    saveLdapMutation.mutate(values, {
      onSuccess: () => {
        toast.success("Settings saved successfully");
      },
      onError: (error: any) => {
        toast.error(error?.message || "Failed to save");
      },
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSave)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Server */}
          <FormField
            control={form.control}
            name="server"
            render={({ field }) => (
              <FormItem>
                <FormLabel>LDAP Server</FormLabel>
                <FormControl>
                  <Input placeholder="ldap.example.com" {...field} />
                </FormControl>
                <FormDescription>The hostname or IP address of your LDAP server</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Port */}
          <FormField
            control={form.control}
            name="port"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Port</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="389" {...field} />
                </FormControl>
                <FormDescription>Default LDAP port is 389 (636 for LDAPS)</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Protocol */}
          <FormField
            control={form.control}
            name="protocol"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Protocol</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a protocol" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={PROTOCOLS[0].value}>{PROTOCOLS[0].label}</SelectItem>
                    <SelectItem value={PROTOCOLS[1].value}>{PROTOCOLS[1].label}</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>Choose LDAP or LDAPS (secure)</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Bind DN */}
          <FormField
            control={form.control}
            name="bindDN"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bind DN</FormLabel>
                <FormControl>
                  <Input placeholder="cn=admin,dc=example,dc=com" {...field} value={field.value || ""} />
                </FormControl>
                <FormDescription>Leave empty for anonymous bind</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Bind Password */}
          <FormField
            control={form.control}
            name="bindPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bind Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} value={field.value || ""} />
                </FormControl>
                <FormDescription>Password for the bind DN</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Search Base */}
          <FormField
            control={form.control}
            name="userSearchBase"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Search Base</FormLabel>
                <FormControl>
                  <Input placeholder="dc=example,dc=com" {...field} value={field.value || ""} />
                </FormControl>
                <FormDescription>Base distinguished name for LDAP searches</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Search Scope */}
          {/* <FormField
            control={form.control}
            name="searchScope"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Search Scope</FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a scope" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={SEARCH_SCOPES[0].value}>{SEARCH_SCOPES[0].label}</SelectItem>
                      <SelectItem value={SEARCH_SCOPES[1].value}>{SEARCH_SCOPES[1].label}</SelectItem>
                      <SelectItem value={SEARCH_SCOPES[2].value}>{SEARCH_SCOPES[2].label}</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormDescription>Default scope is sub (searches all levels)</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          /> */}
          {/* Search Filter */}
          <FormField
            control={form.control}
            name="userSearchFilter"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Search Filter</FormLabel>
                <FormControl>
                  <Input placeholder="(objectClass=*)" {...field} value={field.value || ""} />
                </FormControl>
                <FormDescription>LDAP search filter to find users (e.g., (objectClass=person))</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Attributes */}
        <FormField
          control={form.control}
          name="userNameAttribute"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Attributes</FormLabel>
              <FormControl>
                <Textarea placeholder="cn,mail,displayName,givenName,sn,userPrincipalName" className="min-h-[100px]" {...field} />
              </FormControl>
              <FormDescription>Comma-separated list of attributes to fetch</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Switches */}
        <FormField
          control={form.control}
          name="secureConnection"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg p-4 border">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Use SSL/TLS</FormLabel>
                <FormDescription>Enable secure connection to LDAP server (recommended)</FormDescription>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="allowSelfSignedCert"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg p-4 border">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Validate Certificate</FormLabel>
                <FormDescription>Verify the LDAP server's SSL certificate (recommended)</FormDescription>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} disabled={!form.watch("secureConnection")} />
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};

export default BasicInfoForm;
