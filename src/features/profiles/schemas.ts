import { z } from "zod";

/**
 * Validation for the fields a user may edit on their own profile.
 * `role` and `status` are intentionally excluded — those are service_role only
 * (enforced by RLS), so they must never come from a client form.
 */
export const profileUpdateSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(80, "El nombre es demasiado largo"),
  team_name: z.string().trim().max(80).nullable().optional(),
});

export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;
