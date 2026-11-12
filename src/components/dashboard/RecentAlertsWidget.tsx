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
  ArrowRight,
  MapPin
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
        return <Flame className="w-4 h-4 text-[#A9A17A]" />;
      case 'alerta_desmatamento':
        return <Trees className="w-4 h-4 text-[#789B7C]" />;
      case 'anomalia_marinha':
        return <Waves className="w-4 h-4 text-[#91A88F]" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-[#A9A17A]" />;
    }
  };

  return (
    <div className="glass-panel flex flex-col justify-between p-6">
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 border-b border-[#222D25] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex rounded-full h-2 w-2 bg-[#A9A17A]" />
              <h3 className="font-display font-semibold text-lg text-[#DCE5DD]">
                Detecções e Alertas Recentes
              </h3>
            </div>
            <p className="text-xs text-[#78877D] mt-1">
              Registros orbitais consolidados (DETER, BDQueimadas e NASA FIRMS)
            </p>
          </div>

          <div className="flex items-center gap-1 border border-[#29362D] bg-[#131A16] p-1 rounded-[7px] text-xs">
            <button
              type="button"
              onClick={() => setFilterType('all')}
              className={`px-2.5 py-1 rounded-[5px] font-medium transition-colors ${
                filterType === 'all'
                  ? 'bg-[#789B7C] text-[#101512] font-semibold'
                  : 'text-[#A7B3A9] hover:text-[#DCE5DD]'
              }`}
            >
              Todos
            </button>
            <button
              type="button"
              onClick={() => setFilterType('foco')}
              className={`px-2.5 py-1 rounded-[5px] font-medium transition-colors ${
                filterType === 'foco'
                  ? 'bg-[#789B7C] text-[#101512] font-semibold'
                  : 'text-[#A7B3A9] hover:text-[#DCE5DD]'
              }`}
            >
              Queimadas
            </button>
            <button
              type="button"
              onClick={() => setFilterType('desmatamento')}
              className={`px-2.5 py-1 rounded-[5px] font-medium transition-colors ${
                filterType === 'desmatamento'
                  ? 'bg-[#789B7C] text-[#101512] font-semibold'
                  : 'text-[#A7B3A9] hover:text-[#DCE5DD]'
              }`}
            >
              DETER
            </button>
          </div>
        </div>

        <div className="divide-y divide-[#222D25]">
          {filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              className="py-3.5 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-[7px] bg-[#1D2821] border border-[#29362D] shrink-0 mt-0.5">
                  {getTypeIcon(alert.type)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-[#DCE5DD]">
                      {alert.typeName}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-[5px] bg-[#1D2821] text-[#91A88F] border border-[#29362D] font-mono">
                      {alert.biomeName}
                    </span>
                  </div>
                  <div className="text-[11px] text-[#78877D] mt-1 flex items-center gap-1.5">
                    <MapPin size={11} className="text-[#789B7C]" />
                    <span>{alert.municipality}/{alert.state} · {alert.date} {alert.time ? `(${alert.time})` : ''} · {alert.satellite}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pl-10 sm:pl-0">
                {alert.areaHectares ? (
                  <span className="font-mono text-[#83A989] font-medium text-xs">
                    {alert.areaHectares} ha
                  </span>
                ) : alert.frp ? (
                  <span className="font-mono text-[#A9A17A] font-medium text-xs">
                    {alert.frp} MW
                  </span>
                ) : (
                  <span className="font-mono text-[#91A88F] text-xs">Anomalia</span>
                )}

                <span className={`inline-flex items-center gap-1 text-[10px] px-2.5 py-1 rounded-[5px] font-mono ${
                  alert.status === 'Confirmado (Auditoria)'
                    ? 'bg-[#1D2821] text-[#83A989] border border-[#29362D]'
                    : 'bg-[#1D2821] text-[#A9A17A] border border-[#29362D]'
                }`}>
                  {alert.status === 'Confirmado (Auditoria)' ? <CheckCircle2 size={11} /> : <Clock size={11} />}
                  {alert.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-[#222D25] flex items-center justify-between">
        <span className="text-xs text-[#78877D]">
          Dados abertos auditados do INPE e NASA
        </span>
        <Link
          href="/alertas"
          className="text-xs font-medium text-[#91A88F] hover:text-[#DCE5DD] flex items-center gap-1 group"
        >
          <span>Acessar tabela completa de alertas</span>
          <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
