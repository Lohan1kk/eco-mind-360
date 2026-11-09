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
        return <Trees className="w-4 h-4 text-emerald-500" />;
      case 'anomalia_marinha':
        return <Waves className="w-4 h-4 text-blue-500" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-amber-500" />;
    }
  };

  return (
    <div className="p-5 rounded-2xl bg-white dark:bg-[#0d1522] border border-slate-200 dark:border-slate-800/80 shadow-sm flex flex-col justify-between">
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="font-semibold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </span>
              <span>Alertas e Detecções Recentes</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Registros geoespaciais dos sistemas DETER, NASA FIRMS e BDQueimadas
            </p>
          </div>

          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl text-xs">
            <button
              onClick={() => setFilterType('all')}
              className={`px-2 py-1 rounded-lg font-medium transition-all ${
                filterType === 'all'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-emerald-400 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setFilterType('foco')}
              className={`px-2 py-1 rounded-lg font-medium transition-all ${
                filterType === 'foco'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-amber-400 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
              }`}
            >
              Focos
            </button>
            <button
              onClick={() => setFilterType('desmatamento')}
              className={`px-2 py-1 rounded-lg font-medium transition-all ${
                filterType === 'desmatamento'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-emerald-400 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
              }`}
            >
              DETER
            </button>
          </div>
        </div>

        <div className="space-y-2.5">
          {filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-start gap-2.5">
                <div className="p-2 rounded-lg bg-slate-200/60 dark:bg-slate-800 flex-shrink-0 mt-0.5">
                  {getTypeIcon(alert.type)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-900 dark:text-slate-100">
                      {alert.typeName}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium">
                      {alert.biomeName}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    📍 {alert.municipality}/{alert.state} • {alert.date} {alert.time ? `(${alert.time})` : ''} • {alert.satellite}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-3 flex-shrink-0 pl-9 sm:pl-0">
                {alert.areaHectares ? (
                  <span className="font-mono text-emerald-500 font-bold text-[11px]">
                    {alert.areaHectares} ha
                  </span>
                ) : alert.frp ? (
                  <span className="font-mono text-amber-500 font-bold text-[11px]">
                    {alert.frp} MW
                  </span>
                ) : (
                  <span className="font-mono text-blue-500 text-[11px]">Anomalia</span>
                )}

                <span className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-medium ${
                  alert.status === 'Confirmado (Auditoria)'
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                    : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                }`}>
                  {alert.status === 'Confirmado (Auditoria)' ? <CheckCircle2 size={10} /> : <Clock size={10} />}
                  {alert.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between">
        <span className="text-[11px] text-slate-500 dark:text-slate-400">
          Dados abertos auditados do INPE e NASA
        </span>
        <Link
          href="/alertas"
          className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 flex items-center gap-1"
        >
          <span>Ver Tabela Completa</span>
          <ArrowRight size={13} />
        </Link>
      </div>
    </div>
  );
}
