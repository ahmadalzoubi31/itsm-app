import { useQuery } from "@tanstack/react-query";
import { getUser } from "../services/user.service";
import { User } from "../interfaces/user.interface";

export function useUser(userId: string) {
  const {
    data: user,
    error,
    isLoading,
    refetch,
  } = useQuery<User>({
    queryKey: ["user", userId],
    queryFn: () => getUser(userId),
  });

  return {
    user,
    error,
    isLoading,
    refetch,
  };
}
