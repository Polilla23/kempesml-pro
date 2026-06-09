import { z } from "zod";

/**
 * Base sign-in schema — source of the inferred input type. Validation messages
 * are applied (localized) at the form level via the `auth.errors` translator.
 */
export const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export type SignInInput = z.infer<typeof signInSchema>;

/** Base sign-up schema — drives the form's inferred type. */
export const signUpSchema = z
  .object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
    confirmPassword: z.string().min(6),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
  });

export type SignUpInput = z.infer<typeof signUpSchema>;

/** Payload actually sent to Supabase (no confirmPassword). */
export type SignUpValues = {
  name: string;
  email: string;
  password: string;
};
