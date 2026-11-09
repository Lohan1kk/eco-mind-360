import type { Metadata } from 'next';
import { AlertaIntro } from '@/components/alerts/AlertaIntro';
import { AlertaQueimadasClient } from '@/components/alerts/AlertaQueimadasClient';

export const metadata: Metadata = {
  title: 'Alerta de Queimadas',
  description:
    'Mapa mundial e brasileiro de focos de queimada com níveis por FRP (INPE Brasil + NASA FIRMS).',
};

export default function AlertaQueimadasPage() {
  return (
    <div className="flex h-[calc(100dvh-4rem)] md:h-[calc(100dvh-4.25rem)] w-full flex-col overflow-hidden relative">
      <div className="shrink-0 border-b border-forest/10 bg-mist px-4 py-2 md:px-8 md:py-2.5 z-10">
        <AlertaIntro />
      </div>
      <div className="min-h-0 flex-1 relative w-full h-full">
        <AlertaQueimadasClient />
      </div>
    </div>
  );
}
