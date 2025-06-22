"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateIncidentDto, Impact, Urgency } from "@/types/globals";
import { toast } from "sonner";

interface IncidentFormProps {
  onSubmit: (data: CreateIncidentDto) => Promise<void>;
  loading?: boolean;
}

const categories = [
  "Hardware",
  "Software",
  "Network",
  "Access",
  "Email",
  "Phone",
  "Application",
  "Other",
];

const impactOptions = [
  { value: Impact.CRITICAL, label: "Critical - System-wide outage" },
  { value: Impact.HIGH, label: "High - Multiple users affected" },
  { value: Impact.MEDIUM, label: "Medium - Single user affected" },
  { value: Impact.LOW, label: "Low - Minimal impact" },
];

const urgencyOptions = [
  { value: Urgency.CRITICAL, label: "Critical - immediate action required" },
  { value: Urgency.HIGH, label: "High - immediate attention required" },
  { value: Urgency.MEDIUM, label: "Medium - Normal processing" },
  { value: Urgency.LOW, label: "Low - Can be delayed" },
];

export default function IncidentForm({
  onSubmit,
  loading = false,
}: IncidentFormProps) {
  const [formData, setFormData] = useState<CreateIncidentDto>({
    businessService: "",
    title: "",
    description: "",
    category: "",
    impact: Impact.MEDIUM,
    urgency: Urgency.MEDIUM,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.description || !formData.category) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      await onSubmit(formData);
      setFormData({
        businessService: "",
        title: "",
        description: "",
        category: "",
        impact: Impact.MEDIUM,
        urgency: Urgency.MEDIUM,
      });
      toast.success("Incident created successfully");
    } catch (error) {
      toast.error("Failed to create incident");
    }
  };

  const updateField = (field: keyof CreateIncidentDto, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Create New Incident</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => updateField("title", e.target.value)}
                placeholder="Brief description of the issue"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => updateField("category", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => updateField("description", e.target.value)}
              placeholder="Detailed description of the issue, including steps to reproduce, error messages, etc."
              rows={4}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="impact">Business Impact</Label>
              <Select
                value={formData.impact}
                onValueChange={(value: Impact) => updateField("impact", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {impactOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="urgency">Urgency</Label>
              <Select
                value={formData.urgency}
                onValueChange={(value: Urgency) =>
                  updateField("urgency", value)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {urgencyOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="businessService">Business Service</Label>
              <Input
                id="businessService"
                value={formData.businessService || ""}
                onChange={(e) => updateField("businessService", e.target.value)}
                placeholder="e.g., Email, CRM, ERP"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location || ""}
                onChange={(e) => updateField("location", e.target.value)}
                placeholder="Building, floor, or office"
              />
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Button
              size="sm"
              type="submit"
              disabled={loading}
              className="min-w-32"
            >
              {loading ? "Creating..." : "Create Incident"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
