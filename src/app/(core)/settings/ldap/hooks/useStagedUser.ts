import { useMutation, useQuery } from "@tanstack/react-query";
import { getStagedUsers } from "../services/stage-user.service";
import { StagedUser } from "../types";
import { ApiResponse } from "@/types/globals";
import { importUsers } from "../services/stage-user.service";

export function useStagedUsers() {
  const { data, error, isLoading, refetch } = useQuery<
    ApiResponse<StagedUser[]>
  >({
    queryKey: ["stagedUsers"],
    queryFn: getStagedUsers,
  });

  const users = data?.data ?? [];

  const importMutation = useMutation({
    mutationFn: importUsers,
    onSuccess: () => {
      refetch();
    },
  });

  return {
    users,
    error,
    isLoading,
    refetch,
    importMutation,
  };
}
