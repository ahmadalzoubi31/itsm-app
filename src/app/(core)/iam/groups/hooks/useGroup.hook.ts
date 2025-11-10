import { useQuery } from "@tanstack/react-query";
import { Group } from "../interfaces/group.interface";
import { getGroupById } from "../services/group.service";

export function useGroupHook(id: string) {
  const { data, error, isLoading, refetch } = useQuery<Group>({
    queryKey: ["group", id],
    queryFn: () => getGroupById(id),
  });

  return {
    group: data,
    error,
    isLoading,
    refetch,
  };
}
