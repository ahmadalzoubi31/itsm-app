import { fetchWithAuth } from "@/utils/fetxhWithAuth";
import { getBackendUrl } from "@/utils/getBackendUrl";
import { useQuery } from "@tanstack/react-query";
import { User } from "../types/types";
import { Status } from "../enums/status.enum";
import { ApiResponse } from "@/types/globals";

export const useUser: () => {
  users: User[];
  totalUsers: number;
  newUsers: User[];
  pendingUsers: User[];
  rejectedUsers: User[];
  activeUsers: User[];
  error: Error | null;
  isLoading: boolean;
  refetch: any;
} = () => {
  const { data, error, isLoading, refetch } = useQuery<ApiResponse<User[]>>({
    queryKey: ["user"],
    queryFn: async () => {
      const res = await fetchWithAuth(getBackendUrl("/api/users"), {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch users");
      return res.json();
    },
  });

  const users = data?.data || [];

  // Total Users
  const totalUsers = users.length;

  // New User last 30 days
  const newUsers = users.filter((user) => {
    const userDate = new Date(user.createdAt);
    const today = new Date();
    const diff = today.getTime() - userDate.getTime();
    const diffDays = Math.floor(diff / (1000 * 60 * 60 * 24));
    return diffDays <= 30;
  });

  // Pending Users
  const pendingUsers = users.filter((user) => user.status === Status.PENDING);

  // Rejected Users
  const rejectedUsers = users.filter((user) => user.status === Status.REJECTED);

  // Active Users
  const activeUsers = users.filter((user) => user.status === Status.ACTIVE);

  return {
    users,
    totalUsers,
    newUsers,
    pendingUsers,
    rejectedUsers,
    activeUsers,
    error,
    isLoading,
    refetch,
  };
};
