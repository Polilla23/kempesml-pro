"use client";

import { useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { z } from "zod";

import { Form } from "@/components/ui/form";
import { Link } from "@/i18n/navigation";

import { useSignIn } from "../hooks/use-auth";
import { type SignInInput } from "../schemas";
import { AuthField } from "./auth-field";
import { AuthSubmit } from "./auth-submit";

export function SignInForm() {
  const t = useTranslations("auth");
  const tErrors = useTranslations("auth.errors");
  const signIn = useSignIn();

  const schema = useMemo(
    () =>
      z.object({
        email: z
          .string()
          .min(1, tErrors("required"))
          .email(tErrors("invalidEmail")),
        password: z.string().min(6, tErrors("passwordMin")),
      }),
    [tErrors]
  );

  const form = useForm<SignInInput>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  function onSubmit(values: SignInInput) {
    signIn.mutate(values, {
      onError: () =>
        toast.error(t("signInErrorTitle"), {
          description: t("invalidCredentials"),
        }),
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <AuthField
            control={form.control}
            name="email"
            label={t("email")}
            type="email"
            autoComplete="email"
            placeholder={t("emailPlaceholder")}
            icon={Mail}
          />
          <AuthField
            control={form.control}
            name="password"
            label={t("password")}
            type="password"
            autoComplete="current-password"
            placeholder={t("passwordPlaceholder")}
            icon={Lock}
            action={
              <Link
                href="/forgot-password"
                className="text-kml-primary font-label text-xs uppercase transition-all hover:underline"
              >
                {t("forgotPasswordLink")}
              </Link>
            }
          />
        </div>
        <AuthSubmit pending={signIn.isPending}>
          {signIn.isPending ? t("signingIn") : t("signInButton")}
        </AuthSubmit>
      </form>
    </Form>
  );
}
