import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { listUsers } from "@/app/(core)/iam/users/_lib/_services/user.service";
import type { User } from "@/app/(core)/iam/users/_lib/_types";

export function useUsers(initialData?: User[]) {
  const query = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: listUsers,
    initialData,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    retry: false,
  });

  const users = query.data ?? [];

  const { totalUsers, newUsers, manualUsers, importedUsers, agentUsers } =
    useMemo(() => {
      const totalUsers = users.length;
      const today = new Date();

      const newUsers = users.filter((user) => {
        const userDate = new Date(user.createdAt);
        const diffDays =
          (today.getTime() - userDate.getTime()) / (1000 * 60 * 60 * 24);
        return diffDays <= 30;
      });

      const manualUsers = users.filter(
        (user) => user.authSource === "local" && !user.externalId
      );

      const importedUsers = users.filter(
        (user) => user.authSource === "ldap" && user.externalId
      );

      const agentUsers = users.filter((user) =>
        (user.roles ?? []).some((r) => r.key === "agent")
      );

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
    error: query.error,
    isLoading: query.isLoading,
    refetch: query.refetch,
  };
}
