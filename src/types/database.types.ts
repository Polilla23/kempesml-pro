/**
 * Database schema types — AUTO-DERIVED from the live Supabase REST (PostgREST
 * OpenAPI) endpoint. Accurate for Row reads, FK relationships and nullability.
 *
 * ⚠️ Insert/Update column optionality is heuristic (DB column defaults are not
 * fully exposed over REST). When the DB owner can share an official dump from
 * `supabase gen types typescript`, replace this file with it.
 *
 * Regenerate: pnpm db:types:rest
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      incident_types: {
        Row: {
          code: string;
          label: string;
          has_quantity: boolean;
          sort_order: number;
          active: boolean;
          created_at: string;
        };
        Insert: {
          code: string;
          label: string;
          has_quantity: boolean;
          sort_order: number;
          active: boolean;
          created_at?: string;
        };
        Update: {
          code?: string;
          label?: string;
          has_quantity?: boolean;
          sort_order?: number;
          active?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      match_covid_draws: {
        Row: {
          id: string;
          match_id: string;
          team_side: string;
          player_id: string;
          created_at: string;
        };
        Insert: {
          id: string;
          match_id: string;
          team_side: string;
          player_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          match_id?: string;
          team_side?: string;
          player_id?: string;
          created_at?: string;
        };
        Relationships: [
        {
          foreignKeyName: "match_covid_draws_match_id_fkey";
          columns: ["match_id"];
          isOneToOne: false;
          referencedRelation: "matches";
          referencedColumns: ["id"];
        },
        {
          foreignKeyName: "match_covid_draws_player_id_fkey";
          columns: ["player_id"];
          isOneToOne: false;
          referencedRelation: "players";
          referencedColumns: ["id"];
        },
      ];
      };
      match_incidents: {
        Row: {
          id: string;
          match_id: string;
          tournament_id: string;
          player_id: string;
          team_id: string;
          incident_type: string;
          quantity: number;
          created_at: string;
        };
        Insert: {
          id: string;
          match_id: string;
          tournament_id: string;
          player_id: string;
          team_id: string;
          incident_type: string;
          quantity: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          match_id?: string;
          tournament_id?: string;
          player_id?: string;
          team_id?: string;
          incident_type?: string;
          quantity?: number;
          created_at?: string;
        };
        Relationships: [
        {
          foreignKeyName: "match_incidents_match_id_fkey";
          columns: ["match_id"];
          isOneToOne: false;
          referencedRelation: "matches";
          referencedColumns: ["id"];
        },
        {
          foreignKeyName: "match_incidents_tournament_id_fkey";
          columns: ["tournament_id"];
          isOneToOne: false;
          referencedRelation: "tournaments";
          referencedColumns: ["id"];
        },
        {
          foreignKeyName: "match_incidents_player_id_fkey";
          columns: ["player_id"];
          isOneToOne: false;
          referencedRelation: "players";
          referencedColumns: ["id"];
        },
        {
          foreignKeyName: "match_incidents_team_id_fkey";
          columns: ["team_id"];
          isOneToOne: false;
          referencedRelation: "teams";
          referencedColumns: ["id"];
        },
        {
          foreignKeyName: "match_incidents_incident_type_fkey";
          columns: ["incident_type"];
          isOneToOne: false;
          referencedRelation: "incident_types";
          referencedColumns: ["code"];
        },
      ];
      };
      match_statuses: {
        Row: {
          code: string;
          label: string;
          sort_order: number;
          active: boolean;
          created_at: string;
        };
        Insert: {
          code: string;
          label: string;
          sort_order: number;
          active: boolean;
          created_at?: string;
        };
        Update: {
          code?: string;
          label?: string;
          sort_order?: number;
          active?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      match_types: {
        Row: {
          code: string;
          label: string;
          sort_order: number;
          active: boolean;
          created_at: string;
        };
        Insert: {
          code: string;
          label: string;
          sort_order: number;
          active: boolean;
          created_at?: string;
        };
        Update: {
          code?: string;
          label?: string;
          sort_order?: number;
          active?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      matches: {
        Row: {
          id: string;
          tournament_id: string;
          round_id: string;
          home_team_id: string | null;
          away_team_id: string | null;
          bye_team_id: string | null;
          type: string;
          status: string;
          home_score: number | null;
          away_score: number | null;
          match_number: number | null;
          plazo: string | null;
          scheduled_at: string | null;
          venue: string | null;
          observations: string | null;
          created_at: string;
          updated_at: string | null;
        };
        Insert: {
          id: string;
          tournament_id: string;
          round_id: string;
          home_team_id?: string | null;
          away_team_id?: string | null;
          bye_team_id?: string | null;
          type: string;
          status: string;
          home_score?: number | null;
          away_score?: number | null;
          match_number?: number | null;
          plazo?: string | null;
          scheduled_at?: string | null;
          venue?: string | null;
          observations?: string | null;
          created_at?: string;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          tournament_id?: string;
          round_id?: string;
          home_team_id?: string | null;
          away_team_id?: string | null;
          bye_team_id?: string | null;
          type?: string;
          status?: string;
          home_score?: number | null;
          away_score?: number | null;
          match_number?: number | null;
          plazo?: string | null;
          scheduled_at?: string | null;
          venue?: string | null;
          observations?: string | null;
          created_at?: string;
          updated_at?: string | null;
        };
        Relationships: [
        {
          foreignKeyName: "matches_tournament_id_fkey";
          columns: ["tournament_id"];
          isOneToOne: false;
          referencedRelation: "tournaments";
          referencedColumns: ["id"];
        },
        {
          foreignKeyName: "matches_round_id_fkey";
          columns: ["round_id"];
          isOneToOne: false;
          referencedRelation: "tournament_rounds";
          referencedColumns: ["id"];
        },
        {
          foreignKeyName: "matches_home_team_id_fkey";
          columns: ["home_team_id"];
          isOneToOne: false;
          referencedRelation: "teams";
          referencedColumns: ["id"];
        },
        {
          foreignKeyName: "matches_away_team_id_fkey";
          columns: ["away_team_id"];
          isOneToOne: false;
          referencedRelation: "teams";
          referencedColumns: ["id"];
        },
        {
          foreignKeyName: "matches_bye_team_id_fkey";
          columns: ["bye_team_id"];
          isOneToOne: false;
          referencedRelation: "teams";
          referencedColumns: ["id"];
        },
        {
          foreignKeyName: "matches_type_fkey";
          columns: ["type"];
          isOneToOne: false;
          referencedRelation: "match_types";
          referencedColumns: ["code"];
        },
        {
          foreignKeyName: "matches_status_fkey";
          columns: ["status"];
          isOneToOne: false;
          referencedRelation: "match_statuses";
          referencedColumns: ["code"];
        },
      ];
      };
      player_categories: {
        Row: {
          code: string;
          label: string;
          sort_order: number;
          active: boolean;
          created_at: string;
        };
        Insert: {
          code: string;
          label: string;
          sort_order: number;
          active: boolean;
          created_at?: string;
        };
        Update: {
          code?: string;
          label?: string;
          sort_order?: number;
          active?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      player_statuses: {
        Row: {
          code: string;
          label: string;
          sort_order: number;
          active: boolean;
          created_at: string;
        };
        Insert: {
          code: string;
          label: string;
          sort_order: number;
          active: boolean;
          created_at?: string;
        };
        Update: {
          code?: string;
          label?: string;
          sort_order?: number;
          active?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      players: {
        Row: {
          id: string;
          name: string;
          normalized_name: string;
          keywords: string[];
          birth_date: string | null;
          nationality: string | null;
          nationality_code: string | null;
          category: string;
          status: string;
          primary_position: string | null;
          positions: string[] | null;
          salary: number;
          current_team_id: string | null;
          loaned_team_id: string | null;
          sofifa_link: string | null;
          transfermarket_id: number | null;
          created_at: string;
          updated_at: string | null;
        };
        Insert: {
          id: string;
          name: string;
          normalized_name: string;
          keywords: string[];
          birth_date?: string | null;
          nationality?: string | null;
          nationality_code?: string | null;
          category: string;
          status: string;
          primary_position?: string | null;
          positions?: string[] | null;
          salary: number;
          current_team_id?: string | null;
          loaned_team_id?: string | null;
          sofifa_link?: string | null;
          transfermarket_id?: number | null;
          created_at?: string;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          normalized_name?: string;
          keywords?: string[];
          birth_date?: string | null;
          nationality?: string | null;
          nationality_code?: string | null;
          category?: string;
          status?: string;
          primary_position?: string | null;
          positions?: string[] | null;
          salary?: number;
          current_team_id?: string | null;
          loaned_team_id?: string | null;
          sofifa_link?: string | null;
          transfermarket_id?: number | null;
          created_at?: string;
          updated_at?: string | null;
        };
        Relationships: [
        {
          foreignKeyName: "players_category_fkey";
          columns: ["category"];
          isOneToOne: false;
          referencedRelation: "player_categories";
          referencedColumns: ["code"];
        },
        {
          foreignKeyName: "players_status_fkey";
          columns: ["status"];
          isOneToOne: false;
          referencedRelation: "player_statuses";
          referencedColumns: ["code"];
        },
        {
          foreignKeyName: "players_current_team_id_fkey";
          columns: ["current_team_id"];
          isOneToOne: false;
          referencedRelation: "teams";
          referencedColumns: ["id"];
        },
        {
          foreignKeyName: "players_loaned_team_id_fkey";
          columns: ["loaned_team_id"];
          isOneToOne: false;
          referencedRelation: "teams";
          referencedColumns: ["id"];
        },
      ];
      };
      players_scrapped_data: {
        Row: {
          player_id: string;
          rating: number | null;
          market_value: number | null;
          market_value_txt: string | null;
          market_value_date: string | null;
          current_club_id: string | null;
          current_club_name: string | null;
          club_logo_id: string | null;
          league_id: string | null;
          league_name: string | null;
          last_updated: string | null;
          last_position_review: string | null;
        };
        Insert: {
          player_id: string;
          rating?: number | null;
          market_value?: number | null;
          market_value_txt?: string | null;
          market_value_date?: string | null;
          current_club_id?: string | null;
          current_club_name?: string | null;
          club_logo_id?: string | null;
          league_id?: string | null;
          league_name?: string | null;
          last_updated?: string | null;
          last_position_review?: string | null;
        };
        Update: {
          player_id?: string;
          rating?: number | null;
          market_value?: number | null;
          market_value_txt?: string | null;
          market_value_date?: string | null;
          current_club_id?: string | null;
          current_club_name?: string | null;
          club_logo_id?: string | null;
          league_id?: string | null;
          league_name?: string | null;
          last_updated?: string | null;
          last_position_review?: string | null;
        };
        Relationships: [];
      };
      players_scrapped_stats: {
        Row: {
          player_id: string;
          version: string;
          version_date: string | null;
          version_date_txt: string;
          roster_id: string;
          primary_position: string | null;
          positions: string[];
          finishing: number | null;
          shot_power: number | null;
          long_shots: number | null;
          volleys: number | null;
          penalties: number | null;
          heading_accuracy: number | null;
          short_passing: number | null;
          long_passing: number | null;
          crossing: number | null;
          curve: number | null;
          fk_accuracy: number | null;
          vision: number | null;
          dribbling: number | null;
          ball_control: number | null;
          agility: number | null;
          balance: number | null;
          reactions: number | null;
          composure: number | null;
          defensive_awareness: number | null;
          interceptions: number | null;
          standing_tackle: number | null;
          sliding_tackle: number | null;
          sprint_speed: number | null;
          acceleration: number | null;
          stamina: number | null;
          strength: number | null;
          jumping: number | null;
          aggression: number | null;
          attack_position: number | null;
          gk_diving: number | null;
          gk_handling: number | null;
          gk_kicking: number | null;
          gk_positioning: number | null;
          gk_reflexes: number | null;
          scraped_at: string | null;
          created_at: string;
        };
        Insert: {
          player_id: string;
          version: string;
          version_date?: string | null;
          version_date_txt: string;
          roster_id: string;
          primary_position?: string | null;
          positions: string[];
          finishing?: number | null;
          shot_power?: number | null;
          long_shots?: number | null;
          volleys?: number | null;
          penalties?: number | null;
          heading_accuracy?: number | null;
          short_passing?: number | null;
          long_passing?: number | null;
          crossing?: number | null;
          curve?: number | null;
          fk_accuracy?: number | null;
          vision?: number | null;
          dribbling?: number | null;
          ball_control?: number | null;
          agility?: number | null;
          balance?: number | null;
          reactions?: number | null;
          composure?: number | null;
          defensive_awareness?: number | null;
          interceptions?: number | null;
          standing_tackle?: number | null;
          sliding_tackle?: number | null;
          sprint_speed?: number | null;
          acceleration?: number | null;
          stamina?: number | null;
          strength?: number | null;
          jumping?: number | null;
          aggression?: number | null;
          attack_position?: number | null;
          gk_diving?: number | null;
          gk_handling?: number | null;
          gk_kicking?: number | null;
          gk_positioning?: number | null;
          gk_reflexes?: number | null;
          scraped_at?: string | null;
          created_at?: string;
        };
        Update: {
          player_id?: string;
          version?: string;
          version_date?: string | null;
          version_date_txt?: string;
          roster_id?: string;
          primary_position?: string | null;
          positions?: string[];
          finishing?: number | null;
          shot_power?: number | null;
          long_shots?: number | null;
          volleys?: number | null;
          penalties?: number | null;
          heading_accuracy?: number | null;
          short_passing?: number | null;
          long_passing?: number | null;
          crossing?: number | null;
          curve?: number | null;
          fk_accuracy?: number | null;
          vision?: number | null;
          dribbling?: number | null;
          ball_control?: number | null;
          agility?: number | null;
          balance?: number | null;
          reactions?: number | null;
          composure?: number | null;
          defensive_awareness?: number | null;
          interceptions?: number | null;
          standing_tackle?: number | null;
          sliding_tackle?: number | null;
          sprint_speed?: number | null;
          acceleration?: number | null;
          stamina?: number | null;
          strength?: number | null;
          jumping?: number | null;
          aggression?: number | null;
          attack_position?: number | null;
          gk_diving?: number | null;
          gk_handling?: number | null;
          gk_kicking?: number | null;
          gk_positioning?: number | null;
          gk_reflexes?: number | null;
          scraped_at?: string | null;
          created_at?: string;
        };
        Relationships: [
        {
          foreignKeyName: "players_scrapped_stats_player_id_fkey";
          columns: ["player_id"];
          isOneToOne: false;
          referencedRelation: "players";
          referencedColumns: ["id"];
        },
      ];
      };
      profiles: {
        Row: {
          id: string;
          name: string;
          mail: string;
          role: string;
          team_id: string | null;
          team_name: string | null;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          mail: string;
          role: string;
          team_id?: string | null;
          team_name?: string | null;
          status: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          mail?: string;
          role?: string;
          team_id?: string | null;
          team_name?: string | null;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
        {
          foreignKeyName: "profiles_team_id_fkey";
          columns: ["team_id"];
          isOneToOne: false;
          referencedRelation: "teams";
          referencedColumns: ["id"];
        },
      ];
      };
      season_statuses: {
        Row: {
          code: string;
          label: string;
          sort_order: number;
          active: boolean;
          created_at: string;
        };
        Insert: {
          code: string;
          label: string;
          sort_order: number;
          active: boolean;
          created_at?: string;
        };
        Update: {
          code?: string;
          label?: string;
          sort_order?: number;
          active?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      seasons: {
        Row: {
          id: string;
          name: string;
          season_number: number;
          category_year_cutoff: number | null;
          status: string;
          pre_contracts_enabled: boolean;
          transfers_enabled: boolean;
          start_date: string | null;
          end_date: string | null;
          created_at: string;
          updated_at: string | null;
        };
        Insert: {
          id: string;
          name: string;
          season_number: number;
          category_year_cutoff?: number | null;
          status: string;
          pre_contracts_enabled: boolean;
          transfers_enabled: boolean;
          start_date?: string | null;
          end_date?: string | null;
          created_at?: string;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          season_number?: number;
          category_year_cutoff?: number | null;
          status?: string;
          pre_contracts_enabled?: boolean;
          transfers_enabled?: boolean;
          start_date?: string | null;
          end_date?: string | null;
          created_at?: string;
          updated_at?: string | null;
        };
        Relationships: [
        {
          foreignKeyName: "seasons_status_fkey";
          columns: ["status"];
          isOneToOne: false;
          referencedRelation: "season_statuses";
          referencedColumns: ["code"];
        },
      ];
      };
      standings: {
        Row: {
          id: string;
          tournament_id: string;
          team_id: string;
          won: number;
          drawn: number;
          lost: number;
          goals_for: number;
          goals_against: number;
          points: number;
          position: number;
          updated_at: string | null;
          reached_stage: string | null;
          prize: string | null;
        };
        Insert: {
          id: string;
          tournament_id: string;
          team_id: string;
          won: number;
          drawn: number;
          lost: number;
          goals_for: number;
          goals_against: number;
          points: number;
          position: number;
          updated_at?: string | null;
          reached_stage?: string | null;
          prize?: string | null;
        };
        Update: {
          id?: string;
          tournament_id?: string;
          team_id?: string;
          won?: number;
          drawn?: number;
          lost?: number;
          goals_for?: number;
          goals_against?: number;
          points?: number;
          position?: number;
          updated_at?: string | null;
          reached_stage?: string | null;
          prize?: string | null;
        };
        Relationships: [
        {
          foreignKeyName: "standings_tournament_id_fkey";
          columns: ["tournament_id"];
          isOneToOne: false;
          referencedRelation: "tournaments";
          referencedColumns: ["id"];
        },
        {
          foreignKeyName: "standings_team_id_fkey";
          columns: ["team_id"];
          isOneToOne: false;
          referencedRelation: "teams";
          referencedColumns: ["id"];
        },
      ];
      };
      teams: {
        Row: {
          id: string;
          team_name: string;
          team_status: string;
          manager_id: string | null;
          manager_name: string | null;
          manager_mail: string | null;
          manager_whatsapp: string | null;
          created_at: string;
          updated_at: string | null;
        };
        Insert: {
          id: string;
          team_name: string;
          team_status: string;
          manager_id?: string | null;
          manager_name?: string | null;
          manager_mail?: string | null;
          manager_whatsapp?: string | null;
          created_at?: string;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          team_name?: string;
          team_status?: string;
          manager_id?: string | null;
          manager_name?: string | null;
          manager_mail?: string | null;
          manager_whatsapp?: string | null;
          created_at?: string;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      tournament_rounds: {
        Row: {
          id: string;
          tournament_id: string;
          round_number: number;
          round_name: string | null;
          status: string;
          created_at: string;
        };
        Insert: {
          id: string;
          tournament_id: string;
          round_number: number;
          round_name?: string | null;
          status: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          tournament_id?: string;
          round_number?: number;
          round_name?: string | null;
          status?: string;
          created_at?: string;
        };
        Relationships: [
        {
          foreignKeyName: "tournament_rounds_tournament_id_fkey";
          columns: ["tournament_id"];
          isOneToOne: false;
          referencedRelation: "tournaments";
          referencedColumns: ["id"];
        },
        {
          foreignKeyName: "tournament_rounds_status_fkey";
          columns: ["status"];
          isOneToOne: false;
          referencedRelation: "tournament_statuses";
          referencedColumns: ["code"];
        },
      ];
      };
      tournament_statuses: {
        Row: {
          code: string;
          label: string;
          sort_order: number;
          active: boolean;
          created_at: string;
        };
        Insert: {
          code: string;
          label: string;
          sort_order: number;
          active: boolean;
          created_at?: string;
        };
        Update: {
          code?: string;
          label?: string;
          sort_order?: number;
          active?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      tournament_types: {
        Row: {
          code: string;
          label: string;
          sort_order: number;
          active: boolean;
          created_at: string;
        };
        Insert: {
          code: string;
          label: string;
          sort_order: number;
          active: boolean;
          created_at?: string;
        };
        Update: {
          code?: string;
          label?: string;
          sort_order?: number;
          active?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      tournaments: {
        Row: {
          id: string;
          season_id: string;
          name: string;
          type: string;
          division: string | null;
          category: string;
          status: string;
          home_away: boolean;
          has_fixture: boolean;
          last_fixture_update: string | null;
          seeded_from_tournament_id: string | null;
          start_date: string | null;
          end_date: string | null;
          created_at: string;
          updated_at: string | null;
          format: string | null;
          total_teams: number | null;
          total_matches: number | null;
          total_rounds: number | null;
        };
        Insert: {
          id: string;
          season_id: string;
          name: string;
          type: string;
          division?: string | null;
          category: string;
          status: string;
          home_away: boolean;
          has_fixture: boolean;
          last_fixture_update?: string | null;
          seeded_from_tournament_id?: string | null;
          start_date?: string | null;
          end_date?: string | null;
          created_at?: string;
          updated_at?: string | null;
          format?: string | null;
          total_teams?: number | null;
          total_matches?: number | null;
          total_rounds?: number | null;
        };
        Update: {
          id?: string;
          season_id?: string;
          name?: string;
          type?: string;
          division?: string | null;
          category?: string;
          status?: string;
          home_away?: boolean;
          has_fixture?: boolean;
          last_fixture_update?: string | null;
          seeded_from_tournament_id?: string | null;
          start_date?: string | null;
          end_date?: string | null;
          created_at?: string;
          updated_at?: string | null;
          format?: string | null;
          total_teams?: number | null;
          total_matches?: number | null;
          total_rounds?: number | null;
        };
        Relationships: [
        {
          foreignKeyName: "tournaments_season_id_fkey";
          columns: ["season_id"];
          isOneToOne: false;
          referencedRelation: "seasons";
          referencedColumns: ["id"];
        },
        {
          foreignKeyName: "tournaments_type_fkey";
          columns: ["type"];
          isOneToOne: false;
          referencedRelation: "tournament_types";
          referencedColumns: ["code"];
        },
        {
          foreignKeyName: "tournaments_category_fkey";
          columns: ["category"];
          isOneToOne: false;
          referencedRelation: "player_categories";
          referencedColumns: ["code"];
        },
        {
          foreignKeyName: "tournaments_status_fkey";
          columns: ["status"];
          isOneToOne: false;
          referencedRelation: "tournament_statuses";
          referencedColumns: ["code"];
        },
        {
          foreignKeyName: "tournaments_seeded_from_tournament_id_fkey";
          columns: ["seeded_from_tournament_id"];
          isOneToOne: false;
          referencedRelation: "tournaments";
          referencedColumns: ["id"];
        },
      ];
      };
      trophies: {
        Row: {
          id: string;
          tournament_id: string;
          season_id: string;
          team_id: string;
          created_at: string;
        };
        Insert: {
          id: string;
          tournament_id: string;
          season_id: string;
          team_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          tournament_id?: string;
          season_id?: string;
          team_id?: string;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      v_players_full: {
        Row: {
          id: string | null;
          name: string | null;
          normalized_name: string | null;
          keywords: string[] | null;
          birth_date: string | null;
          nationality: string | null;
          nationality_code: string | null;
          category: string | null;
          category_label: string | null;
          status: string | null;
          status_label: string | null;
          primary_position: string | null;
          positions: string[] | null;
          salary: number | null;
          current_team_id: string | null;
          loaned_team_id: string | null;
          sofifa_link: string | null;
          transfermarket_id: number | null;
          created_at: string | null;
          updated_at: string | null;
          rating: number | null;
          market_value: number | null;
          market_value_txt: string | null;
          market_value_date: string | null;
          current_club_id: string | null;
          current_club_name: string | null;
          club_logo_id: string | null;
          league_id: string | null;
          league_name: string | null;
          last_updated: string | null;
          last_position_review: string | null;
        };
        Relationships: [
        {
          foreignKeyName: "v_players_full_category_fkey";
          columns: ["category"];
          isOneToOne: false;
          referencedRelation: "player_categories";
          referencedColumns: ["code"];
        },
        {
          foreignKeyName: "v_players_full_status_fkey";
          columns: ["status"];
          isOneToOne: false;
          referencedRelation: "player_statuses";
          referencedColumns: ["code"];
        },
        {
          foreignKeyName: "v_players_full_current_team_id_fkey";
          columns: ["current_team_id"];
          isOneToOne: false;
          referencedRelation: "teams";
          referencedColumns: ["id"];
        },
        {
          foreignKeyName: "v_players_full_loaned_team_id_fkey";
          columns: ["loaned_team_id"];
          isOneToOne: false;
          referencedRelation: "teams";
          referencedColumns: ["id"];
        },
      ];
      };
      v_resultado: {
        Row: {
          jsonb_build_object: Json | null;
        };
        Relationships: [];
      };
      v_standings_full: {
        Row: {
          id: string | null;
          tournament_id: string | null;
          team_id: string | null;
          team_name: string | null;
          position: number | null;
          won: number | null;
          drawn: number | null;
          lost: number | null;
          played: number | null;
          goals_for: number | null;
          goals_against: number | null;
          goal_difference: number | null;
          points: number | null;
          updated_at: string | null;
        };
        Relationships: [
        {
          foreignKeyName: "v_standings_full_tournament_id_fkey";
          columns: ["tournament_id"];
          isOneToOne: false;
          referencedRelation: "tournaments";
          referencedColumns: ["id"];
        },
        {
          foreignKeyName: "v_standings_full_team_id_fkey";
          columns: ["team_id"];
          isOneToOne: false;
          referencedRelation: "teams";
          referencedColumns: ["id"];
        },
      ];
      };
      v_tournament_general_stats: {
        Row: {
          tournament_id: string | null;
          tournament_name: string | null;
          season_id: string | null;
          total_matches: number | null;
          matches_played: number | null;
          total_goals: number | null;
          avg_goals_per_match: number | null;
          total_yellow_cards: number | null;
          total_red_cards: number | null;
          total_injuries: number | null;
          top_scoring_team_id: string | null;
          least_conceded_team_id: string | null;
        };
        Relationships: [
        {
          foreignKeyName: "v_tournament_general_stats_season_id_fkey";
          columns: ["season_id"];
          isOneToOne: false;
          referencedRelation: "seasons";
          referencedColumns: ["id"];
        },
      ];
      };
      v_tournament_player_stats: {
        Row: {
          tournament_id: string | null;
          player_id: string | null;
          player_name: string | null;
          team_id: string | null;
          team_name: string | null;
          goals: number | null;
          assists: number | null;
          mvps: number | null;
          yellow_cards: number | null;
          red_cards: number | null;
          injuries: number | null;
          matches_played: number | null;
          goals_per_match: number | null;
        };
        Relationships: [
        {
          foreignKeyName: "v_tournament_player_stats_tournament_id_fkey";
          columns: ["tournament_id"];
          isOneToOne: false;
          referencedRelation: "tournaments";
          referencedColumns: ["id"];
        },
        {
          foreignKeyName: "v_tournament_player_stats_player_id_fkey";
          columns: ["player_id"];
          isOneToOne: false;
          referencedRelation: "players";
          referencedColumns: ["id"];
        },
        {
          foreignKeyName: "v_tournament_player_stats_team_id_fkey";
          columns: ["team_id"];
          isOneToOne: false;
          referencedRelation: "teams";
          referencedColumns: ["id"];
        },
      ];
      };
      v_tournament_team_stats: {
        Row: {
          tournament_id: string | null;
          team_id: string | null;
          team_name: string | null;
          goals_scored: number | null;
          assists: number | null;
          mvps: number | null;
          yellow_cards: number | null;
          red_cards: number | null;
          injuries: number | null;
          players_with_incidents: number | null;
        };
        Relationships: [
        {
          foreignKeyName: "v_tournament_team_stats_tournament_id_fkey";
          columns: ["tournament_id"];
          isOneToOne: false;
          referencedRelation: "tournaments";
          referencedColumns: ["id"];
        },
        {
          foreignKeyName: "v_tournament_team_stats_team_id_fkey";
          columns: ["team_id"];
          isOneToOne: false;
          referencedRelation: "teams";
          referencedColumns: ["id"];
        },
      ];
      };
    };
    Functions: {
      add_player: { Args: { p_player: Json }; Returns: unknown };
      add_team: { Args: { p_team: Json }; Returns: unknown };
      delete_incident: { Args: { p_id: string }; Returns: unknown };
      get_active_season: { Args: Record<PropertyKey, never>; Returns: unknown };
      get_all_teams: { Args: Record<PropertyKey, never>; Returns: unknown };
      get_incident_types: { Args: Record<PropertyKey, never>; Returns: unknown };
      get_incidents_by_match: { Args: { p_match_id: string }; Returns: unknown };
      get_match_statuses: { Args: Record<PropertyKey, never>; Returns: unknown };
      get_match_types: { Args: Record<PropertyKey, never>; Returns: unknown };
      get_matches_by_round: { Args: { p_round_id: string }; Returns: unknown };
      get_matches_by_tournament: { Args: { p_status: string; p_tournament_id: string }; Returns: unknown };
      get_player_by_id: { Args: { p_id: string }; Returns: unknown };
      get_player_categories: { Args: Record<PropertyKey, never>; Returns: unknown };
      get_player_stats_by_tournament: { Args: { p_team_id: string; p_tournament_id: string }; Returns: unknown };
      get_player_statuses: { Args: Record<PropertyKey, never>; Returns: unknown };
      get_players: { Args: { p_category: string; p_search: string; p_status: string; p_team_id: string }; Returns: unknown };
      get_rounds_by_tournament: { Args: { p_tournament_id: string }; Returns: unknown };
      get_season_by_id: { Args: { p_id: string }; Returns: unknown };
      get_season_statuses: { Args: Record<PropertyKey, never>; Returns: unknown };
      get_seasons: { Args: { p_status: string }; Returns: unknown };
      get_squad: { Args: { p_team_id: string }; Returns: unknown };
      get_squad_stats: { Args: { p_team_id: string }; Returns: unknown };
      get_standings_by_tournament: { Args: { p_tournament_id: string }; Returns: unknown };
      get_team_by_id: { Args: { p_team_id: string }; Returns: unknown };
      get_team_fixtures: { Args: { p_limit: number; p_team_id: string }; Returns: unknown };
      get_team_form: { Args: { p_team_id: string }; Returns: unknown };
      get_team_profile: { Args: { p_team_id: string }; Returns: unknown };
      get_team_record: { Args: { p_team_id: string }; Returns: unknown };
      get_team_results: { Args: { p_limit: number; p_team_id: string }; Returns: unknown };
      get_team_tournaments: { Args: { p_season_id: string; p_team_id: string }; Returns: unknown };
      get_team_trophies: { Args: { p_team_id: string }; Returns: unknown };
      get_teams_by_status: { Args: { p_status: string }; Returns: unknown };
      get_tournament_by_id: { Args: { p_id: string }; Returns: unknown };
      get_tournament_statuses: { Args: Record<PropertyKey, never>; Returns: unknown };
      get_tournament_types: { Args: Record<PropertyKey, never>; Returns: unknown };
      get_tournaments: { Args: { p_category: string; p_season_id: string; p_status: string; p_type: string }; Returns: unknown };
      get_tournaments_by_season: { Args: { p_season_id: string }; Returns: unknown };
      get_tournaments_by_status: { Args: { p_season_id: string; p_status: string }; Returns: unknown };
      insert_incident: { Args: { incident: Json }; Returns: unknown };
      insert_match: { Args: { match: Json }; Returns: unknown };
      insert_round: { Args: { round: Json }; Returns: unknown };
      insert_season: { Args: { season: Json }; Returns: unknown };
      insert_tournament: { Args: { tournament: Json }; Returns: unknown };
      is_admin: { Args: Record<PropertyKey, never>; Returns: unknown };
      manages_team: { Args: { p_team_id: string }; Returns: unknown };
      rls_auto_enable: { Args: Record<PropertyKey, never>; Returns: unknown };
      update_match: { Args: { match: Json; p_id: string }; Returns: unknown };
      update_player: { Args: { p_id: string; p_player: Json }; Returns: unknown };
      update_player_scrapped_data: { Args: { data: Json; p_id: string }; Returns: unknown };
      update_season: { Args: { p_id: string; season: Json }; Returns: unknown };
      update_tournament: { Args: { p_id: string; tournament: Json }; Returns: unknown };
      upsert_standing: { Args: { standing: Json }; Returns: unknown };
    };
    Enums: Record<never, never>;
    CompositeTypes: Record<never, never>;
  };
};

type PublicSchema = Database["public"];

export type Tables<T extends keyof PublicSchema["Tables"]> =
  PublicSchema["Tables"][T]["Row"];
export type TablesInsert<T extends keyof PublicSchema["Tables"]> =
  PublicSchema["Tables"][T]["Insert"];
export type TablesUpdate<T extends keyof PublicSchema["Tables"]> =
  PublicSchema["Tables"][T]["Update"];
export type Views<T extends keyof PublicSchema["Views"]> =
  PublicSchema["Views"][T]["Row"];
