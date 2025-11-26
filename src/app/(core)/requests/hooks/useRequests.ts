"use client";

import { useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchRequests,
  fetchRequestById,
  fetchRequestByLinkedCaseId,
  fetchRequestComments,
  addRequestComment,
  fetchRequestAttachments,
  uploadRequestAttachment,
} from "../services/request.service";
import { CreateCommentDto } from "../_lib/_types/";

export function useRequests(params?: {
  page?: number;
  pageSize?: number;
  type?: string;
}) {
  // Create a stable query key by serializing params
  const queryKey = useMemo(
    () => ["requests", params?.page, params?.pageSize, params?.type],
    [params?.page, params?.pageSize, params?.type]
  );

  const { data, error, isLoading, refetch } = useQuery({
    queryKey,
    queryFn: () => fetchRequests(params),
    staleTime: 5 * 60 * 1000, // 5 minutes - data is fresh for 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes - cache for 10 minutes (formerly cacheTime)
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchInterval: false,
    refetchIntervalInBackground: false,
  });

  return {
    requests: data,
    total: data?.total || 0,
    error,
    isLoading,
    refetch,
  };
}

export function useRequest(requestId: string) {
  const {
    data: request,
    error,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["request", requestId],
    queryFn: () => fetchRequestById(requestId),
    enabled: !!requestId,
  });

  return {
    request,
    error,
    isLoading,
    refetch,
  };
}

export function useRequestByLinkedCase(caseId: string) {
  const {
    data: request,
    error,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["request", "linkedCase", caseId],
    queryFn: () => fetchRequestByLinkedCaseId(caseId),
    enabled: !!caseId,
  });

  return {
    request,
    error,
    isLoading,
    refetch,
  };
}

/**
 * Hook to fetch request comments
 */
export function useRequestComments(requestId: string) {
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["request-comments", requestId],
    queryFn: () => fetchRequestComments(requestId),
    enabled: !!requestId,
  });

  return {
    comments: data || [],
    error,
    isLoading,
    refetch,
  };
}

/**
 * Hook to add a comment to a request
 */
export function useAddRequestComment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      requestId,
      data,
    }: {
      requestId: string;
      data: CreateCommentDto;
    }) => addRequestComment(requestId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["request-comments", variables.requestId],
      });
    },
  });
}

/**
 * Hook to fetch request attachments
 */
export function useRequestAttachments(requestId: string) {
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["request-attachments", requestId],
    queryFn: () => fetchRequestAttachments(requestId),
    enabled: !!requestId,
  });

  return {
    attachments: data || [],
    error,
    isLoading,
    refetch,
  };
}

/**
 * Hook to upload an attachment to a request
 */
export function useUploadRequestAttachment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ requestId, file }: { requestId: string; file: File }) =>
      uploadRequestAttachment(requestId, file),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["request-attachments", variables.requestId],
      });
    },
  });
}
