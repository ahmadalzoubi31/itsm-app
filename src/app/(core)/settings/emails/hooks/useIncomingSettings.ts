import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchEmailSettings, saveEmailSettings } from "../services/email.service";


// Get Email settings
export function useGetIncomingSettings() {
    return useQuery({
      queryKey: ["incomingSettings"],
      queryFn: fetchEmailSettings,
      select: (data) => data.data.incoming,
      refetchOnWindowFocus: false,
    });
  }
  
