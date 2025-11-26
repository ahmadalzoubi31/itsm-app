import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  saveNotificationSettings,
  testEmailConnection,
  sendTestEmail,
  fetchEmailStatistics,
  saveEmailSettings,
  fetchEmailSettings
} from "../services/email.service";
import {
  EmailSettings,  
  NotificationSettings,
  EmailTestResult,
  EmailStatistics,
  OutgoingEmailEngine,
  IncomingEmailEngine
} from "../types";
import { TestEmailForm } from "../validations/email.schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Get Email settings
export function useGetEmailSettings() {
  return useQuery({
    queryKey: ["emailSettings"],
    queryFn: fetchEmailSettings,
    select: (data) => data.data,
    refetchOnWindowFocus: false,
  });
}

// Save Email settings
export function useSaveEmailSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: saveEmailSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["emailSettings"] });
    },
  });
}


export function useEmailTest() {
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<EmailTestResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const testConnection = async () => {
    try {
      setTesting(true);
      setError(null);
      const response = await testEmailConnection();
      if (response.status === "success" && response.data) {
        setTestResult(response.data);
        if (response.data.success) {
          toast.success("Email connection test successful");
        } else {
          toast.error(`Connection test failed: ${response.data.message}`);
        }
        return response.data;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to test email connection";
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setTesting(false);
    }
  };

  const sendTest = async (testEmail: TestEmailForm) => {
    try {
      setTesting(true);
      setError(null);
      const response = await sendTestEmail(testEmail);
      if (response.status === "success" && response.data) {
        setTestResult(response.data);
        if (response.data.success) {
          toast.success("Test email sent successfully");
        } else {
          toast.error(`Failed to send test email: ${response.data.message}`);
        }
        return response.data;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to send test email";
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setTesting(false);
    }
  };

  return {
    testing,
    testResult,
    error,
    testConnection,
    sendTest,
    clearResult: () => setTestResult(null)
  };
}

export function useEmailStatistics() {
  const [statistics, setStatistics] = useState<EmailStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadStatistics = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetchEmailStatistics();
      if (response.status === "success" && response.data) {
        setStatistics(response.data);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to load email statistics";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStatistics();
  }, []);

  return {
    statistics,
    loading,
    error,
    loadStatistics,
    refreshStatistics: loadStatistics
  };
} 