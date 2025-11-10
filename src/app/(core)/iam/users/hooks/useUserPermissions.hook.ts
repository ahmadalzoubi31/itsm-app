import { useQuery } from "@tanstack/react-query";
import { getUserPermissions } from "../../permissions/services/permission.service";
import { Permission } from "../../permissions/interfaces/permission.interface";
import { User } from "../interfaces/user.interface";

export function useUserPermissionsHook(id: string) {
  const { data, error, isLoading, refetch } = useQuery<User[]>({
    queryKey: ["user-permissions", id],
    queryFn: () => getUserPermissions(id),
  });

  return {
    userPermissions: data,
    error,
    isLoading,
    refetch,
  };
}
