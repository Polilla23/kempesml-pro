"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { TextField } from "@/components/common/text-field";

import { useCurrentProfile, useUpdateProfile } from "../hooks/use-profile";
import { profileUpdateSchema, type ProfileUpdateInput } from "../schemas";

/** Modal to edit the current user's own profile (name + team name). */
export function ProfileSettingsDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const t = useTranslations("profile");
  const tCommon = useTranslations("common");
  const { data: profile } = useCurrentProfile();
  const update = useUpdateProfile(profile?.id ?? "");

  const form = useForm<ProfileUpdateInput>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: { name: "", team_name: "" },
    values: profile
      ? { name: profile.name ?? "", team_name: profile.team_name ?? "" }
      : undefined,
  });

  function onSubmit(data: ProfileUpdateInput) {
    update.mutate(data, { onSuccess: () => onOpenChange(false) });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <TextField control={form.control} name="name" label={t("name")} />
            <TextField
              control={form.control}
              name="team_name"
              label={t("teamName")}
            />
            <DialogFooter>
              <DialogClose render={<Button variant="outline" type="button" />}>
                {tCommon("cancel")}
              </DialogClose>
              <Button type="submit" disabled={update.isPending}>
                {tCommon("save")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
