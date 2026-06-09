"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { useSupabaseBrowser } from "@/hooks/use-supabase";
import { queryKeys } from "@/lib/query-keys";

import { profilesService } from "../services/profiles.service";
import type { ProfileUpdate } from "../types";

/** Current authenticated user's profile. */
export function useCurrentProfile() {
  const supabase = useSupabaseBrowser();

  return useQuery({
    queryKey: queryKeys.profiles.me,
    queryFn: () => profilesService.getCurrent(supabase),
  });
}

/** A specific profile by id. */
export function useProfile(id: string) {
  const supabase = useSupabaseBrowser();

  return useQuery({
    queryKey: queryKeys.profiles.detail(id),
    queryFn: () => profilesService.getById(supabase, id),
    enabled: Boolean(id),
  });
}

/** Update a profile and refresh the relevant caches. */
export function useUpdateProfile(id: string) {
  const supabase = useSupabaseBrowser();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (patch: ProfileUpdate) =>
      profilesService.update(supabase, id, patch),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.profiles.me });
      queryClient.invalidateQueries({
        queryKey: queryKeys.profiles.detail(id),
      });
    },
  });
}
