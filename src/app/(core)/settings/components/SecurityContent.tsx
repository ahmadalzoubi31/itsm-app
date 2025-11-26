import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SettingToggle } from "./SettingToggle";

const SecurityContent = () => {
  return (
    <>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label
            htmlFor="session-timeout"
            className="block text-sm font-medium text-gray-700"
          >
            Session Timeout (minutes)
          </Label>

          <Select defaultValue="15">
            <SelectTrigger id="session-timeout">
              <SelectValue placeholder="Select Session Timeout" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="15">15 minutes</SelectItem>
              <SelectItem value="30">30 minutes</SelectItem>
              <SelectItem value="60">1 hour</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="password-policy"
            className="block text-sm font-medium text-gray-700"
          >
            Password Policy
          </Label>

          <Select defaultValue="strong">
            <SelectTrigger id="password-policy">
              <SelectValue placeholder="Select Password Policy" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="basic">Basic</SelectItem>
              <SelectItem value="strong">Strong</SelectItem>
              <SelectItem value="enterprise">Enterprise</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <SettingToggle
        id="two-factor"
        label="Two-Factor Authentication"
        description="Require 2FA for all user accounts"
        defaultChecked
      />
      <SettingToggle
        id="login-monitoring"
        label="Login Attempt Monitoring"
        description="Monitor and alert on failed login attempts"
        defaultChecked
      />
    </>
  );
};

export default SecurityContent;
