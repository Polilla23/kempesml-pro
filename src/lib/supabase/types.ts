import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/types/database.types";

/** Supabase client typed against our DB schema. Use in every service. */
export type TypedSupabaseClient = SupabaseClient<Database>;
