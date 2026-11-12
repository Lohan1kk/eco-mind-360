'use client';

import React from 'react';
import Image from 'next/image';
import { Users } from 'lucide-react';

const TEAM = [
  {
    name: 'Ana Flávia',
    role: 'Designer & Marketing',
    image: '/team/foto-ana.png',
  },
  {
    name: 'André Zauli',
    role: 'Programador Fullstack',
    image: '/team/foto-andre.png',
  },
  {
    name: 'Lucas Lohan',
    role: 'Programador & Pesquisa',
    image: '/team/foto-lucas.png',
  },
  {
    name: 'Gabriel Rosa',
    role: 'Conteúdo & Design Visual',
    image: '/team/foto-gabriel.png',
  },
];

export function Team() {
  return (
    <section id="equipe" className="section scroll-mt-20 bg-[#101512] border-b border-[#222D25]">
      <div className="section-inner space-y-12">
        <div className="max-w-3xl space-y-3">
          <div className="badge-360">
            <Users size={12} className="text-[#789B7C]" />
            <span>Colégio Paulo de Tarso</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#DCE5DD] tracking-tight">
            Quatro Alunos, Uma Causa Continental
          </h2>
          <p className="text-base text-[#A7B3A9]">
            Desenvolvimento de software, cartografia digital e comunicação científica: uma equipe escolar
            provando na prática o poder do aprendizado ativo.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {TEAM.map((person) => (
            <div
              key={person.name}
              className="glass-panel p-6 text-center space-y-4 relative group"
            >
              <div className="relative mx-auto h-24 w-24 rounded-full overflow-hidden border border-[#29362D]">
                <Image
                  src={person.image}
                  alt={person.name}
                  fill
                  className="object-cover"
                />
              </div>

              <div>
                <h3 className="font-display text-base font-semibold text-[#DCE5DD]">
                  {person.name}
                </h3>
                <p className="text-xs text-[#91A88F] mt-0.5">
                  {person.role}
                </p>
              </div>

              <div className="pt-3 border-t border-[#222D25] text-[11px] text-[#78877D] font-mono">
                EcoMind 360 Team
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
