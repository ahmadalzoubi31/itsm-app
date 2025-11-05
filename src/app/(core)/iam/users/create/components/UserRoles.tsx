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
import { useRoles } from "../../../roles/hooks/useRoles";
import { Role } from "../../../roles/interfaces/role.interface";

type Props = {
  form: UseFormReturn<any>;
};

export default function UserRoles({ form }: Props) {
  const { roles, isLoading, error } = useRoles();

  const selectedRoles = form.watch("roles") || [];

  const handleRoleToggle = (role: Role) => {
    const currentRoles: Role[] = form.getValues("roles") || [];
    const isAdding = !currentRoles.some((r: Role) => r.id === role.id);

    const newRoles = isAdding
      ? [...currentRoles, role]
      : currentRoles.filter((r: Role) => r.id !== role.id);

    form.setValue("roles", newRoles);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          User Roles
        </CardTitle>
        <CardDescription>
          Assign roles to the user. Role permissions will be automatically
          inherited and shown in the Permissions tab.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Separator />
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : roles.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No roles available
          </div>
        ) : (
          <div className="space-y-4">
            {roles
              .filter((role) => role.key !== "end_user")
              .map((role) => (
                <FormField
                  key={role.id}
                  control={form.control}
                  name="roles"
                  render={() => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={selectedRoles.some(
                            (r: Role) => r.id === role.id
                          )}
                          onCheckedChange={() => handleRoleToggle(role)}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="font-medium cursor-pointer">
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
              ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
