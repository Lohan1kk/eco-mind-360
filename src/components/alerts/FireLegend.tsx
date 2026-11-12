import { LEVEL_META, ALERT_LEVELS } from "@/lib/alerts/levels";

export function FireLegend() {
  return (
    <div
      className="rounded-[10px] border border-[#29362D] bg-[#171F1A]/95 px-3 py-2.5 shadow-lift backdrop-blur-md"
      aria-label="Legenda de níveis de alerta"
    >
      <p className="mb-1.5 text-[10px] font-mono uppercase tracking-wider text-[#91A88F] sm:mb-2">
        Potência Radiativa (FRP)
      </p>
      <ul className="flex flex-wrap gap-x-3 gap-y-1 sm:block sm:space-y-1.5">
        {ALERT_LEVELS.map((level) => (
          <li
            key={level}
            className="flex items-center gap-2 text-[11px] text-[#DCE5DD] sm:text-xs"
          >
            <span
              className="inline-block h-2.5 w-2.5 shrink-0 rounded-full border border-[#101512]"
              style={{ backgroundColor: LEVEL_META[level].color }}
              aria-hidden
            />
            {LEVEL_META[level].label}
          </li>
        ))}
      </ul>
      <p className="mt-2 hidden max-w-[13rem] text-[10px] leading-snug text-[#78877D] font-mono sm:block">
        Crítico ≥100 · Alto ≥40 · Médio ≥15 · Baixo &lt;15 MW.{" "}
        <a href="/#glossario" className="text-[#91A88F] underline underline-offset-2">
          Glossário
        </a>
      </p>
    </div>
  );
}
