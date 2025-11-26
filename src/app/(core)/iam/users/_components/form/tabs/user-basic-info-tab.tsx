"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { User as UserIcon, Mail, Lock, Info } from "lucide-react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

import {
  AUTH_SOURCE,
  type AuthSource,
} from "@/app/(core)/iam/users/_lib/_types";
import type { UseFormReturn } from "react-hook-form";
import type { UserSchema } from "@/app/(core)/iam/users/_lib/_schemas";

interface UserBasicInfoProps {
  form: UseFormReturn<UserSchema>;
  isEdit?: boolean;
}

const UserBasicInfo = ({ form, isEdit }: UserBasicInfoProps) => {
  const authSource = form.watch("authSource") as AuthSource | undefined;

  const isLocal = authSource === AUTH_SOURCE.LOCAL || authSource === undefined;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserIcon className="h-5 w-5" />
          Personal Information
        </CardTitle>
        <CardDescription>
          Enter the user's personal details and contact information
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <Separator />

        <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input
                    placeholder="jdoe"
                    autoComplete="username"
                    maxLength={80}
                    {...field}
                    disabled={isEdit}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="displayName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Display Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" maxLength={150} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  <Mail className="inline h-4 w-4" /> Email Address (Optional)
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="john.doe@company.com"
                    maxLength={150}
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormItem>
            <FormLabel className="flex items-center gap-2">
              Authentication Source
              <Info className="h-3 w-3 text-muted-foreground" />
            </FormLabel>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-sm">
                {authSource === AUTH_SOURCE.LDAP ? "LDAP" : "Local"}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {authSource === AUTH_SOURCE.LDAP
                  ? "Set automatically for LDAP users"
                  : "Set automatically for manually created users"}
              </span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              This field is automatically determined by the system
            </p>
          </FormItem>
        </div>

        {isLocal && (
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  <Lock className="inline h-4 w-4" /> Password
                </FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="SecurePass123!"
                    autoComplete="new-password"
                    {...field}
                  />
                </FormControl>
                <p className="text-sm text-muted-foreground">
                  Must be at least 8 characters with uppercase, lowercase, and a
                  number/special character.
                </p>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="externalId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>External ID (Optional)</FormLabel>
              <FormControl>
                <Input
                  placeholder="AD GUID (for LDAP users)"
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
              <p className="text-sm text-muted-foreground">
                External identifier for LDAP users
              </p>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
};

export default UserBasicInfo;
