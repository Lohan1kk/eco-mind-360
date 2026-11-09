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
    color: "#dc2626",
    pinClass: "bg-red-600",
  },
  alto: {
    label: "Alto",
    color: "#ea580c",
    pinClass: "bg-orange-500",
  },
  medio: {
    label: "Médio",
    color: "#ca8a04",
    pinClass: "bg-yellow-500",
  },
  baixo: {
    label: "Baixo",
    color: "#16a34a",
    pinClass: "bg-green-600",
  },
};

export function isAlertLevel(value: string): value is AlertLevel {
  return ALERT_LEVELS.includes(value as AlertLevel);
}
