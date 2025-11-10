import { useQuery } from "@tanstack/react-query";
import { listUsers } from "../services/user.service";
import { useMemo } from "react";
import { User } from "../interfaces/user.interface";

export function useUsersHook() {
  const { data, error, isLoading, refetch } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: listUsers,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    retry: false,
  });

  const users = data ?? [];

  // Memoized derived data
  const { totalUsers, newUsers, manualUsers, importedUsers, agentUsers } =
    useMemo(() => {
      const totalUsers = users.length;

      const today = new Date();

      const newUsers = users.filter((user: User) => {
        const userDate = new Date(user.createdAt);
        const diffDays =
          (today.getTime() - userDate.getTime()) / (1000 * 60 * 60 * 24);
        return diffDays <= 30;
      });

      // Manual users are local auth users (no externalId)
      const manualUsers = users.filter(
        (user: User) => user.authSource === "local" && !user.externalId
      );

      // Imported users are LDAP users (have externalId)
      const importedUsers = users.filter(
        (user: User) => user.authSource === "ldap" && user.externalId
      );

      // Check for agent role in userRoles relation
      const agentUsers = users.filter((user: User) => {
        const roles = user.roles || [];
        return roles.some((r) => r.key === "agent");
      });

      return {
        totalUsers,
        newUsers,
        manualUsers,
        importedUsers,
        agentUsers,
      };
    }, [users]);

  return {
    users,
    totalUsers,
    newUsers,
    manualUsers,
    importedUsers,
    agentUsers,
    error,
    isLoading,
    refetch,
  };
}
