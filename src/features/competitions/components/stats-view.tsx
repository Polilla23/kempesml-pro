"use client";

import { useMemo } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { BarChart3 } from "lucide-react";
import { useTranslations } from "next-intl";

import { DataTable } from "@/components/common/data-table";
import { EmptyState } from "@/components/common/empty-state";
import { Link } from "@/i18n/navigation";
import { initials } from "@/lib/format";

import { useTournamentPlayerStats } from "../hooks/use-competitions";
import type { TournamentPlayerStats } from "../types";
import {
  TournamentPicker,
  useTournamentSelection,
} from "./tournament-picker";

export function StatsView() {
  const t = useTranslations("competitions.stats");
  const sel = useTournamentSelection();
  const stats = useTournamentPlayerStats(sel.tournamentId);

  const columns = useMemo<ColumnDef<TournamentPlayerStats>[]>(
    () => [
      {
        accessorKey: "player_name",
        header: t("player"),
        cell: ({ row }) => (
          <Link
            href={`/players/${row.original.player_id}`}
            className="flex min-w-0 items-center gap-2.5 hover:underline"
          >
            <span className="inline-flex size-6.5 shrink-0 items-center justify-center rounded-full bg-muted text-[10px] font-extrabold text-muted-foreground">
              {initials(row.original.player_name ?? "?")}
            </span>
            <span className="max-w-44 truncate font-semibold">
              {row.original.player_name}
            </span>
          </Link>
        ),
      },
      {
        accessorKey: "team_name",
        header: t("team"),
        cell: ({ row }) => (
          <Link
            href={`/teams/${row.original.team_id}`}
            className="max-w-40 truncate text-muted-foreground hover:underline"
          >
            {row.original.team_name}
          </Link>
        ),
      },
      { accessorKey: "matches_played", header: t("played") },
      {
        accessorKey: "goals",
        header: t("goals"),
        cell: ({ row }) => (
          <span className="font-bold text-emerald-600 dark:text-emerald-400">
            {row.original.goals}
          </span>
        ),
      },
      { accessorKey: "assists", header: t("assists") },
      {
        accessorKey: "mvps",
        header: t("mvps"),
        cell: ({ row }) => (
          <span className="font-bold text-primary">{row.original.mvps}</span>
        ),
      },
      {
        accessorKey: "yellow_cards",
        header: "🟨",
        cell: ({ row }) => (
          <span className="text-amber-600 dark:text-amber-400">
            {row.original.yellow_cards}
          </span>
        ),
      },
      {
        accessorKey: "red_cards",
        header: "🟥",
        cell: ({ row }) => (
          <span className="text-red-600 dark:text-red-400">
            {row.original.red_cards}
          </span>
        ),
      },
      {
        accessorKey: "goals_per_match",
        header: t("goalsPerMatch"),
        cell: ({ row }) => (
          <span className="text-muted-foreground tabular-nums">
            {row.original.goals_per_match?.toFixed?.(2) ??
              row.original.goals_per_match ??
              "—"}
          </span>
        ),
      },
    ],
    [t]
  );

  if (stats.isError) {
    return <EmptyState icon={BarChart3} title={t("error")} />;
  }

  return (
    <div className="flex flex-col gap-4">
      <TournamentPicker {...sel} />
      <DataTable
        columns={columns}
        data={stats.data ?? []}
        isLoading={stats.isLoading}
        initialSorting={[{ id: "goals", desc: true }]}
        searchPlaceholder={t("searchPlaceholder")}
        emptyMessage={t("empty")}
        emptyIcon={BarChart3}
        pageSize={20}
      />
    </div>
  );
}
