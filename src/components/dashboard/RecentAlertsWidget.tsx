'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  AlertTriangle, 
  Flame, 
  Trees, 
  Waves, 
  CheckCircle2, 
  Clock,
  ArrowRight
} from 'lucide-react';
import { VERIFIED_ALERTS } from '@/data/alerts';
import { EnvironmentalAlert } from '@/data/types';

export function RecentAlertsWidget() {
  const [filterType, setFilterType] = useState<string>('all');

  const filteredAlerts = VERIFIED_ALERTS.filter(alert => {
    if (filterType === 'all') return true;
    if (filterType === 'foco') return alert.type === 'foco_calor';
    if (filterType === 'desmatamento') return alert.type === 'alerta_desmatamento';
    if (filterType === 'marinho') return alert.type === 'anomalia_marinha';
    return true;
  }).slice(0, 5);

  const getTypeIcon = (type: EnvironmentalAlert['type']) => {
    switch (type) {
      case 'foco_calor':
        return <Flame className="w-4 h-4 text-amber-500" />;
      case 'alerta_desmatamento':
        return <Trees className="w-4 h-4 text-emerald-600" />;
      case 'anomalia_marinha':
        return <Waves className="w-4 h-4 text-teal-600" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-amber-500" />;
    }
  };

  return (
    <div className="glass-panel flex flex-col justify-between p-6">
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 border-b border-slate-200/80 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
              </span>
              <h3 className="font-display font-extrabold text-xl text-slate-900">
                Detecções e Alertas Recentes
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Registros orbitais consolidados (DETER, BDQueimadas e NASA FIRMS)
            </p>
          </div>

          <div className="flex items-center gap-1 border border-slate-200/80 bg-slate-50 p-1 rounded-xl text-xs">
            <button
              type="button"
              onClick={() => setFilterType('all')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                filterType === 'all'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Todos
            </button>
            <button
              type="button"
              onClick={() => setFilterType('foco')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                filterType === 'foco'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Queimadas
            </button>
            <button
              type="button"
              onClick={() => setFilterType('desmatamento')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                filterType === 'desmatamento'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              DETER
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/60 hover:border-emerald-500/30 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-white border border-slate-200/60 shrink-0 mt-0.5">
                  {getTypeIcon(alert.type)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">
                      {alert.typeName}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-200/80 text-slate-700 font-semibold">
                      {alert.biomeName}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    📍 {alert.municipality}/{alert.state} • {alert.date} {alert.time ? `(${alert.time})` : ''} • {alert.satellite}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pl-11 sm:pl-0">
                {alert.areaHectares ? (
                  <span className="font-mono text-emerald-700 font-bold text-xs">
                    {alert.areaHectares} ha
                  </span>
                ) : alert.frp ? (
                  <span className="font-mono text-amber-600 font-bold text-xs">
                    {alert.frp} MW
                  </span>
                ) : (
                  <span className="font-mono text-teal-600 text-xs">Anomalia</span>
                )}

                <span className={`inline-flex items-center gap-1 text-[10px] px-2.5 py-1 rounded-full font-bold ${
                  alert.status === 'Confirmado (Auditoria)'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-500/20'
                    : 'bg-amber-50 text-amber-700 border border-amber-500/20'
                }`}>
                  {alert.status === 'Confirmado (Auditoria)' ? <CheckCircle2 size={11} /> : <Clock size={11} />}
                  {alert.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 pt-3 border-t border-slate-200/70 flex items-center justify-between">
        <span className="text-xs text-slate-500">
          Dados abertos auditados do INPE e NASA
        </span>
        <Link
          href="/alertas"
          className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 group"
        >
          <span>Acessar tabela completa de alertas</span>
          <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
