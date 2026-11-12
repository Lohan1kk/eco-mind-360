'use client';

import React from 'react';
import { AlertCircle, EyeOff, Network, Compass } from 'lucide-react';

const ITEMS = [
  {
    icon: EyeOff,
    tag: 'Desconexão',
    title: 'Distância dos Dados Reais',
    desc: 'Notícias generalistas não mostram onde o fogo está ativo, qual ambiente está sob ameaça nem a intensidade do FRP (potência radiativa) medida em megawatts.',
  },
  {
    icon: Network,
    tag: 'Dispersão',
    title: 'Fontes Oficiais Fragmentadas',
    desc: 'INPE, NASA, MapBiomas e IBGE produzem os melhores dados do planeta, mas as bases ficam dispersas em repositórios complexos distantes da comunidade.',
  },
  {
    icon: Compass,
    tag: 'Inércia',
    title: 'Da Notícia à Paralisia',
    desc: 'Ver a destruição sem ter ferramentas acessíveis para auditar o próprio território ou calcular o impacto pessoal faz a sociedade se sentir impotente.',
  },
];

export function Problem() {
  return (
    <section id="problema" className="section scroll-mt-20 bg-[#101512] border-b border-[#222D25] relative">
      <div className="section-inner space-y-12">
        <div className="max-w-3xl space-y-3">
          <div className="badge-360">
            <AlertCircle size={12} className="text-[#A9A17A]" />
            <span>O Desafio da Consciência Territorial</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#DCE5DD] tracking-tight">
            Florestas desaparecem. A distância dos dados gera inércia.
          </h2>
          <p className="text-base text-[#A7B3A9] leading-relaxed">
            Todo mundo acompanha as notícias sobre a crise ambiental. Pouca gente tem acesso direto à telemetria
            orbital para verificar os fatos e agir no cotidiano.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {ITEMS.map((item, i) => {
            const Icon = item.icon;
            return (
              <article
                key={item.title}
                className="glass-panel p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#A9A17A] bg-[#1D2821] border border-[#29362D] px-2.5 py-0.5 rounded-[5px]">
                      {item.tag}
                    </span>
                    <div className="h-8 w-8 rounded-[7px] bg-[#1D2821] border border-[#29362D] text-[#A9A17A] flex items-center justify-center">
                      <Icon size={16} />
                    </div>
                  </div>

                  <h3 className="font-display text-lg font-semibold text-[#DCE5DD]">
                    {item.title}
                  </h3>
                  <p className="mt-2.5 text-xs text-[#A7B3A9] leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#222D25] font-mono text-[11px] text-[#78877D]">
                  0{i + 1} · Diagnóstico EcoMind
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
