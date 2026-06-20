"use client";

import { useState } from "react";
import { Eye, EyeOff, type LucideIcon } from "lucide-react";
import type { Control, FieldPath, FieldValues } from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";

type AuthFieldProps<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
  label: string;
  type?: "text" | "email" | "password";
  placeholder?: string;
  autoComplete?: string;
  icon?: LucideIcon;
  /** Optional element rendered to the right of the label (e.g. a "forgot?" link). */
  action?: React.ReactNode;
};

/**
 * KML-styled form input wired to react-hook-form: uppercase mono label, a
 * leading icon, focus glow, and a show/hide toggle for password fields.
 */
export function AuthField<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  type = "text",
  placeholder,
  autoComplete,
  icon: Icon,
  action,
}: AuthFieldProps<TFieldValues>) {
  const [show, setShow] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword ? (show ? "text" : "password") : type;

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="group space-y-1">
          <div className="flex items-center justify-between">
            <FormLabel className="text-kml-on-surface-variant group-focus-within:text-kml-primary font-label text-xs tracking-wider uppercase transition-colors">
              {label}
            </FormLabel>
            {action}
          </div>
          <div className="relative">
            {Icon && (
              <Icon className="text-kml-outline pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2" />
            )}
            <FormControl>
              <input
                type={inputType}
                placeholder={placeholder}
                autoComplete={autoComplete}
                {...field}
                className={cn(
                  "border-kml-outline-variant bg-kml-surface-low text-kml-on-surface placeholder:text-kml-on-surface-variant/40 focus:border-kml-primary w-full rounded-sm border py-3.5 outline-none transition-all focus:shadow-[0_0_10px_rgba(151,204,254,0.2)]",
                  Icon ? "pl-12" : "pl-4",
                  isPassword ? "pr-12" : "pr-4"
                )}
              />
            </FormControl>
            {isPassword && (
              <button
                type="button"
                onClick={() => setShow((s) => !s)}
                className="text-kml-outline hover:text-kml-on-surface absolute top-1/2 right-4 -translate-y-1/2"
                tabIndex={-1}
              >
                {show ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </button>
            )}
          </div>
          <FormMessage className="text-kml-error" />
        </FormItem>
      )}
    />
  );
}
