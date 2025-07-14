import { useQuery } from "@tanstack/react-query";
import { fetchGroups } from "../services/group.service";
import { Group, GroupFilters } from "../types";
import { ApiResponse } from "@/types/globals";
import { useMemo } from "react";
import { GroupStatusEnum } from "../constants/group-status.constant";
import { GroupTypeEnum } from "../constants/group-type.constant";

export function useGroups(filters?: GroupFilters) {
  const { data, error, isLoading, refetch } = useQuery<ApiResponse<Group[]>>({
    queryKey: ["groups", filters],
    queryFn: () => fetchGroups(filters),
  });

  const groups = data?.data ?? [];

  // Memoized derived data
  const { 
    totalGroups, 
    activeGroups, 
    supportGroups, 
    technicalGroups, 
    pendingGroups,
    groupsByType,
    groupsByStatus 
  } = useMemo(() => {
    const totalGroups = groups.length;

    const activeGroups = groups.filter((group) => group.status === GroupStatusEnum.ACTIVE);
    const supportGroups = groups.filter((group) => group.type === GroupTypeEnum.SUPPORT);
    const technicalGroups = groups.filter((group) => group.type === GroupTypeEnum.TECHNICAL);
    const pendingGroups = groups.filter((group) => group.status === GroupStatusEnum.PENDING);

    // Group by type
    const groupsByType = groups.reduce((acc, group) => {
      acc[group.type] = (acc[group.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Group by status
    const groupsByStatus = groups.reduce((acc, group) => {
      acc[group.status] = (acc[group.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalGroups,
      activeGroups,
      supportGroups,
      technicalGroups,
      pendingGroups,
      groupsByType,
      groupsByStatus,
    };
  }, [groups]);

  return {
    groups,
    totalGroups,
    activeGroups,
    supportGroups,
    technicalGroups,
    pendingGroups,
    groupsByType,
    groupsByStatus,
    error,
    isLoading,
    refetch,
  };
} 