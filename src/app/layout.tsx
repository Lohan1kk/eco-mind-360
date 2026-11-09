import type { Metadata } from 'next';
import { Fraunces, Source_Sans_3 } from 'next/font/google';
import './globals.css';
import { AppShell } from '@/components/shell/AppShell';

const display = Fraunces({
  variable: '--font-display',
  subsets: ['latin'],
  display: 'swap',
});

const body = Source_Sans_3({
  variable: '--font-body',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'EcoMind 360 — Consciência Ambiental e Monitoramento dos Biomas Brasileiros',
    template: '%s · EcoMind 360',
  },
  description:
    'EcoMind 360: plataforma de inteligência territorial, mapa de queimadas em tempo real com dados INPE e NASA, e monitoramento oficial dos 7 ambientes brasileiros.',
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
      <body className="min-h-screen bg-mist text-ink antialiased">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
