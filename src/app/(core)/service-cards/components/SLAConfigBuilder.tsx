"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Plus,
  Trash2,
  Edit,
  Save,
  Clock,
  AlertTriangle,
  Timer,
  Calendar,
} from "lucide-react";
import { SLAConfig } from "../types";

interface SLAConfigBuilderProps {
  slaConfig: SLAConfig;
  onChange: (slaConfig: SLAConfig) => void;
}

export const SLAConfigBuilder = ({
  slaConfig,
  onChange,
}: SLAConfigBuilderProps) => {
  const [showEscalationDialog, setShowEscalationDialog] = useState(false);
  const [editingEscalation, setEditingEscalation] = useState<any>(null);
  const [escalationData, setEscalationData] = useState({
    level: 1,
    timeThreshold: 24,
    escalateTo: "",
  });

  const handleBasicSLAChange = (field: keyof SLAConfig, value: any) => {
    onChange({ ...slaConfig, [field]: value });
  };

  const handleBusinessHoursChange = (field: string, value: any) => {
    const businessHours = slaConfig.businessHours || {
      start: "09:00",
      end: "17:00",
      timezone: "UTC",
      excludeWeekends: true,
      holidays: [],
    };

    onChange({
      ...slaConfig,
      businessHours: { ...businessHours, [field]: value },
    });
  };

  const handleAddEscalation = () => {
    setEditingEscalation(null);
    setEscalationData({
      level: (slaConfig.escalationSteps?.length || 0) + 1,
      timeThreshold: 24,
      escalateTo: "",
    });
    setShowEscalationDialog(true);
  };

  const handleEditEscalation = (escalation: any, index: number) => {
    setEditingEscalation(index);
    setEscalationData(escalation);
    setShowEscalationDialog(true);
  };

  const handleSaveEscalation = () => {
    if (!escalationData.escalateTo) return;

    const newEscalation = {
      level: escalationData.level,
      timeThreshold: escalationData.timeThreshold,
      escalateTo: escalationData.escalateTo,
    };

    const escalationSteps = slaConfig.escalationSteps || [];

    if (editingEscalation !== null) {
      escalationSteps[editingEscalation] = newEscalation;
    } else {
      escalationSteps.push(newEscalation);
    }

    onChange({
      ...slaConfig,
      escalationSteps: escalationSteps.sort((a, b) => a.level - b.level),
    });

    setShowEscalationDialog(false);
    resetEscalationData();
  };

  const handleDeleteEscalation = (index: number) => {
    const escalationSteps =
      slaConfig.escalationSteps?.filter((_, i) => i !== index) || [];
    onChange({ ...slaConfig, escalationSteps });
  };

  const resetEscalationData = () => {
    setEscalationData({
      level: (slaConfig.escalationSteps?.length || 0) + 1,
      timeThreshold: 24,
      escalateTo: "",
    });
    setEditingEscalation(null);
  };

  const escalationRoles = [
    "Manager",
    "Department Head",
    "Senior Manager",
    "Director",
    "VP",
    "Executive Team",
    "Custom User",
  ];

  const timezones = [
    "UTC",
    "America/New_York",
    "America/Chicago",
    "America/Denver",
    "America/Los_Angeles",
    "Europe/London",
    "Europe/Paris",
    "Asia/Tokyo",
    "Asia/Shanghai",
    "Australia/Sydney",
  ];

  return (
    <div className="space-y-6">
      {/* Basic SLA Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Timer className="h-5 w-5" />
            SLA Timeframes
          </CardTitle>
          <CardDescription>
            Set response and resolution time expectations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="response-time">Response Time (hours)</Label>
              <Input
                id="response-time"
                type="number"
                value={slaConfig.responseTime}
                onChange={(e) =>
                  handleBasicSLAChange(
                    "responseTime",
                    parseInt(e.target.value) || 0
                  )
                }
                min={1}
              />
              <p className="text-xs text-gray-500 mt-1">
                Maximum time to provide initial response
              </p>
            </div>
            <div>
              <Label htmlFor="resolution-time">Resolution Time (hours)</Label>
              <Input
                id="resolution-time"
                type="number"
                value={slaConfig.resolutionTime}
                onChange={(e) =>
                  handleBasicSLAChange(
                    "resolutionTime",
                    parseInt(e.target.value) || 0
                  )
                }
                min={1}
              />
              <p className="text-xs text-gray-500 mt-1">
                Maximum time to complete the request
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Business Hours */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Business Hours
          </CardTitle>
          <CardDescription>
            Configure when SLA times are calculated
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="start-time">Start Time</Label>
              <Input
                id="start-time"
                type="time"
                value={slaConfig.businessHours?.start || "09:00"}
                onChange={(e) =>
                  handleBusinessHoursChange("start", e.target.value)
                }
              />
            </div>
            <div>
              <Label htmlFor="end-time">End Time</Label>
              <Input
                id="end-time"
                type="time"
                value={slaConfig.businessHours?.end || "17:00"}
                onChange={(e) =>
                  handleBusinessHoursChange("end", e.target.value)
                }
              />
            </div>
            <div>
              <Label htmlFor="timezone">Timezone</Label>
              <Select
                value={slaConfig.businessHours?.timezone || "UTC"}
                onValueChange={(value) =>
                  handleBusinessHoursChange("timezone", value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {timezones.map((tz) => (
                    <SelectItem key={tz} value={tz}>
                      {tz}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="exclude-weekends"
              checked={slaConfig.businessHours?.excludeWeekends ?? true}
              onCheckedChange={(checked) =>
                handleBusinessHoursChange("excludeWeekends", checked)
              }
            />
            <Label htmlFor="exclude-weekends">
              Exclude weekends from SLA calculations
            </Label>
          </div>
        </CardContent>
      </Card>

      {/* Escalation Steps */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Escalation Steps
              </CardTitle>
              <CardDescription>
                Define escalation rules when SLA is at risk
              </CardDescription>
            </div>
            <Button onClick={handleAddEscalation}>
              <Plus className="h-4 w-4 mr-2" />
              Add Escalation
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {!slaConfig.escalationSteps ||
          slaConfig.escalationSteps.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <AlertTriangle className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p>No escalation steps configured.</p>
              <p className="text-sm">
                Add escalation rules to ensure timely resolution.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {slaConfig.escalationSteps.map((step, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="text-xs">
                        Level {step.level}
                      </Badge>
                      <div>
                        <p className="font-medium">
                          Escalate to {step.escalateTo}
                        </p>
                        <p className="text-sm text-gray-600">
                          After {step.timeThreshold} hours
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEditEscalation(step, index)}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteEscalation(index)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Escalation Configuration Dialog */}
          <Dialog
            open={showEscalationDialog}
            onOpenChange={setShowEscalationDialog}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingEscalation !== null
                    ? "Edit Escalation Step"
                    : "Add Escalation Step"}
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="escalation-level">Escalation Level</Label>
                    <Input
                      id="escalation-level"
                      type="number"
                      value={escalationData.level}
                      onChange={(e) =>
                        setEscalationData({
                          ...escalationData,
                          level: parseInt(e.target.value) || 1,
                        })
                      }
                      min={1}
                    />
                  </div>
                  <div>
                    <Label htmlFor="time-threshold">
                      Time Threshold (hours)
                    </Label>
                    <Input
                      id="time-threshold"
                      type="number"
                      value={escalationData.timeThreshold}
                      onChange={(e) =>
                        setEscalationData({
                          ...escalationData,
                          timeThreshold: parseInt(e.target.value) || 1,
                        })
                      }
                      min={1}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="escalate-to">Escalate To</Label>
                  <Select
                    value={escalationData.escalateTo}
                    onValueChange={(value) =>
                      setEscalationData({
                        ...escalationData,
                        escalateTo: value,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select role or person" />
                    </SelectTrigger>
                    <SelectContent>
                      {escalationRoles.map((role) => (
                        <SelectItem key={role} value={role}>
                          {role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setShowEscalationDialog(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveEscalation}
                  disabled={!escalationData.escalateTo}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {editingEscalation !== null ? "Update Step" : "Add Step"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  );
};
