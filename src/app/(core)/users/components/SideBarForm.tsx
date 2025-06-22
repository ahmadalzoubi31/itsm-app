import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { User, Mail, Shield, UserPlus } from "lucide-react";
import { RoleEnum } from "../constants/role.constant";
import { StatusEnum } from "../constants/status.constant";
import { Permission } from "../../permissions/types";
import { Badge } from "@/components/ui/badge";

type Props = {
  formData: {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    password: string;
    phone: string;
    address: string;
    role: RoleEnum;
    status: StatusEnum;
  };
  selectedPermissions: Permission[];
};

const SideBarForm = ({ formData, selectedPermissions }: Props) => {
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
                {selectedPermissions.length} permissions
              </span>
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <Button type="submit" className="w-full" size="lg">
              <UserPlus className="h-4 w-4 mr-2" />
              Create User
            </Button>
            <Button variant="outline" className="w-full">
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SideBarForm;
