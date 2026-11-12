import type { Metadata } from 'next';
import { Inter, IBM_Plex_Mono } from 'next/font/google';
import 'leaflet/dist/leaflet.css';
import './globals.css';
import { AppShell } from '@/components/shell/AppShell';

const display = Inter({
  variable: '--font-display',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

const body = Inter({
  variable: '--font-body',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

const mono = IBM_Plex_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'EcoMind 360° — Inteligência Territorial & Monitoramento dos Biomas',
    template: '%s · EcoMind 360°',
  },
  description:
    'EcoMind 360°: Plataforma de inteligência territorial, mapa orbital de queimadas em tempo real com dados INPE e NASA FIRMS, e monitoramento oficial dos 7 ambientes brasileiros.',
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
    <html lang="pt-BR" className={`dark ${display.variable} ${body.variable} ${mono.variable}`}>
      <body className="min-h-screen bg-[#101512] text-[#DCE5DD] antialiased font-sans selection:bg-[#789B7C]/25 selection:text-[#DCE5DD]">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
