import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-forest/10 bg-ink py-14 text-mist/85">
      <div className="section-inner relative z-[1] flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
        <div className="max-w-sm">
          <div className="flex items-center gap-2.5">
            <Image
              src="/brand/icon-ecomind.png"
              alt="EcoMind 360"
              width={36}
              height={36}
              className="h-9 w-9 object-contain"
            />
            <span className="font-display text-xl font-bold text-mist">
              EcoMind <span className="text-sprout">360</span>
            </span>
          </div>
          <p className="mt-4 text-xs sm:text-sm leading-relaxed text-mist/65">
            Consciência ambiental + tecnologia. Plataforma de monitoramento dos 7 ambientes brasileiros com dados oficiais do INPE, NASA, MapBiomas e IBGE.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-2 text-[11px] text-sprout">
            <span>Ana Flávia</span> · <span>Lucas Lohan</span> · <span>André Soares</span> · <span>Gabriel Rosa</span>
          </div>
        </div>

        <nav aria-label="Rodapé" className="flex flex-wrap gap-x-8 gap-y-3 text-xs sm:text-sm">
          <div className="flex flex-col space-y-2">
            <span className="font-bold uppercase tracking-wider text-sprout text-[11px]">Navegação</span>
            <Link href="/" className="hover:text-sprout text-mist/75">Início</Link>
            <Link href="/dashboard" className="hover:text-sprout text-mist/75">Dashboard</Link>
            <Link href="/mapa" className="hover:text-sprout text-mist/75">Mapa de Queimadas</Link>
            <Link href="/biomas" className="hover:text-sprout text-mist/75">Os 7 Ambientes</Link>
          </div>

          <div className="flex flex-col space-y-2">
            <span className="font-bold uppercase tracking-wider text-sprout text-[11px]">Análise</span>
            <Link href="/alertas" className="hover:text-sprout text-mist/75">Alertas Orbitais</Link>
            <Link href="/comparacao" className="hover:text-sprout text-mist/75">Comparador</Link>
            <Link href="/metodologia" className="hover:text-sprout text-mist/75">Metodologia e Fontes</Link>
          </div>
        </nav>
      </div>

      <div className="section-inner relative z-[1] mt-10 border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-mist/50">
        <p>© 2024 EcoMind 360. Demonstração educacional com dados públicos oficiais.</p>
        <p className="font-mono text-sprout/70">Orçamento R$ 0 · Padrão Científico</p>
      </div>
    </footer>
  );
}
