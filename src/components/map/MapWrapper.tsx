'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';

const DynamicMap = dynamic(() => import('./InteractiveMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[650px] md:h-[750px] rounded-2xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center gap-3 text-slate-400">
      <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
      <div className="text-sm font-medium text-slate-300">
        Inicializando motor cartográfico e camadas dos biomas...
      </div>
      <div className="text-xs text-slate-500">
        Carregando geometrias oficiais IBGE e detecções orbitais
      </div>
    </div>
  ),
});

export function MapWrapper({ initialBiomeId }: { initialBiomeId?: string }) {
  return <DynamicMap initialBiomeId={initialBiomeId} />;
}
