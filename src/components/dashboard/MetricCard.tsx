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
  iconColor = 'text-[#789B7C]',
  source,
  description,
}: MetricCardProps) {
  const isNegative = trend && trend.value < 0;
  const isPositive = trend && trend.value > 0;
  const isFavorable = trend?.isPositiveGood ? isPositive : isNegative;

  return (
    <div className="glass-panel p-5 flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between gap-3">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#78877D]">
            {title}
          </span>
          <div className={`p-1.5 rounded-[7px] bg-[#1D2821] border border-[#29362D] ${iconColor}`}>
            <Icon size={15} />
          </div>
        </div>

        <div className="mt-3 flex items-baseline gap-2">
          <span className="font-mono text-3xl font-semibold tracking-tight text-[#DCE5DD]">
            {typeof value === 'number' ? value.toLocaleString('pt-BR') : value}
          </span>
          {unit && (
            <span className="text-xs font-mono text-[#78877D]">
              {unit}
            </span>
          )}
        </div>

        {trend && (
          <div className="mt-2.5 flex items-center gap-1.5 text-xs">
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-[5px] text-[11px] font-mono font-medium ${
              isFavorable 
                ? 'bg-[#1D2821] text-[#83A989] border border-[#29362D]' 
                : 'bg-[#1D2821] text-[#A9A17A] border border-[#29362D]'
            }`}>
              {isNegative ? <TrendingDown size={11} /> : isPositive ? <TrendingUp size={11} /> : <Minus size={11} />}
              {Math.abs(trend.value)}%
            </span>
            <span className="text-[11px] text-[#78877D] truncate">
              {trend.label}
            </span>
          </div>
        )}

        <p className="mt-3 text-xs leading-relaxed text-[#A7B3A9]">
          {description}
        </p>
      </div>

      <div className="mt-4 pt-3 border-t border-[#222D25] flex items-center justify-between text-[11px] text-[#78877D] font-mono">
        <span className="truncate">{source}</span>
        <Info size={12} className="text-[#78877D] shrink-0" />
      </div>
    </div>
  );
}
