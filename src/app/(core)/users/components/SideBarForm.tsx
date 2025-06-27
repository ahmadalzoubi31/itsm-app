import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { User, Mail, Shield } from "lucide-react";
import { RoleEnum } from "../constants/role.constant";
import { StatusEnum } from "../constants/status.constant";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { UseFormReturn } from "react-hook-form";

type Props = {
  form: UseFormReturn<any>;
  errors?: Record<string, any>;
};

const getRoleVariant = (role: RoleEnum) => {
  switch (role) {
    case RoleEnum.ADMIN:
      return "destructive";
    case RoleEnum.AGENT:
      return "default";
    case RoleEnum.USER:
      return "secondary";
    default:
      return "outline";
  }
};

const getStatusVariant = (status: StatusEnum) => {
  return status === StatusEnum.ACTIVE ? "default" : "secondary";
};

const SideBarForm = ({ form, errors = {} }: Props) => {
  const router = useRouter();
  const formData = form.watch(); // 👈 this is the live snapshot of form fields!

  // Extract field errors
  const errorMessages = Object.entries(errors)
    .map(([key, value]) => {
      if (value?.message) return `${key}: ${value.message}`;
      return null;
    })
    .filter(Boolean);

  return (
    <div className="space-y-6">
      {/* Preview Card */}
      <Card className="sticky top-6">
        <CardHeader>
          <CardTitle className="text-lg">User Preview</CardTitle>
          <CardDescription>Review user details before creating</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">
                {formData.firstName} {formData.lastName}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {formData.email || "No email"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Role:</span>
              <Badge variant={getRoleVariant(formData.role)}>
                {formData.role}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Status:</span>
              <Badge variant={getStatusVariant(formData.status)}>
                {formData.status}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                {formData.permissions.length} permissions
              </span>
            </div>
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
            <Button type="submit" className="w-1/2" size="sm">
              {/* <UserPlus className="h-4 w-4 mr-2" /> */}
              Save
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="w-1/2"
              onClick={() => {
                router.push("/users");
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

export default SideBarForm;
