import type { Metadata } from 'next';
import { Outfit, Plus_Jakarta_Sans } from 'next/font/google';
import 'leaflet/dist/leaflet.css';
import './globals.css';
import { AppShell } from '@/components/shell/AppShell';

const display = Outfit({
  variable: '--font-display',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  display: 'swap',
});

const body = Plus_Jakarta_Sans({
  variable: '--font-body',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
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
    <html lang="pt-BR" className={`${display.variable} ${body.variable}`}>
      <body className="min-h-screen bg-[#f8fafc] text-slate-900 antialiased font-sans selection:bg-emerald-500/20 selection:text-emerald-900">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
