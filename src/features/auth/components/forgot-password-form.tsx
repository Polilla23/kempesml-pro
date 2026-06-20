"use client";

import { useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { z } from "zod";

import { Form } from "@/components/ui/form";

import { useRequestPasswordReset } from "../hooks/use-auth";
import { AuthField } from "./auth-field";
import { AuthSubmit } from "./auth-submit";

type Values = { email: string };

export function ForgotPasswordForm() {
  const t = useTranslations("auth");
  const tErrors = useTranslations("auth.errors");
  const requestReset = useRequestPasswordReset();
  const [sent, setSent] = useState(false);

  const schema = useMemo(
    () =>
      z.object({
        email: z
          .string()
          .min(1, tErrors("required"))
          .email(tErrors("invalidEmail")),
      }),
    [tErrors]
  );

  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { email: "" },
  });

  function onSubmit(values: Values) {
    requestReset.mutate(values.email, { onSuccess: () => setSent(true) });
  }

  if (sent) {
    return (
      <div className="border-kml-outline-variant/40 bg-kml-surface-low space-y-2 rounded-sm border p-6 text-center">
        <p className="text-kml-on-surface font-display text-lg font-bold uppercase">
          {t("resetEmailSentTitle")}
        </p>
        <p className="text-kml-on-surface-variant font-body text-sm">
          {t("resetEmailSent")}
        </p>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <AuthField
          control={form.control}
          name="email"
          label={t("email")}
          type="email"
          autoComplete="email"
          placeholder={t("emailPlaceholder")}
          icon={Mail}
        />
        <AuthSubmit pending={requestReset.isPending}>
          {requestReset.isPending ? t("sending") : t("sendResetLink")}
        </AuthSubmit>
      </form>
    </Form>
  );
}
