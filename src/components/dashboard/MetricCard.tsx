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
  iconColor = 'text-forest',
  source,
  description,
}: MetricCardProps) {
  const isNegative = trend && trend.value < 0;
  const isPositive = trend && trend.value > 0;
  const isFavorable = trend?.isPositiveGood ? isPositive : isNegative;

  return (
    <div className="panel-soft flex flex-col justify-between p-6 transition-transform hover:-translate-y-0.5">
      <div>
        <div className="flex items-start justify-between gap-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-forest-mid">
            {title}
          </span>
          <div className={`p-2.5 rounded-full bg-forest/8 ${iconColor}`}>
            <Icon size={18} />
          </div>
        </div>

        <div className="mt-3 flex items-baseline gap-2">
          <span className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-forest">
            {typeof value === 'number' ? value.toLocaleString('pt-BR') : value}
          </span>
          {unit && (
            <span className="text-xs font-semibold text-ash">
              {unit}
            </span>
          )}
        </div>

        {trend && (
          <div className="mt-2.5 flex items-center gap-1.5 text-xs">
            <span className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[11px] font-bold ${
              isFavorable 
                ? 'bg-sprout text-forest' 
                : 'bg-burn/15 text-burn'
            }`}>
              {isNegative ? <TrendingDown size={13} /> : isPositive ? <TrendingUp size={13} /> : <Minus size={13} />}
              {Math.abs(trend.value)}%
            </span>
            <span className="text-[11px] font-medium text-ash">
              {trend.label}
            </span>
          </div>
        )}

        <p className="mt-3 text-xs leading-relaxed text-ash">
          {description}
        </p>
      </div>

      <div className="mt-4 pt-3 border-t border-forest/10 flex items-center justify-between text-[11px] text-ash/80">
        <span className="truncate">Fonte: {source}</span>
        <Info size={12} className="text-forest/40 flex-shrink-0" />
      </div>
    </div>
  );
}
