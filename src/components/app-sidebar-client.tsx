"use client";
import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "./nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { IconInnerShadowTop } from "@tabler/icons-react";
import { useMemo } from "react";
import {
  filterNavigationItems,
  NavigationItem,
} from "@/lib/utils/navigation-access.utils";
import { User } from "@/app/(core)/iam/users/_lib/_types/user.type";

const data: {
  navMain: NavigationItem[];
  navSecondary: NavigationItem[];
} = {
  navMain: [
    {
      title: "Dashboard",
      url: "/",
      icon: "dashboard",
      roles: ["admin", "agent"],
      permissions: [],
    },
    {
      title: "Cases",
      url: "/cases",
      icon: "ticket",
      roles: ["admin", "agent"],
      permissions: [],
    },
    {
      title: "Service Catalog",
      url: "/catalog",
      icon: "store",
      roles: ["admin", "agent", "end_user"],
      permissions: [],
    },
    {
      title: "My Requests",
      url: "/requests",
      icon: "service-requests",
      roles: ["admin", "agent", "end_user"],
      permissions: [],
    },
    {
      title: "Approvals",
      url: "/approvals",
      icon: "check-circle",
      roles: ["admin", "agent", "end_user"],
      permissions: [],
    },
    {
      title: "Identity & Access Management",
      url: "/iam",
      icon: "shield",
      roles: ["admin"],
      permissions: [],
    },
    {
      title: "Users",
      url: "/iam/users",
      icon: "users",
      roles: ["admin"],
      permissions: [],
    },
    {
      title: "Groups",
      url: "/iam/groups",
      icon: "groups",
      roles: ["admin"],
      permissions: [],
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "/settings",
      icon: "settings",
      roles: ["admin", "agent"],
      permissions: [],
    },
    {
      title: "Get Help",
      url: "#",
      icon: "help",
      roles: ["admin", "agent", "end_user"],
      permissions: [],
    },
    {
      title: "Search",
      url: "#",
      icon: "search",
      roles: ["admin", "agent", "end_user"],
      permissions: [],
    },
  ],
};

interface AppSidebarClientProps extends React.ComponentProps<typeof Sidebar> {
  user: User | null;
}

const AppSidebarClient = ({ user, ...props }: AppSidebarClientProps) => {
  // HOOKS
  // Custom Hooks

  // React Hooks
  const filteredNavMain = useMemo(
    () => filterNavigationItems(data.navMain, user),
    [user]
  );

  const filteredNavSecondary = useMemo(
    () => filterNavigationItems(data.navSecondary, user),
    [user]
  );

  // EFFECTS

  // HELPERS

  // EVENT HANDLERS

  // EARLY RETURNS

  // RENDER LOGIC

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">QoreDesk</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={filteredNavMain} />
        <NavSecondary items={filteredNavSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebarClient;
