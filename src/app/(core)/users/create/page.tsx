"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import {
  User,
  Shield,
  Settings,
  Mail,
  Phone,
  MapPin,
  Lock,
  UserPlus,
  X,
  Plus,
  Check,
  ChevronDown,
  Search,
} from "lucide-react";
import { addUser } from "../data/userMutations";
// Mock enums and types
const Role = {
  ADMIN: "admin",
  AGENT: "agent",
  USER: "user",
};

const Status = {
  ACTIVE: "active",
  INACTIVE: "inactive",
};

// Mock permissions data
const availablePermissions = [
  {
    id: "read_users",
    name: "Read Users",
    category: "User Management",
    description: "View user profiles and information",
  },
  {
    id: "write_users",
    name: "Write Users",
    category: "User Management",
    description: "Create and edit user accounts",
  },
  {
    id: "delete_users",
    name: "Delete Users",
    category: "User Management",
    description: "Remove user accounts",
  },
  {
    id: "read_reports",
    name: "Read Reports",
    category: "Reporting",
    description: "Access system reports and analytics",
  },
  {
    id: "write_reports",
    name: "Write Reports",
    category: "Reporting",
    description: "Create and modify reports",
  },
  {
    id: "system_config",
    name: "System Configuration",
    category: "System",
    description: "Modify system settings",
  },
  {
    id: "audit_logs",
    name: "Audit Logs",
    category: "Security",
    description: "View system audit trails",
  },
  {
    id: "billing_access",
    name: "Billing Access",
    category: "Finance",
    description: "Access billing and payment information",
  },
  {
    id: "api_access",
    name: "API Access",
    category: "Development",
    description: "Use system APIs and integrations",
  },
  {
    id: "export_data",
    name: "Export Data",
    category: "Data",
    description: "Export system data and records",
  },
];

