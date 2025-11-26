"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Settings } from "lucide-react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

import type { UseFormReturn } from "react-hook-form";
import type { UserSchema } from "@/app/(core)/iam/users/_lib/_schemas";

interface UserSettingsProps {
  form: UseFormReturn<UserSchema>;
}

const UserSettings = ({ form }: UserSettingsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Account Settings
        </CardTitle>
        <CardDescription>
          Configure user account status. Licensing controls visibility of Roles
          and Permissions tabs.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <Separator />

        {/* Account Status */}
        <FormField
          control={form.control}
          name="isActive"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel>Account Status</FormLabel>
                <div className="text-sm text-muted-foreground">
                  {field.value
                    ? "User account is active and can log in"
                    : "User account is inactive and cannot log in"}
                </div>
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

        {/* License Toggle */}
        <FormField
          control={form.control}
          name="isLicensed"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel>Licensed Account</FormLabel>
                <div className="text-sm text-muted-foreground">
                  {field.value
                    ? "User is licensed and can access system features"
                    : "User is not licensed — roles & permissions will be hidden"}
                </div>
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
      </CardContent>
    </Card>
  );
};

export default UserSettings;
