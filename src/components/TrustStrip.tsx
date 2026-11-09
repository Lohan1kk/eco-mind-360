'use client';

import React from 'react';
import { Satellite, ShieldCheck, Database, Award, Sparkles } from 'lucide-react';

const BADGES = [
  { icon: Satellite, label: 'INPE & NASA FIRMS', detail: 'Focos Quase Tempo Real' },
  { icon: ShieldCheck, label: 'PRODES 2024 Auditado', detail: 'Desmatamento Oficial' },
  { icon: Database, label: 'MapBiomas Col. 9', detail: 'Série Histórica 1985-2023' },
  { icon: Award, label: 'Colégio Paulo de Tarso', detail: 'Projeto Estudantil' },
  { icon: Sparkles, label: 'Orçamento R$ 0', detail: 'Padrão Aberto & Gratuito' },
];

export function TrustStrip() {
  return (
    <section className="border-y border-emerald-900/10 bg-white py-5 shadow-sm">
      <div className="section-inner">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
          {BADGES.map((b, i) => {
            const Icon = b.icon;
            return (
              <div
                key={i}
                className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50/80 border border-slate-200/60 hover:border-emerald-500/30 transition-colors"
              >
                <div className="h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                  <Icon size={16} />
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-xs text-slate-900 truncate">
                    {b.label}
                  </p>
                  <p className="text-[10px] text-slate-500 truncate">
                    {b.detail}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
