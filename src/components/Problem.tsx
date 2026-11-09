'use client';

import React from 'react';
import { motion } from 'framer-motion';
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
    <section id="problema" className="section bg-slate-50 border-b border-slate-200/70 relative">
      <div className="section-inner space-y-12">
        <div className="max-w-3xl space-y-3">
          <div className="badge-360">
            <AlertCircle size={12} className="text-amber-600" />
            <span>O Desafio da Consciência Territorial</span>
          </div>
          <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Florestas desaparecem. A distância dos dados gera inércia.
          </h2>
          <p className="text-base text-slate-600 leading-relaxed">
            Todo mundo acompanha as notícias sobre a crise ambiental. Pouca gente tem acesso direto à telemetria
            orbital para verificar os fatos e agir no cotidiano.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {ITEMS.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.article
                key={item.title}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="glass-panel p-7 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full">
                      {item.tag}
                    </span>
                    <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
                      <Icon size={18} />
                    </div>
                  </div>

                  <h3 className="font-display text-xl font-bold text-slate-900">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-xs text-slate-600 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200/60 font-mono text-[11px] font-bold text-slate-400">
                  0{i + 1} · Diagnóstico EcoMind
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
