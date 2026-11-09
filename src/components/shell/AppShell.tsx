'use client';

import React, { type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { Header } from './Header';
import { BottomNav } from './BottomNav';
import { Footer } from './Footer';

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isMap = pathname === '/mapa' || pathname === '/alerta-queimadas';
  const isHome = pathname === '/';

  return (
    <div className="min-h-screen flex flex-col bg-mist text-ink antialiased">
      <Header />
      <main
        className={`flex-1 ${
          isHome
            ? ''
            : isMap
              ? 'h-[100dvh] pt-[calc(3.75rem+env(safe-area-inset-top))] pb-0 overflow-hidden flex flex-col'
              : 'pt-20 md:pt-24 pb-16 md:pb-20'
        }`}
      >
        {children}
      </main>
      {!isMap && <Footer />}
      <BottomNav />
    </div>
  );
}
