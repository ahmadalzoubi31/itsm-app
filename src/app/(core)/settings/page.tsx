"use client";

import { useState } from "react";
import { Bell, Building, Globe, Palette, Settings, Shield } from "lucide-react";
import { SettingsHeader } from "./components/SettingsHeader";
import { SystemIntegrations } from "./components/SystemIntegrations";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SystemContent from "./components/SystemContent";
import SecurityContent from "./components/SecurityContent";
import NotificationsContent from "./components/NotificationsContent";
import AppearanceContent from "./components/AppearanceContent";

interface Tab {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("system");

  const tabs: Tab[] = [
    { id: "system", label: "System", icon: Globe },
    { id: "security", label: "Security", icon: Shield },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "appearance", label: "Appearance", icon: Palette },
  ];

  return (
    <div className="px-4 lg:px-8">
      <SettingsHeader
        title="Settings"
        description="Configure system settings and integrations"
      />

      <div className="space-y-8">
        <SystemIntegrations />

        <Separator />

        <div>
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2 text-gray-900">
            <Settings className="w-5 h-5" />
            Global Settings
          </h3>

          <Tabs defaultValue="system" className="w-full">
            <TabsList className="w-full">
              <TabsTrigger value="system">System</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="appearance">Appearance</TabsTrigger>
            </TabsList>
            <TabsContent value="system">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h4 className="text-lg font-semibold flex items-center gap-2 text-gray-900">
                    <Globe className="w-5 h-5" />
                    System Settings
                  </h4>
                  <p className="mt-1 text-sm text-gray-600">
                    Configure core system behavior and preferences
                  </p>
                </div>
                <div className="p-6 space-y-6">
                  <SystemContent />
                </div>
              </div>
            </TabsContent>
            <TabsContent value="security">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h4 className="text-lg font-semibold flex items-center gap-2 text-gray-900">
                    <Shield className="w-5 h-5" />
                    Security Settings
                  </h4>
                  <p className="mt-1 text-sm text-gray-600">
                    Manage security policies and access controls
                  </p>
                </div>
                <div className="p-6 space-y-6">
                  <SecurityContent />
                </div>
              </div>
            </TabsContent>
            <TabsContent value="notifications">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h4 className="text-lg font-semibold flex items-center gap-2 text-gray-900">
                    <Bell className="w-5 h-5" />
                    Notification Settings
                  </h4>
                  <p className="mt-1 text-sm text-gray-600">
                    Configure alerts and notification preferences
                  </p>
                </div>
                <div className="p-6 space-y-6">
                  <NotificationsContent />
                </div>
              </div>
            </TabsContent>
            <TabsContent value="appearance">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h4 className="text-lg font-semibold flex items-center gap-2 text-gray-900">
                    <Palette className="w-5 h-5" />
                    Appearance Settings
                  </h4>
                  <p className="mt-1 text-sm text-gray-600">
                    Customize the look and feel of the interface
                  </p>
                </div>
                <div className="p-6 space-y-6">
                  <AppearanceContent />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
