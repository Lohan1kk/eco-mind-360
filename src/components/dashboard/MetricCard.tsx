import React from 'react';
import { LucideIcon, TrendingDown, TrendingUp, Minus, Info } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  trend?: {
    value: number;
    label: string;
    isPositiveGood?: boolean; // if false, negative is good (e.g. less deforestation)
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
  iconColor = 'text-emerald-400',
  source,
  description,
}: MetricCardProps) {
  const isNegative = trend && trend.value < 0;
  const isPositive = trend && trend.value > 0;

  // Para desmatamento e queimadas, queda (negativo) é verde/positivo!
  const isFavorable = trend?.isPositiveGood ? isPositive : isNegative;

  return (
    <div className="p-5 rounded-2xl bg-white dark:bg-[#0d1522] border border-slate-200 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700/80 shadow-sm hover:shadow-md transition-all">
      <div className="flex items-start justify-between gap-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {title}
        </span>
        <div className={`p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 ${iconColor}`}>
          <Icon size={18} />
        </div>
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-mono">
          {typeof value === 'number' ? value.toLocaleString('pt-BR') : value}
        </span>
        {unit && (
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            {unit}
          </span>
        )}
      </div>

      {trend && (
        <div className="mt-2 flex items-center gap-1.5 text-xs">
          <span className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded font-medium ${
            isFavorable 
              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
              : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
          }`}>
            {isNegative ? <TrendingDown size={13} /> : isPositive ? <TrendingUp size={13} /> : <Minus size={13} />}
            {Math.abs(trend.value)}%
          </span>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">
            {trend.label}
          </span>
        </div>
      )}

      <p className="mt-3 text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
        {description}
      </p>

      <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400">
        <span className="truncate">Fonte: {source}</span>
        <Info size={11} className="text-slate-400 flex-shrink-0" />
      </div>
    </div>
  );
}
