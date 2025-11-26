"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchCases,
  fetchCaseById,
  fetchCaseByNumber,
  createCase,
  updateCase,
  assignCase,
  changeCaseStatus,
  fetchCaseComments,
  addCaseComment,
  fetchCaseAttachments,
  uploadCaseAttachment,
  fetchCaseTimeline,
} from "../services/case.service";
import {
  ListCasesQuery,
  CreateCaseDto,
  UpdateCaseDto,
  AssignCaseDto,
  ChangeStatusDto,
  CreateCommentDto,
} from "../types";

/**
 * Hook to fetch cases list with filters
 */
export function useCases(params?: ListCasesQuery) {
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["cases", params],
    queryFn: () => fetchCases(params),
  });

  return {
    cases: data,
    items: data?.items || [],
    total: data?.total || 0,
    error,
    isLoading,
    refetch,
  };
}

/**
 * Hook to fetch a single case by ID
 */
export function useCase(caseId: string) {
  const {
    data: caseData,
    error,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["case", caseId],
    queryFn: () => fetchCaseById(caseId),
    enabled: !!caseId,
  });

  return {
    case: caseData,
    error,
    isLoading,
    refetch,
  };
}

/**
 * Hook to fetch a case by number
 */
export function useCaseByNumber(number: string) {
  const {
    data: caseData,
    error,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["case", "number", number],
    queryFn: () => fetchCaseByNumber(number),
    enabled: !!number,
  });

  return {
    case: caseData,
    error,
    isLoading,
    refetch,
  };
}

/**
 * Hook to create a new case
 */
export function useCreateCase() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCaseDto) => createCase(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cases"] });
    },
  });
}

/**
 * Hook to update a case
 */
export function useUpdateCase() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCaseDto }) =>
      updateCase(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["cases"] });
      queryClient.invalidateQueries({ queryKey: ["case", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["case-timeline", variables.id] });
    },
  });
}

/**
 * Hook to assign a case
 */
export function useAssignCase() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: AssignCaseDto }) =>
      assignCase(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["cases"] });
      queryClient.invalidateQueries({ queryKey: ["case", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["case-timeline", variables.id] });
    },
  });
}

/**
 * Hook to change case status
 */
export function useChangeCaseStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ChangeStatusDto }) =>
      changeCaseStatus(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["cases"] });
      queryClient.invalidateQueries({ queryKey: ["case", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["case-timeline", variables.id] });
    },
  });
}

/**
 * Hook to fetch case comments
 */
export function useCaseComments(caseId: string) {
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["case-comments", caseId],
    queryFn: () => fetchCaseComments(caseId),
    enabled: !!caseId,
  });

  return {
    comments: data || [],
    error,
    isLoading,
    refetch,
  };
}

/**
 * Hook to add a comment to a case
 */
export function useAddCaseComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      caseId,
      data,
    }: {
      caseId: string;
      data: CreateCommentDto;
    }) => addCaseComment(caseId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["case-comments", variables.caseId],
      });
    },
  });
}

/**
 * Hook to fetch case attachments
 */
export function useCaseAttachments(caseId: string) {
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["case-attachments", caseId],
    queryFn: () => fetchCaseAttachments(caseId),
    enabled: !!caseId,
  });

  return {
    attachments: data || [],
    error,
    isLoading,
    refetch,
  };
}

/**
 * Hook to upload an attachment to a case
 */
export function useUploadCaseAttachment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ caseId, file }: { caseId: string; file: File }) =>
      uploadCaseAttachment(caseId, file),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["case-attachments", variables.caseId],
      });
    },
  });
}

/**
 * Hook to fetch case timeline events
 */
export function useCaseTimeline(caseId: string) {
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["case-timeline", caseId],
    queryFn: () => fetchCaseTimeline(caseId),
    enabled: !!caseId,
  });

  return {
    timeline: data || [],
    error,
    isLoading,
    refetch,
  };
}
