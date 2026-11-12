"use client";

import { CLIMATE_STATS } from "@/data/climate-stats";

export function ClimateReality() {
  return (
    <section id="realidade" className="section scroll-mt-20 relative overflow-hidden bg-[#131A16] border-b border-[#222D25] text-[#DCE5DD]">
      <div className="section-inner relative z-[1]">
        <div>
          <p className="eyebrow text-[#91A88F]">A realidade</p>
          <h2 className="font-display font-semibold tracking-tight mt-3 max-w-3xl text-3xl md:text-4xl text-[#DCE5DD]">
            Os números não pedem licença para mudar
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#A7B3A9]">
            Antes de qualquer app, existe um planeta reagindo às nossas
            escolhas. Os números usam unidades como{" "}
            <a href="/#glossario" className="text-[#91A88F] underline-offset-2 hover:underline">
              ppm
            </a>{" "}
            e °C — veja o glossário se o termo for novo.
          </p>
        </div>

        <ul className="mt-12 grid gap-x-12 gap-y-10 md:grid-cols-2">
          {CLIMATE_STATS.map((stat) => (
            <li key={stat.value} className="border-t border-[#222D25] pt-6">
              <p
                className={`font-mono font-semibold text-2xl md:text-3xl ${
                  stat.trend === "down" ? "text-[#83A989]" : "text-[#A9A17A]"
                }`}
              >
                {stat.trend === "up" ? "↑ " : "↓ "}
                {stat.value}
              </p>
              <p className="mt-2.5 text-sm leading-relaxed text-[#DCE5DD]">
                {stat.label}
              </p>
              <p className="mt-2 text-xs font-mono text-[#78877D]">Fonte: {stat.source}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
