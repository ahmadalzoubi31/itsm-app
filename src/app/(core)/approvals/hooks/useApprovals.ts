// src/app/(core)/approvals/hooks/useApprovals.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  listPendingApprovals,
  approveRequest,
  rejectRequest,
  PendingApproval,
  ApproveRequestDto,
  RejectRequestDto,
} from "../services/approval.service";
import { toast } from "sonner";

export function usePendingApprovals() {
  return useQuery<PendingApproval[]>({
    queryKey: ["pending-approvals"],
    queryFn: listPendingApprovals,
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 60 * 1000, // Refetch every minute
  });
}

export function useApproveRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ requestId, dto }: { requestId: string; dto?: ApproveRequestDto }) =>
      approveRequest(requestId, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pending-approvals"] });
      queryClient.invalidateQueries({ queryKey: ["requests"] });
      toast.success("Request approved successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to approve request");
    },
  });
}

export function useRejectRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ requestId, dto }: { requestId: string; dto: RejectRequestDto }) =>
      rejectRequest(requestId, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pending-approvals"] });
      queryClient.invalidateQueries({ queryKey: ["requests"] });
      toast.success("Request rejected successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to reject request");
    },
  });
}

