"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import IncidentForm from "../components/IncidentForm";
import {
  CreateIncidentDto,
  IncidentWithDetails,
  IncidentStatus,
  Priority,
  Impact,
  Urgency,
} from "@/types/globals";
import { toast } from "sonner";
import {
  generateIncidentNumber,
  calculatePriority,
  calculateSLABreachTime,
} from "@/utils/incident-utils";
import { ArrowLeft } from "lucide-react";
import { Role } from "../../users/data/enums";

const CreateIncident = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const createIncident = async (data: CreateIncidentDto) => {
    setLoading(true);
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const priority = calculatePriority(
        data.impact || Impact.MEDIUM,
        data.urgency || Urgency.MEDIUM
      );
      const createdAt = new Date();

      const newIncident: IncidentWithDetails = {
        id: Date.now().toString(),
        number: generateIncidentNumber(),
        title: data.title,
        description: data.description,
        status: IncidentStatus.NEW,
        priority,
        impact: data.impact || Impact.MEDIUM,
        urgency: data.urgency || Urgency.MEDIUM,
        category: data.category,
        subcategory: data.subcategory,
        reportedBy: {
          id: "1",
          email: "user@example.com",
          name: "John Doe",
          role: Role.AGENT,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        slaBreachTime: calculateSLABreachTime(priority, createdAt),
        businessService: data.businessService,
        location: data.location,
        createdAt,
        updatedAt: createdAt,
        comments: [],
        history: [],
        _count: { comments: 0 },
      };

      toast.success("Incident created successfully");

      // Navigate back to the main page
      router.push("/");
    } catch (error) {
      console.error("Error creating incident:", error);
      toast.error("Failed to create incident");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.push("/")}
            className="mb-4 flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Incidents
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">
            Create New Incident
          </h1>
          <p className="text-gray-600 mt-2">
            Report a new incident in the ITIL v4 aligned system
          </p>
        </div>

        {/* Form */}
        <IncidentForm onSubmit={createIncident} loading={loading} />
      </div>
    </div>
  );
};

export default CreateIncident;
