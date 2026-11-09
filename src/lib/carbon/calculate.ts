export type TransportMode = "carro" | "onibus" | "metro" | "bike";

export const TRANSPORT_FACTORS: Record<TransportMode, number> = {
  carro: 0.192,
  onibus: 0.089,
  metro: 0.041,
  bike: 0,
};

export const MEAT_FACTOR_KG = 2.5;
export const TARIFA_MEDIA_KWH = 0.75;
export const FATOR_GRID_SIN = 0.0817;
export const MAX_REF_KG_YEAR = 8750;

export interface CarbonInput {
  kmPerDay: number;
  transportMode: TransportMode;
  meatPerWeek: number;
  energyReais: number;
}

export interface CarbonResult {
  transportAnnual: number;
  meatAnnual: number;
  energyAnnual: number;
  total: number;
  kwhEstimado: number;
  progressPct: number;
  level: "excelente" | "media" | "acima";
  message: string;
}

export function calculateFootprint(input: CarbonInput): CarbonResult {
  const factor = TRANSPORT_FACTORS[input.transportMode];
  const transportAnnual = input.kmPerDay * factor * 365;
  const meatAnnual = input.meatPerWeek * 52 * MEAT_FACTOR_KG;
  const kwhEstimado = input.energyReais / TARIFA_MEDIA_KWH;
  const energyAnnual = kwhEstimado * FATOR_GRID_SIN * 12;
  const total = transportAnnual + meatAnnual + energyAnnual;
  const progressPct = Math.min(100, (total / MAX_REF_KG_YEAR) * 100);

  let level: CarbonResult["level"] = "acima";
  let message =
    "Acima da média nacional. O maior ganho aqui costuma vir do transporte — pequenas trocas geram grande impacto acumulado.";

  if (total < 1800) {
    level = "excelente";
    message =
      "Excelente. Sua pegada está bem abaixo da média — continue assim.";
  } else if (total < 4200) {
    level = "media";
    if (input.transportMode === "carro" && input.kmPerDay > 0) {
      const economia = Math.round(
        input.kmPerDay * (factor - TRANSPORT_FACTORS.onibus) * 2 * 52,
      );
      message = `Dentro da média. Trocar 2 dias de carro por ônibus já reduziria cerca de ${Math.max(economia, 0).toLocaleString("pt-BR")} kg/ano.`;
    } else if (input.meatPerWeek >= 4) {
      message = `Dentro da média. Reduzir 2 refeições com carne por semana já cortaria cerca de ${Math.round(2 * 52 * MEAT_FACTOR_KG).toLocaleString("pt-BR")} kg/ano.`;
    } else {
      message =
        "Dentro da média. Pequenos ajustes no consumo de energia já fazem diferença ao longo do ano.";
    }
  }

  return {
    transportAnnual,
    meatAnnual,
    energyAnnual,
    total,
    kwhEstimado,
    progressPct,
    level,
    message,
  };
}
