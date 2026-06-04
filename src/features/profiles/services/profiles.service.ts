import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/types/database.types";

import type { Profile, ProfileUpdate } from "../types";

type Client = SupabaseClient<Database>;

/**
 * Pure data-access layer for `profiles`. Every function receives the Supabase
 * client as an argument so the same code works from Server Components, Route
 * Handlers and Client Components — pass the server client or the browser client
 * accordingly. No React, no caching here: that lives in the hooks.
 */
export const profilesService = {
  async getCurrent(supabase: Client): Promise<Profile | null> {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (error) throw error;
    return data;
  },

  async getById(supabase: Client, id: string): Promise<Profile> {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  },

  async update(
    supabase: Client,
    id: string,
    patch: ProfileUpdate
  ): Promise<Profile> {
    const { data, error } = await supabase
      .from("profiles")
      .update(patch)
      .eq("id", id)
      .select("*")
      .single();

    if (error) throw error;
    return data;
  },
};
