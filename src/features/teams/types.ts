import type {
  Tables,
  TablesInsert,
  TablesUpdate,
} from "@/types/database.types";

export type Team = Tables<"teams">;
export type TeamInsert = TablesInsert<"teams">;
export type TeamUpdate = TablesUpdate<"teams">;
