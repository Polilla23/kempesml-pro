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
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      is_admin: { Args: Record<PropertyKey, never>; Returns: boolean };
      manages_team: { Args: { p_team_id: string }; Returns: boolean };
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
