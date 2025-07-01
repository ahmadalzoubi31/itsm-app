"use client";

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
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { LdapSettings } from "../types";
import { UseFormReturn } from "react-hook-form";

type Props = {
  form: UseFormReturn<LdapSettings>;
  onSave: (values: LdapSettings) => void;
  isSaving: boolean;
};

export function LdapSettingsForm({ form, onSave, isSaving }: Props) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSave)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                <FormDescription>
                  The hostname or IP address of your LDAP server
                </FormDescription>
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
                <FormDescription>
                  Default LDAP port is 389 (636 for LDAPS)
                </FormDescription>
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
                    <SelectItem value="ldap">LDAP</SelectItem>
                    <SelectItem value="ldaps">LDAPS (SSL/TLS)</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>Choose LDAP or LDAPS (secure)</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Base DN */}
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
          {/* Bind DN */}
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
          {/* Bind Password */}
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
                <FormDescription>Password for the bind DN</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Search Filter */}
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
                LDAP search filter to find users (e.g., (objectClass=person))
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Attributes */}
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

        {/* Switches */}
        <FormField
          control={form.control}
          name="useSSL"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg p-4 border">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Use SSL/TLS</FormLabel>
                <FormDescription>
                  Enable secure connection to LDAP server (recommended)
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
                  Verify the LDAP server's SSL certificate (recommended)
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
          <Button type="submit" disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Settings"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