const CreateUserForm = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    role: Role.USER,
    status: Status.ACTIVE,
  });

  const [selectedPermissions, setSelectedPermissions] = useState<
    {
      id: string;
      name: string;
      category: string;
    }[]
  >([]);
  const [permissionSearch, setPermissionSearch] = useState("");
  const [permissionPopoverOpen, setPermissionPopoverOpen] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addPermission = (permission: {
    id: string;
    name: string;
    category: string;
    description: string;
  }) => {
    if (
      !selectedPermissions.find(
        (p: { id: string; name: string; category: string }) =>
          p.id === permission.id
      )
    ) {
      setSelectedPermissions((prev) => [...prev, permission]);
    }
  };

  const removePermission = (permissionId: any) => {
    setSelectedPermissions((prev) => prev.filter((p) => p.id !== permissionId));
  };

  const filteredPermissions = availablePermissions.filter(
    (permission) =>
      !selectedPermissions.find((p) => p.id === permission.id) &&
      (permission.name.toLowerCase().includes(permissionSearch.toLowerCase()) ||
        permission.category
          .toLowerCase()
          .includes(permissionSearch.toLowerCase()))
  );

  const permissionsByCategory = filteredPermissions.reduce(
    (acc, permission) => {
      if (!Object.prototype.hasOwnProperty.call(acc, permission.category)) {
        (acc as Record<string, typeof availablePermissions>)[
          permission.category
        ] = [];
      }
      (acc as Record<string, typeof availablePermissions>)[
        permission.category
      ].push(permission);
      return acc;
    },
    {}
  );

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    const userData = {
      ...formData,
      // fullName: `${formData.firstName} ${formData.lastName}`,
      // permissions: selectedPermissions,
    };
    console.log("Creating user:", userData);

    addUser(userData);
  };

  const getRoleVariant = (role: string) => {
    switch (role) {
      case Role.ADMIN:
        return "destructive";
      case Role.AGENT:
        return "default";
      case Role.USER:
        return "secondary";
      default:
        return "outline";
    }
  };

  const getStatusVariant = (status: string) => {
    return status === Status.ACTIVE ? "default" : "secondary";
  };

  return (
    <div className="container mx-auto py-10 px-4 max-w-7xl">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-8">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
          <UserPlus className="h-6 w-6 text-primary-foreground" />
        </div>
        <div className="space-y-1">
          <h1 className="text-3xl font-semibold tracking-tight">
            Create New User
          </h1>
          <p className="text-muted-foreground">
            Add a new user to the system with appropriate roles and permissions
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Basic Info
              </TabsTrigger>
              <TabsTrigger
                value="permissions"
                className="flex items-center gap-2"
              >
                <Shield className="h-4 w-4" />
                Permissions
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Settings
              </TabsTrigger>
            </TabsList>

            {/* Basic Information Tab */}
            <TabsContent value="basic" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Personal Information
                  </CardTitle>
                  <CardDescription>
                    Enter the user's personal details and contact information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        placeholder="John"
                        value={formData.firstName}
                        onChange={(e) =>
                          handleInputChange("firstName", e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        placeholder="Doe"
                        value={formData.lastName}
                        onChange={(e) =>
                          handleInputChange("lastName", e.target.value)
                        }
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="email"
                        className="flex items-center gap-2"
                      >
                        <Mail className="h-4 w-4" />
                        Email Address
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="john.doe@company.com"
                        value={formData.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        placeholder="john_doe"
                        value={formData.username}
                        onChange={(e) =>
                          handleInputChange("username", e.target.value)
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="password"
                      className="flex items-center gap-2"
                    >
                      <Lock className="h-4 w-4" />
                      Password
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter secure password"
                      value={formData.password}
                      onChange={(e) =>
                        handleInputChange("password", e.target.value)
                      }
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="phone"
                        className="flex items-center gap-2"
                      >
                        <Phone className="h-4 w-4" />
                        Phone Number
                      </Label>
                      <Input
                        id="phone"
                        placeholder="+1 (555) 123-4567"
                        value={formData.phone}
                        onChange={(e) =>
                          handleInputChange("phone", e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="address"
                        className="flex items-center gap-2"
                      >
                        <MapPin className="h-4 w-4" />
                        Address
                      </Label>
                      <Input
                        id="address"
                        placeholder="123 Main Street, City, State"
                        value={formData.address}
                        onChange={(e) =>
                          handleInputChange("address", e.target.value)
                        }
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Permissions Tab */}
            <TabsContent value="permissions" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Permission Management
                  </CardTitle>
                  <CardDescription>
                    Assign specific permissions to control user access levels
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Selected Permissions */}
                  {selectedPermissions.length > 0 && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-600" />
                        <Label className="text-sm font-medium">
                          Assigned Permissions ({selectedPermissions.length})
                        </Label>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {selectedPermissions.map((permission) => (
                          <Badge
                            key={permission.id}
                            variant="secondary"
                            className="gap-1"
                          >
                            {permission.name}
                            <button
                              type="button"
                              onClick={() => removePermission(permission.id)}
                              className="ml-1 hover:text-destructive"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <Separator />

                  {/* Add Permissions */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">
                      Add Permissions
                    </Label>
                    <Popover
                      open={permissionPopoverOpen}
                      onOpenChange={setPermissionPopoverOpen}
                    >
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-between"
                        >
                          <div className="flex items-center gap-2">
                            <Plus className="h-4 w-4" />
                            Add Permission
                          </div>
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80 p-0" align="start">
                        <Command>
                          <CommandInput
                            placeholder="Search permissions..."
                            value={permissionSearch}
                            onValueChange={setPermissionSearch}
                          />
                          <CommandList>
                            <CommandEmpty>No permissions found.</CommandEmpty>
                            {Object.entries(permissionsByCategory).map(
                              ([category, permissions]) => (
                                <CommandGroup key={category} heading={category}>
                                  {(
                                    permissions as typeof availablePermissions
                                  ).map(
                                    (permission: {
                                      id: string;
                                      name: string;
                                      category: string;
                                      description: string;
                                    }) => (
                                      <CommandItem
                                        key={permission.id}
                                        onSelect={() => {
                                          addPermission(permission);
                                          setPermissionPopoverOpen(false);
                                        }}
                                        className="flex flex-col items-start py-2"
                                      >
                                        <div className="font-medium">
                                          {permission.name}
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                          {permission.description}
                                        </div>
                                      </CommandItem>
                                    )
                                  )}
                                </CommandGroup>
                              )
                            )}
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Account Settings
                  </CardTitle>
                  <CardDescription>
                    Configure user role and account status
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label>User Role</Label>
                      <Select
                        value={formData.role}
                        onValueChange={(value) =>
                          handleInputChange("role", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={Role.ADMIN}>
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-red-500 rounded-full" />
                              Administrator
                            </div>
                          </SelectItem>
                          <SelectItem value={Role.AGENT}>
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-blue-500 rounded-full" />
                              Agent
                            </div>
                          </SelectItem>
                          <SelectItem value={Role.USER}>
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-green-500 rounded-full" />
                              User
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-3">
                      <Label>Account Status</Label>
                      <Select
                        value={formData.status}
                        onValueChange={(value) =>
                          handleInputChange("status", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={Status.ACTIVE}>
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-green-500 rounded-full" />
                              Active
                            </div>
                          </SelectItem>
                          <SelectItem value={Status.INACTIVE}>
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-gray-500 rounded-full" />
                              Inactive
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Preview Card */}
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="text-lg">User Preview</CardTitle>
              <CardDescription>
                Review user details before creating
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">
                    {formData.firstName} {formData.lastName}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {formData.email || "No email"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {/* <span className="text-sm font-medium">Role:</span> */}
                  <Badge variant={getRoleVariant(formData.role)}>
                    {formData.role}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  {/* <span className="text-sm font-medium">Status:</span> */}
                  <Badge variant={getStatusVariant(formData.status)}>
                    {formData.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {selectedPermissions.length} permissions
                  </span>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <Button onClick={handleSubmit} className="w-full" size="lg">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Create User
                </Button>
                <Button variant="outline" className="w-full">
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CreateUserForm;
