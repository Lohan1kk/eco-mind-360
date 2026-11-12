'use client';

import React from 'react';
import { ThemeProvider } from './ThemeContext';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-[#101512] text-[#DCE5DD] flex flex-col antialiased">
        {/* Sidebar fixa à esquerda */}
        <Sidebar />

        {/* Área de conteúdo principal à direita da Sidebar */}
        <div className="lg:pl-72 flex-1 flex flex-col min-w-0">
          <Header />
          <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            {children}
          </main>

          {/* Rodapé institucional */}
          <footer className="border-t border-[#222D25] bg-[#131A16] py-6 px-4 md:px-8 text-xs text-[#78877D]">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-[#DCE5DD]">
                  EcoMind 360
                </span>
                <span>— Plataforma de Inteligência e Monitoramento dos Biomas Brasileiros</span>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-[11px]">
                <span>Dados Oficiais: INPE · NASA FIRMS · MapBiomas · IBGE · ICMBio</span>
                <span className="text-[#91A88F] font-mono">Orçamento R$ 0 · Apresentação 2024</span>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </ThemeProvider>
  );
}
