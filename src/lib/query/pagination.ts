/** Shared types/helpers for server-side paginated reads (PostgREST .range()). */

export type PaginatedParams = {
  /** 0-based page index (matches TanStack Table's pageIndex). */
  page: number;
  pageSize: number;
  /** Free-text search; the service decides which columns it covers. */
  search?: string;
  /** Column id to sort by. */
  sortId?: string;
  sortDesc?: boolean;
};

export type PaginatedResult<T> = {
  rows: T[];
  /** Total rows matching the filter (for page-count math). */
  total: number;
};

/** Inclusive [from, to] range for a page, as Supabase `.range()` expects. */
export function pageRange(page: number, pageSize: number) {
  const from = page * pageSize;
  return { from, to: from + pageSize - 1 };
}
