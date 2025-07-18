"use client";

import { useState } from "react";

import { Geist, Geist_Mono } from "next/font/google";
import { Inter } from "next/font/google";

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

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [client] = useState(new QueryClient());

  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <body lang="en" suppressHydrationWarning>
        <QueryClientProvider client={client}>
          <TooltipProvider>
            <Toaster richColors position="top-center" />
            {children}
          </TooltipProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
