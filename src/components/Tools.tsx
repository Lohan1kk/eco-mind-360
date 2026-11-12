'use client';

import React from 'react';
import Link from 'next/link';
import { MapPin, LayoutDashboard, Calculator, HelpCircle, ArrowUpRight, Sparkles } from 'lucide-react';

const TOOLS = [
  {
    href: '/mapa',
    tag: 'Tempo Real',
    title: 'Mapa Orbital de Queimadas',
    desc: 'Focos de calor instantâneos (INPE e NASA FIRMS) graduados por potência radiativa (FRP), com a malha vetorial dos 7 biomas.',
    cta: 'Abrir mapa 360°',
    icon: MapPin,
  },
  {
    href: '/dashboard',
    tag: 'Telemetria',
    title: 'Dashboard dos 7 Ambientes',
    desc: 'Indicadores territoriais consolidados: desmatamento PRODES 2024, áreas protegidas ICMBio e cobertura vegetal nativa.',
    cta: 'Acessar painel',
    icon: LayoutDashboard,
  },
  {
    href: '/calculadora',
    tag: 'Pegada Pessoal',
    title: 'Calculadora de Carbono',
    desc: 'Descubra sua emissão anual estimada em kg de CO₂e nos eixos transporte, alimentação e energia com recomendações práticas.',
    cta: 'Calcular emissão',
    icon: Calculator,
  },
  {
    href: '/quiz',
    tag: 'Gincana Escolar',
    title: 'Quiz & Folclore Protetor',
    desc: 'Educação ambiental conectada às lendas brasileiras: o papel do Curupira, Caipora e Boitatá na proteção das matas nativas.',
    cta: 'Iniciar gincana',
    icon: HelpCircle,
  },
];

export function Tools() {
  return (
    <section id="ferramentas" className="section scroll-mt-20 bg-[#101512] border-b border-[#222D25]">
      <div className="section-inner space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#222D25] pb-6">
          <div>
            <div className="badge-360 mb-2">
              <Sparkles size={12} />
              <span>Ferramentas Integradas</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#DCE5DD] tracking-tight">
              Quatro Módulos de Consciência e Ação
            </h2>
            <p className="mt-3 max-w-2xl text-base text-[#A7B3A9]">
              Da detecção orbital de queimadas à gincana escolar: uma plataforma unificada
              desenvolvida por alunos para transformar dados complexos em ações concretas.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {TOOLS.map((t) => {
            const Icon = t.icon;
            return (
              <article
                key={t.title}
                className="glass-panel p-6 flex flex-col justify-between relative group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#91A88F] bg-[#1D2821] border border-[#29362D] px-2.5 py-0.5 rounded-[5px]">
                      {t.tag}
                    </span>
                    <div className="h-9 w-9 rounded-[7px] bg-[#1D2821] border border-[#29362D] text-[#789B7C] flex items-center justify-center">
                      <Icon size={17} />
                    </div>
                  </div>

                  <h3 className="font-display text-lg font-semibold text-[#DCE5DD] group-hover:text-[#91A88F] transition-colors">
                    {t.title}
                  </h3>

                  <p className="mt-2.5 text-xs text-[#A7B3A9] leading-relaxed">
                    {t.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#222D25]">
                  <Link
                    href={t.href}
                    className="text-xs font-medium text-[#91A88F] hover:text-[#DCE5DD] inline-flex items-center gap-1 group/link"
                  >
                    <span>{t.cta}</span>
                    <ArrowUpRight size={14} className="group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
