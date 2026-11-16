'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  MapPin,
  LayoutDashboard,
  Flame,
  Trees,
  Compass,
} from 'lucide-react';
import type { ResumoFocos } from '@/lib/firms/types';
import { useResumoFocos } from '@/lib/firms/useResumoFocos';
import { FreshnessSeal } from '@/components/firms/FreshnessSeal';

export function Hero({ initialResumo }: { initialResumo?: ResumoFocos | null }) {
  const { resumo } = useResumoFocos('24h', initialResumo);

  return (
    <section className="relative min-h-[78svh] overflow-hidden bg-[#101512] text-[#DCE5DD] flex flex-col justify-between pt-24 pb-12 border-b border-[#222D25]">
      {/* Background Ambiental Sutil */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 opacity-20">
          <Image
            src="/brand/hero-ecomind-4k.jpg"
            alt="EcoMind 360 Background"
            fill
            priority
            quality={90}
            className="object-cover object-center grayscale-[25%]"
          />
        </div>

        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 50% 25%, rgba(16, 21, 18, 0.45) 0%, rgba(16, 21, 18, 0.92) 70%, #101512 100%), linear-gradient(to bottom, rgba(16, 21, 18, 0.5) 0%, #101512 100%)',
          }}
        />
      </div>

      {/* Conteúdo Principal do Hero */}
      <div className="relative z-10 section-inner flex-1 flex flex-col justify-center py-8 md:py-12">
        <div className="max-w-3xl space-y-6">
          <div className="badge-360">
            <span className="inline-flex rounded-full h-1.5 w-1.5 bg-[#83A989]" />
            <span>Monitoramento dos 7 Biomas · Dados Abertos NASA FIRMS & INPE</span>
          </div>

          <div className="space-y-4">
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.1] text-[#DCE5DD]">
              Inteligência Territorial para os{' '}
              <span className="text-[#91A88F]">
                7 Ambientes do Brasil.
              </span>
            </h1>
            <p className="max-w-2xl text-base sm:text-lg text-[#A7B3A9] font-normal leading-relaxed">
              Acompanhe focos de calor por satélite, cobertura vegetal nativa e indicadores
              dos biomas brasileiros de forma simples, visual e gratuita.
            </p>
          </div>

          {/* Ações */}
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <Link
              href="/mapa"
              className="btn-primary !py-2.5 !px-5 text-xs font-semibold cursor-pointer"
            >
              <MapPin size={15} />
              <span>Abrir Mapa ao Vivo</span>
            </Link>

            <Link
              href="/dashboard"
              className="btn-secondary !py-2.5 !px-5 text-xs font-medium cursor-pointer"
            >
              <LayoutDashboard size={15} className="text-[#91A88F]" />
              <span>Ver Painel Geral</span>
            </Link>
          </div>

          <div className="pt-1">
            <FreshnessSeal
              atualizadoEm={resumo?.atualizadoEm}
              ultimoFocoEm={resumo?.ultimoFocoEm}
              desatualizado={resumo?.desatualizado}
              fonte={resumo?.fonte}
              periodo="24h"
              compact
            />
          </div>
        </div>
      </div>

      {/* Resumo Limpo em 3 Indicadores no Rodapé do Hero */}
      <div className="relative z-10 section-inner pt-6 border-t border-[#222D25]">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            href="/mapa"
            className="p-4 rounded-[10px] bg-[#171F1A]/90 border border-[#29362D] hover:border-[#789B7C] flex items-center justify-between transition-colors"
          >
            <div>
              <span className="text-[11px] font-mono uppercase text-[#91A88F]">
                Focos Ativos (24h)
              </span>
              <p className="font-display text-2xl font-semibold text-[#DCE5DD] mt-0.5 tabular-nums">
                {resumo ? resumo.total.toLocaleString('pt-BR') : '...'}
              </p>
            </div>
            <Flame className="w-6 h-6 text-[#FB923C]" />
          </Link>

          <Link
            href="#biomas"
            className="p-4 rounded-[10px] bg-[#171F1A]/90 border border-[#29362D] hover:border-[#789B7C] flex items-center justify-between transition-colors"
          >
            <div>
              <span className="text-[11px] font-mono uppercase text-[#91A88F]">
                Ambientes Monitorados
              </span>
              <p className="font-display text-2xl font-semibold text-[#DCE5DD] mt-0.5">
                7 Biomas (IBGE)
              </p>
            </div>
            <Compass className="w-6 h-6 text-[#789B7C]" />
          </Link>

          <Link
            href="/dashboard"
            className="p-4 rounded-[10px] bg-[#171F1A]/90 border border-[#29362D] hover:border-[#789B7C] flex items-center justify-between transition-colors"
          >
            <div>
              <span className="text-[11px] font-mono uppercase text-[#91A88F]">
                Vegetação Nativa no Brasil
              </span>
              <p className="font-display text-2xl font-semibold text-[#DCE5DD] mt-0.5">
                64,2% Preservada
              </p>
            </div>
            <Trees className="w-6 h-6 text-[#83A989]" />
          </Link>
        </div>
      </div>
    </section>
  );
}
