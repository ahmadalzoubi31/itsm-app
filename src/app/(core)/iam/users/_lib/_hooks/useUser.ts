import { useQuery } from "@tanstack/react-query";
import type { User } from "@/app/(core)/iam/users/_lib/_types";
import { getUser } from "@/app/(core)/iam/users/_lib/_services/user.service";

export function useUser(id: string) {
  const query = useQuery<User>({
    queryKey: ["user", id],
    queryFn: () => getUser(id),
    enabled: Boolean(id),
  });

  return {
    user: query.data,
    error: query.error,
    isLoading: query.isLoading,
    refetch: query.refetch,
  };
}
