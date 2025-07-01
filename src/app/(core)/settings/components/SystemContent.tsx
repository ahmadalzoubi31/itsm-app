import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SettingToggle } from "./SettingToggle";

const SystemContent = () => {
  return (
    <>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label
            htmlFor="system-name"
            className="block text-sm font-medium text-gray-700"
          >
            System Name
          </Label>

          <Select defaultValue="Production System">
            <SelectTrigger id="system-name">
              <SelectValue placeholder="Select System Name" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Production System">
                Production System
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="timezone"
            className="block text-sm font-medium text-gray-700"
          >
            Timezone
          </Label>

          <Select defaultValue="utc">
            <SelectTrigger id="timezone">
              <SelectValue placeholder="Select Timezone" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="utc">UTC</SelectItem>
              <SelectItem value="est">Eastern Time</SelectItem>
              <SelectItem value="pst">Pacific Time</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <SettingToggle
        id="debug-mode"
        defaultChecked
        label="Enable Debug Mode"
        description="Show detailed error messages and logs"
      />
      <SettingToggle
        id="auto-backup"
        label="Auto-backup"
        description="Automatically backup system data daily"
        defaultChecked
      />
    </>
  );
};

export default SystemContent;
