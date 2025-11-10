import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const AppearanceContent = () => {
  return (
    <>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label
            htmlFor="theme"
            className="block text-sm font-medium text-gray-700"
          >
            Theme
          </Label>

          <Select defaultValue="system">
            <SelectTrigger id="theme">
              <SelectValue placeholder="Select Theme" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
              <SelectItem value="system">System</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="density"
            className="block text-sm font-medium text-gray-700"
          >
            Interface Density
          </Label>

          <Select defaultValue="comfortable">
            <SelectTrigger id="density">
              <SelectValue placeholder="Select Interface Density" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="compact">Compact</SelectItem>
              <SelectItem value="comfortable">Comfortable</SelectItem>
              <SelectItem value="spacious">Spacious</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </>
  );
};

export default AppearanceContent;
