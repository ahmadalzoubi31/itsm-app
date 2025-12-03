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
import z from "zod";
import { Switch } from "@/components/ui/switch";
import { UseFormReturn } from "react-hook-form";
import { PROTOCOLS } from "../../constants/protocol.constant";
import { SEARCH_SCOPES } from "../../constants/search-scope.constant";
import { ldapSchema } from "../../validations/ldap.schema";
import { toast } from "sonner";
import { useSaveBasicInfo } from "../../hooks/useLdap";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Download } from "lucide-react";
import { BasicInfo } from "../../types";

type Props = {
  form: UseFormReturn<z.infer<typeof ldapSchema>>;
  configId?: string; // ID of existing config if updating
};

export const BasicInfoForm = ({ form, configId }: Props) => {
  const saveLdapMutation = useSaveBasicInfo();
  const groupMappings = form.watch("groupMappings") || {};
  const roleMappings = form.watch("roleMappings") || {};
  const attributes = form.watch("attributes") || {};

  // Map search scope enum to backend lowercase values
  const mapScopeToBackend = (scope: string): string => {
    const scopeMap: Record<string, string> = {
      SUB: "sub",
      SUBTREE: "sub", // Handle both SUB and SUBTREE for compatibility
      ONE_LEVEL: "one",
      BASE: "base",
    };
    return scopeMap[scope] || scope.toLowerCase();
  };

  // Map backend lowercase values to form enum (using SUB to match SEARCH_SCOPES)
  const mapScopeFromBackend = (scope: string): string => {
    if (!scope) return "SUB"; // Default to SUB if empty
    const scopeMap: Record<string, string> = {
      sub: "SUB", // Map to SUB to match SEARCH_SCOPES constant
      one: "ONE_LEVEL",
      base: "BASE",
    };
    return scopeMap[scope.toLowerCase()] || "SUB";
  };

  // Save settings
  const onSave = () => {
    const values = form.getValues();

    // Convert to backend format
    const submitValues: any = {
      ...values,
      protocol: values.protocol?.toLowerCase() || "ldap",
      userSearchScope: mapScopeToBackend(values.userSearchScope || "sub"),
    };

    // Handle bindPassword:
    // - For updates (configId exists): password is optional, only send if changed
    // - For creates (no configId): password is required
    if (configId) {
      // Updating existing config - only include password if it's been entered
      if (
        !submitValues.bindPassword ||
        submitValues.bindPassword.trim() === ""
      ) {
        delete submitValues.bindPassword;
      }
    } else {
      // Creating new config - password is required
      // Validation will catch this if empty
    }

    // Remove empty string keys from mappings to avoid validation errors
    const cleanedGroupMappings = submitValues.groupMappings
      ? Object.fromEntries(
          Object.entries(submitValues.groupMappings).filter(
            ([key, value]) =>
              key.trim() !== "" && Array.isArray(value) && value.length > 0
          )
        )
      : undefined;

    const cleanedRoleMappings = submitValues.roleMappings
      ? Object.fromEntries(
          Object.entries(submitValues.roleMappings).filter(
            ([key, value]) =>
              key.trim() !== "" && Array.isArray(value) && value.length > 0
          )
        )
      : undefined;

    const cleanedAttributes = submitValues.attributes
      ? Object.fromEntries(
          Object.entries(submitValues.attributes).filter(
            ([key, value]) => key.trim() !== "" && value !== ""
          )
        )
      : undefined;

    const finalValues = {
      ...submitValues,
      ...(configId && { id: configId }), // Include ID if updating
      groupMappings:
        cleanedGroupMappings && Object.keys(cleanedGroupMappings).length > 0
          ? cleanedGroupMappings
          : undefined,
      roleMappings:
        cleanedRoleMappings && Object.keys(cleanedRoleMappings).length > 0
          ? cleanedRoleMappings
          : undefined,
      attributes:
        cleanedAttributes && Object.keys(cleanedAttributes).length > 0
          ? cleanedAttributes
          : undefined,
    };

    saveLdapMutation.mutate(finalValues as Partial<BasicInfo>, {
      onSuccess: () => {
        toast.success("Settings saved successfully");
      },
      onError: (error: any) => {
        toast.error(error?.message || "Failed to save");
      },
    });
  };

  // Group mappings handlers
  const addGroupMapping = () => {
    const currentMappings = form.getValues("groupMappings") || {};
    form.setValue("groupMappings", {
      ...currentMappings,
      "": [""],
    });
  };

  const removeGroupMapping = (groupName: string) => {
    const currentMappings = form.getValues("groupMappings") || {};
    const newMappings = { ...currentMappings };
    delete newMappings[groupName];
    form.setValue("groupMappings", newMappings);
  };

  const updateGroupMappingName = (oldName: string, newName: string) => {
    const currentMappings = form.getValues("groupMappings") || {};
    const newMappings = { ...currentMappings };
    if (oldName !== newName) {
      newMappings[newName] = newMappings[oldName] || [""];
      delete newMappings[oldName];
    }
    form.setValue("groupMappings", newMappings);
  };

  const updateGroupMappingDNs = (groupName: string, dns: string[]) => {
    const currentMappings = form.getValues("groupMappings") || {};
    form.setValue("groupMappings", {
      ...currentMappings,
      [groupName]: dns,
    });
  };

  const addDNToGroup = (groupName: string) => {
    const currentMappings = form.getValues("groupMappings") || {};
    const currentDNs = currentMappings[groupName] || [];
    updateGroupMappingDNs(groupName, [...currentDNs, ""]);
  };

  const removeDNFromGroup = (groupName: string, index: number) => {
    const currentMappings = form.getValues("groupMappings") || {};
    const currentDNs = currentMappings[groupName] || [];
    updateGroupMappingDNs(
      groupName,
      currentDNs.filter((_, i) => i !== index)
    );
  };

  const updateDN = (groupName: string, index: number, value: string) => {
    const currentMappings = form.getValues("groupMappings") || {};
    const currentDNs = currentMappings[groupName] || [];
    const newDNs = [...currentDNs];
    newDNs[index] = value;
    updateGroupMappingDNs(groupName, newDNs);
  };

  // Role mappings handlers (similar to group mappings)
  const addRoleMapping = () => {
    const currentMappings = form.getValues("roleMappings") || {};
    form.setValue("roleMappings", {
      ...currentMappings,
      "": [""],
    });
  };

  const removeRoleMapping = (roleName: string) => {
    const currentMappings = form.getValues("roleMappings") || {};
    const newMappings = { ...currentMappings };
    delete newMappings[roleName];
    form.setValue("roleMappings", newMappings);
  };

  const updateRoleMappingName = (oldName: string, newName: string) => {
    const currentMappings = form.getValues("roleMappings") || {};
    const newMappings = { ...currentMappings };
    if (oldName !== newName) {
      newMappings[newName] = newMappings[oldName] || [""];
      delete newMappings[oldName];
    }
    form.setValue("roleMappings", newMappings);
  };

  const updateRoleMappingDNs = (roleName: string, dns: string[]) => {
    const currentMappings = form.getValues("roleMappings") || {};
    form.setValue("roleMappings", {
      ...currentMappings,
      [roleName]: dns,
    });
  };

  const addDNToRole = (roleName: string) => {
    const currentMappings = form.getValues("roleMappings") || {};
    const currentDNs = currentMappings[roleName] || [];
    updateRoleMappingDNs(roleName, [...currentDNs, ""]);
  };

  const removeDNFromRole = (roleName: string, index: number) => {
    const currentMappings = form.getValues("roleMappings") || {};
    const currentDNs = currentMappings[roleName] || [];
    updateRoleMappingDNs(
      roleName,
      currentDNs.filter((_, i) => i !== index)
    );
  };

  const updateRoleDN = (roleName: string, index: number, value: string) => {
    const currentMappings = form.getValues("roleMappings") || {};
    const currentDNs = currentMappings[roleName] || [];
    const newDNs = [...currentDNs];
    newDNs[index] = value;
    updateRoleMappingDNs(roleName, newDNs);
  };

  // Attributes handlers
  const addAttribute = () => {
    const currentAttrs = form.getValues("attributes") || {};
    form.setValue("attributes", {
      ...currentAttrs,
      "": "",
    });
  };

  const removeAttribute = (key: string) => {
    const currentAttrs = form.getValues("attributes") || {};
    const newAttrs = { ...currentAttrs };
    delete newAttrs[key];
    form.setValue("attributes", newAttrs);
  };

  const updateAttributeKey = (oldKey: string, newKey: string) => {
    const currentAttrs = form.getValues("attributes") || {};

    if (oldKey === newKey || !newKey.trim()) {
      return; // No change or empty key
    }

    // Preserve order by rebuilding the object
    const entries = Object.entries(currentAttrs);
    const newAttrs: Record<string, string> = {};

    entries.forEach(([key, value]) => {
      if (key === oldKey) {
        // Replace old key with new key at the same position
        newAttrs[newKey] = value;
      } else {
        // Keep other keys in their original order
        newAttrs[key] = value;
      }
    });

    form.setValue("attributes", newAttrs);
  };

  const updateAttributeValue = (key: string, value: string) => {
    const currentAttrs = form.getValues("attributes") || {};
    form.setValue("attributes", {
      ...currentAttrs,
      [key]: value,
    });
  };

  // Import common attributes for user creation
  const importCommonAttributes = () => {
    const currentAttrs = form.getValues("attributes") || {};

    // Common LDAP attributes typically used for user creation
    // Note: sAMAccountName is for Active Directory, uid is for standard LDAP
    const commonAttributes: Record<string, string> = {
      username: "uid", // Use "uid" for standard LDAP (change to "sAMAccountName" for AD)
      email: "mail",
      displayName: "displayName",
      firstName: "givenName",
      lastName: "sn",
      department: "department",
      title: "title",
      phone: "telephoneNumber",
      mobile: "mobile",
      manager: "manager",
      employeeId: "employeeID",
      cn: "cn", // Add cn as it's commonly used
    };

    // Merge with existing attributes, only add if not already present
    const mergedAttrs = { ...currentAttrs };
    Object.entries(commonAttributes).forEach(([logicalName, ldapAttr]) => {
      // Only add if the logical name doesn't already exist
      if (!mergedAttrs[logicalName]) {
        mergedAttrs[logicalName] = ldapAttr;
      }
    });

    form.setValue("attributes", mergedAttrs);
    toast.success(
      `Imported ${Object.keys(commonAttributes).length} common attributes`
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSave)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Name */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Configuration Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="LDAP Configuration"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormDescription>
                  A descriptive name for this LDAP configuration
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

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
                  <Input
                    type="number"
                    placeholder="389"
                    {...field}
                    value={field.value ?? 389}
                    onChange={(e) => {
                      const value = e.target.value;
                      const numValue = value === "" ? 389 : Number(value);
                      field.onChange(isNaN(numValue) ? 389 : numValue);
                    }}
                  />
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
                <Select
                  value={field.value?.toLowerCase() || "ldap"}
                  onValueChange={(value) => field.onChange(value.toLowerCase())}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a protocol" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="ldap">{PROTOCOLS[0].label}</SelectItem>
                    <SelectItem value="ldaps">{PROTOCOLS[1].label}</SelectItem>
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
            name="baseDN"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Base DN</FormLabel>
                <FormControl>
                  <Input
                    placeholder="dc=example,dc=com"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormDescription>
                  Base distinguished name for the LDAP directory
                </FormDescription>
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
                  <Input
                    placeholder="cn=admin,dc=example,dc=com"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormDescription>
                  Distinguished name for LDAP authentication
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
                <FormDescription>
                  Password for the bind DN. Leave empty to keep existing
                  password when updating.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* User Search Base */}
          <FormField
            control={form.control}
            name="userSearchBase"
            render={({ field }) => (
              <FormItem>
                <FormLabel>User Search Base</FormLabel>
                <FormControl>
                  <Input
                    placeholder="ou=users,dc=example,dc=com"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormDescription>
                  Base DN for searching users in LDAP
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* User Search Filter */}
          <FormField
            control={form.control}
            name="userSearchFilter"
            render={({ field }) => (
              <FormItem>
                <FormLabel>User Search Filter</FormLabel>
                <FormControl>
                  <Input
                    placeholder="(objectClass=user)"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormDescription>
                  LDAP filter for finding users (e.g., (objectClass=user))
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* User Search Scope */}
          <FormField
            control={form.control}
            name="userSearchScope"
            render={({ field }) => {
              // Form stores values as "SUB", "ONE_LEVEL", "BASE" (matching SEARCH_SCOPES)
              // If empty or lowercase, map from backend format
              let displayValue = field.value;

              // If value is empty or lowercase (from backend), map it
              if (
                !displayValue ||
                displayValue === displayValue.toLowerCase()
              ) {
                displayValue = mapScopeFromBackend(displayValue || "sub");
                // Update the field value if it was empty/lowercase
                if (displayValue !== field.value) {
                  field.onChange(displayValue);
                }
              }

              return (
                <FormItem>
                  <FormLabel>User Search Scope</FormLabel>
                  <Select
                    value={displayValue || "SUB"}
                    onValueChange={(value) => {
                      // Store the value as-is (SEARCH_SCOPES values: "SUB", "ONE_LEVEL", "BASE")
                      // Conversion to backend format happens only when saving
                      field.onChange(value);
                    }}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a scope" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {SEARCH_SCOPES.map((scope) => (
                        <SelectItem key={scope.value} value={scope.value}>
                          {scope.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Search scope: sub (all levels), one (one level), base (base
                    only)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
        </div>

        {/* Attributes Mapping */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium">LDAP Attributes Mapping</h3>
              <p className="text-sm text-muted-foreground">
                Map LDAP attributes to application fields
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                type="button"
                variant="outline"
                onClick={importCommonAttributes}
              >
                <Download className="w-4 h-4 mr-1" />
                Import Common
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addAttribute}
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Attribute
              </Button>
            </div>
          </div>

          {Object.keys(attributes).length === 0 ? (
            <div className="text-sm text-muted-foreground text-center py-8 border rounded-lg">
              <p className="mb-2">
                No attributes configured. Click "Add Attribute" to create one.
              </p>
              <p className="text-xs">
                Common attributes: cn, uid, givenName, sn, displayName, mail,
                department, title, manager, memberOf, company
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {Object.entries(attributes).map(([key, value], idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 p-3 border rounded-lg"
                >
                  <div className="flex-1 grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-1 block">
                        Application Field
                      </label>
                      <Input
                        placeholder="cn, mail, givenName..."
                        value={key}
                        onChange={(e) => {
                          if (e.target.value !== key) {
                            updateAttributeKey(key, e.target.value);
                          }
                        }}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-1 block">
                        LDAP Attribute
                      </label>
                      <Input
                        placeholder="commonName, email, firstName..."
                        value={value as string}
                        onChange={(e) =>
                          updateAttributeValue(key, e.target.value)
                        }
                      />
                    </div>
                  </div>
                  <Button
                    size="sm"
                    type="button"
                    variant="ghost"
                    onClick={() => removeAttribute(key)}
                    className="mt-5"
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          )}
          <p className="text-xs text-muted-foreground">
            <strong>Common LDAP attributes:</strong> cn (common name), uid (user
            ID), givenName (first name), sn (surname), displayName, mail
            (email), department, title, manager, memberOf (groups), company
          </p>
        </div>

        {/* Group Mappings */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium">Group Mappings</h3>
              <p className="text-sm text-muted-foreground">
                Map LDAP groups to application groups
              </p>
            </div>
            <Button
              size="sm"
              type="button"
              variant="outline"
              onClick={addGroupMapping}
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Mapping
            </Button>
          </div>

          {Object.keys(groupMappings).length === 0 ? (
            <div className="text-sm text-muted-foreground text-center py-8 border rounded-lg">
              No group mappings configured. Click "Add Mapping" to create one.
            </div>
          ) : (
            <div className="space-y-4">
              {Object.entries(groupMappings).map(([groupName, dns], idx) => (
                <div
                  key={`${groupName}-${idx}`}
                  className="border rounded-lg p-4 space-y-3"
                >
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="Application Group Name"
                      value={groupName}
                      onChange={(e) => {
                        if (e.target.value !== groupName) {
                          updateGroupMappingName(groupName, e.target.value);
                        }
                      }}
                      className="flex-1"
                    />
                    <Button
                      size="sm"
                      type="button"
                      variant="ghost"
                      onClick={() => removeGroupMapping(groupName)}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                  <div className="space-y-2 pl-4 border-l-2">
                    <div className="text-xs font-medium text-muted-foreground">
                      LDAP Group DNs:
                    </div>
                    {(dns as string[]).map((dn, dnIdx) => (
                      <div key={dnIdx} className="flex items-center gap-2">
                        <Input
                          placeholder="CN=GroupName,OU=Groups,DC=example,DC=com"
                          value={dn}
                          onChange={(e) =>
                            updateDN(groupName, dnIdx, e.target.value)
                          }
                          className="flex-1"
                        />
                        <Button
                          size="sm"
                          type="button"
                          variant="ghost"
                          onClick={() => removeDNFromGroup(groupName, dnIdx)}
                          disabled={(dns as string[]).length === 1}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      size="sm"
                      type="button"
                      variant="outline"
                      onClick={() => addDNToGroup(groupName)}
                      className="w-full"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add LDAP Group DN
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Role Mappings */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium">Role Mappings</h3>
              <p className="text-sm text-muted-foreground">
                Map LDAP groups to application roles
              </p>
            </div>
            <Button
              size="sm"
              type="button"
              variant="outline"
              onClick={addRoleMapping}
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Mapping
            </Button>
          </div>

          {Object.keys(roleMappings).length === 0 ? (
            <div className="text-sm text-muted-foreground text-center py-8 border rounded-lg">
              No role mappings configured. Click "Add Mapping" to create one.
            </div>
          ) : (
            <div className="space-y-4">
              {Object.entries(roleMappings).map(([roleName, dns], idx) => (
                <div
                  key={`${roleName}-${idx}`}
                  className="border rounded-lg p-4 space-y-3"
                >
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="Application Role Name"
                      value={roleName}
                      onChange={(e) => {
                        if (e.target.value !== roleName) {
                          updateRoleMappingName(roleName, e.target.value);
                        }
                      }}
                      className="flex-1"
                    />
                    <Button
                      size="sm"
                      type="button"
                      variant="ghost"
                      onClick={() => removeRoleMapping(roleName)}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                  <div className="space-y-2 pl-4 border-l-2">
                    <div className="text-xs font-medium text-muted-foreground">
                      LDAP Group DNs:
                    </div>
                    {(dns as string[]).map((dn, dnIdx) => (
                      <div key={dnIdx} className="flex items-center gap-2">
                        <Input
                          placeholder="CN=GroupName,OU=Groups,DC=example,DC=com"
                          value={dn}
                          onChange={(e) =>
                            updateRoleDN(roleName, dnIdx, e.target.value)
                          }
                          className="flex-1"
                        />
                        <Button
                          size="sm"
                          type="button"
                          variant="ghost"
                          onClick={() => removeDNFromRole(roleName, dnIdx)}
                          disabled={(dns as string[]).length === 1}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      size="sm"
                      type="button"
                      variant="outline"
                      onClick={() => addDNToRole(roleName)}
                      className="w-full"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add LDAP Group DN
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Advanced Settings */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Sync Interval Minutes */}
          <FormField
            control={form.control}
            name="syncIntervalMinutes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sync Interval (minutes)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="300"
                    {...field}
                    value={field.value ?? ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      field.onChange(value === "" ? undefined : Number(value));
                    }}
                  />
                </FormControl>
                <FormDescription>
                  Interval between automatic syncs in minutes
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Connection Timeout */}
          <FormField
            control={form.control}
            name="connectionTimeout"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Connection Timeout (ms)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="5000"
                    {...field}
                    value={field.value ?? ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      field.onChange(value === "" ? undefined : Number(value));
                    }}
                  />
                </FormControl>
                <FormDescription>
                  Connection timeout in milliseconds
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Page Size Limit */}
          <FormField
            control={form.control}
            name="pageSizeLimit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Page Size Limit</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="1000"
                    {...field}
                    value={field.value ?? ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      field.onChange(value === "" ? undefined : Number(value));
                    }}
                  />
                </FormControl>
                <FormDescription>
                  Maximum number of results per page
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Switches */}
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="isEnabled"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg p-4 border">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Enable LDAP</FormLabel>
                  <FormDescription>
                    Enable or disable this LDAP configuration
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
            name="secureConnection"
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
            name="allowSelfSignedCert"
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
                    disabled={!form.watch("secureConnection")}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="autoSync"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg p-4 border">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Auto Sync</FormLabel>
                  <FormDescription>
                    Automatically sync users at configured intervals
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value ?? false}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="deactivateRemovedUsers"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg p-4 border">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">
                    Deactivate Removed Users
                  </FormLabel>
                  <FormDescription>
                    Automatically deactivate users removed from LDAP
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value ?? false}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        {/* Staging Mode */}
        <FormField
          control={form.control}
          name="stagingMode"
          render={({ field }) => (
            <FormItem className="rounded-lg p-4 border bg-card">
              <div className="space-y-3">
                <div className="space-y-0.5">
                  <FormLabel className="text-base font-semibold">
                    User Staging Mode
                  </FormLabel>
                  <FormDescription className="text-sm">
                    Control how users are synchronized from LDAP. Choose whether
                    users should be reviewed before import or synced directly.
                  </FormDescription>
                </div>
                <Select
                  value={field.value || "full"}
                  onValueChange={field.onChange}
                >
                  <FormControl>
                    <SelectTrigger className="text-left h-auto py-6">
                      <SelectValue placeholder="Select staging mode" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="full" className="py-3">
                      <div className="space-y-1">
                        <div className="font-semibold text-sm">
                          Full Staging
                        </div>
                        <div className="text-xs text-muted-foreground leading-relaxed">
                          All users (new and updated) go through staging for
                          review before import. Maximum control and safety.
                        </div>
                      </div>
                    </SelectItem>
                    <SelectItem value="new-only" className="py-3">
                      <div className="space-y-1">
                        <div className="font-semibold text-sm">
                          New Users Only
                        </div>
                        <div className="text-xs text-muted-foreground leading-relaxed">
                          Only new users go to staging. Existing users sync
                          directly for faster updates.
                        </div>
                      </div>
                    </SelectItem>
                    <SelectItem value="disabled" className="py-3">
                      <div className="space-y-1">
                        <div className="font-semibold text-sm">Disabled</div>
                        <div className="text-xs text-muted-foreground leading-relaxed">
                          Direct sync - no staging. All users are created or
                          updated immediately (legacy behavior).
                        </div>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex items-start gap-2 pt-1">
                  <div className="mt-0.5">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    <strong>Recommended:</strong> Use "Full Staging" for
                    production environments to ensure data quality and prevent
                    accidental imports.
                  </p>
                </div>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        <div className="flex justify-end pt-4">
          <Button type="submit" size="sm" disabled={saveLdapMutation.isPending}>
            {saveLdapMutation.isPending ? "Saving..." : "Save Settings"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default BasicInfoForm;
