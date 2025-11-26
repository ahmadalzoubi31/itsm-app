import { useMutation, useQuery } from "@tanstack/react-query";
import { getStagedUsers } from "../services/stage-user.service";
import { StagedUser } from "../types";
import { importUsers, rejectUsers } from "../services/stage-user.service";

export function useStagedUsers() {
  const { data, error, isLoading, refetch } = useQuery<StagedUser[]>({
    queryKey: ["stagedUsers"],
    queryFn: getStagedUsers,
  });

  const users = data ?? [];

  const importMutation = useMutation({
    mutationFn: importUsers,
    onSuccess: () => {
      refetch();
    },
  });

  const rejectMutation = useMutation({
    mutationFn: rejectUsers,
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
    rejectMutation,
  };
}
