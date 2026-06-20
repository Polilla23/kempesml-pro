/**
 * Content of the left branding panel: an eyebrow tag, a big headline (with an
 * optional highlighted word), a description and a row of stats. Driven by props
 * so each auth page can show its own copy.
 */
export function AuthBranding({
  eyebrow,
  title,
  description,
  stats,
}: {
  eyebrow: string;
  title: React.ReactNode;
  description: string;
  stats: { value: string; label: string }[];
}) {
  return (
    <>
      {/* top spacer (keeps content vertically centered between top and stats) */}
      <div />

      <div className="max-w-xl space-y-6">
        <span className="border-kml-primary bg-kml-primary/10 text-kml-primary font-label inline-block border-l-4 px-4 py-1 text-xs tracking-widest uppercase">
          {eyebrow}
        </span>
        <h1 className="text-kml-on-surface font-display text-6xl leading-none font-extrabold tracking-tight uppercase lg:text-[72px] lg:leading-[76px]">
          {title}
        </h1>
        <p className="text-kml-on-surface-variant font-body text-lg leading-relaxed">
          {description}
        </p>
      </div>

      <div className="border-kml-outline-variant/30 flex items-center gap-12 border-t pt-6">
        {stats.map((stat) => (
          <div key={stat.label} className="flex flex-col">
            <span className="text-kml-primary font-display text-2xl font-extrabold">
              {stat.value}
            </span>
            <span className="text-kml-on-surface-variant font-label text-xs uppercase">
              {stat.label}
            </span>
          </div>
        ))}
      </div>
    </>
  );
}
