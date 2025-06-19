import { getBackendUrl } from "@/utils/getBackendUrl";
import { useQuery } from "@tanstack/react-query";

export function useUser() {
  const { data, error, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const res = await fetch(getBackendUrl("/api/auth/me"), {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Not authenticated");
      return res.json();
    },
  });

  return {
    user: data,
    error,
    isLoading,
  };
}
