import Image from "next/image";
import { useTranslations } from "next-intl";

/**
 * Split-screen auth layout: an immersive branding panel on the left (desktop
 * only) and the form column on the right. Shared by sign-in / sign-up /
 * forgot-password / reset-password so they all stay consistent.
 */
export function AuthShell({
  branding,
  children,
}: {
  branding: React.ReactNode;
  children: React.ReactNode;
}) {
  const t = useTranslations("auth");

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden md:flex-row">
      {/* Atmospheric glow blobs */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="bg-kml-primary/5 absolute -top-[10%] -left-[10%] h-[40%] w-[40%] rounded-full blur-[120px]" />
        <div className="bg-kml-primary/5 absolute -right-[10%] -bottom-[10%] h-[30%] w-[30%] rounded-full blur-[100px]" />
      </div>

      {/* Left: branding (desktop only) */}
      <div className="bg-kml-surface-lowest relative hidden w-1/2 overflow-hidden md:flex lg:w-3/5">
        <div className="absolute inset-0 z-0">
          <div className="from-kml-surface-lowest via-kml-surface to-kml-surface-low absolute inset-0 bg-gradient-to-br" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Image
              src="/images/120.png"
              alt=""
              width={420}
              height={420}
              priority
              className="w-[55%] -rotate-6 scale-125 opacity-10 mix-blend-overlay"
            />
          </div>
          <div className="from-kml-surface/90 via-kml-surface/40 absolute inset-0 bg-gradient-to-r to-transparent" />
        </div>
        <div className="relative z-10 flex h-full flex-col justify-between p-16">
          {branding}
        </div>
      </div>

      {/* Right: form column */}
      <main className="bg-kml-surface relative flex flex-1 items-center justify-center p-4 md:p-16">
        <div className="border-kml-outline-variant/30 bg-kml-surface-container absolute top-8 left-4 rounded-full border p-1 shadow-lg md:hidden">
          <Image
            src="/images/120.png"
            alt="Kempes Master League"
            width={56}
            height={56}
            priority
            className="size-14 object-contain"
          />
        </div>

        <div className="w-full max-w-md space-y-10">{children}</div>

        <footer className="absolute right-4 bottom-6 left-4 flex items-center justify-between opacity-40 md:right-16 md:left-16">
          <p className="font-label text-[10px] tracking-tighter uppercase">
            {t("legal")}
          </p>
        </footer>
      </main>
    </div>
  );
}
