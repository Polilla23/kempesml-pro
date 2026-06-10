"use client";

import { useMemo, useState } from "react";
import type {
  ColumnDef,
  OnChangeFn,
  PaginationState,
  SortingState,
} from "@tanstack/react-table";
import { Users } from "lucide-react";
import { useTranslations } from "next-intl";

import { DataTable } from "@/components/common/data-table";
import { EmptyState } from "@/components/common/empty-state";
import { Badge } from "@/components/ui/badge";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import type { PaginatedParams } from "@/lib/query/pagination";

import { useTeamsPaged } from "../hooks/use-teams";
import type { Team } from "../types";

function statusVariant(estado: string) {
  return estado.toLowerCase().startsWith("activ") ? "default" : "secondary";
}

export function TeamsTable() {
  const t = useTranslations("teams");

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>([
    { id: "nombre", desc: false },
  ]);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, 300);

  // Changing the filter or sort jumps back to the first page.
  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPagination((p) => ({ ...p, pageIndex: 0 }));
  };

  const handleSortingChange: OnChangeFn<SortingState> = (updater) => {
    setSorting(updater);
    setPagination((p) => ({ ...p, pageIndex: 0 }));
  };

  const params = useMemo<PaginatedParams>(
    () => ({
      page: pagination.pageIndex,
      pageSize: pagination.pageSize,
      search: debouncedSearch || undefined,
      sortId: sorting[0]?.id,
      sortDesc: sorting[0]?.desc,
    }),
    [pagination, sorting, debouncedSearch]
  );

  const { data, isLoading, isFetching, isError } = useTeamsPaged(params);

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
        enableSorting: false,
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
        enableSorting: false,
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
      data={data?.rows ?? []}
      rowCount={data?.total ?? 0}
      isLoading={isLoading}
      isFetching={isFetching}
      manualPagination
      pagination={pagination}
      onPaginationChange={setPagination}
      sorting={sorting}
      onSortingChange={handleSortingChange}
      globalFilter={search}
      onGlobalFilterChange={handleSearchChange}
      searchPlaceholder={t("searchPlaceholder")}
      emptyMessage={t("empty")}
      emptyIcon={Users}
    />
  );
}
