import type { Metadata } from 'next';
import { AlertaIntro } from '@/components/alerts/AlertaIntro';
import { AlertaQueimadasClient } from '@/components/alerts/AlertaQueimadasClient';

export const metadata: Metadata = {
  title: 'Mapa Interativo de Queimadas e Biomas',
  description:
    'Monitoramento orbital em tempo real dos 7 ambientes brasileiros com dados INPE e NASA FIRMS classificados por FRP.',
};

export default function MapaPage() {
  return (
    <div className="flex h-full w-full flex-col overflow-hidden">
      <div className="shrink-0 border-b border-forest/10 bg-mist px-4 py-2.5 md:px-8 md:py-3.5">
        <AlertaIntro />
      </div>
      <div className="min-h-0 flex-1 relative w-full h-full">
        <AlertaQueimadasClient />
      </div>
    </div>
  );
}
