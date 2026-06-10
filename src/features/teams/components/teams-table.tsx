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

function statusVariant(estado: string) {
  return estado.toLowerCase().startsWith("activ") ? "default" : "secondary";
}

export function TeamsTable() {
  const t = useTranslations("teams");
  const { data, isLoading, isError } = useTeams();

  const columns = useMemo<ColumnDef<Team>[]>(
    () => [
      {
        accessorKey: "nombre",
        header: t("name"),
        cell: ({ row }) => (
          <span className="font-medium">{row.original.nombre}</span>
        ),
      },
      {
        accessorKey: "estado",
        header: t("status"),
        cell: ({ row }) => (
          <Badge variant={statusVariant(row.original.estado)}>
            {row.original.estado}
          </Badge>
        ),
      },
      {
        accessorKey: "manager_nombre",
        header: t("manager"),
        cell: ({ row }) => row.original.manager_nombre ?? "—",
      },
      {
        accessorKey: "manager_email",
        header: t("email"),
        cell: ({ row }) => (
          <span className="text-muted-foreground">
            {row.original.manager_email ?? "—"}
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
