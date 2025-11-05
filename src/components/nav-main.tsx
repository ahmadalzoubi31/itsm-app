"use client";

import { IconCirclePlusFilled, IconMail, type Icon } from "@tabler/icons-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
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
  IconPalette,
  IconLock,
  IconShield,
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
  "service-cards": IconDatabase,
  design: IconPalette,
  lock: IconLock,
  shield: IconShield,
  // add other mappings as needed
};

export function NavMain({ items }: { items: NavigationItem[] }) {
  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <SidebarMenuButton
              asChild
              tooltip="Quick Create"
              className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear"
            >
              <Link href="/incidents/create">
                <IconCirclePlusFilled />
                <span className="leading-8">Quick Create</span>
              </Link>
            </SidebarMenuButton>
            <Button
              size="icon"
              className="size-8 group-data-[collapsible=icon]:opacity-0"
              variant="outline"
            >
              <IconMail />
              <span className="sr-only">Inbox</span>
            </Button>
          </SidebarMenuItem>
        </SidebarMenu>
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
}
