'use client';

import React, { type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { ThemeProvider } from '@/components/layout/ThemeContext';
import { Header } from './Header';
import { BottomNav } from './BottomNav';
import { Footer } from './Footer';

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isMap = pathname === '/mapa' || pathname === '/alerta-queimadas';
  const isHome = pathname === '/';

  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)] antialiased">
        <Header />
        <main
          className={`flex-1 ${
            isHome
              ? 'pb-16 xl:pb-0'
              : isMap
                ? 'pt-14 pb-20 xl:pb-12 flex flex-col'
                : 'pt-20 md:pt-24 pb-24 xl:pb-20'
          }`}
        >
          {children}
        </main>
        <Footer />
        <BottomNav />
      </div>
    </ThemeProvider>
  );
}
