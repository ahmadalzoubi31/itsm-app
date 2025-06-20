"use client";

import * as React from "react";
import { type Icon } from "@tabler/icons-react";

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
  IconReport,
  IconSearch,
  IconSettings,
  IconUser,
  IconUsers,
} from "@tabler/icons-react";
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
  // add other mappings as needed
};
export function NavSecondary({
  items,
  ...props
}: {
  items: {
    title: string;
    url: string;
    icon: string;
  }[];
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => {
            const IconComponent = icons[item.icon]; // lookup the icon
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <a href={item.url}>
                    <IconComponent />
                    <span>{item.title}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
