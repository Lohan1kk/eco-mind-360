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
    <section className="border-b border-[#222D25] bg-[#131A16] py-6">
      <div className="section-inner">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
          {BADGES.map((b, i) => {
            const Icon = b.icon;
            return (
              <div
                key={i}
                className="flex items-center gap-3"
              >
                <div className="h-8 w-8 rounded-[7px] bg-[#171F1A] border border-[#29362D] text-[#789B7C] flex items-center justify-center shrink-0">
                  <Icon size={15} />
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-xs text-[#DCE5DD] truncate">
                    {b.label}
                  </p>
                  <p className="text-[11px] text-[#78877D] truncate font-mono">
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
