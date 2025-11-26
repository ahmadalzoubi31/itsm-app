"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useRefreshToken } from "../hooks";
import { Suspense } from "react";
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

interface SessionExpiredContentProps {}

const SessionExpiredContent = ({}: SessionExpiredContentProps) => {
  // HOOKS
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refresh, loading, error: refreshError } = useRefreshToken();

  // EFFECTS

  // HELPERS
  const redirect = searchParams.get("redirect") || "/";
  const refreshToken = searchParams.get("refreshToken") || "";

  // EVENT HANDLERS
  const handleRefresh = async () => {
    const result = await refresh({ refreshToken });
    if (result.success) {
      // Success: New cookies set by server, reload to original page.
      window.location.href = redirect;
    }
  };

  // EARLY RETURNS

  // RENDER LOGIC
  const error = refreshError || "";

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
                size="sm"
                onClick={handleRefresh}
                disabled={loading}
                className="w-full h-11 font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
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
                size="sm"
                variant="ghost"
                onClick={() => router.push("/auth/sign-in")}
                disabled={loading}
                className="w-full h-11 font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-all duration-200"
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
};

interface LoadingFallbackProps {}

const LoadingFallback = ({}: LoadingFallbackProps) => {
  // HOOKS

  // EFFECTS

  // HELPERS

  // EVENT HANDLERS

  // EARLY RETURNS

  // RENDER LOGIC

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-lg border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
          <CardHeader className="text-center space-y-4 pb-6">
            <div className="mx-auto w-16 h-16 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center">
              <Clock className="w-8 h-8 text-amber-600 dark:text-amber-400 animate-pulse" />
            </div>
            <div className="space-y-2">
              <CardTitle className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                Loading...
              </CardTitle>
            </div>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
};

interface SessionExpiredPageProps {}

const SessionExpiredPage = ({}: SessionExpiredPageProps) => {
  // HOOKS

  // EFFECTS

  // HELPERS

  // EVENT HANDLERS

  // EARLY RETURNS

  // RENDER LOGIC

  return (
    <Suspense fallback={<LoadingFallback />}>
      <SessionExpiredContent />
    </Suspense>
  );
};

export default SessionExpiredPage;
