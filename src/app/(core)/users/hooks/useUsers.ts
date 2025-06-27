import { useQuery } from "@tanstack/react-query";
import { fetchUsers } from "../services/user.service";
import { User } from "../types";
import { StatusEnum } from "../constants/status.constant";
import { ApiResponse } from "@/types/globals";
import { useMemo } from "react";
import { RoleEnum } from "../constants/role.constant";

export function useUsers() {
  const { data, error, isLoading, refetch } = useQuery<ApiResponse<User[]>>({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  const users = data?.data ?? [];

  // Memoized derived data
  const { totalUsers, newUsers, pendingUsers, rejectedUsers, agentUsers } =
    useMemo(() => {
      const totalUsers = users.length;

      const today = new Date();

      const newUsers = users.filter((user) => {
        const userDate = new Date(user.createdAt);
        const diffDays =
          (today.getTime() - userDate.getTime()) / (1000 * 60 * 60 * 24);
        return diffDays <= 30;
      });

      const pendingUsers = users.filter(
        (user) => user.status === StatusEnum.PENDING
      );

      const rejectedUsers = users.filter(
        (user) => user.status === StatusEnum.REJECTED
      );

      const agentUsers = users.filter((user) => user.role === RoleEnum.AGENT);

      return {
        totalUsers,
        newUsers,
        pendingUsers,
        rejectedUsers,
        agentUsers,
      };
    }, [users]);

  return {
    users,
    totalUsers,
    newUsers,
    pendingUsers,
    rejectedUsers,
    agentUsers,
    error,
    isLoading,
    refetch,
  };
}
