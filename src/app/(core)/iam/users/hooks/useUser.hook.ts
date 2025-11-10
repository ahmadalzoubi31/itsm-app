import { useQuery } from "@tanstack/react-query";
import { getUser } from "../services/user.service";
import { User } from "../interfaces/user.interface";

export function useUserHook(id: string) {
  const { data, error, isLoading, refetch } = useQuery<User>({
    queryKey: ["user", id],
    queryFn: () => getUser(id),
  });

  return {
    user: data,
    error,
    isLoading,
    refetch,
  };
}
