"use client";

import * as React from "react";
import { Drawer as DrawerPrimitive } from "vaul";
import { cn } from "@/lib/utils/cn";

function Drawer({
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Root>) {
  return <DrawerPrimitive.Root data-slot="drawer" {...props} />;
}

function DrawerTrigger({
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Trigger>) {
  return <DrawerPrimitive.Trigger data-slot="drawer-trigger" {...props} />;
}

function DrawerPortal({
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Portal>) {
  return <DrawerPrimitive.Portal data-slot="drawer-portal" {...props} />;
}

function DrawerClose({
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Close>) {
  return <DrawerPrimitive.Close data-slot="drawer-close" {...props} />;
}

function DrawerOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Overlay>) {
  return (
    <DrawerPrimitive.Overlay
      data-slot="drawer-overlay"
      className={cn(
        "fixed inset-0 z-50 bg-black/50 backdrop-blur-sm",
        "data-[state=open]:animate-in data-[state=open]:fade-in-0",
        "data-[state=closed]:animate-out data-[state=closed]:fade-out-0",
        "data-[state=closed]:duration-300 data-[state=open]:duration-300",
        className
      )}
      {...props}
    />
  );
}

function DrawerContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Content>) {
  return (
    <DrawerPortal data-slot="drawer-portal">
      <DrawerOverlay />
      <DrawerPrimitive.Content
        data-slot="drawer-content"
        className={cn(
          // Base styles
          "group/drawer-content bg-background fixed z-50 flex h-auto flex-col border shadow-lg",

          // Top drawer styles
          "data-[vaul-drawer-direction=top]:inset-x-0 data-[vaul-drawer-direction=top]:top-0",
          "data-[vaul-drawer-direction=top]:mb-24 data-[vaul-drawer-direction=top]:max-h-[85vh]",
          "data-[vaul-drawer-direction=top]:rounded-b-xl data-[vaul-drawer-direction=top]:border-b",

          // Bottom drawer styles
          "data-[vaul-drawer-direction=bottom]:inset-x-0 data-[vaul-drawer-direction=bottom]:bottom-0",
          "data-[vaul-drawer-direction=bottom]:mt-24 data-[vaul-drawer-direction=bottom]:max-h-[85vh]",
          "data-[vaul-drawer-direction=bottom]:rounded-t-xl data-[vaul-drawer-direction=bottom]:border-t",

          // Right drawer styles - improved
          "data-[vaul-drawer-direction=right]:inset-y-0 data-[vaul-drawer-direction=right]:right-0",
          "data-[vaul-drawer-direction=right]:w-full data-[vaul-drawer-direction=right]:max-w-md",
          "data-[vaul-drawer-direction=right]:border-l data-[vaul-drawer-direction=right]:rounded-l-xl",
          "data-[vaul-drawer-direction=right]:[&::after]:hidden data-[vaul-drawer-direction=right]:[&::before]:hidden",
          "data-[vaul-drawer-direction=right]:sm:max-w-lg data-[vaul-drawer-direction=right]:lg:max-w-3xl",

          // Left drawer styles - improved
          "data-[vaul-drawer-direction=left]:inset-y-0 data-[vaul-drawer-direction=left]:left-0",
          "data-[vaul-drawer-direction=left]:w-full data-[vaul-drawer-direction=left]:max-w-md",
          "data-[vaul-drawer-direction=left]:border-r data-[vaul-drawer-direction=left]:rounded-r-xl",
          "data-[vaul-drawer-direction=left]:[&::after]:hidden data-[vaul-drawer-direction=left]:[&::before]:hidden",
          "data-[vaul-drawer-direction=left]:sm:max-w-lg data-[vaul-drawer-direction=left]:lg:max-w-xl",

          // Animation improvements
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=closed]:duration-300 data-[state=open]:duration-300",
          "data-[vaul-drawer-direction=right]:data-[state=closed]:slide-out-to-right",
          "data-[vaul-drawer-direction=right]:data-[state=open]:slide-in-from-right",
          "data-[vaul-drawer-direction=left]:data-[state=closed]:slide-out-to-left",
          "data-[vaul-drawer-direction=left]:data-[state=open]:slide-in-from-left",
          "data-[vaul-drawer-direction=bottom]:data-[state=closed]:slide-out-to-bottom",
          "data-[vaul-drawer-direction=bottom]:data-[state=open]:slide-in-from-bottom",
          "data-[vaul-drawer-direction=top]:data-[state=closed]:slide-out-to-top",
          "data-[vaul-drawer-direction=top]:data-[state=open]:slide-in-from-top",

          className
        )}
        {...props}
      >
        {/* Drag handle - only show for bottom/top drawers */}
        <div className="mx-auto mt-4 hidden h-2 w-[100px] shrink-0 rounded-full bg-muted group-data-[vaul-drawer-direction=bottom]/drawer-content:block group-data-[vaul-drawer-direction=top]/drawer-content:block" />
        {children}
      </DrawerPrimitive.Content>
    </DrawerPortal>
  );
}

function DrawerHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="drawer-header"
      className={cn(
        "flex flex-col gap-1.5 p-6",
        "group-data-[vaul-drawer-direction=bottom]/drawer-content:text-center",
        "group-data-[vaul-drawer-direction=top]/drawer-content:text-center",
        "group-data-[vaul-drawer-direction=right]/drawer-content:text-left",
        "group-data-[vaul-drawer-direction=left]/drawer-content:text-left",
        "border-b border-border/60",
        className
      )}
      {...props}
    />
  );
}

function DrawerFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="drawer-footer"
      className={cn(
        "mt-auto flex flex-col gap-2 p-6",
        "border-t border-border/60",
        className
      )}
      {...props}
    />
  );
}

function DrawerTitle({
  className,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Title>) {
  return (
    <DrawerPrimitive.Title
      data-slot="drawer-title"
      className={cn(
        "text-lg font-semibold leading-none tracking-tight text-foreground",
        className
      )}
      {...props}
    />
  );
}

function DrawerDescription({
  className,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Description>) {
  return (
    <DrawerPrimitive.Description
      data-slot="drawer-description"
      className={cn("text-sm text-muted-foreground leading-relaxed", className)}
      {...props}
    />
  );
}

export {
  Drawer,
  DrawerPortal,
  DrawerOverlay,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
};
