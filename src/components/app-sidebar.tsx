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
import { IconInnerShadowTop } from "@tabler/icons-react";
import { getLoggedUser } from "@/app/(core)/users/data/getLoggedUser";

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/",
      icon: "dasboard",
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
      icon: "incidents",
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
      icon: "analytics",
      roles: ["admin"],
      permissions: [],
    },
    {
      title: "Groups",
      url: "#",
      icon: "groups",
      roles: ["admin", "agent"],
      permissions: [PermissionName.Foundation_SupportGroup],
    },
    {
      title: "Users",
      url: "/users",
      icon: "users",
      roles: ["admin", "agent"],
      permissions: [PermissionName.Foundation_People],
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: "settings",
    },
    {
      title: "Get Help",
      url: "#",
      icon: "help",
    },
    {
      title: "Search",
      url: "#",
      icon: "search",
    },
  ],
};

async function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const user = await getLoggedUser();

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
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user.data} />
      </SidebarFooter>
    </Sidebar>
  );
}

export default AppSidebar;
