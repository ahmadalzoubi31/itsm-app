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
import { Badge } from "@/components/ui/badge";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Plus,
  Edit,
  Trash2,
  User,
  Calendar,
  CheckCircle,
  Clock,
  Settings,
} from "lucide-react";
import { ServiceCard } from "./types";
import { useServiceCards } from "./hooks/useServiceCards";
import {
  createServiceCard,
  deleteServiceCard,
  updateServiceCard,
} from "./services/service-card.service";

export default function ServiceCards() {
  const { serviceCards } = useServiceCards();

  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingServiceCard, setEditingServiceCard] =
    useState<ServiceCard | null>(null);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    description: "",
    category: "",
    estimatedTime: "",
    price: "Free",
    workflowId: "",
  });

  const iconOptions = [
    { name: "User", icon: User },
    { name: "Calendar", icon: Calendar },
    { name: "Settings", icon: Settings },
    { name: "CheckCircle", icon: CheckCircle },
    { name: "Clock", icon: Clock },
  ];

  const colorOptions = [
    "bg-blue-500",
    "bg-green-500",
    "bg-purple-500",
    "bg-red-500",
    "bg-orange-500",
    "bg-pink-500",
    "bg-indigo-500",
    "bg-teal-500",
  ];

  const handleCreateService = () => {
    };

  const handleEditService = (serviceCard: ServiceCard) => {
    setEditingServiceCard(serviceCard);
    setFormData({
      id: serviceCard.id,
      name: serviceCard.name,
      description: serviceCard.description,
      category: serviceCard.category,
      estimatedTime: serviceCard.estimatedTime,
      price: serviceCard.price,
      workflowId: serviceCard.workflowId,
    });
    setShowCreateDialog(true);
  };

  const handleUpdateService = () => {
    if (!editingServiceCard) return;

    updateServiceCard(editingServiceCard.id, formData);
    resetForm();
    setShowCreateDialog(false);
    setEditingServiceCard(null);
  };

  // const handleToggleActive = (serviceId: string) => {
  //   toggleServiceCardActive(serviceId);
  // };

  const handleDeleteService = (serviceId: string) => {
    deleteServiceCard(serviceId);
  };

  const resetForm = () => {
    setFormData({
      id: "",
      name: "",
      description: "",
      category: "",
      estimatedTime: "",
      price: "Free",
      workflowId: "",
    });
    setEditingServiceCard(null);
  };

  return (
    <>
      <div className="flex flex-row items-center justify-between px-4 lg:px-6">
        <div className="text-2xl font-bold tracking-tight">
          Service Catalog Management
          <div className="text-muted-foreground text-sm font-normal">
            Create and manage services that users can request
          </div>
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          Create Service Card
        </Button>
      </div>

      {/* Services Grid */}
      <div className="px-4 lg:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {serviceCards.map((serviceCard: ServiceCard) => (
            <Card
              key={serviceCard.id}
              className={`relative ${
                !serviceCard.isActive ? "opacity-60" : ""
              }`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded flex items-center justify-center text-white`}
                    >
                      <serviceCard.icon className="h-4 w-4" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">
                        {serviceCard.name}
                      </CardTitle>
                      <Badge variant="secondary" className="text-xs">
                        {serviceCard.category}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEditService(serviceCard)}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteService(serviceCard.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <CardDescription>{serviceCard.description}</CardDescription>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">
                    <Clock className="inline h-3 w-3 mr-1" />
                    {serviceCard.estimatedTime}
                  </span>
                  <span className="text-green-600 font-medium">
                    {serviceCard.price}
                  </span>
                </div>

                <div className="text-xs text-gray-500">
                  Workflow ID: {serviceCard.workflowId}
                </div>

                <div className="flex items-center justify-between pt-2">
                  <Badge
                    className={
                      serviceCard.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }
                  >
                    {serviceCard.isActive ? "Active" : "Inactive"}
                  </Badge>
                  <Button
                    size="sm"
                    variant="outline"
                    // onClick={() => handleToggleActive(serviceCard.id)}
                  >
                    {serviceCard.isActive ? "Deactivate" : "Activate"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Create/Edit Service Dialog */}

      <div className="px-4 lg:px-6">
        <Dialog
          open={showCreateDialog}
          onOpenChange={(open) => {
            setShowCreateDialog(open);
            if (!open) resetForm();
          }}
        >
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingServiceCard ? "Edit Service" : "Create New Service"}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="service-name">Service Name</Label>
                  <Input
                    id="service-name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="e.g., Employee Onboarding"
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) =>
                      setFormData({ ...formData, category: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="HR">HR</SelectItem>
                      <SelectItem value="Finance">Finance</SelectItem>
                      <SelectItem value="IT">IT</SelectItem>
                      <SelectItem value="Legal">Legal</SelectItem>
                      <SelectItem value="Operations">Operations</SelectItem>
                      <SelectItem value="Marketing">Marketing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Describe what this service provides..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="estimated-time">Estimated Time</Label>
                  <Input
                    id="estimated-time"
                    value={formData.estimatedTime}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        estimatedTime: e.target.value,
                      })
                    }
                    placeholder="e.g., 2-3 days"
                  />
                </div>
                <div>
                  <Label htmlFor="price">Price</Label>
                  <Input
                    id="price"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    placeholder="e.g., Free or $50"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="workflow-id">Workflow ID</Label>
                <Input
                  id="workflow-id"
                  value={formData.workflowId}
                  onChange={(e) =>
                    setFormData({ ...formData, workflowId: e.target.value })
                  }
                  placeholder="e.g., employee-onboarding-workflow"
                />
                <p className="text-xs text-gray-500 mt-1">
                  This should match the ID of the workflow that will be
                  triggered when users request this service
                </p>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setShowCreateDialog(false);
                  resetForm();
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={
                  editingServiceCard ? handleUpdateService : handleCreateService
                }
                disabled={
                  !formData.name || !formData.category || !formData.description
                }
              >
                {editingServiceCard ? "Update Service" : "Create Service"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
