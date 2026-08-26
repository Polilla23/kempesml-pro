import type { Tables, Views } from "@/types/database.types";

export type Season = Tables<"seasons">;
export type Tournament = Tables<"tournaments">;
export type TournamentRound = Tables<"tournament_rounds">;
export type Match = Tables<"matches">;
export type StandingRow = Views<"v_standings_full">;
export type TournamentPlayerStats = Views<"v_tournament_player_stats">;
