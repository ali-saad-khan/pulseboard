interface Props { data: { label: string; value: number }[]; format: (n: number) => string }

/** Dependency-free responsive SVG bar chart with an accessible text alternative. */
export function BarChart({ data, format }: Props) {
  const max = Math.max(1, ...data.map((d) => d.value));
  const w = 100 / Math.max(1, data.length);
  return (
    <figure>
      <svg viewBox="0 0 100 48" className="h-56 w-full" role="img" aria-label={`Weekly revenue, ${data.length} weeks`}>
        {data.map((d, i) => {
          const h = (d.value / max) * 40;
          return (
            <g key={d.label}>
              <title>{`Week of ${d.label}: ${format(d.value)}`}</title>
              <rect x={i * w + w * 0.15} y={44 - h} width={w * 0.7} height={h} rx="0.8" className="fill-indigo-500 hover:fill-indigo-400" />
            </g>
          );
        })}
        <line x1="0" x2="100" y1="44" y2="44" className="stroke-slate-300 dark:stroke-slate-700" strokeWidth="0.3" />
      </svg>
      <figcaption className="sr-only">
        {data.map((d) => `Week of ${d.label}: ${format(d.value)}`).join("; ")}
      </figcaption>
    </figure>
  );
}
