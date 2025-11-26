"use client";

import { useEffect, useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Clock, AlertTriangle } from "lucide-react";
import { SlaTimer } from "../types";
import { cn } from "@/lib/utils/cn";
import { format } from "date-fns";

interface SLATimerProps {
  timer: SlaTimer;
  className?: string;
  showLabel?: boolean;
}

/**
 * Formats milliseconds into a human-readable duration
 */
function formatDuration(ms: number): string {
  if (ms < 0) {
    return "Breached";
  }

  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days}d ${hours % 24}h`;
  }
  if (hours > 0) {
    return `${hours}h ${minutes % 60}m`;
  }
  if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  }
  return `${seconds}s`;
}

/**
 * Calculates the current remaining time based on timer state
 */
function calculateRemainingTime(timer: SlaTimer): number {
  if (
    timer.status === "Stopped" ||
    timer.status === "Met" ||
    timer.status === "Breached"
  ) {
    return timer.remainingMs;
  }

  if (timer.status === "Paused") {
    return timer.remainingMs;
  }

  // For Running status, calculate based on lastTickAt and remainingMs
  if (timer.status === "Running" && timer.lastTickAt) {
    const lastTick = new Date(timer.lastTickAt).getTime();
    const now = Date.now();
    const elapsed = now - lastTick;
    return Math.max(0, timer.remainingMs - elapsed);
  }

  // Fallback to remainingMs
  return timer.remainingMs;
}

/**
 * Determines the variant/color based on remaining time and status
 */
function getTimerVariant(
  timer: SlaTimer,
  remainingMs: number
): {
  variant: "default" | "secondary" | "destructive" | "outline";
  className: string;
} {
  if (timer.status === "Breached") {
    return { variant: "destructive" as const, className: "animate-pulse" };
  }

  if (timer.status === "Met" || timer.status === "Stopped") {
    return { variant: "secondary" as const, className: "" };
  }

  if (timer.status === "Paused") {
    return { variant: "outline" as const, className: "opacity-60" };
  }

  // For Running status, use color based on remaining time
  const percentage = timer.target
    ? (remainingMs / timer.target.goalMs) * 100
    : 100;

  if (percentage <= 10) {
    return { variant: "destructive" as const, className: "animate-pulse" };
  }
  if (percentage <= 25) {
    return { variant: "destructive" as const, className: "" };
  }
  if (percentage <= 50) {
    return { variant: "default" as const, className: "" };
  }

  return { variant: "secondary" as const, className: "" };
}

export function SLATimer({
  timer,
  className,
  showLabel = true,
}: SLATimerProps) {
  const [remainingMs, setRemainingMs] = useState(() =>
    calculateRemainingTime(timer)
  );

  useEffect(() => {
    if (timer.status !== "Running") {
      setRemainingMs(calculateRemainingTime(timer));
      return;
    }

    // Update every second for running timers
    const interval = setInterval(() => {
      const newRemaining = calculateRemainingTime(timer);
      setRemainingMs(newRemaining);

      // If timer has breached, stop updating
      if (newRemaining <= 0) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const { variant, className: variantClassName } = useMemo(
    () => getTimerVariant(timer, remainingMs),
    [timer, remainingMs]
  );

  const formattedTime = formatDuration(remainingMs);
  const isBreached = remainingMs < 0 || timer.status === "Breached";
  const isPaused = timer.status === "Paused";

  return (
    <Badge
      variant={variant}
      className={cn(
        "flex items-center gap-1.5 font-mono text-xs",
        variantClassName,
        className
      )}
      title={
        timer.target
          ? `${timer.target.name}: ${formattedTime} remaining`
          : formattedTime
      }
    >
      {isBreached ? (
        <AlertTriangle className="h-3 w-3" />
      ) : (
        <Clock className="h-3 w-3" />
      )}
      {showLabel && timer.target && (
        <span className="font-normal mr-1">{timer.target.name}:</span>
      )}
      <span>{formattedTime}</span>
      {isPaused && <span className="text-xs opacity-70">(Paused)</span>}
    </Badge>
  );
}

/**
 * Component to display multiple SLA timers
 */
interface SLATimersProps {
  timers?: SlaTimer[];
  className?: string;
  maxDisplay?: number;
}

export function SLATimers({
  timers = [],
  className,
  maxDisplay = 2,
}: SLATimersProps) {
  if (!timers || timers.length === 0) {
    return null;
  }

  // Filter to only show active/running timers, or all if none are running
  const activeTimers = timers.filter(
    (t) => t.status === "Running" || t.status === "Paused"
  );
  const timersToShow =
    activeTimers.length > 0 ? activeTimers : timers.slice(0, maxDisplay);

  // Sort by remaining time (most urgent first)
  const sortedTimers = [...timersToShow].sort((a, b) => {
    const aRemaining = calculateRemainingTime(a);
    const bRemaining = calculateRemainingTime(b);
    return aRemaining - bRemaining;
  });

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {sortedTimers.slice(0, maxDisplay).map((timer) => (
        <SLATimer key={timer.id} timer={timer} showLabel={true} />
      ))}
      {sortedTimers.length > maxDisplay && (
        <Badge variant="outline" className="text-xs">
          +{sortedTimers.length - maxDisplay} more
        </Badge>
      )}
    </div>
  );
}

/**
 * SLA Timer with Progress Bar - for detail views
 */
interface SLATimerProgressProps {
  timer: SlaTimer;
  className?: string;
}

export function SLATimerProgress({ timer, className }: SLATimerProgressProps) {
  const [remainingMs, setRemainingMs] = useState(() =>
    calculateRemainingTime(timer)
  );

  useEffect(() => {
    if (timer.status !== "Running") {
      setRemainingMs(calculateRemainingTime(timer));
      return;
    }

    const interval = setInterval(() => {
      const newRemaining = calculateRemainingTime(timer);
      setRemainingMs(newRemaining);

      if (newRemaining <= 0) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const goalMs = timer.target?.goalMs || 0;
  const percentage = goalMs > 0 ? (remainingMs / goalMs) * 100 : 0;
  const isBreached = remainingMs < 0 || timer.status === "Breached";
  const isPaused = timer.status === "Paused";
  const isRunning = timer.status === "Running";
  const formattedTime = formatDuration(remainingMs);

  // Determine progress bar color using design system colors
  const getProgressColor = () => {
    if (isBreached) return "bg-destructive";
    if (percentage <= 10) return "bg-destructive";
    if (percentage <= 25) return "bg-chart-4"; // Warning - darker chart color
    if (percentage <= 50) return "bg-chart-2"; // Caution - medium chart color
    return "bg-primary"; // Good status - primary brand color
  };

  const progressColor = getProgressColor();

  // Format timestamp helper
  const formatTimestamp = (timestamp?: string, includeSeconds = false) => {
    if (!timestamp) return null;
    try {
      const date = new Date(timestamp);
      return format(date, includeSeconds ? "PPpp" : "PPp");
    } catch {
      return null;
    }
  };

  // Calculate when the timer will breach (for running/paused timers)
  const calculateBreachTime = () => {
    if (isBreached || (!isRunning && !isPaused)) return null;

    try {
      // Calculate breach time: startedAt + goalMs - totalPausedMs
      const startedAt = new Date(timer.startedAt).getTime();
      const totalPausedMs = timer.totalPausedMs || 0;
      let breachTime = new Date(startedAt + goalMs - totalPausedMs);

      // If paused, add the current pause duration
      if (isPaused && timer.pausedAt) {
        const pausedAt = new Date(timer.pausedAt).getTime();
        const currentPauseDuration = Date.now() - pausedAt;
        breachTime = new Date(breachTime.getTime() + currentPauseDuration);
      }

      return breachTime;
    } catch {
      return null;
    }
  };

  const breachedTime =
    isBreached && timer.breachedAt
      ? formatTimestamp(timer.breachedAt, true)
      : null;

  const willBreachAt = calculateBreachTime();
  const willBreachAtFormatted = willBreachAt
    ? formatTimestamp(willBreachAt.toISOString(), true)
    : null;

  return (
    <div
      className={cn("space-y-2 p-3 rounded-lg border bg-muted/50", className)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isBreached ? (
            <AlertTriangle className="h-4 w-4 text-destructive" />
          ) : (
            <Clock className="h-4 w-4 text-primary" />
          )}
          <span className="text-sm font-medium">
            {timer.target?.name || "SLA Timer"}
          </span>
        </div>
        <Badge
          variant={
            isBreached ? "destructive" : isPaused ? "outline" : "secondary"
          }
          className="text-xs font-mono"
        >
          {formattedTime}
          {isPaused && " (Paused)"}
        </Badge>
      </div>

      {goalMs > 0 && (
        <div className="space-y-1">
          <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className={cn("h-full transition-all", progressColor)}
              style={{
                width: `${Math.max(0, Math.min(100, percentage))}%`,
              }}
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>
              {percentage > 0
                ? `${Math.round(percentage)}% remaining`
                : "Breached"}
            </span>
            <span>Goal: {formatDuration(goalMs)}</span>
          </div>
          {breachedTime && (
            <div className="text-xs text-destructive font-medium mt-1">
              Breached: {breachedTime}
            </div>
          )}
          {willBreachAtFormatted && !isBreached && (
            <div className="text-xs text-muted-foreground mt-1">
              Will breach at:{" "}
              <span className="font-medium">{willBreachAtFormatted}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Component to display SLA timers with progress bars - for detail pages
 */
interface SLATimersProgressProps {
  timers?: SlaTimer[];
  className?: string;
}

export function SLATimersProgress({
  timers = [],
  className,
}: SLATimersProgressProps) {
  if (!timers || timers.length === 0) {
    return null;
  }

  // Show all timers including breached, stopped, and met ones
  // Sort by status priority (Running/Paused first, then Breached, then others)
  // Within each status group, sort by remaining time (most urgent first)
  const sortedTimers = [...timers].sort((a, b) => {
    // Status priority: Running > Paused > Breached > Stopped/Met
    const statusPriority = {
      Running: 0,
      Paused: 1,
      Breached: 2,
      Stopped: 3,
      Met: 4,
    };

    const aPriority = statusPriority[a.status] ?? 5;
    const bPriority = statusPriority[b.status] ?? 5;

    if (aPriority !== bPriority) {
      return aPriority - bPriority;
    }

    // Within same status, sort by remaining time (most urgent first)
    const aRemaining = calculateRemainingTime(a);
    const bRemaining = calculateRemainingTime(b);
    return aRemaining - bRemaining;
  });

  return (
    <div className={cn("space-y-3", className)}>
      {sortedTimers.map((timer) => (
        <SLATimerProgress key={timer.id} timer={timer} />
      ))}
    </div>
  );
}
