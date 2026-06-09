"use client";

import { useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { useSignIn } from "../hooks/use-auth";
import { type SignInInput } from "../schemas";

export function SignInForm() {
  const t = useTranslations("auth");
  const tErrors = useTranslations("auth.errors");
  const signIn = useSignIn();

  const schema = useMemo(
    () =>
      z.object({
        email: z.string().min(1, tErrors("required")).email(tErrors("invalidEmail")),
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("email")}</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  autoComplete="email"
                  placeholder={t("emailPlaceholder")}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("password")}</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  autoComplete="current-password"
                  placeholder={t("passwordPlaceholder")}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={signIn.isPending}>
          {signIn.isPending ? t("signingIn") : t("signInButton")}
        </Button>
      </form>
    </Form>
  );
}
