import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Users, Mail, Crown, Activity } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { UseFormReturn } from "react-hook-form";
import { GROUP_TYPES } from "../constants/group-type.constant";
import { GROUP_STATUSES } from "../constants/group-status.constant";

type Props = {
  form: UseFormReturn<any>;
  errors?: Record<string, any>;
  isEdit?: boolean;
  isSubmitting?: boolean;
};

const getTypeVariant = (type: string) => {
  switch (type) {
    case "TECHNICAL":
      return "default";
    case "SUPPORT":
      return "secondary";
    case "BUSINESS":
      return "outline";
    default:
      return "secondary";
  }
};

const getStatusVariant = (status: string) => {
  switch (status) {
    case "ACTIVE":
      return "default";
    case "INACTIVE":
      return "secondary";
    case "SUSPENDED":
      return "destructive";
    default:
      return "outline";
  }
};

const GroupSideBarForm = ({
  form,
  errors = {},
  isEdit = false,
  isSubmitting = false,
}: Props) => {
  const router = useRouter();
  const formData = form.watch();

  // Extract field errors
  const errorMessages = Object.entries(errors)
    .map(([key, value]) => {
      if (value?.message) return `${key}: ${value.message}`;
      return null;
    })
    .filter(Boolean);

  // Get readable type label
  const typeLabel =
    GROUP_TYPES.find((t) => t.value === formData.type)?.label || formData.type;
  const statusLabel =
    GROUP_STATUSES.find((s) => s.value === formData.status)?.label ||
    formData.status;

  return (
    <div className="space-y-6">
      {/* Preview Card */}
      <Card className="sticky top-6">
        <CardHeader>
          <CardTitle className="text-lg">Group Preview</CardTitle>
          <CardDescription>
            Review group details before {isEdit ? "updating" : "creating"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">
                {formData.name || "Untitled Group"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {formData.email || "No email"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Type:</span>
              <Badge variant={getTypeVariant(formData.type)}>{typeLabel}</Badge>
            </div>
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Status:</span>
              <Badge variant={getStatusVariant(formData.status)}>
                {statusLabel}
              </Badge>
            </div>
            {formData.leaderId && (
              <div className="flex items-center gap-2">
                <Crown className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Leader assigned</span>
              </div>
            )}
            {formData.tags && formData.tags.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm">
                  {formData.tags.length} tag
                  {formData.tags.length !== 1 ? "s" : ""}
                </span>
              </div>
            )}
            {formData.location && (
              <div className="text-sm text-muted-foreground">
                📍 {formData.location}
              </div>
            )}
          </div>

          {/* Error messages under preview */}
          {errorMessages.length > 0 && (
            <div className="mb-4">
              {errorMessages.map((msg, i) => (
                <div key={i} className="text-destructive text-xs font-medium">
                  {msg}
                </div>
              ))}
            </div>
          )}

          <Separator />

          <div className="flex flex-row gap-2">
            <Button
              type="submit"
              size="sm"
              className="w-1/2"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : isEdit ? "Update" : "Create"}
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="w-1/2"
              onClick={() => {
                router.push("/groups");
              }}
            >
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GroupSideBarForm;
