"use client";

import type { Control, FieldPath, FieldValues } from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

type TextFieldProps<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
  label: string;
  type?: React.ComponentProps<typeof Input>["type"];
  placeholder?: string;
  autoComplete?: string;
};

/**
 * Reusable form text input: wraps FormField + FormItem + FormLabel +
 * FormControl + Input + FormMessage. Generic over the form's value type so it
 * stays type-safe with react-hook-form.
 */
export function TextField<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  type,
  placeholder,
  autoComplete,
}: TextFieldProps<TFieldValues>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              type={type}
              placeholder={placeholder}
              autoComplete={autoComplete}
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
