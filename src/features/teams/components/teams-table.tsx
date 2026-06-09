"use client";

import { useMemo, useState } from "react";
import { Search, Users } from "lucide-react";
import { useTranslations } from "next-intl";

import { EmptyState } from "@/components/common/empty-state";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useTeams } from "../hooks/use-teams";

function statusVariant(estado: string) {
  return estado.toLowerCase().startsWith("activ") ? "default" : "secondary";
}

export function TeamsTable() {
  const t = useTranslations("teams");
  const { data: teams, isLoading, isError } = useTeams();
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = teams ?? [];
    if (!q) return list;
    return list.filter(
      (team) =>
        team.nombre.toLowerCase().includes(q) ||
        (team.manager_nombre ?? "").toLowerCase().includes(q)
    );
  }, [teams, search]);

  if (isError) {
    return <EmptyState icon={Users} title={t("error")} />;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="relative max-w-xs flex-1">
          <Search className="text-muted-foreground absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("searchPlaceholder")}
            className="pl-8"
          />
        </div>
        {!isLoading && (
          <span className="text-muted-foreground text-sm">
            {t("count", { count: filtered.length })}
          </span>
        )}
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("name")}</TableHead>
              <TableHead>{t("status")}</TableHead>
              <TableHead>{t("manager")}</TableHead>
              <TableHead>{t("email")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading &&
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 4 }).map((__, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}

            {!isLoading &&
              filtered.map((team) => (
                <TableRow key={team.id}>
                  <TableCell className="font-medium">{team.nombre}</TableCell>
                  <TableCell>
                    <Badge variant={statusVariant(team.estado)}>
                      {team.estado}
                    </Badge>
                  </TableCell>
                  <TableCell>{team.manager_nombre ?? "—"}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {team.manager_email ?? "—"}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>

        {!isLoading && filtered.length === 0 && (
          <EmptyState icon={Users} title={t("empty")} className="border-0" />
        )}
      </div>
    </div>
  );
}
