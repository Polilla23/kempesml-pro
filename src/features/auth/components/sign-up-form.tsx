"use client";

import { useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, Mail, User } from "lucide-react";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { z } from "zod";

import { Form } from "@/components/ui/form";

import { useSignUp } from "../hooks/use-auth";
import { type SignUpInput } from "../schemas";
import { AuthField } from "./auth-field";
import { AuthSubmit } from "./auth-submit";

export function SignUpForm() {
  const t = useTranslations("auth");
  const tErrors = useTranslations("auth.errors");
  const signUp = useSignUp();

  const schema = useMemo(
    () =>
      z
        .object({
          name: z.string().min(2, tErrors("nameMin")),
          email: z
            .string()
            .min(1, tErrors("required"))
            .email(tErrors("invalidEmail")),
          password: z.string().min(6, tErrors("passwordMin")),
          confirmPassword: z.string().min(1, tErrors("required")),
        })
        .refine((data) => data.password === data.confirmPassword, {
          path: ["confirmPassword"],
          message: tErrors("passwordsDontMatch"),
        }),
    [tErrors]
  );

  const form = useForm<SignUpInput>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  function onSubmit(values: SignUpInput) {
    signUp.mutate(
      { name: values.name, email: values.email, password: values.password },
      {
        onSuccess: (data) => {
          if (!data.session) {
            toast.success(t("checkEmailTitle"), {
              description: t("checkEmail"),
            });
            form.reset();
          }
        },
        onError: (error) => {
          const alreadyExists = /registered|already/i.test(error.message);
          toast.error(t("signUpErrorTitle"), {
            description: alreadyExists ? t("emailInUse") : error.message,
          });
        },
      }
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <AuthField
            control={form.control}
            name="name"
            label={t("name")}
            autoComplete="name"
            placeholder={t("namePlaceholder")}
            icon={User}
          />
          <AuthField
            control={form.control}
            name="email"
            label={t("email")}
            type="email"
            autoComplete="email"
            placeholder={t("emailPlaceholder")}
            icon={Mail}
          />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <AuthField
              control={form.control}
              name="password"
              label={t("password")}
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
        </div>
        <AuthSubmit pending={signUp.isPending} skew>
          {signUp.isPending ? t("signingUp") : t("signUpButton")}
        </AuthSubmit>
      </form>
    </Form>
  );
}
