import type { Metadata } from 'next';
import './globals.css';
import { AppLayout } from '@/components/layout/AppLayout';

export const metadata: Metadata = {
  title: 'EcoMind 360 | Monitoramento Ambiental dos Biomas Brasileiros',
  description: 'Plataforma profissional de inteligência territorial e monitoramento ambiental dos 7 ambientes brasileiros com dados oficiais do INPE, NASA FIRMS, MapBiomas e IBGE.',
  keywords: ['EcoMind 360', 'meio ambiente', 'biomas brasileiros', 'Amazônia', 'Cerrado', 'Pantanal', 'Mata Atlântica', 'INPE', 'NASA FIRMS', 'desmatamento', 'focos de calor'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className="antialiased selection:bg-emerald-500/30 selection:text-emerald-300">
        <AppLayout>{children}</AppLayout>
      </body>
    </html>
  );
}
