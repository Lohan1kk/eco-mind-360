import type { Metadata } from 'next';
import { Instrument_Serif, Inter } from 'next/font/google';
import 'leaflet/dist/leaflet.css';
import './globals.css';
import { AppShell } from '@/components/shell/AppShell';
import { SmoothScrollProvider } from '@/components/providers/SmoothScrollProvider';

const display = Instrument_Serif({
  variable: '--font-display',
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
});

const body = Inter({
  variable: '--font-body',
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'EcoMind 360° — Monitoramento dos 7 Ambientes Brasileiros',
    template: '%s · EcoMind 360°',
  },
  description:
    'Acompanhe focos de calor por satélite, cobertura vegetal nativa e indicadores oficiais dos 7 ambientes brasileiros com dados do INPE, NASA FIRMS, MapBiomas e IBGE.',
  openGraph: {
    title: 'EcoMind 360° — Monitoramento dos 7 Ambientes Brasileiros',
    description:
      'Dados oficiais do INPE, NASA FIRMS, MapBiomas e IBGE para os 7 ambientes do Brasil.',
    locale: 'pt_BR',
    type: 'website',
  },
  icons: {
    icon: '/brand/icon-ecomind.png',
    apple: '/brand/icon-ecomind.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`light ${display.variable} ${body.variable}`}>
      <body className="min-h-screen bg-[var(--background)] text-[var(--foreground)] antialiased font-sans selection:bg-[#BFE5CB] selection:text-[#1B211D]">
        <SmoothScrollProvider>
          <AppShell>{children}</AppShell>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
