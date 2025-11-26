"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { FieldErrors, UseFormReturn } from "react-hook-form";
import { Mail, Shield, Lock, User as UserIcon, UserCog } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

import type { Permission } from "@/app/(core)/iam/permissions/interfaces/permission.interface";
import type { Role } from "@/app/(core)/iam/roles/_lib/_types/role.type";
import { useRoles } from "@/app/(core)/iam/roles/_lib/_hooks/useRoles";
import {
  AUTH_SOURCE,
  type AuthSource,
} from "@/app/(core)/iam/users/_lib/_types";
import type { UserSchema } from "@/app/(core)/iam/users/_lib/_schemas";

interface SideBarFormProps {
  form: UseFormReturn<UserSchema>;
  errors: FieldErrors<UserSchema>;
}

// Extracted helper to keep component smaller
const extractErrorMessages = (
  errorObj: unknown,
  path: string = ""
): string[] => {
  if (!errorObj) return [];

  const messages: string[] = [];

  if (
    typeof errorObj === "object" &&
    errorObj !== null &&
    "message" in errorObj &&
    typeof (errorObj as any).message === "string"
  ) {
    const fieldPath = path || "form";
    messages.push(`${fieldPath}: ${(errorObj as any).message}`);
  }

  if (Array.isArray(errorObj)) {
    errorObj.forEach((item, index) => {
      messages.push(...extractErrorMessages(item, `${path}[${index}]`));
    });
  }

  if (
    typeof errorObj === "object" &&
    errorObj !== null &&
    !Array.isArray(errorObj)
  ) {
    Object.entries(errorObj).forEach(([key, value]) => {
      if (key === "message" || key === "__proto__" || key === "constructor")
        return;
      const nestedPath = path ? `${path}.${key}` : key;
      messages.push(...extractErrorMessages(value, nestedPath));
    });
  }

  return messages;
};

const SideBarForm = ({ form, errors }: SideBarFormProps) => {
  const router = useRouter();
  const formData = form.watch(); // live snapshot of form values

  const isLicensed = formData.isLicensed ?? false;
  const selectedRoles = formData.roles ?? ([] as Role[]);
  const directPermissions = formData.permissions ?? ([] as Permission[]);

  const { roles: allRoles } = useRoles();
  // const { permissions: allPermissions } = usePermissionsHook(); // only if needed

  const selectedRoleObjects = useMemo(
    () =>
      allRoles.filter((role: Role) =>
        selectedRoles.some((r) => r.id === role.id)
      ),
    [allRoles, selectedRoles]
  );

  const inheritedPermissions = useMemo(
    () => selectedRoleObjects.flatMap((role: Role) => role.permissions ?? []),
    [selectedRoleObjects]
  );

  const totalPermissionsCount = useMemo(() => {
    const allPermissions = [...directPermissions, ...inheritedPermissions];

    const uniquePermissions = allPermissions.filter(
      (permission, index, self) =>
        index === self.findIndex((p) => p.id === permission.id)
    );

    return uniquePermissions.length;
  }, [directPermissions, inheritedPermissions]);

  const errorMessages = extractErrorMessages(errors);

  return (
    <div className="space-y-6">
      <Card className="sticky top-6">
        <CardHeader>
          <CardTitle className="text-lg">User Preview</CardTitle>
          <CardDescription>Review user details before saving</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <UserIcon className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">
                {formData.displayName || "No display name"}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {formData.email || "No email"}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Username:</span>
              <span className="text-sm text-muted-foreground">
                {formData.username || "-"}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Auth Source:</span>
              <Badge variant="secondary">
                {(formData.authSource as AuthSource) || AUTH_SOURCE.LOCAL}
              </Badge>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Status:</span>
              <Badge variant={formData.isActive ? "default" : "secondary"}>
                {formData.isActive ? "Active" : "Inactive"}
              </Badge>
            </div>

            {formData.authSource === AUTH_SOURCE.LOCAL && (
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {formData.password ? "Password set" : "Password required"}
                </span>
              </div>
            )}

            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Licensed:</span>
              <Badge variant={isLicensed ? "default" : "secondary"}>
                {isLicensed ? "Yes" : "No"}
              </Badge>
            </div>

            {isLicensed && selectedRoleObjects.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <UserCog className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">
                  {selectedRoleObjects.length} role
                  {selectedRoleObjects.length !== 1 ? "s" : ""}
                </span>
                <div className="flex flex-wrap gap-1">
                  {selectedRoleObjects.map((role: Role) => (
                    <Badge key={role.id} variant="outline" className="text-xs">
                      {role.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {isLicensed && (
              <div className="flex flex-wrap items-center gap-2">
                <Shield className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  {totalPermissionsCount} permission
                  {totalPermissionsCount !== 1 ? "s" : ""}
                </span>
                {directPermissions.length > 0 &&
                  inheritedPermissions.length > 0 && (
                    <span className="text-xs text-muted-foreground">
                      ({directPermissions.length} direct,{" "}
                      {inheritedPermissions.length} from roles)
                    </span>
                  )}
              </div>
            )}
          </div>

          {errorMessages.length > 0 && (
            <div className="mb-4 space-y-1">
              {errorMessages.map((msg, i) => (
                <div key={i} className="text-xs font-medium text-destructive">
                  {msg}
                </div>
              ))}
            </div>
          )}

          <Separator />

          <div className="flex flex-row gap-2">
            <Button type="submit" size="sm" className="w-1/2">
              Save
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="w-1/2"
              onClick={() => router.push("/iam/users")}
            >
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SideBarForm;
