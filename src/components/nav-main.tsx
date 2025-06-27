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
  "service-requests": IconFileWord,
  // add other mappings as needed
};

export function NavMain({
  items,
  user,
}: {
  items: {
    title: string;
    url: string;
    icon: string;
    roles: string[];
    permissions: string[];
  }[];
  user: {
    id: string;
    fullName: string;
    email: string;
    role: string;
    permissions: Array<string>;
  };
}) {
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
            const IconComponent = icons[item.icon]; // lookup the icon
            return (
              <SidebarMenuItem key={item.title}>
                {item.roles.includes(user.role) &&
                  (!item.permissions ||
                    item.permissions.length === 0 ||
                    item.permissions.some((perm) =>
                      user.permissions.includes(perm)
                    )) && (
                    <SidebarMenuButton
                      tooltip={item.title}
                      className="cursor-pointer"
                      asChild
                    >
                      <Link href={item.url}>
                        {IconComponent && <IconComponent />}
                        <span className="leading-8">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  )}
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
