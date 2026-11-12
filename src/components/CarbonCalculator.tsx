"use client";

import { useEffect, useMemo, useState } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
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
    <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
      <div className="space-y-8 rounded-[10px] border border-[#29362D] bg-[#171F1A] p-6 sm:p-8">
        <div>
          <label htmlFor="km" className="flex justify-between text-sm font-medium text-[#DCE5DD]">
            <span>Deslocamento diário</span>
            <span className="font-mono text-[#91A88F]">{km} km</span>
          </label>
          <input
            id="km"
            type="range"
            min={0}
            max={80}
            value={km}
            onChange={(e) => setKm(Number(e.target.value))}
            className="mt-2.5 w-full accent-[#789B7C]"
          />
        </div>

        <div>
          <p className="text-sm font-medium text-[#DCE5DD]">Meio de transporte principal</p>
          <div className="mt-2.5 flex flex-wrap gap-2">
            {TRANSPORT_OPTIONS.map((opt) => (
              <motion.button
                key={opt.mode}
                type="button"
                onClick={() => setTransport(opt.mode)}
                className={`cursor-pointer rounded-[7px] px-4 py-2 text-xs font-medium transition ${
                  transport === opt.mode
                    ? "bg-[#294C35] text-[#DCE5DD] border border-[#365C40]"
                    : "border border-[#29362D] bg-[#131A16] text-[#A7B3A9] hover:border-[#789B7C]/50 hover:text-[#DCE5DD]"
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
          <label htmlFor="meat" className="flex justify-between text-sm font-medium text-[#DCE5DD]">
            <span>Consumo de carne</span>
            <span className="font-mono text-[#91A88F]">{meat}x por semana</span>
          </label>
          <input
            id="meat"
            type="range"
            min={0}
            max={14}
            value={meat}
            onChange={(e) => setMeat(Number(e.target.value))}
            className="mt-2.5 w-full accent-[#789B7C]"
          />
        </div>

        <div>
          <label htmlFor="energy" className="flex justify-between text-sm font-medium text-[#DCE5DD]">
            <span>Conta de energia mensal</span>
            <span className="font-mono text-[#91A88F]">
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
            className="mt-2.5 w-full accent-[#789B7C]"
          />
        </div>
      </div>

      <motion.div
        className="rounded-[10px] border border-[#29362D] bg-[#171F1A] p-6 sm:p-8"
        initial={reduce ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduce ? 0 : 0.35, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="text-xs font-mono uppercase tracking-wider text-[#91A88F]">
          Estimativa anual
        </p>
        <motion.p
          className={`mt-2 font-display text-5xl sm:text-6xl font-semibold tabular-nums ${
            result.level === "excelente" ? "text-[#83A989]" : "text-[#DCE5DD]"
          }`}
        >
          {totalDisplay}
        </motion.p>
        <p className="text-base text-[#A7B3A9] mt-1">kg de CO₂ equivalente por ano</p>
        <p className="mt-1 text-xs text-[#78877D]">
          CO₂e = impacto de vários gases numa só unidade (como se fosse só CO₂).
        </p>

        <div className="mt-6 h-2 overflow-hidden rounded-full bg-[#131A16] border border-[#222D25]">
          <motion.div
            className="h-full rounded-full bg-[#789B7C]"
            animate={{ width: `${result.progressPct}%` }}
            transition={{ duration: reduce ? 0 : 0.35, ease: "easeOut" }}
          />
        </div>

        <p className="mt-6 text-sm leading-relaxed text-[#DCE5DD]">{result.message}</p>

        <CarbonBreakdown
          transport={result.transportAnnual}
          meat={result.meatAnnual}
          energy={result.energyAnnual}
          total={result.total}
        />

        <p className="mt-6 text-xs leading-relaxed text-[#78877D]">
          Metodologia: fatores médios de transporte (DEFRA/EPA), alimentação
          (Poore &amp; Nemecek, 2018) e matriz elétrica do SIN (MCTI).
        </p>
      </motion.div>
    </div>
  );
}
