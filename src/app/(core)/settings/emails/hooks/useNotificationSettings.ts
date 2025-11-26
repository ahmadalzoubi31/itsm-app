import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchNotificationSettings, saveNotificationSettings } from "../services/email.service";


// Get Email settings
export function useGetNotificationSettings() {
    return useQuery({
      queryKey: ["notificationSettings"],
      queryFn: fetchNotificationSettings,
      select: (data) => data,
      refetchOnWindowFocus: false,
    });
  }
  
  // Save Email settings
  export function useSaveNotificationSettings() {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: saveNotificationSettings,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["notificationSettings"] });
      },
    });
  }``