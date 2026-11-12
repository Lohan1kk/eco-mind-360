'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';

const DynamicMap = dynamic(() => import('./InteractiveMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[650px] md:h-[750px] rounded-[14px] bg-[#101512] border border-[#29362D] flex flex-col items-center justify-center gap-3 text-[#A7B3A9]">
      <Loader2 className="w-7 h-7 animate-spin text-[#789B7C]" />
      <div className="text-xs font-medium text-[#DCE5DD]">
        Inicializando motor cartográfico e camadas dos biomas...
      </div>
      <div className="text-[11px] font-mono text-[#78877D]">
        Carregando geometrias oficiais IBGE e detecções orbitais
      </div>
    </div>
  ),
});

export function MapWrapper({ initialBiomeId }: { initialBiomeId?: string }) {
  return <DynamicMap initialBiomeId={initialBiomeId} />;
}
