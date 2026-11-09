import React from 'react';
import { LucideIcon, TrendingDown, TrendingUp, Minus, Info } from 'lucide-react';

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
  iconColor = 'text-emerald-600',
  source,
  description,
}: MetricCardProps) {
  const isNegative = trend && trend.value < 0;
  const isPositive = trend && trend.value > 0;
  const isFavorable = trend?.isPositiveGood ? isPositive : isNegative;

  return (
    <div className="glass-panel p-6 flex flex-col justify-between hover:border-emerald-500/30">
      <div>
        <div className="flex items-start justify-between gap-3">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">
            {title}
          </span>
          <div className={`p-2 rounded-xl bg-slate-100 ${iconColor}`}>
            <Icon size={17} />
          </div>
        </div>

        <div className="mt-3 flex items-baseline gap-2">
          <span className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            {typeof value === 'number' ? value.toLocaleString('pt-BR') : value}
          </span>
          {unit && (
            <span className="text-xs font-semibold text-slate-500">
              {unit}
            </span>
          )}
        </div>

        {trend && (
          <div className="mt-2.5 flex items-center gap-1.5 text-xs">
            <span className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[11px] font-bold ${
              isFavorable 
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-500/20' 
                : 'bg-amber-50 text-amber-700 border border-amber-500/20'
            }`}>
              {isNegative ? <TrendingDown size={12} /> : isPositive ? <TrendingUp size={12} /> : <Minus size={12} />}
              {Math.abs(trend.value)}%
            </span>
            <span className="text-[11px] font-medium text-slate-500">
              {trend.label}
            </span>
          </div>
        )}

        <p className="mt-3 text-xs leading-relaxed text-slate-600">
          {description}
        </p>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-200/70 flex items-center justify-between text-[11px] text-slate-400 font-mono">
        <span className="truncate">Fonte: {source}</span>
        <Info size={12} className="text-slate-400 shrink-0" />
      </div>
    </div>
  );
}
