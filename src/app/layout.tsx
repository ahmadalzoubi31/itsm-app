"use client";

import { Geist, Geist_Mono } from "next/font/google";
import { Inter } from "next/font/google";
import { Poppins } from "next/font/google";
import { Roboto } from "next/font/google";
import {Open_Sans} from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { SessionProvider } from "next-auth/react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: "400",  
});

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: "400",  
});

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
  weight: "400",  
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [client] = useState(new QueryClient());

  return (
    <html lang="en" style={{
      fontSize: "16px"  
    }} className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProvider>
          <QueryClientProvider client={client}>
            <TooltipProvider>
              <Toaster />
              <SidebarProvider
                style={
                  {
                    "--sidebar-width": "calc(var(--spacing) * 72)",
                    "--header-height": "calc(var(--spacing) * 12)",
                  } as React.CSSProperties
                }
              >
                <AppSidebar variant="inset" />
                <SidebarInset>
                  <SiteHeader />  
                  {children}
                </SidebarInset> 
              </SidebarProvider>
            </TooltipProvider>
          </QueryClientProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
