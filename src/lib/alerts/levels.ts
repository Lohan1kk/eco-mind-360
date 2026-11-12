import type { AlertLevel } from "./types";

export const ALERT_LEVELS: AlertLevel[] = [
  "critico",
  "alto",
  "medio",
  "baixo",
];

export const LEVEL_META: Record<
  AlertLevel,
  { label: string; color: string; pinClass: string }
> = {
  critico: {
    label: "Crítico",
    color: "#A77D78",
    pinClass: "bg-[#A77D78]",
  },
  alto: {
    label: "Alto",
    color: "#A9A17A",
    pinClass: "bg-[#A9A17A]",
  },
  medio: {
    label: "Médio",
    color: "#91A88F",
    pinClass: "bg-[#91A88F]",
  },
  baixo: {
    label: "Baixo",
    color: "#789B7C",
    pinClass: "bg-[#789B7C]",
  },
};

export function isAlertLevel(value: string): value is AlertLevel {
  return ALERT_LEVELS.includes(value as AlertLevel);
}
