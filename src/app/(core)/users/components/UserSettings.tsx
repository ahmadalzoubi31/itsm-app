import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ROLES } from "../constants/role.constant";
import { STATUSES } from "../constants/status.constant";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Settings } from "lucide-react";
import { RoleEnum } from "../constants/role.constant";
import { StatusEnum } from "../constants/status.constant";

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
  onChange: (field: string, value: string) => void;
};

export default function UserSettings({ formData, onChange }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Account Settings
        </CardTitle>
        <CardDescription>
          Configure user role and account status
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <Label>User Role</Label>
            <Select
              value={formData.role}
              onValueChange={(value) => onChange("role", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={RoleEnum.ADMIN}>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full" />
                    Administrator
                  </div>
                </SelectItem>
                <SelectItem value={RoleEnum.AGENT}>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                    Agent
                  </div>
                </SelectItem>
                <SelectItem value={RoleEnum.USER}>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    User
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label>Account Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => onChange("status", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={StatusEnum.ACTIVE}>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    Active
                  </div>
                </SelectItem>
                <SelectItem value={StatusEnum.INACTIVE}>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-gray-500 rounded-full" />
                    Inactive
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
