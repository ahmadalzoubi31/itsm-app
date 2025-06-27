"use client";

import { getBackendUrl } from "@/utils/getBackendUrl";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { AlertCircle, RefreshCw, LogIn, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function SessionExpiredPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";
  const refreshToken = searchParams.get("refreshToken") || "";

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRefresh = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(getBackendUrl("/api/auth/refresh-token"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // very important for cookies!
        body: JSON.stringify({ refreshToken }),
      });

      if (res.ok) {
        // Success: New cookies set by server, reload to original page.
        window.location.href = redirect;
      } else {
        setError("Session could not be refreshed. Please log in again.");
      }
    } catch {
      setError("Network error. Please log in again.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-lg border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
          <CardHeader className="text-center space-y-4 pb-6">
            <div className="mx-auto w-16 h-16 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center">
              <Clock className="w-8 h-8 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="space-y-2">
              <CardTitle className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                Session Expired
              </CardTitle>
              <CardDescription className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Your session has ended for security reasons. You can continue if
                you're still authorized.
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {error && (
              <Alert
                variant="destructive"
                className="animate-in slide-in-from-top-2"
              >
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-3">
              <Button
                onClick={handleRefresh}
                disabled={loading}
                className="w-full h-11 font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                size="lg"
              >
                {loading ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Refreshing Session...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Continue Session
                  </>
                )}
              </Button>

              <Button
                variant="ghost"
                onClick={() => router.push("/auth/sign-in")}
                disabled={loading}
                className="w-full h-11 font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-all duration-200"
                size="lg"
              >
                <LogIn className="mr-2 h-4 w-4" />
                Sign In Again
              </Button>
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
              <p className="text-xs text-center text-slate-500 dark:text-slate-400">
                For your security, sessions expire after a period of inactivity
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
