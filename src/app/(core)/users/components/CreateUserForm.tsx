"use client";
import React, { useState } from "react";
import UserBasicInfo from "./UserBasicInfo";
import UserPermissions from "./UserPermissions";
import UserSettings from "./UserSettings";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { createUser } from "../services/user.service";
import { StatusEnum } from "../constants/status.constant";
import { RoleEnum } from "../constants/role.constant";
import { Permission } from "../../permissions/types";
import { toast } from "sonner";
import { User, Shield, Settings } from "lucide-react";
import SideBarForm from "./SideBarForm";

export default function CreateUserForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    role: RoleEnum.USER,
    status: StatusEnum.ACTIVE,
  });
  const [selectedPermissions, setSelectedPermissions] = useState<Permission[]>(
    []
  );
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userData = { ...formData };
      const user = await createUser(userData);
      const userId = user.data.id;

      await Promise.all(
        selectedPermissions.map((permission) => {
          console.log("🚀 ~ handleSubmit ~ permission:", permission);
          return; //   assignPermission({ userId, permissionId: permission.id })
        })
      );
      // Optionally: Show success or redirect
      toast.success("User created successfully!");
      // Optionally: redirect or reset form here
    } catch (error) {
      toast.error("Failed to create user. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Main Content */}
      <div className="lg:col-span-3 space-y-6">
        <form onSubmit={handleSubmit}>
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
              <UserBasicInfo formData={formData} onChange={handleInputChange} />
            </TabsContent>

            {/* Permissions Tab */}
            <TabsContent value="permissions">
              <UserPermissions
                selectedPermissions={selectedPermissions}
                setSelectedPermissions={setSelectedPermissions}
              />
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings">
              <UserSettings formData={formData} onChange={handleInputChange} />
            </TabsContent>
          </Tabs>
          <div className="mt-4">
            <Button size="sm" type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create User"}
            </Button>
          </div>
        </form>
      </div>

      <SideBarForm
        formData={formData}
        selectedPermissions={selectedPermissions}
      />
    </div>
  );
}
