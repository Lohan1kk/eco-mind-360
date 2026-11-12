'use client';

import React from 'react';
import { Satellite, Cpu, Users, ArrowRight } from 'lucide-react';

const STEPS = [
  {
    n: '01',
    icon: Satellite,
    title: 'Telemetria Orbital',
    desc: 'Satélites de órbita polar e heliosíncrona (MODIS, VIIRS, Landsat-8 e Sentinel-2) captam radiação térmica e imagens ópticas ao sobrevoar o Brasil.',
  },
  {
    n: '02',
    icon: Cpu,
    title: 'Classificação por FRP',
    desc: 'O motor do EcoMind 360 processa as anomalias, calcula o FRP (Potência Radiativa do Fogo em Megawatts) e cruza as coordenadas com os 7 biomas.',
  },
  {
    n: '03',
    icon: Users,
    title: 'Cidadania & Sala de Aula',
    desc: 'Alunos, professores e cidadãos acessam indicadores auditados, calculam sua pegada de carbono e participam da gincana pedagógica do folclore.',
  },
];

export function HowItWorks() {
  return (
    <section id="como-funciona" className="section bg-[#131A16] border-b border-[#222D25]">
      <div className="section-inner space-y-12">
        <div className="max-w-3xl space-y-3">
          <div className="badge-360">
            <Cpu size={12} className="text-[#789B7C]" />
            <span>Fluxo Operacional 360°</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#DCE5DD] tracking-tight">
            Do Espaço à Prática Escolar em Três Etapas
          </h2>
          <p className="text-base text-[#A7B3A9]">
            Como os dados públicos mais avançados do mundo se transformam em consciência viva para a sua comunidade.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {STEPS.map((s) => {
            const Icon = s.icon;
            return (
              <article
                key={s.n}
                className="glass-panel p-6 flex flex-col justify-between relative"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span className="font-mono text-xl font-medium text-[#78877D]">
                      {s.n}
                    </span>
                    <div className="h-9 w-9 rounded-[7px] bg-[#1D2821] border border-[#29362D] text-[#789B7C] flex items-center justify-center">
                      <Icon size={16} />
                    </div>
                  </div>

                  <h3 className="font-display text-lg font-semibold text-[#DCE5DD]">
                    {s.title}
                  </h3>

                  <p className="mt-2.5 text-xs text-[#A7B3A9] leading-relaxed">
                    {s.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#222D25] flex items-center justify-between text-[11px] font-mono text-[#91A88F]">
                  <span>Etapa {s.n} / 03</span>
                  <ArrowRight size={13} />
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
