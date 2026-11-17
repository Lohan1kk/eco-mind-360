"use client";

import React from "react";
import { LucideIcon, TrendingDown, TrendingUp, Minus } from "lucide-react";
import { NumberTicker } from "@/components/ui/magicui/number-ticker";

interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  trend?: {
    value: number;
    label: string;
    isPositiveGood?: boolean;
  };
  icon: LucideIcon;
  iconColor?: string;
  source: string;
  description: string;
}

export function MetricCard({
  title,
  value,
  unit,
  trend,
  icon: Icon,
  source,
  description,
}: MetricCardProps) {
  const isNegative = trend && trend.value < 0;
  const isPositive = trend && trend.value > 0;
  const isFavorable = trend?.isPositiveGood ? isPositive : isNegative;

  const isNumeric = typeof value === "number" && Number.isFinite(value);
  const hasDecimals = isNumeric && !Number.isInteger(value);

  return (
    <div className="glass-panel p-6 flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between gap-3">
          <span className="text-xs font-medium text-[var(--muted)]">
            {title}
          </span>
          <div className="flex h-9 w-9 items-center justify-center rounded-[8px] bg-[var(--accent-soft)] text-[var(--primary)]">
            <Icon size={16} strokeWidth={1.5} />
          </div>
        </div>

        <div className="mt-4 flex items-baseline gap-2">
          <span className="font-display text-4xl text-[var(--foreground)] tabular-nums">
            {isNumeric ? (
              <NumberTicker value={value} decimalPlaces={hasDecimals ? 1 : 0} />
            ) : (
              value
            )}
          </span>
          {unit && (
            <span className="text-xs text-[var(--muted)]">{unit}</span>
          )}
        </div>

        {trend && (
          <div className="mt-3 flex items-center gap-1.5 text-xs">
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${
                isFavorable
                  ? "bg-[var(--accent-soft)] text-[var(--primary)]"
                  : "bg-[var(--background)] text-[var(--warning)] border border-[var(--border)]"
              }`}
            >
              {isNegative ? (
                <TrendingDown size={11} strokeWidth={1.5} />
              ) : isPositive ? (
                <TrendingUp size={11} strokeWidth={1.5} />
              ) : (
                <Minus size={11} strokeWidth={1.5} />
              )}
              {Math.abs(trend.value)}%
            </span>
            <span className="text-[11px] text-[var(--muted)] truncate">
              {trend.label}
            </span>
          </div>
        )}

        <p className="mt-3 text-xs leading-relaxed text-[var(--foreground-secondary)]">
          {description}
        </p>
      </div>

      <div className="mt-5 pt-3 border-t border-[var(--border)] text-[11px] text-[var(--muted)]">
        <span className="truncate block">{source}</span>
      </div>
    </div>
  );
}
