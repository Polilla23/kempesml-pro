"use client";

import { useMemo } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Users } from "lucide-react";
import { useTranslations } from "next-intl";

import { DataTable } from "@/components/common/data-table";
import { EmptyState } from "@/components/common/empty-state";
import { Badge } from "@/components/ui/badge";

import { useTeams } from "../hooks/use-teams";
import type { Team } from "../types";

function statusVariant(status: string) {
  return status.toLowerCase().startsWith("activ") ? "default" : "secondary";
}

export function TeamsTable() {
  const t = useTranslations("teams");
  const { data, isLoading, isError } = useTeams();

  const columns = useMemo<ColumnDef<Team>[]>(
    () => [
      {
        accessorKey: "team_name",
        header: t("name"),
        cell: ({ row }) => (
          <span className="font-medium">{row.original.team_name}</span>
        ),
      },
      {
        accessorKey: "team_status",
        header: t("status"),
        enableSorting: false,
        cell: ({ row }) => (
          <Badge variant={statusVariant(row.original.team_status)}>
            {row.original.team_status || "—"}
          </Badge>
        ),
      },
      {
        accessorKey: "manager_name",
        header: t("manager"),
        cell: ({ row }) => row.original.manager_name ?? "—",
      },
      {
        accessorKey: "manager_mail",
        header: t("email"),
        enableSorting: false,
        cell: ({ row }) => (
          <span className="text-muted-foreground">
            {row.original.manager_mail ?? "—"}
          </span>
        ),
      },
    ],
    [t]
  );

  if (isError) {
    return <EmptyState icon={Users} title={t("error")} />;
  }

  return (
    <DataTable
      columns={columns}
      data={data ?? []}
      isLoading={isLoading}
      searchPlaceholder={t("searchPlaceholder")}
      emptyMessage={t("empty")}
      emptyIcon={Users}
    />
  );
}
