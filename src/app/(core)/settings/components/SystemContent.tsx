"use client";

import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SettingToggle } from "./SettingToggle";
import { X, Plus, Loader2, AlertCircle, Power, PowerOff } from "lucide-react";
import {
  fetchBusinessLines,
  createBusinessLine,
  deactivateBusinessLine,
  activateBusinessLine,
  BusinessLine,
} from "../services/business-line.service";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const SystemContent = () => {
  const [businessLines, setBusinessLines] = useState<BusinessLine[]>([]);
  const [newBusinessLineName, setNewBusinessLineName] = useState("");
  const [newBusinessLineDescription, setNewBusinessLineDescription] =
    useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"active" | "inactive">("active");

  // Fetch business lines on component mount
  useEffect(() => {
    loadBusinessLines();
  }, []);

  const loadBusinessLines = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchBusinessLines();
      setBusinessLines(data); // Load all business lines (active and inactive)
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load business lines";
      setError(errorMessage);
      toast.error("Error", {
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddBusinessLine = async () => {
    if (!newBusinessLineName.trim()) return;

    try {
      setIsCreating(true);
      // Generate a key from the name (lowercase, kebab-case)
      const key = newBusinessLineName
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-");

      const newLine = await createBusinessLine({
        key,
        name: newBusinessLineName.trim(),
        description: newBusinessLineDescription.trim() || undefined,
      });

      setBusinessLines([...businessLines, newLine]);
      setNewBusinessLineName("");
      setNewBusinessLineDescription("");
      setIsAdding(false);
      toast.success("Success", {
        description: "Business line created successfully",
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to create business line";
      toast.error("Error", {
        description: errorMessage,
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleToggleBusinessLine = async (
    id: string,
    currentStatus: boolean
  ) => {
    try {
      setTogglingId(id);
      const updatedLine = currentStatus
        ? await deactivateBusinessLine(id)
        : await activateBusinessLine(id);

      // Update the business line in the list
      setBusinessLines(
        businessLines.map((line) => (line.id === id ? updatedLine : line))
      );

      toast.success("Success", {
        description: `Business line ${
          currentStatus ? "deactivated" : "activated"
        } successfully`,
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : `Failed to ${
              currentStatus ? "deactivate" : "activate"
            } business line`;
      toast.error("Error", {
        description: errorMessage,
      });
    } finally {
      setTogglingId(null);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleAddBusinessLine();
    } else if (e.key === "Escape") {
      setIsAdding(false);
      setNewBusinessLineName("");
      setNewBusinessLineDescription("");
    }
  };

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label
            htmlFor="system-name"
            className="block text-sm font-medium text-gray-700"
          >
            System Name
          </Label>

          <Select defaultValue="Production System">
            <SelectTrigger id="system-name">
              <SelectValue placeholder="Select System Name" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Production System">
                Production System
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="timezone"
            className="block text-sm font-medium text-gray-700"
          >
            Timezone
          </Label>

          <Select defaultValue="utc">
            <SelectTrigger id="timezone">
              <SelectValue placeholder="Select Timezone" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="utc">UTC</SelectItem>
              <SelectItem value="est">Eastern Time</SelectItem>
              <SelectItem value="pst">Pacific Time</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Business Lines Section */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <div>
            <Label className="block text-sm font-medium text-gray-700">
              Business Lines
            </Label>
            <p className="text-sm text-gray-500 mt-0.5">
              Manage your organization's business lines
            </p>
          </div>
          {!isAdding && !isLoading && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsAdding(true)}
              className="gap-1.5"
            >
              <Plus className="size-4" />
              Add Line
            </Button>
          )}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="size-6 animate-spin text-gray-400" />
            <span className="ml-2 text-sm text-gray-500">
              Loading business lines...
            </span>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="flex items-center gap-2 p-4 bg-red-50 dark:bg-red-900/10 rounded-lg border border-red-200 dark:border-red-800">
            <AlertCircle className="size-5 text-red-600" />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-900 dark:text-red-200">
                {error}
              </p>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={loadBusinessLines}
              className="shrink-0"
            >
              Retry
            </Button>
          </div>
        )}

        {/* Add New Business Line Form */}
        {isAdding && !isLoading && !error && (
          <div className="space-y-3 p-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="space-y-2">
              <Label
                htmlFor="business-line-name"
                className="text-sm font-medium"
              >
                Business Line Name *
              </Label>
              <Input
                id="business-line-name"
                type="text"
                placeholder="e.g., Information Technology"
                value={newBusinessLineName}
                onChange={(e) => setNewBusinessLineName(e.target.value)}
                onKeyDown={handleKeyPress}
                autoFocus
                disabled={isCreating}
                className="bg-white dark:bg-gray-900"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="business-line-description"
                className="text-sm font-medium"
              >
                Description (Optional)
              </Label>
              <Textarea
                id="business-line-description"
                placeholder="e.g., Manages all IT services, infrastructure, and support"
                value={newBusinessLineDescription}
                onChange={(e) => setNewBusinessLineDescription(e.target.value)}
                disabled={isCreating}
                className="bg-white dark:bg-gray-900 min-h-[80px]"
              />
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={handleAddBusinessLine}
                disabled={!newBusinessLineName.trim() || isCreating}
              >
                {isCreating ? (
                  <>
                    <Loader2 className="size-4 animate-spin mr-1" />
                    Creating...
                  </>
                ) : (
                  "Create Business Line"
                )}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setIsAdding(false);
                  setNewBusinessLineName("");
                  setNewBusinessLineDescription("");
                }}
                disabled={isCreating}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Business Lines Tabs */}
        {!isLoading && !error && (
          <Tabs
            value={activeTab}
            onValueChange={(v) => setActiveTab(v as "active" | "inactive")}
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="active">
                Active ({businessLines.filter((l) => l.active).length})
              </TabsTrigger>
              <TabsTrigger value="inactive">
                Inactive ({businessLines.filter((l) => !l.active).length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="active" className="space-y-2 mt-3">
              {businessLines.filter((l) => l.active).length === 0 ? (
                <div className="text-center py-8 text-gray-500 text-sm">
                  No active business lines. Click "Add Line" to create one.
                </div>
              ) : (
                businessLines
                  .filter((line) => line.active)
                  .map((line) => (
                    <div
                      key={line.id}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 group hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
                    >
                      <div className="flex-1">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {line.name}
                        </span>
                        {line.description && (
                          <p className="text-xs text-gray-500 mt-0.5">
                            {line.description}
                          </p>
                        )}
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() =>
                          handleToggleBusinessLine(line.id, line.active)
                        }
                        disabled={togglingId === line.id}
                        className="size-7 opacity-0 group-hover:opacity-100 transition-opacity text-gray-500 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20 disabled:opacity-100"
                        title="Deactivate business line"
                      >
                        {togglingId === line.id ? (
                          <Loader2 className="size-4 animate-spin" />
                        ) : (
                          <PowerOff className="size-4" />
                        )}
                      </Button>
                    </div>
                  ))
              )}
            </TabsContent>

            <TabsContent value="inactive" className="space-y-2 mt-3">
              {businessLines.filter((l) => !l.active).length === 0 ? (
                <div className="text-center py-8 text-gray-500 text-sm">
                  No inactive business lines.
                </div>
              ) : (
                businessLines
                  .filter((line) => !line.active)
                  .map((line) => (
                    <div
                      key={line.id}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 opacity-60 group hover:opacity-100 hover:border-gray-300 dark:hover:border-gray-600 transition-all"
                    >
                      <div className="flex-1">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {line.name}
                        </span>
                        {line.description && (
                          <p className="text-xs text-gray-500 mt-0.5">
                            {line.description}
                          </p>
                        )}
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() =>
                          handleToggleBusinessLine(line.id, line.active)
                        }
                        disabled={togglingId === line.id}
                        className="size-7 opacity-0 group-hover:opacity-100 transition-opacity text-gray-500 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 disabled:opacity-100"
                        title="Activate business line"
                      >
                        {togglingId === line.id ? (
                          <Loader2 className="size-4 animate-spin" />
                        ) : (
                          <Power className="size-4" />
                        )}
                      </Button>
                    </div>
                  ))
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>

      <SettingToggle
        id="debug-mode"
        defaultChecked
        label="Enable Debug Mode"
        description="Show detailed error messages and logs"
      />
      <SettingToggle
        id="auto-backup"
        label="Auto-backup"
        description="Automatically backup system data daily"
        defaultChecked
      />
    </>
  );
};

export default SystemContent;
