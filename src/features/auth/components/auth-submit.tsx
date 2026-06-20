"use client";

import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * KML-styled primary submit button: uppercase display font, primary glow and a
 * sliding arrow. `skew` applies the angled clip-path used on the sign-up CTA.
 */
export function AuthSubmit({
  children,
  pending = false,
  skew = false,
}: {
  children: React.ReactNode;
  pending?: boolean;
  skew?: boolean;
}) {
  return (
    <button
      type="submit"
      disabled={pending}
      className={cn(
        "group bg-kml-primary text-kml-on-primary font-display relative flex w-full items-center justify-center gap-2 rounded-sm px-6 py-4 text-lg font-bold tracking-widest uppercase transition-all duration-150 hover:shadow-[0_0_30px_rgba(151,204,254,0.6)] active:scale-95 disabled:opacity-60",
        skew
          ? "[clip-path:polygon(0_0,96%_0,100%_100%,0_100%)]"
          : "shadow-[0_0_20px_rgba(151,204,254,0.4)]"
      )}
    >
      <span className="relative z-10">{children}</span>
      <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
    </button>
  );
}
