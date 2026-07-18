"use client";

import { useEffect, useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock } from "lucide-react";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { z } from "zod";

import { Form } from "@/components/ui/form";
import { useSupabaseBrowser } from "@/hooks/use-supabase";
import { Link } from "@/i18n/navigation";

import { useUpdatePassword } from "../hooks/use-auth";
import { AuthField } from "./auth-field";
import { AuthSubmit } from "./auth-submit";

type Values = { password: string; confirmPassword: string };

/** "verifying" → exchanging the recovery code; "ready" → session is set; */
/** "invalid" → the link was missing, expired or already used. */
type Status = "verifying" | "ready" | "invalid";

export function ResetPasswordForm() {
  const t = useTranslations("auth");
  const tErrors = useTranslations("auth.errors");
  const supabase = useSupabaseBrowser();
  const updatePassword = useUpdatePassword();
  // If Supabase appended an error to the URL (expired/used link), decide that
  // up front; otherwise start "verifying" and resolve in the effect.
  const [status, setStatus] = useState<Status>(() => {
    if (typeof window === "undefined") return "verifying";
    const params = new URLSearchParams(
      window.location.search + "&" + window.location.hash.slice(1)
    );
    return params.has("error") ? "invalid" : "verifying";
  });

  // Following the email link lands here with a PKCE `?code=` (or, for older
  // projects, a `#access_token`). The browser client auto-exchanges it on load
  // and emits a session; we wait for that before showing the form, and fall
  // back to "invalid" if no recovery session ever materialises.
  useEffect(() => {
    let active = true;
    const params = new URLSearchParams(
      window.location.search + "&" + window.location.hash.slice(1)
    );
    const hasCredential =
      params.has("code") || params.has("access_token");

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (active && session) setStatus("ready");
    });

    void supabase.auth.getSession().then(({ data }) => {
      if (active && data.session) setStatus("ready");
    });

    const timer = setTimeout(
      () => {
        if (active) setStatus((s) => (s === "verifying" ? "invalid" : s));
      },
      hasCredential ? 5000 : 500
    );

    return () => {
      active = false;
      clearTimeout(timer);
      sub.subscription.unsubscribe();
    };
  }, [supabase]);

  const schema = useMemo(
    () =>
      z
        .object({
          password: z.string().min(6, tErrors("passwordMin")),
          confirmPassword: z.string().min(1, tErrors("required")),
        })
        .refine((data) => data.password === data.confirmPassword, {
          path: ["confirmPassword"],
          message: tErrors("passwordsDontMatch"),
        }),
    [tErrors]
  );

  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  function onSubmit(values: Values) {
    updatePassword.mutate(values.password, {
      onError: (error) =>
        toast.error(t("resetPasswordErrorTitle"), {
          description: error.message,
        }),
    });
  }

  if (status === "verifying") {
    return (
      <p className="text-kml-on-surface-variant font-body text-center">
        {t("verifyingLink")}
      </p>
    );
  }

  if (status === "invalid") {
    return (
      <div className="border-kml-outline-variant/40 bg-kml-surface-low space-y-3 rounded-sm border p-6 text-center">
        <p className="text-kml-on-surface font-display text-lg font-bold uppercase">
          {t("invalidLinkTitle")}
        </p>
        <p className="text-kml-on-surface-variant font-body text-sm">
          {t("invalidLink")}
        </p>
        <Link
          href="/forgot-password"
          className="text-kml-primary font-label inline-block text-xs uppercase transition-all hover:underline"
        >
          {t("requestNewLink")}
        </Link>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <AuthField
            control={form.control}
            name="password"
            label={t("newPassword")}
            type="password"
            autoComplete="new-password"
            placeholder={t("passwordPlaceholder")}
            icon={Lock}
          />
          <AuthField
            control={form.control}
            name="confirmPassword"
            label={t("confirmPassword")}
            type="password"
            autoComplete="new-password"
            placeholder={t("passwordPlaceholder")}
            icon={Lock}
          />
        </div>
        <AuthSubmit pending={updatePassword.isPending}>
          {updatePassword.isPending ? t("saving") : t("updatePasswordButton")}
        </AuthSubmit>
      </form>
    </Form>
  );
}
