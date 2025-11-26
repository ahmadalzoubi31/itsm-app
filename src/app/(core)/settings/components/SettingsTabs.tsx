import { Button } from "@/components/ui/button";
import { Globe, Shield, Bell, Palette } from "lucide-react";
import { cn } from "@/lib/utils/cn";

type Tab = {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
};

type SettingsTabsProps = {
  activeTab: string;
  onTabChange: (tabId: string) => void;
};

export const SettingsTabs: React.FC<SettingsTabsProps> = ({
  activeTab,
  onTabChange,
}) => {
  const tabs: Tab[] = [
    { id: "system", label: "System", icon: Globe },
    { id: "security", label: "Security", icon: Shield },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "appearance", label: "Appearance", icon: Palette },
  ];

  return (
    <div className="border-b border-gray-200 mb-6">
      <nav className="flex space-x-8" aria-label="Tabs">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <Button
              size="sm"
              variant="ghost"
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "flex items-center gap-2 py-2 px-1 font-medium text-sm transition-colors duration-200",
                activeTab === tab.id
                  ? "text-gray-900"
                  : "text-gray-500 hover:text-gray-700"
              )}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </Button>
          );
        })}
      </nav>
    </div>
  );
};
