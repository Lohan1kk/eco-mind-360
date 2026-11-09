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
        return <Flame className="w-4 h-4 text-burn" />;
      case 'alerta_desmatamento':
        return <Trees className="w-4 h-4 text-forest" />;
      case 'anomalia_marinha':
        return <Waves className="w-4 h-4 text-forest-mid" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-burn" />;
    }
  };

  return (
    <div className="panel-soft flex flex-col justify-between p-6">
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 border-b border-forest/10 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-burn opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-burn"></span>
              </span>
              <h3 className="display font-bold text-xl text-forest">
                Detecções e Alertas Recentes
              </h3>
            </div>
            <p className="text-xs text-ash mt-1">
              Registros orbitais consolidados (DETER, BDQueimadas e NASA FIRMS)
            </p>
          </div>

          <div className="flex items-center gap-1 border border-forest/15 bg-mist p-1 rounded-xl text-xs">
            <button
              type="button"
              onClick={() => setFilterType('all')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                filterType === 'all'
                  ? 'bg-forest text-mist shadow-sm'
                  : 'text-ash hover:text-forest'
              }`}
            >
              Todos
            </button>
            <button
              type="button"
              onClick={() => setFilterType('foco')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                filterType === 'foco'
                  ? 'bg-forest text-mist shadow-sm'
                  : 'text-ash hover:text-forest'
              }`}
            >
              Queimadas
            </button>
            <button
              type="button"
              onClick={() => setFilterType('desmatamento')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                filterType === 'desmatamento'
                  ? 'bg-forest text-mist shadow-sm'
                  : 'text-ash hover:text-forest'
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
              className="p-3.5 rounded-xl bg-mist border border-forest/10 hover:border-forest/20 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-full bg-forest/8 flex-shrink-0 mt-0.5">
                  {getTypeIcon(alert.type)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-forest">
                      {alert.typeName}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-forest/8 text-forest-mid font-semibold">
                      {alert.biomeName}
                    </span>
                  </div>
                  <div className="text-[11px] text-ash mt-0.5">
                    📍 {alert.municipality}/{alert.state} • {alert.date} {alert.time ? `(${alert.time})` : ''} • {alert.satellite}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-3 flex-shrink-0 pl-11 sm:pl-0">
                {alert.areaHectares ? (
                  <span className="font-mono text-forest font-bold text-xs">
                    {alert.areaHectares} ha
                  </span>
                ) : alert.frp ? (
                  <span className="font-mono text-burn font-bold text-xs">
                    {alert.frp} MW
                  </span>
                ) : (
                  <span className="font-mono text-forest-mid text-xs">Anomalia</span>
                )}

                <span className={`inline-flex items-center gap-1 text-[10px] px-2.5 py-1 rounded-full font-bold ${
                  alert.status === 'Confirmado (Auditoria)'
                    ? 'bg-sprout text-forest'
                    : 'bg-burn/15 text-burn'
                }`}>
                  {alert.status === 'Confirmado (Auditoria)' ? <CheckCircle2 size={11} /> : <Clock size={11} />}
                  {alert.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 pt-3 border-t border-forest/10 flex items-center justify-between">
        <span className="text-xs text-ash">
          Dados abertos auditados do INPE e NASA
        </span>
        <Link
          href="/alertas"
          className="text-xs font-bold text-forest hover:text-forest-mid flex items-center gap-1 group"
        >
          <span>Acessar tabela completa de alertas</span>
          <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
