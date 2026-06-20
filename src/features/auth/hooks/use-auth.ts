"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocale } from "next-intl";

import { useSupabaseBrowser } from "@/hooks/use-supabase";
import { useRouter } from "@/i18n/navigation";

import type { SignInInput, SignUpValues } from "../schemas";

/**
 * Register a new account. Only `name` is sent as metadata — `role` is
 * intentionally omitted so the DB trigger defaults it to 'manager' (users
 * must never be able to self-assign a role). Returns the Supabase response so
 * the caller can tell "logged in" from "needs email confirmation".
 */
export function useSignUp() {
  const supabase = useSupabaseBrowser();
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ name, email, password }: SignUpValues) => {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name } },
      });
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      // Session present → email confirmation is off, go straight in.
      if (data.session) {
        queryClient.clear();
        router.replace("/dashboard");
        router.refresh();
      }
    },
  });
}

/** Sign in with email + password, then route into the app. */
export function useSignIn() {
  const supabase = useSupabaseBrowser();
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: SignInInput) => {
      const { error } = await supabase.auth.signInWithPassword(input);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.clear();
      router.replace("/dashboard");
      router.refresh();
    },
  });
}

/** Sign out and route back to the sign-in screen. */
export function useSignOut() {
  const supabase = useSupabaseBrowser();
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.clear();
      router.replace("/sign-in");
      router.refresh();
    },
  });
}

/**
 * Send a password-reset email. Supabase redirects the link back to
 * /reset-password (locale-prefixed) where the user sets a new password.
 */
export function useRequestPasswordReset() {
  const supabase = useSupabaseBrowser();
  const locale = useLocale();

  return useMutation({
    mutationFn: async (email: string) => {
      const redirectTo = `${window.location.origin}/${locale}/reset-password`;
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo,
      });
      if (error) throw error;
    },
  });
}

/**
 * Set a new password for the recovery session created when the user follows
 * the reset link, then route into the app.
 */
export function useUpdatePassword() {
  const supabase = useSupabaseBrowser();
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (password: string) => {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.clear();
      router.replace("/dashboard");
      router.refresh();
    },
  });
}
