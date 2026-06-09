"use client";

import { useMemo } from "react";

import { createClient } from "@/lib/supabase/client";

/**
 * Memoized browser Supabase client. Use in every client hook instead of
 * calling createClient() inline, so we don't recreate it on each render.
 */
export function useSupabaseBrowser() {
  return useMemo(() => createClient(), []);
}
