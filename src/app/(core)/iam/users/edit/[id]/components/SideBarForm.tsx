"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { User, Mail, Shield, Lock, UserCog } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { FieldErrors, UseFormReturn } from "react-hook-form";
import { UpdateUserDto } from "../../../interfaces/user-dto.interface";
import { Permission } from "../../../../permissions/interfaces/permission.interface";
import { useRolePermissions } from "../../../../roles/hooks/useRolePermissions";
import { useRoles } from "../../../../roles/hooks/useRoles";
import { useMemo } from "react";
import { AuthSource } from "../../../interfaces/user.interface";
import { Role } from "../../../../roles/interfaces/role.interface";

const SideBarForm = ({
  form,
  errors,
}: {
  form: UseFormReturn<any>;
  errors: FieldErrors<UpdateUserDto>;
}) => {
  const router = useRouter();
  const formData = form.watch(); // 👈 this is the live snapshot of form fields!

  // Get selected roles
  const selectedRoles = formData.roles || [];

  // Fetch all roles to get role names
  const { roles: allRoles } = useRoles();

  // Get selected role objects
  const selectedRoleObjects = useMemo(() => {
    return allRoles.filter((role) =>
      selectedRoles.some((r: Role) => r.id === role.id)
    );
  }, [allRoles, selectedRoles]);

  // Fetch role permissions using cached hook
  const { permissions: rolePermissions } = useRolePermissions(selectedRoles);

  // Calculate total unique permissions (direct + inherited from roles)
  const totalPermissionsCount = useMemo(() => {
    const directPermissions = formData.permissions || [];
    const allPermissions = [...directPermissions, ...rolePermissions];

    // Remove duplicates by permission ID
    const uniquePermissions = allPermissions.filter(
      (permission, index, self) =>
        index === self.findIndex((p: Permission) => p.id === permission.id)
    );

    return uniquePermissions.length;
  }, [formData.permissions, rolePermissions]);

  // Extract field errors (handles nested structures and arrays)
  const extractErrorMessages = (errorObj: any, path: string = ""): string[] => {
    if (!errorObj) return [];

    const messages: string[] = [];

    // Handle direct message
    if (typeof errorObj.message === "string") {
      const fieldPath = path || "form";
      messages.push(`${fieldPath}: ${errorObj.message}`);
    }

    // Handle array errors (e.g., permissions array)
    if (Array.isArray(errorObj)) {
      errorObj.forEach((item, index) => {
        if (item && typeof item === "object") {
          messages.push(...extractErrorMessages(item, `${path}[${index}]`));
        }
      });
    }

    // Handle nested object errors
    if (typeof errorObj === "object" && !Array.isArray(errorObj)) {
      Object.entries(errorObj).forEach(([key, value]) => {
        // Skip message as we already handled it
        if (key === "message") return;
        // Skip prototype properties
        if (key === "__proto__" || key === "constructor") return;

        const nestedPath = path ? `${path}.${key}` : key;

        // If it's an error object, extract its message
        if (value && typeof value === "object" && value !== null) {
          const errorValue = value as { message?: string };
          if (errorValue.message) {
            messages.push(`${nestedPath}: ${errorValue.message}`);
          } else {
            // Recursively extract nested errors
            messages.push(...extractErrorMessages(value, nestedPath));
          }
        }
      });
    }

    return messages;
  };

  const errorMessages = extractErrorMessages(errors);

  return (
    <div className="space-y-6">
      {/* Preview Card */}
      <Card className="sticky top-6">
        <CardHeader>
          <CardTitle className="text-lg">User Preview</CardTitle>
          <CardDescription>Review user details before creating</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
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
                {formData.authSource || AuthSource.LOCAL}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Status:</span>
              <Badge variant={formData.isActive ? "default" : "secondary"}>
                {formData.isActive ? "Active" : "Inactive"}
              </Badge>
            </div>
            {formData.authSource === AuthSource.LOCAL && (
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {formData.password ? "Password set" : "Password required"}
                </span>
              </div>
            )}
            {selectedRoleObjects.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                <UserCog className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">
                  {selectedRoleObjects.length} role
                  {selectedRoleObjects.length !== 1 ? "s" : ""}
                </span>
                <div className="flex flex-wrap gap-1">
                  {selectedRoleObjects.map((role) => (
                    <Badge key={role.id} variant="outline" className="text-xs">
                      {role.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            <div className="flex items-center gap-2 flex-wrap">
              <Shield className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                {totalPermissionsCount} permission
                {totalPermissionsCount !== 1 ? "s" : ""}
              </span>
              {formData.permissions?.length > 0 &&
                rolePermissions.length > 0 && (
                  <span className="text-xs text-muted-foreground">
                    ({formData.permissions.length} direct,{" "}
                    {rolePermissions.length} from roles)
                  </span>
                )}
            </div>
          </div>

          {/* Error messages under preview */}
          {errorMessages.length > 0 && (
            <div className="mb-4">
              {errorMessages.map((msg, i) => (
                <div key={i} className="text-destructive text-xs font-medium">
                  {msg}
                </div>
              ))}
            </div>
          )}

          <Separator />

          <div className="flex flex-row gap-2">
            <Button type="submit" size="sm" className="w-1/2">
              {/* <UserPlus className="h-4 w-4 mr-2" /> */}
              Save
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="w-1/2"
              onClick={() => {
                router.push("/iam/users");
              }}
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
