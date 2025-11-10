import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SettingToggle } from "./SettingToggle";

const NotificationsContent = () => {
  return (
    <>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label
            htmlFor="email-notifications"
            className="block text-sm font-medium text-gray-700"
          >
            Email Notifications
          </Label>

          <Select defaultValue="important">
            <SelectTrigger id="email-notifications">
              <SelectValue placeholder="Select Email Notifications" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All notifications</SelectItem>
              <SelectItem value="important">Important only</SelectItem>
              <SelectItem value="none">None</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="alert-frequency"
            className="block text-sm font-medium text-gray-700"
          >
            Alert Frequency
          </Label>

          <Select defaultValue="realtime">
            <SelectTrigger id="alert-frequency">
              <SelectValue placeholder="Select Alert Frequency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="realtime">Real-time</SelectItem>
              <SelectItem value="hourly">Hourly digest</SelectItem>
              <SelectItem value="daily">Daily digest</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <SettingToggle
        id="push-notifications"
        label="Push Notifications"
        description="Receive push notifications for critical alerts"
        defaultChecked
      />
      <SettingToggle
        id="sms-alerts"
        label="SMS Alerts"
        description="Send SMS for high-priority incidents"
      />
    </>
  );
};

export default NotificationsContent;
