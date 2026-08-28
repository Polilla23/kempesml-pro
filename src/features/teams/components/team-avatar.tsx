"use client";

import { ClubAvatar } from "@/components/common/club-avatar";
import { clubColor } from "@/lib/football";

import { useTeams } from "../hooks/use-teams";
import type { Team } from "../types";

/** get_all_teams exposes the crest as `club_logo`; the column is crest_url. */
type TeamRowWithLogo = Team & { club_logo?: string | null };

/**
 * Club avatar resolved by team id: name and crest come from the cached
 * get_all_teams list (one shared TanStack query for the whole page), with the
 * colored-initials fallback while loading or when the team has no logo.
 */
export function TeamAvatar({
  teamId,
  name,
  size,
  className,
  style,
}: {
  teamId: string;
  /** Display name override (used while the teams list loads). */
  name?: string;
  size?: React.ComponentProps<typeof ClubAvatar>["size"];
  className?: string;
  style?: React.CSSProperties;
}) {
  const { data } = useTeams();
  const team = data?.find((t) => t.id === teamId) as TeamRowWithLogo | undefined;

  return (
    <ClubAvatar
      name={name ?? team?.team_name ?? teamId}
      color={clubColor(teamId)}
      src={team?.club_logo ?? team?.crest_url ?? null}
      size={size}
      className={className}
      style={style}
    />
  );
}
