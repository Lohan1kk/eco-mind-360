"use client";

import { useEffect, useMemo, useState } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { Info } from "lucide-react";
import { CarbonBreakdown } from "./CarbonBreakdown";
import {
  calculateFootprint,
  type TransportMode,
} from "@/lib/carbon/calculate";
import { pressTransition, tapSoft } from "@/components/motion";

const TRANSPORT_OPTIONS: {
  mode: TransportMode;
  label: string;
}[] = [
  { mode: "carro", label: "Carro" },
  { mode: "onibus", label: "Ônibus" },
  { mode: "metro", label: "Metrô/Trem" },
  { mode: "bike", label: "Bike/A pé" },
];

export function CarbonCalculator() {
  const [km, setKm] = useState(12);
  const [meat, setMeat] = useState(4);
  const [energy, setEnergy] = useState(220);
  const [transport, setTransport] = useState<TransportMode>("carro");
  const reduce = useReducedMotion();

  const result = useMemo(
    () =>
      calculateFootprint({
        kmPerDay: km,
        meatPerWeek: meat,
        energyReais: energy,
        transportMode: transport,
      }),
    [km, meat, energy, transport],
  );

  const totalMv = useMotionValue(result.total);
  const totalSpring = useSpring(totalMv, {
    stiffness: reduce ? 400 : 90,
    damping: reduce ? 40 : 22,
  });
  const totalDisplay = useTransform(totalSpring, (v) =>
    Math.round(v).toLocaleString("pt-BR"),
  );

  useEffect(() => {
    totalMv.set(result.total);
  }, [result.total, totalMv]);

  return (
    <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
      <div className="glass-panel space-y-7 p-6 sm:p-8">
        <div>
          <label htmlFor="km" className="flex justify-between text-sm font-medium text-[var(--foreground)]">
            <span>Deslocamento diário</span>
            <span className="font-mono text-[var(--primary)]">{km} km</span>
          </label>
          <input
            id="km"
            type="range"
            min={0}
            max={80}
            value={km}
            onChange={(e) => setKm(Number(e.target.value))}
            className="mt-2.5 w-full accent-[var(--primary)]"
          />
        </div>

        <div>
          <p className="text-sm font-medium text-[var(--foreground)]">Meio de transporte principal</p>
          <div className="mt-2.5 flex flex-wrap gap-2">
            {TRANSPORT_OPTIONS.map((opt) => (
              <motion.button
                key={opt.mode}
                type="button"
                onClick={() => setTransport(opt.mode)}
                className={`min-h-[40px] cursor-pointer rounded-[8px] px-4 py-2 text-xs font-medium transition ${
                  transport === opt.mode
                    ? "bg-[var(--primary)] text-white"
                    : "border border-[var(--border)] bg-[var(--background)] text-[var(--foreground-secondary)] hover:border-[var(--accent-action)] hover:text-[var(--foreground)]"
                }`}
                whileTap={reduce ? undefined : tapSoft}
                transition={pressTransition}
              >
                {opt.label}
              </motion.button>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="meat" className="flex justify-between text-sm font-medium text-[var(--foreground)]">
            <span>Consumo de carne</span>
            <span className="font-mono text-[var(--primary)]">{meat}x por semana</span>
          </label>
          <input
            id="meat"
            type="range"
            min={0}
            max={14}
            value={meat}
            onChange={(e) => setMeat(Number(e.target.value))}
            className="mt-2.5 w-full accent-[var(--primary)]"
          />
        </div>

        <div>
          <label htmlFor="energy" className="flex justify-between text-sm font-medium text-[var(--foreground)]">
            <span>Conta de energia mensal</span>
            <span className="font-mono text-[var(--primary)]">
              R$ {energy} (~{Math.round(result.kwhEstimado)} kWh)
            </span>
          </label>
          <input
            id="energy"
            type="range"
            min={0}
            max={1000}
            step={10}
            value={energy}
            onChange={(e) => setEnergy(Number(e.target.value))}
            className="mt-2.5 w-full accent-[var(--primary)]"
          />
        </div>
      </div>

      <div className="glass-panel p-6 sm:p-8 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-2">
            <span className="eyebrow">Resultado Anual</span>
            <span className="inline-flex items-center gap-1 rounded-full bg-[var(--accent-soft)] px-2.5 py-0.5 text-[11px] font-medium text-[var(--primary)]">
              <Info size={12} strokeWidth={1.5} />
              <span>Estimativa parcial</span>
            </span>
          </div>

          <motion.p className="mt-3 font-display text-5xl sm:text-6xl text-[var(--foreground)] tabular-nums">
            {totalDisplay}
          </motion.p>
          <p className="text-sm text-[var(--foreground-secondary)] mt-1">
            kg de CO₂ equivalente por ano
          </p>

          <div className="mt-5 h-2 overflow-hidden rounded-full bg-[var(--background)] border border-[var(--border)]">
            <motion.div
              className="h-full rounded-full bg-[var(--primary)]"
              animate={{ width: `${result.progressPct}%` }}
              transition={{ duration: reduce ? 0 : 0.35, ease: "easeOut" }}
            />
          </div>

          <p className="mt-5 text-sm leading-relaxed text-[var(--foreground)]">
            {result.message}
          </p>

          <CarbonBreakdown
            transport={result.transportAnnual}
            meat={result.meatAnnual}
            energy={result.energyAnnual}
            total={result.total}
          />
        </div>

        <p className="mt-6 pt-4 border-t border-[var(--border)] text-xs leading-relaxed text-[var(--muted)]">
          Aviso de estimativa parcial: cálculo simplificado nos eixos transporte, alimentação e eletricidade residencial (fatores médios DEFRA/EPA, Poore &amp; Nemecek 2018 e SIN/MCTI).
        </p>
      </div>
    </div>
  );
}
