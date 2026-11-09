'use client';

import React from 'react';
import Link from 'next/link';
import { MapPin, Calculator, HelpCircle, Sparkles } from 'lucide-react';

export function Encourage() {
  return (
    <section id="agir" className="section bg-[#022c22] text-white relative overflow-hidden">
      {/* Luz e brilhos */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-800/30 via-[#022c22] to-[#022c22]" />

      <div className="section-inner relative z-10 text-center max-w-3xl mx-auto space-y-8">
        <div className="badge-360 bg-emerald-950/80 border-emerald-500/30 text-emerald-300 mx-auto">
          <Sparkles size={12} />
          <span>Comece Agora</span>
        </div>

        <div className="space-y-4">
          <h2 className="font-display text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Plante Conhecimento.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-sprout">
              Cultive Consciência.
            </span>
          </h2>
          <p className="text-base sm:text-lg text-emerald-100/80 max-w-xl mx-auto leading-relaxed">
            Não espere a crise chegar à sua porta. Monitore os 7 ambientes, calcule sua pegada de carbono
            e leve essa conversa para a sua escola e comunidade.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Link
            href="/mapa"
            className="btn-primary !py-3.5 !px-6 text-sm font-bold shadow-lg"
          >
            <MapPin size={17} />
            <span>Abrir Mapa Orbital</span>
          </Link>

          <Link
            href="/calculadora"
            className="btn-ghost !py-3.5 !px-6 text-sm font-bold inline-flex items-center gap-2"
          >
            <Calculator size={17} />
            <span>Calcular Minha Pegada</span>
          </Link>

          <Link
            href="/quiz"
            className="px-5 py-3.5 rounded-full text-xs font-bold text-emerald-300 hover:text-white border border-emerald-500/20 hover:bg-emerald-900/40 transition-all inline-flex items-center gap-1.5"
          >
            <HelpCircle size={15} />
            <span>Jogar o Quiz do Folclore</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
