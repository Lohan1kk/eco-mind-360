'use client';

import React from 'react';
import { Compass, Flame } from 'lucide-react';

export function AlertaIntro() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div>
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
          </span>
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-500/20">
            Feed Quase Tempo Real · INPE & NASA FIRMS
          </span>
        </div>
        <h1 className="font-display text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
          Mapa de Queimadas e Ambientes Brasileiros
        </h1>
      </div>

      <div className="hidden md:flex items-center gap-3 text-xs text-slate-500 font-medium">
        <span className="flex items-center gap-1">
          <Flame size={14} className="text-amber-500" />
          <span>Cores por Potência (FRP em MW)</span>
        </span>
        <span>•</span>
        <span className="flex items-center gap-1">
          <Compass size={14} className="text-emerald-600" />
          <span>7 Biomas Oficiais Ativos</span>
        </span>
      </div>
    </div>
  );
}
