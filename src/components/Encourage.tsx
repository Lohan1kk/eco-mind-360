'use client';

import React from 'react';
import Link from 'next/link';
import { MapPin, Calculator, HelpCircle, Sparkles } from 'lucide-react';

export function Encourage() {
  return (
    <section id="agir" className="section scroll-mt-20 bg-[#101512] text-[#DCE5DD] relative overflow-hidden">
      <div className="section-inner relative z-10 text-center max-w-3xl mx-auto space-y-8">
        <div className="badge-360 mx-auto">
          <Sparkles size={12} className="text-[#789B7C]" />
          <span>Comece Agora</span>
        </div>

        <div className="space-y-4">
          <h2 className="font-display text-3xl sm:text-5xl font-semibold tracking-tight text-[#DCE5DD] leading-tight">
            Plante Conhecimento.{' '}
            <span className="text-[#91A88F]">
              Cultive Consciência.
            </span>
          </h2>
          <p className="text-base text-[#A7B3A9] max-w-xl mx-auto leading-relaxed">
            Não espere a crise chegar à sua porta. Monitore os 7 ambientes, calcule sua pegada de carbono
            e leve essa conversa para a sua escola e comunidade.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href="/mapa"
            className="btn-primary !py-2.5 !px-5 text-xs font-semibold"
          >
            <MapPin size={15} />
            <span>Abrir Mapa Orbital</span>
          </Link>

          <Link
            href="/calculadora"
            className="btn-secondary !py-2.5 !px-5 text-xs font-medium inline-flex items-center gap-2"
          >
            <Calculator size={15} className="text-[#91A88F]" />
            <span>Calcular Minha Pegada</span>
          </Link>

          <Link
            href="/quiz"
            className="btn-secondary !py-2.5 !px-5 text-xs font-medium inline-flex items-center gap-1.5"
          >
            <HelpCircle size={15} className="text-[#91A88F]" />
            <span>Jogar o Quiz do Folclore</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
