"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { createServiceRequest } from "../services/request.service";
import { ServiceRequest } from "../types";

interface NewServiceRequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  services: any[];
}

export const NewServiceRequestDialog = ({
  open,
  onOpenChange,
  services,
}: NewServiceRequestDialogProps) => {
  const [selectedService, setSelectedService] = useState<string>("");
  const [priority, setPriority] = useState<string>("medium");
  const [requestTitle, setRequestTitle] = useState("");
  const [businessJustification, setBusinessJustification] = useState("");
  const [requiredDate, setRequiredDate] = useState("");
  const [additionalDetails, setAdditionalDetails] = useState("");

  const handleSubmit = () => {
    const selectedServiceData = services.find((s) => s.id === selectedService);
    if (!selectedServiceData) return;

    console.log("Submitting service request:", selectedServiceData);
    createServiceRequest(selectedServiceData);

    toast.success(
      `Your ${selectedServiceData.name} request has been submitted successfully!`
    );

    // Reset form and close dialog
    setSelectedService("");
    setPriority("medium");
    setRequestTitle("");
    setBusinessJustification("");
    setRequiredDate("");
    setAdditionalDetails("");
    onOpenChange(false);
  };

  const selectedServiceData = services.find((s) => s.id === selectedService);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>New Service Request</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Service Selection */}
          <div className="space-y-3">
            <Label>Select Service</Label>
            <div className="grid grid-cols-1 gap-3">
              {services.map((service) => (
                <div
                  key={service.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-all ${
                    selectedService === service.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setSelectedService(service.id)}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded ${service.color} flex items-center justify-center text-white`}
                    >
                      <service.icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{service.name}</h4>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">
                            {service.category}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {service.estimatedTime}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {service.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {selectedService && (
            <>
              {/* Request Details */}
              <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900">Request Details</h4>

                <div>
                  <Label htmlFor="request-title">Request Title</Label>
                  <Input
                    id="request-title"
                    value={requestTitle}
                    onChange={(e) => setRequestTitle(e.target.value)}
                    placeholder="Brief description of your request"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label>Priority Level</Label>
                  <RadioGroup
                    value={priority}
                    onValueChange={setPriority}
                    className="mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="low" id="low" />
                      <Label htmlFor="low" className="text-green-600">
                        Low - Can wait 1-2 weeks
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="medium" id="medium" />
                      <Label htmlFor="medium" className="text-orange-600">
                        Medium - Needed within a week
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="high" id="high" />
                      <Label htmlFor="high" className="text-red-600">
                        High - Urgent, needed ASAP
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label htmlFor="required-date">
                    Required Completion Date
                  </Label>
                  <Input
                    id="required-date"
                    type="date"
                    value={requiredDate}
                    onChange={(e) => setRequiredDate(e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="business-justification">
                    Business Justification
                  </Label>
                  <Textarea
                    id="business-justification"
                    value={businessJustification}
                    onChange={(e) => setBusinessJustification(e.target.value)}
                    placeholder="Explain why this request is needed and how it benefits the business"
                    className="mt-1"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="additional-details">Additional Details</Label>
                  <Textarea
                    id="additional-details"
                    value={additionalDetails}
                    onChange={(e) => setAdditionalDetails(e.target.value)}
                    placeholder="Any additional information that would help process your request"
                    className="mt-1"
                    rows={3}
                  />
                </div>
              </div>

              {/* Service Information */}
              {selectedServiceData && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h5 className="font-medium text-blue-800 mb-2">
                    Service Information
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-blue-600" />
                      <span className="text-blue-700">
                        <strong>Estimated Time:</strong>{" "}
                        {selectedServiceData.estimatedTime}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-blue-600" />
                      <span className="text-blue-700">
                        <strong>Department:</strong>{" "}
                        {selectedServiceData.category}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-blue-600" />
                      <span className="text-blue-700">
                        <strong>Cost:</strong> {selectedServiceData.price}
                      </span>
                    </div>
                  </div>
                  <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800">
                    <AlertTriangle className="inline h-3 w-3 mr-1" />
                    Once submitted, this request will automatically trigger the
                    associated workflow and notify the relevant teams.
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={
              !selectedService || !requestTitle || !businessJustification
            }
          >
            Submit Request
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
