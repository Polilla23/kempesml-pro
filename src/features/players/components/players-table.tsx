"use client";

import { useMemo, useState } from "react";
import type {
  ColumnDef,
  PaginationState,
  SortingState,
} from "@tanstack/react-table";
import { UsersRound } from "lucide-react";
import { useTranslations } from "next-intl";

import { DataTable } from "@/components/common/data-table";
import { EmptyState } from "@/components/common/empty-state";
import { RatingBadge } from "@/components/common/rating-badge";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTeams } from "@/features/teams";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { Link } from "@/i18n/navigation";
import { flagEmoji, formatMoney, initials, yearsSince } from "@/lib/format";

import { usePlayerCatalogs, usePlayersList } from "../hooks/use-players-list";
import type { PlayerListItem } from "../types";

const ALL = "__all__";

function FilterSelect({
  value,
  onChange,
  allLabel,
  options,
  label,
}: {
  value: string;
  onChange: (v: string) => void;
  allLabel: string;
  options: { value: string; label: string }[];
  label: string;
}) {
  return (
    <Select value={value} onValueChange={(v) => onChange(v as string)}>
      <SelectTrigger aria-label={label} size="sm" className="min-w-32">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={ALL}>{allLabel}</SelectItem>
        {options.map((o) => (
          <SelectItem key={o.value} value={o.value}>
            {o.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export function PlayersTable() {
  const t = useTranslations("playersPage");

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 20,
  });
  const [sorting, setSorting] = useState<SortingState>([
    { id: "rating", desc: true },
  ]);
  const [search, setSearch] = useState("");
  const [teamId, setTeamId] = useState(ALL);
  const [status, setStatus] = useState(ALL);
  const [category, setCategory] = useState(ALL);
  const debouncedSearch = useDebouncedValue(search, 350);

  const resetPage = () => setPagination((p) => ({ ...p, pageIndex: 0 }));

  const teams = useTeams();
  const catalogs = usePlayerCatalogs();
  const { data, isLoading, isError, isFetching } = usePlayersList({
    page: pagination.pageIndex,
    pageSize: pagination.pageSize,
    search: debouncedSearch,
    sortId: sorting[0]?.id,
    sortDesc: sorting[0]?.desc,
    teamId: teamId === ALL ? undefined : teamId,
    status: status === ALL ? undefined : status,
    category: category === ALL ? undefined : category,
  });

  const teamName = useMemo(() => {
    const map = new Map(teams.data?.map((tm) => [tm.id, tm.team_name]));
    return (id: string | null) => (id ? (map.get(id) ?? id) : "—");
  }, [teams.data]);

  // Known status/category codes get translated; unknown ones show the DB label.
  const statusLabel = (code: string | null, fallback: string | null) => {
    if (code && ["active", "inactive", "loaned", "free"].includes(code)) {
      return t(`statuses.${code}` as Parameters<typeof t>[0]);
    }
    return fallback ?? code ?? "—";
  };

  const columns = useMemo<ColumnDef<PlayerListItem>[]>(
    () => [
      {
        accessorKey: "name",
        header: t("columns.player"),
        cell: ({ row }) => (
          <Link
            href={`/players/${row.original.id}`}
            className="flex min-w-0 items-center gap-2.5 hover:underline"
          >
            <span className="inline-flex size-6.5 shrink-0 items-center justify-center rounded-full bg-muted text-[10px] font-extrabold text-muted-foreground">
              {initials(row.original.name ?? "?")}
            </span>
            <span className="max-w-44 truncate font-semibold">
              {row.original.name}
            </span>
          </Link>
        ),
      },
      {
        id: "nationality",
        header: t("columns.nat"),
        enableSorting: false,
        cell: ({ row }) => (
          <span
            className="text-[15px]"
            title={row.original.nationality ?? undefined}
          >
            {flagEmoji(row.original.nationality_code)}
          </span>
        ),
      },
      {
        accessorKey: "primary_position",
        header: t("columns.pos"),
        cell: ({ row }) => (
          <span className="text-[11px] font-bold text-muted-foreground">
            {row.original.primary_position ?? "—"}
          </span>
        ),
      },
      {
        accessorKey: "birth_date",
        header: t("columns.age"),
        cell: ({ row }) =>
          row.original.birth_date ? yearsSince(row.original.birth_date) : "—",
      },
      {
        accessorKey: "rating",
        header: t("columns.rating"),
        cell: ({ row }) => <RatingBadge rating={row.original.rating ?? 0} />,
      },
      {
        id: "team",
        header: t("columns.team"),
        enableSorting: false,
        cell: ({ row }) =>
          row.original.current_team_id ? (
            <Link
              href={`/teams/${row.original.current_team_id}`}
              className="max-w-40 truncate text-muted-foreground hover:underline"
            >
              {teamName(row.original.current_team_id)}
            </Link>
          ) : (
            <span className="text-muted-foreground">—</span>
          ),
      },
      {
        accessorKey: "salary",
        header: t("columns.salary"),
        cell: ({ row }) => (
          <span className="text-muted-foreground tabular-nums">
            {row.original.salary != null ? formatMoney(row.original.salary) : "—"}
          </span>
        ),
      },
      {
        accessorKey: "market_value",
        header: t("columns.value"),
        cell: ({ row }) => (
          <span className="font-extrabold text-primary tabular-nums">
            {row.original.market_value != null
              ? formatMoney(row.original.market_value)
              : "—"}
          </span>
        ),
      },
      {
        id: "status",
        header: t("columns.status"),
        enableSorting: false,
        cell: ({ row }) => (
          <Badge variant={row.original.status === "active" ? "secondary" : "outline"}>
            {statusLabel(row.original.status, row.original.status_label)}
          </Badge>
        ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps -- statusLabel is stable per render of t
    [t, teamName]
  );

  if (isError) {
    return <EmptyState icon={UsersRound} title={t("error")} />;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <FilterSelect
          label={t("filters.team")}
          value={teamId}
          onChange={(v) => {
            setTeamId(v);
            resetPage();
          }}
          allLabel={t("filters.allTeams")}
          options={(teams.data ?? []).map((tm) => ({
            value: tm.id,
            label: tm.team_name,
          }))}
        />
        <FilterSelect
          label={t("filters.status")}
          value={status}
          onChange={(v) => {
            setStatus(v);
            resetPage();
          }}
          allLabel={t("filters.allStatuses")}
          options={(catalogs.data?.statuses ?? []).map((s) => ({
            value: s.code,
            label: statusLabel(s.code, s.label),
          }))}
        />
        <FilterSelect
          label={t("filters.category")}
          value={category}
          onChange={(v) => {
            setCategory(v);
            resetPage();
          }}
          allLabel={t("filters.allCategories")}
          options={(catalogs.data?.categories ?? []).map((c) => ({
            value: c.code,
            label: c.label ?? c.code,
          }))}
        />
      </div>

      <DataTable
        columns={columns}
        data={data?.rows ?? []}
        isLoading={isLoading}
        isFetching={isFetching}
        manualPagination
        rowCount={data?.total ?? 0}
        pagination={pagination}
        onPaginationChange={setPagination}
        sorting={sorting}
        onSortingChange={(updater) => {
          setSorting(updater);
          resetPage();
        }}
        globalFilter={search}
        onGlobalFilterChange={(v) => {
          setSearch(v);
          resetPage();
        }}
        searchPlaceholder={t("searchPlaceholder")}
        emptyMessage={t("empty")}
        emptyIcon={UsersRound}
        pageSize={20}
      />
    </div>
  );
}
