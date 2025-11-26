"use client";

import { useState } from "react";
import {
  Mail,
  Settings,
  Bell,
  TestTube,
  BarChart3,
  Download,
  Send,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

import { EmailProviderForm } from "./components/EmailProviderForm";
import { NotificationSettingsForm } from "./components/NotificationSettingsForm";
import { EmailTestForm } from "./components/EmailTestForm";
import {
  useGetEmailSettings,
  useEmailStatistics,
} from "./hooks/useEmailSettings";
import { useGetNotificationSettings } from "./hooks/useNotificationSettings";
import { Button } from "@/components/ui/button";

export default function EmailSettingsPage() {
  const [activeTab, setActiveTab] = useState("engines");
  const { data: settings, isLoading: loading } = useGetEmailSettings();
  const { data: notificationSettings, isLoading: notificationLoading } =
    useGetNotificationSettings();
  const { statistics } = useEmailStatistics();

  const isOutgoingConfigured =
    settings?.outgoing?.enabled && settings.outgoing.host;
  const isIncomingConfigured =
    settings?.incoming?.enabled && settings.incoming.host;

  return (
    <div className="px-4 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Mail className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold tracking-tight">Email Settings</h1>
        </div>
        <p className="text-gray-600">
          Configure your email engines, notifications, and test your email
          integration
        </p>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Outgoing Engine
                </p>
                <p className="text-2xl font-bold">
                  {isOutgoingConfigured ? (
                    <Badge
                      variant="default"
                      className="bg-green-100 text-green-800"
                    >
                      <Send className="h-3 w-3 mr-1" />
                      Active
                    </Badge>
                  ) : (
                    <Badge
                      variant="secondary"
                      className="bg-red-100 text-red-800"
                    >
                      Inactive
                    </Badge>
                  )}
                </p>
              </div>
              <Send className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Incoming Engine
                </p>
                <p className="text-2xl font-bold">
                  {isIncomingConfigured ? (
                    <Badge
                      variant="default"
                      className="bg-green-100 text-green-800"
                    >
                      <Download className="h-3 w-3 mr-1" />
                      Active
                    </Badge>
                  ) : (
                    <Badge
                      variant="secondary"
                      className="bg-red-100 text-red-800"
                    >
                      Inactive
                    </Badge>
                  )}
                </p>
              </div>
              <Download className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Notifications
                </p>
                <p className="text-2xl font-bold">
                  {notificationSettings?.enabled ? (
                    <Badge
                      variant="default"
                      className="bg-blue-100 text-blue-800"
                    >
                      <Bell className="h-3 w-3 mr-1" />
                      Enabled
                    </Badge>
                  ) : (
                    <Badge
                      variant="secondary"
                      className="bg-gray-100 text-gray-800"
                    >
                      Disabled
                    </Badge>
                  )}
                </p>
              </div>
              <Bell className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Configuration Status Alert */}
      {!isOutgoingConfigured && !isIncomingConfigured && (
        <Alert className="mb-8 border-orange-200 bg-orange-50">
          <Mail className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            Email engines are not configured. Please configure your outgoing
            and/or incoming email engines to enable email notifications and
            functionality.
          </AlertDescription>
        </Alert>
      )}

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="engines" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">Engines</span>
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="flex items-center gap-2"
          >
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="test" className="flex items-center gap-2">
            <TestTube className="h-4 w-4" />
            <span className="hidden sm:inline">Test</span>
          </TabsTrigger>
          <TabsTrigger value="statistics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Statistics</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="engines" className="mt-6">
          <EmailProviderForm />
        </TabsContent>

        <TabsContent value="notifications" className="mt-6">
          <NotificationSettingsForm />
        </TabsContent>

        <TabsContent value="test" className="mt-6">
          {isOutgoingConfigured || isIncomingConfigured ? (
            <EmailTestForm />
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  Email Engine Required
                </h3>
                <p className="text-gray-600 mb-4">
                  Please configure your email engines first before testing email
                  functionality.
                </p>
                <Button
                  size="sm"
                  variant="link"
                  onClick={() => setActiveTab("engines")}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Configure Email Engines →
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="statistics" className="mt-6">
          <EmailStatisticsCard statistics={statistics} loading={loading} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Email Statistics Component
interface EmailStatisticsCardProps {
  statistics: any;
  loading: boolean;
}

function EmailStatisticsCard({
  statistics,
  loading,
}: EmailStatisticsCardProps) {
  if (loading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="animate-pulse">Loading statistics...</div>
        </CardContent>
      </Card>
    );
  }

  if (!statistics) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No Statistics Available</h3>
          <p className="text-gray-600">
            Email statistics will appear here once you start sending emails.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Email Statistics
          </CardTitle>
          <CardDescription>
            Overview of your email delivery performance and statistics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {statistics.totalSent}
              </div>
              <div className="text-sm text-gray-600">Total Sent</div>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="text-2xl font-bold text-red-600">
                {statistics.totalFailed}
              </div>
              <div className="text-sm text-gray-600">Total Failed</div>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {statistics.deliveryRate?.toFixed(1)}%
              </div>
              <div className="text-sm text-gray-600">Delivery Rate</div>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {statistics.averageDeliveryTime}ms
              </div>
              <div className="text-sm text-gray-600">Avg Delivery Time</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Last 24 Hours</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{statistics.last24Hours}</div>
            <p className="text-sm text-gray-600">emails sent</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Last 7 Days</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{statistics.last7Days}</div>
            <p className="text-sm text-gray-600">emails sent</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Last Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{statistics.lastMonth}</div>
            <p className="text-sm text-gray-600">emails sent</p>
          </CardContent>
        </Card>
      </div>

      {statistics.lastSentAt && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Last email sent:</span>
              <span className="font-medium">
                {new Date(statistics.lastSentAt).toLocaleString()}
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
