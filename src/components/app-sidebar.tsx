import { use } from "react";
import { getCurrentUserServer } from "@/app/auth/services/auth.service.server";
import AppSidebarClient from "./app-sidebar-client";
import { Sidebar } from "@/components/ui/sidebar";

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {}

const AppSidebar = ({ ...props }: AppSidebarProps) => {
  // HOOKS
  // Custom Hooks

  // React Hooks
  const userPromise = getCurrentUserServer();
  const user = use(userPromise);

  // EFFECTS

  // HELPERS

  // EVENT HANDLERS

  // EARLY RETURNS

  // RENDER LOGIC

  return <AppSidebarClient user={user} {...props} />;
};

export default AppSidebar;
