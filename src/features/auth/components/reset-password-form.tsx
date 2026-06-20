"use client";

import { useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock } from "lucide-react";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { z } from "zod";

import { Form } from "@/components/ui/form";

import { useUpdatePassword } from "../hooks/use-auth";
import { AuthField } from "./auth-field";
import { AuthSubmit } from "./auth-submit";

type Values = { password: string; confirmPassword: string };

export function ResetPasswordForm() {
  const t = useTranslations("auth");
  const tErrors = useTranslations("auth.errors");
  const updatePassword = useUpdatePassword();

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
