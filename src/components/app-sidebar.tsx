"use client";

import * as React from "react";
import {
  IconChartBar,
  IconDashboard,
  IconDatabase,
  IconFileWord,
  IconHelp,
  IconInnerShadowTop,
  IconListDetails,
  IconReport,
  IconSearch,
  IconSettings,
  IconUser,
  IconUsers,
} from "@tabler/icons-react";

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
import { PermissionName } from "@/app/(core)/permissions/data/enums";
import { useUser } from "@/app/(core)/users/hooks/useUser";

const data = {
  user: {
    name: "",
    email: "",
    avatar: "https://avatars.githubusercontent.com/u/1?v=4", // Placeholder avatar
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/",
      icon: IconDashboard,
      roles: ["admin", "agent"],
      permissions: [
        PermissionName.INCIDENT_MASTER,
        PermissionName.INCIDENT_USER,
        PermissionName.INCIDENT_SUBMITTER,
        PermissionName.INCIDENT_VIEWER,
      ],
    },
    {
      title: "Incidents",
      url: "/incidents",
      icon: IconListDetails,
      roles: ["admin", "agent"],
      permissions: [
        PermissionName.INCIDENT_MASTER,
        PermissionName.INCIDENT_USER,
        PermissionName.INCIDENT_SUBMITTER,
        PermissionName.INCIDENT_VIEWER,
      ],
    },
    {
      title: "Analytics",
      url: "#",
      icon: IconChartBar,
      roles: ["admin"],
      permissions: [],
    },
    {
      title: "Groups",
      url: "#",
      icon: IconUsers,
      roles: ["admin", "agent"],
      permissions: [PermissionName.Foundation_SupportGroup],
    },
    {
      title: "Users",
      url: "/users",
      icon: IconUser,
      roles: ["admin", "agent"],
      permissions: [PermissionName.Foundation_People],
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: IconSettings,
    },
    {
      title: "Get Help",
      url: "#",
      icon: IconHelp,
    },
    {
      title: "Search",
      url: "#",
      icon: IconSearch,
    },
  ],
  documents: [
    {
      name: "Data Library",
      url: "#",
      icon: IconDatabase,
    },
    {
      name: "Reports",
      url: "#",
      icon: IconReport,
    },
    {
      name: "Word Assistant",
      url: "#",
      icon: IconFileWord,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user, isLoading } = useUser();
  console.log(user);

  if (isLoading) return null; // or spinner

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
        <NavMain items={data.navMain} user={user.data} />
        {/* <NavDocuments items={data.documents} /> */}
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user.data} />
      </SidebarFooter>
    </Sidebar>
  );
}
