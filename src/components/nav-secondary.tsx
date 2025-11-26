"use client";
import Link from "next/link";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  IconChartBar,
  IconDashboard,
  IconDatabase,
  IconFileWord,
  IconHelp,
  IconListDetails,
  IconSearch,
  IconSettings,
  IconUser,
  IconUsers,
  IconPalette,
} from "@tabler/icons-react";
import { NavigationItem } from "@/utils/navigation-access.utils";

// Map icon names to components
const icons: { [key: string]: React.ComponentType<any> } = {
  dashboard: IconDashboard,
  incidents: IconListDetails,
  analytics: IconChartBar,
  groups: IconUsers,
  users: IconUser,
  settings: IconSettings,
  help: IconHelp,
  search: IconSearch,
  "service-requests": IconFileWord,
  "request-cards": IconDatabase,
  design: IconPalette,
};

interface NavSecondaryProps
  extends React.ComponentPropsWithoutRef<typeof SidebarGroup> {
  items: NavigationItem[];
}

const NavSecondary = ({ items, ...props }: NavSecondaryProps) => {
  // HOOKS
  // Custom Hooks

  // React Hooks

  // EFFECTS

  // HELPERS

  // EVENT HANDLERS

  // EARLY RETURNS

  // RENDER LOGIC

  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => {
            const IconComponent = icons[item.icon];
            if (!IconComponent) {
              console.warn(`Icon not found for: ${item.icon}`);
              return null;
            }
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <Link href={item.url}>
                    <IconComponent />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};

export { NavSecondary };
