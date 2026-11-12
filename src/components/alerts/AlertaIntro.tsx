'use client';

import React from 'react';
import { Compass, Flame } from 'lucide-react';

export function AlertaIntro() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="inline-flex rounded-full h-2 w-2 bg-[#83A989]" />
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#91A88F] bg-[#171F1A] px-2 py-0.5 rounded-[5px] border border-[#29362D]">
            Feed Quase Tempo Real · INPE & NASA FIRMS
          </span>
        </div>
        <h1 className="font-display text-base sm:text-lg font-semibold text-[#DCE5DD] tracking-tight">
          Mapa de Queimadas e Ambientes Brasileiros
        </h1>
      </div>

      <div className="hidden md:flex items-center gap-3 text-xs text-[#78877D]">
        <span className="flex items-center gap-1.5">
          <Flame size={13} className="text-[#A9A17A]" />
          <span>Intensidade por Potência (FRP em MW)</span>
        </span>
        <span className="text-[#29362D]">·</span>
        <span className="flex items-center gap-1.5">
          <Compass size={13} className="text-[#789B7C]" />
          <span>7 Biomas Oficiais Ativos</span>
        </span>
      </div>
    </div>
  );
}
