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
import { PermissionNameEnum } from "@/app/(core)/permissions/constants/permission-name.constant";
import { IconInnerShadowTop } from "@tabler/icons-react";
import { getLoggedUser } from "@/app/(core)/users/services/user.server";
import { RoleEnum } from "@/app/(core)/users/constants/role.constant";

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/",
      icon: "dashboard",
      roles: [RoleEnum.ADMIN, RoleEnum.AGENT],
      permissions: [
        PermissionNameEnum.INCIDENT_MASTER,
        PermissionNameEnum.INCIDENT_USER,
        PermissionNameEnum.INCIDENT_SUBMITTER,
        PermissionNameEnum.INCIDENT_VIEWER,
      ],
    },
    {
      title: "Incidents",
      url: "/incidents",
      icon: "incidents",
      roles: [RoleEnum.ADMIN, RoleEnum.AGENT],
      permissions: [
        PermissionNameEnum.INCIDENT_MASTER,
        PermissionNameEnum.INCIDENT_USER,
        PermissionNameEnum.INCIDENT_SUBMITTER,
        PermissionNameEnum.INCIDENT_VIEWER,
      ],
    },
    {
      title: "Service Requests",
      url: "/service-requests",
      icon: "service-requests",
      roles: [RoleEnum.ADMIN, RoleEnum.AGENT, RoleEnum.USER],
      permissions: [],
    },
    {
      title: "Service Templates",
      url: "/service-templates",
      icon: "service-templates",
      roles: [RoleEnum.ADMIN],
      permissions: [],
    },
    {
      title: "Analytics",
      url: "#",
      icon: "analytics",
      roles: [RoleEnum.ADMIN],
      permissions: [],
    },
    {
      title: "Groups",
      url: "#",
      icon: "groups",
      roles: [RoleEnum.ADMIN, RoleEnum.AGENT],
      permissions: [PermissionNameEnum.Foundation_SupportGroup],
    },
    {
      title: "Users",
      url: "/users",
      icon: "users",
      roles: [RoleEnum.ADMIN, RoleEnum.AGENT],
      permissions: [PermissionNameEnum.Foundation_People],
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "/settings",
      icon: "settings",
      roles: [RoleEnum.ADMIN, RoleEnum.AGENT],
      permissions: [PermissionNameEnum.Foundation_People],
    },
    {
      title: "Get Help",
      url: "#",
      icon: "help",
      roles: [RoleEnum.ADMIN, RoleEnum.AGENT, RoleEnum.USER],
      permissions: [],
    },
    {
      title: "Search",
      url: "#",
      icon: "search",
      roles: [RoleEnum.ADMIN, RoleEnum.AGENT, RoleEnum.USER],
      permissions: [],
    },
  ],
};

async function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const user = await getLoggedUser();

  if (!user) {
    return null;
  }

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
        <NavMain items={data.navMain} user={user!} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}

export default AppSidebar;
