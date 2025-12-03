"use client";
import { IconCirclePlusFilled, IconMail } from "@tabler/icons-react";
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
  IconSearch,
  IconSettings,
  IconUser,
  IconUsers,
  IconPalette,
  IconLock,
  IconShield,
  IconBrandAppstore,
  IconCircleCheck,
} from "@tabler/icons-react";
import { NavigationItem } from "@/lib/utils/navigation-access.utils";

// Map icon names to components
const icons: { [key: string]: React.ComponentType<any> } = {
  dashboard: IconDashboard,
  ticket: IconListDetails,
  analytics: IconChartBar,
  groups: IconUsers,
  users: IconUser,
  settings: IconSettings,
  help: IconHelp,
  search: IconSearch,
  "service-requests": IconFileWord,
  "request-cards": IconDatabase,
  design: IconPalette,
  lock: IconLock,
  shield: IconShield,
  store: IconBrandAppstore,
  "check-circle": IconCircleCheck,
};

interface NavMainProps {
  items: NavigationItem[];
}

const NavMain = ({ items }: NavMainProps) => {
  // HOOKS
  // Custom Hooks

  // React Hooks

  // EFFECTS

  // HELPERS

  // EVENT HANDLERS

  // EARLY RETURNS

  // RENDER LOGIC

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
              size="sm"
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
};

export { NavMain };
