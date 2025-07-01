import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

type SettingToggleProps = {
  id: string;
  label: string;
  description: string;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
};

export const SettingToggle: React.FC<SettingToggleProps> = ({
  id,
  label,
  description,
  defaultChecked = false,
  onChange,
}) => {
  return (
    <div className="flex items-center justify-between">
      <div className="space-y-0.5">
        <Label htmlFor={id} className="text-sm font-medium text-gray-700">
          {label}
        </Label>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <Input
          id={id}
          type="checkbox"
          defaultChecked={defaultChecked}
          onChange={(e) => onChange?.(e.target.checked)}
          className="sr-only peer"
        />
        <Switch />
      </label>
    </div>
  );
};
