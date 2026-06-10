"use client";

import { useState } from "react";
import {
  type ColumnDef,
  type OnChangeFn,
  type PaginationState,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronsLeft,
  ChevronsRight,
  ChevronsUpDown,
  Search,
  type LucideIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

import { EmptyState } from "./empty-state";

const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

type DataTableProps<TData, TValue> = {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isLoading?: boolean;
  /** Subtle dim while refetching a new page (server mode). */
  isFetching?: boolean;
  /** If set, shows a global search input with this placeholder. */
  searchPlaceholder?: string;
  emptyMessage?: string;
  emptyIcon?: LucideIcon;
  pageSize?: number;

  /**
   * Server mode. When `manualPagination` is true, the parent owns pagination,
   * sorting and search state (data is already the current page from the DB).
   * Leave these out for client mode (sort/paginate/filter the full dataset).
   */
  manualPagination?: boolean;
  rowCount?: number;
  pagination?: PaginationState;
  onPaginationChange?: OnChangeFn<PaginationState>;
  sorting?: SortingState;
  onSortingChange?: OnChangeFn<SortingState>;
  globalFilter?: string;
  onGlobalFilterChange?: (value: string) => void;
};

export function DataTable<TData, TValue>({
  columns,
  data,
  isLoading,
  isFetching,
  searchPlaceholder,
  emptyMessage,
  emptyIcon,
  pageSize = 10,
  manualPagination,
  rowCount,
  pagination: paginationProp,
  onPaginationChange,
  sorting: sortingProp,
  onSortingChange,
  globalFilter: globalFilterProp,
  onGlobalFilterChange,
}: DataTableProps<TData, TValue>) {
  const t = useTranslations("table");
  const isServer = !!manualPagination;

  const [cSorting, setCSorting] = useState<SortingState>([]);
  const [cFilter, setCFilter] = useState("");
  const [cPagination, setCPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize,
  });

  const sorting = isServer ? (sortingProp ?? []) : cSorting;
  const globalFilter = isServer ? (globalFilterProp ?? "") : cFilter;
  const pagination = isServer
    ? (paginationProp ?? { pageIndex: 0, pageSize })
    : cPagination;

  const setGlobalFilter = isServer
    ? (onGlobalFilterChange ?? (() => {}))
    : setCFilter;

  // eslint-disable-next-line react-hooks/incompatible-library -- TanStack Table's useReactTable is safe here; the rule false-positives on its return value.
  const table = useReactTable({
    data,
    columns,
    state: { sorting, globalFilter, pagination },
    onSortingChange: isServer ? onSortingChange : setCSorting,
    onPaginationChange: isServer ? onPaginationChange : setCPagination,
    onGlobalFilterChange: isServer ? undefined : setCFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: isServer ? undefined : getSortedRowModel(),
    getFilteredRowModel: isServer ? undefined : getFilteredRowModel(),
    getPaginationRowModel: isServer ? undefined : getPaginationRowModel(),
    manualPagination: isServer,
    manualSorting: isServer,
    manualFiltering: isServer,
    rowCount: isServer ? rowCount : undefined,
  });

  const colCount = columns.length;
  const rows = table.getRowModel().rows;
  const totalRows = isServer
    ? (rowCount ?? 0)
    : table.getFilteredRowModel().rows.length;
  const { pageSize: currentPageSize, pageIndex } = table.getState().pagination;
  const pageCount = table.getPageCount();

  return (
    <div className="space-y-4">
      {searchPlaceholder && (
        <div className="relative max-w-xs">
          <Search className="text-muted-foreground absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
          <Input
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder={searchPlaceholder}
            className="pl-8"
          />
        </div>
      )}

      <div className="rounded-lg border">
        <Table
          className={cn(
            "transition-opacity",
            isFetching && !isLoading && "opacity-60"
          )}
        >
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const canSort = header.column.getCanSort();
                  const sorted = header.column.getIsSorted();

                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : canSort ? (
                        <button
                          type="button"
                          onClick={header.column.getToggleSortingHandler()}
                          className="hover:text-foreground inline-flex items-center gap-1"
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {sorted === "asc" ? (
                            <ChevronUp className="size-3.5" />
                          ) : sorted === "desc" ? (
                            <ChevronDown className="size-3.5" />
                          ) : (
                            <ChevronsUpDown className="size-3.5 opacity-50" />
                          )}
                        </button>
                      ) : (
                        flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )
                      )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading &&
              Array.from({ length: pageSize }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: colCount }).map((__, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}

            {!isLoading &&
              rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
          </TableBody>
        </Table>

        {!isLoading && totalRows === 0 && (
          <EmptyState
            icon={emptyIcon}
            title={emptyMessage ?? t("noResults")}
            className="border-0"
          />
        )}
      </div>

      {!isLoading && totalRows > 0 && (
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <span className="text-muted-foreground text-sm">
            {t("results", { count: totalRows })}
          </span>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground hidden text-sm sm:inline">
                {t("rowsPerPage")}
              </span>
              <Select
                value={String(currentPageSize)}
                onValueChange={(value) => table.setPageSize(Number(value))}
              >
                <SelectTrigger size="sm" className="w-[4.5rem]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PAGE_SIZE_OPTIONS.map((n) => (
                    <SelectItem key={n} value={String(n)}>
                      {n}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <span className="text-muted-foreground text-sm">
              {t("pageOf", { page: pageIndex + 1, pages: Math.max(pageCount, 1) })}
            </span>

            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon-sm"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
                aria-label={t("firstPage")}
              >
                <ChevronsLeft />
              </Button>
              <Button
                variant="outline"
                size="icon-sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                aria-label={t("prevPage")}
              >
                <ChevronLeft />
              </Button>
              <Button
                variant="outline"
                size="icon-sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                aria-label={t("nextPage")}
              >
                <ChevronRight />
              </Button>
              <Button
                variant="outline"
                size="icon-sm"
                onClick={() => table.setPageIndex(pageCount - 1)}
                disabled={!table.getCanNextPage()}
                aria-label={t("lastPage")}
              >
                <ChevronsRight />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
