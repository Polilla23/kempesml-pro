"use client";

import { ThemeProvider } from "next-themes";

import { Toaster } from "@/components/ui/sonner";

import { QueryProvider } from "./query-provider";

/**
 * Single place to compose all client-side providers. Mounted once in the
 * locale layout, inside NextIntlClientProvider.
 */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <QueryProvider>{children}</QueryProvider>
      <Toaster richColors position="top-right" />
    </ThemeProvider>
  );
}
