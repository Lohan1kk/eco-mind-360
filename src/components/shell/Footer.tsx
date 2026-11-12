import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-[#222D25] bg-[#131A16] text-[#A7B3A9] py-16">
      <div className="section-inner relative z-10 flex flex-col gap-12 md:flex-row md:items-start md:justify-between">
        <div className="max-w-sm space-y-4">
          <div className="flex items-center gap-2.5">
            <Image
              src="/brand/icon-ecomind.png"
              alt="EcoMind 360"
              width={32}
              height={32}
              className="h-8 w-8 object-contain"
            />
            <span className="font-display text-lg font-semibold text-[#DCE5DD]">
              EcoMind{' '}
              <span className="font-mono text-[10px] px-1.5 py-0.5 rounded-[5px] bg-[#1D2821] text-[#91A88F] border border-[#29362D] font-medium">
                360°
              </span>
            </span>
          </div>
          <p className="text-xs leading-relaxed text-[#A7B3A9]">
            Plataforma aberta de inteligência territorial para os 7 ambientes brasileiros.
            Sensoriamento orbital quase em tempo real integrado às bases oficiais do INPE, NASA, MapBiomas e IBGE.
          </p>
          <div className="pt-1 text-[11px] text-[#78877D] font-mono">
            <span>Ana Flávia</span> · <span>André Zauli</span> · <span>Lucas Lohan</span> · <span>Gabriel Rosa</span>
          </div>
        </div>

        <nav aria-label="Rodapé" className="flex flex-wrap gap-x-16 gap-y-8 text-xs">
          <div className="flex flex-col space-y-2.5">
            <span className="font-mono font-medium uppercase tracking-wider text-[#91A88F] text-[10px]">
              Navegação 360°
            </span>
            <Link href="/" className="text-[#A7B3A9] hover:text-[#DCE5DD] transition-colors">Início</Link>
            <Link href="/dashboard" className="text-[#A7B3A9] hover:text-[#DCE5DD] transition-colors">Dashboard Territorial</Link>
            <Link href="/mapa" className="text-[#A7B3A9] hover:text-[#DCE5DD] transition-colors">Mapa de Queimadas</Link>
            <Link href="/biomas" className="text-[#A7B3A9] hover:text-[#DCE5DD] transition-colors">Os 7 Ambientes</Link>
            <Link href="/alertas" className="text-[#A7B3A9] hover:text-[#DCE5DD] transition-colors">Alertas Orbitais</Link>
          </div>

          <div className="flex flex-col space-y-2.5">
            <span className="font-mono font-medium uppercase tracking-wider text-[#91A88F] text-[10px]">
              Prática & Análise
            </span>
            <Link href="/calculadora" className="text-[#A7B3A9] hover:text-[#DCE5DD] transition-colors">Calculadora de Carbono</Link>
            <Link href="/quiz" className="text-[#A7B3A9] hover:text-[#DCE5DD] transition-colors">Quiz & Folclore</Link>
            <Link href="/comparacao" className="text-[#A7B3A9] hover:text-[#DCE5DD] transition-colors">Comparador Multicritério</Link>
            <Link href="/metodologia" className="text-[#A7B3A9] hover:text-[#DCE5DD] transition-colors">Metodologia Científica</Link>
            <Link href="/baixar" className="text-[#A7B3A9] hover:text-[#DCE5DD] transition-colors">Instalar App PWA</Link>
          </div>
        </nav>
      </div>

      <div className="section-inner relative z-10 mt-12 border-t border-[#222D25] pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#78877D]">
        <p>© 2024 EcoMind 360° · Projeto Estudantil Colégio Paulo de Tarso</p>
        <p className="font-mono text-[#91A88F] text-[11px]">
          100% Gratuito (R$ 0) · Dados Públicos Oficiais
        </p>
      </div>
    </footer>
  );
}
