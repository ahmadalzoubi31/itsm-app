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
import { IconInnerShadowTop, IconLoader2 } from "@tabler/icons-react";
import { getCurrentUser } from "@/app/auth/services/auth.service";
import { useEffect, useState, useMemo } from "react";
import {
  filterNavigationItems,
  NavigationItem,
} from "@/utils/navigation-access.utils";
import { User } from "@/app/(core)/iam/users/interfaces/user.interface";

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
    // {
    //   title: "Cases",
    //   url: "/cases",
    //   icon: "cases",
    //   roles: ["admin", "agent"],
    //   permissions: [],
    // },
    // {
    //   title: "Service Requests",
    //   url: "/service-requests",
    //   icon: "service-requests",
    //   roles: ["admin", "agent", "end_user"],
    //   permissions: [],
    // },
    // {
    //   title: "Service Cards",
    //   url: "/service-cards",
    //   icon: "service-cards",
    //   roles: ["admin"],
    //   permissions: [],
    // },
    // {
    //   title: "Analytics",
    //   url: "#",
    //   icon: "analytics",
    //   roles: ["admin"],
    //   permissions: [],
    // },
    // {
    //   title: "Groups",
    //   url: "/groups",
    //   icon: "groups",
    //   roles: ["admin", "agent"],
    //   permissions: [],
    // },
    {
      title: "Identity & Access Management",
      url: "/iam",
      icon: "shield",
      roles: ["admin", "agent"],
      permissions: [],
    },
    {
      title: "Users",
      url: "/iam/users",
      icon: "users",
      roles: ["admin", "agent"],
      permissions: [],
    },
    // {
    //   title: "Design Demo",
    //   url: "/design-demo",
    //   icon: "design",
    //   roles: ["admin", "agent", "end_user"],
    //   permissions: [],
    // },
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

function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const [user, setUser] = useState<User>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setIsLoading(true);
        const user = await getCurrentUser();
        setUser(user);
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, []);

  // Filter navigation items based on user access
  const filteredNavMain = useMemo(
    () => filterNavigationItems(data.navMain, user),
    [user]
  );

  const filteredNavSecondary = useMemo(
    () => filterNavigationItems(data.navSecondary, user),
    [user]
  );

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
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <IconLoader2 className="size-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            <NavMain items={filteredNavMain} />
            <NavSecondary items={filteredNavSecondary} className="mt-auto" />
          </>
        )}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user || null} />
      </SidebarFooter>
    </Sidebar>
  );
}

export default AppSidebar;
