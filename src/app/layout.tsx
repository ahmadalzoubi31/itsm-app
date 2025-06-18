"use client";

import { useState } from "react";

import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";

import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--geist-font-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--geist-font-mono",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [client] = useState(new QueryClient());

  return (
    <html
      lang="en"
      className={`${geistSans.className} text-sm` }
      suppressHydrationWarning
    >
      <body
        lang="en"
        className={`${geistSans.className}`}
        suppressHydrationWarning
      >
        <QueryClientProvider client={client}>
          <TooltipProvider>
            <Toaster richColors />
            {children}
          </TooltipProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
