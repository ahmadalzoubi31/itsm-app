"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Shield, Loader2 } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";

import { useRoles } from "@/app/(core)/iam/roles/_lib/_hooks/useRoles";
import type { Role } from "@/app/(core)/iam/roles/_lib/_types/role.type";
import type { UserSchema } from "@/app/(core)/iam/users/_lib/_schemas";

interface UserRolesProps {
  form: UseFormReturn<UserSchema>;
}

const UserRoles = ({ form }: UserRolesProps) => {
  const { roles, isLoading } = useRoles();

  const selectedRoles = form.watch("roles") ?? ([] as Role[]);

  const handleRoleToggle = (role: Role) => {
    const exists = selectedRoles.some((r) => r.id === role.id);

    const nextRoles = exists
      ? selectedRoles.filter((r) => r.id !== role.id)
      : [...selectedRoles, role];

    form.setValue("roles", nextRoles, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          User Roles
        </CardTitle>
        <CardDescription>
          Assign roles to the user. Role permissions will be inherited and shown
          in the Permissions tab.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <Separator />

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : roles.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">
            No roles available
          </div>
        ) : (
          <div className="space-y-4">
            {roles
              .filter((role) => role.key !== "end_user")
              .map((role) => {
                const checked = selectedRoles.some((r) => r.id === role.id);

                return (
                  <FormField
                    key={role.id}
                    control={form.control}
                    name="roles"
                    render={() => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={checked}
                            onCheckedChange={() => handleRoleToggle(role)}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="cursor-pointer font-medium">
                            {role.name}
                          </FormLabel>
                          {role.description && (
                            <p className="text-sm text-muted-foreground">
                              {role.description}
                            </p>
                          )}
                        </div>
                      </FormItem>
                    )}
                  />
                );
              })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UserRoles;
