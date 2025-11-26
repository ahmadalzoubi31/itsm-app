import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchEmailSettings, saveEmailSettings } from "../services/email.service";


// Get Email settings
export function useGetOutgoingSettings() {
    return useQuery({
      queryKey: ["outgoingSettings"],
      queryFn: fetchEmailSettings,
      select: (data) => data.outgoing,
      refetchOnWindowFocus: false,
    });
  }
  
  