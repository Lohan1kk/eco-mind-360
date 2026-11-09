import { NextResponse } from 'next/server';
import { VERIFIED_ALERTS } from '@/data/alerts';
import { EnvironmentalAlert, BiomeId } from '@/data/types';

// Helper de classificação geográfica aproximada dos biomas do Brasil
function classifyBrazilianBiome(lat: number, lon: number): { biomeId: BiomeId; biomeName: string } {
  // Pantanal (MT/MS wetland rectangle)
  if (lat >= -22.0 && lat <= -15.5 && lon >= -58.5 && lon <= -55.0) {
    return { biomeId: 'pantanal', biomeName: 'Pantanal' };
  }
  // Pampa (RS sul)
  if (lat <= -27.5 && lon <= -49.5 && lon >= -58.0) {
    return { biomeId: 'pampa', biomeName: 'Pampa' };
  }
  // Amazônia (Norte e Noroeste do Brasil)
  if (lat >= -16.0 && lon <= -45.0 && (lat >= -13.0 || lon <= -50.0)) {
    return { biomeId: 'amazonia', biomeName: 'Amazônia' };
  }
  // Caatinga (Nordeste semiárido)
  if (lat >= -16.5 && lat <= -3.0 && lon >= -45.0 && lon <= -35.0) {
    return { biomeId: 'caatinga', biomeName: 'Caatinga' };
  }
  // Mata Atlântica (Faixa leste / sul / sudeste litorânea e interior)
  if (lon >= -54.0 && (lat <= -18.0 || (lat <= -5.0 && lon >= -40.0))) {
    return { biomeId: 'mata_atlantica', biomeName: 'Mata Atlântica' };
  }
  // Cerrado (Planalto Central)
  return { biomeId: 'cerrado', biomeName: 'Cerrado' };
}

export async function GET() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const firmsUrl = 'https://firms.modaps.eosdis.nasa.gov/data/active_fire/modis-c6.1/csv/MODIS_C6_1_South_America_24h.csv';
    const response = await fetch(firmsUrl, {
      signal: controller.signal,
      next: { revalidate: 3600 } // cache 1h
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`NASA FIRMS respondeu com status ${response.status}`);
    }

    const text = await response.text();
    const lines = text.trim().split('\n');
    if (lines.length < 2) {
      throw new Error('Formato de resposta vazio ou inesperado da NASA');
    }

    const header = lines[0].split(',');
    const latIdx = header.indexOf('latitude');
    const lonIdx = header.indexOf('longitude');
    const dateIdx = header.indexOf('acq_date');
    const timeIdx = header.indexOf('acq_time');
    const satIdx = header.indexOf('satellite');
    const confIdx = header.indexOf('confidence');
    const frpIdx = header.indexOf('frp');

    const liveAlerts: EnvironmentalAlert[] = [];

    // Processar primeiras linhas dentro do Brasil
    for (let i = 1; i < lines.length && liveAlerts.length < 50; i++) {
      const cols = lines[i].split(',');
      if (cols.length < header.length) continue;

      const lat = parseFloat(cols[latIdx]);
      const lon = parseFloat(cols[lonIdx]);

      // Bounding box do Brasil: lat 5.27 a -33.75, lon -73.98 a -34.79
      if (lat <= 5.27 && lat >= -33.75 && lon >= -73.98 && lon <= -34.79) {
        const { biomeId, biomeName } = classifyBrazilianBiome(lat, lon);
        const frpVal = frpIdx !== -1 ? parseFloat(cols[frpIdx]) : undefined;
        const confVal = confIdx !== -1 ? parseInt(cols[confIdx], 10) : 50;

        liveAlerts.push({
          id: `NASA-FIRMS-${i}-${cols[dateIdx] || 'live'}`,
          biomeId,
          biomeName,
          type: 'foco_calor',
          typeName: 'Foco de Calor Satelital (NASA FIRMS)',
          latitude: Number(lat.toFixed(4)),
          longitude: Number(lon.toFixed(4)),
          municipality: 'Detecção Territorial',
          state: 'BR',
          date: cols[dateIdx] || new Date().toISOString().split('T')[0],
          time: cols[timeIdx] ? `${cols[timeIdx].slice(0, 2)}:${cols[timeIdx].slice(2, 4)} UTC` : undefined,
          confidence: confVal >= 80 ? 'Alta' : confVal >= 50 ? 'Média' : 'Baixa',
          satellite: cols[satIdx] === 'T' ? 'Terra (MODIS)' : cols[satIdx] === 'A' ? 'Aqua (MODIS)' : 'Satélite Operacional',
          sensor: 'MODIS (1km)',
          frp: isNaN(frpVal || NaN) ? undefined : Number(frpVal?.toFixed(1)),
          source: 'NASA FIRMS / MODIS C6.1',
          sourceUrl: 'https://firms.modaps.eosdis.nasa.gov/',
          status: 'Detectado',
          description: `Foco de calor ativo detectado pelo sensor térmico orbital da NASA com potência radiativa estimada de ${frpVal ? frpVal.toFixed(1) + ' MW' : 'padrão'}.`
        });
      }
    }

    return NextResponse.json({
      success: true,
      mode: 'live',
      source: 'NASA FIRMS (Fire Information for Resource Management System)',
      sourceUrl: 'https://firms.modaps.eosdis.nasa.gov/',
      lastUpdated: new Date().toISOString(),
      totalInBrazil: liveAlerts.length,
      alerts: [...liveAlerts, ...VERIFIED_ALERTS]
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Falha na conexão externa com NASA FIRMS';
    // Fallback gracioso com dados oficiais verificados em conformidade com as regras
    return NextResponse.json({
      success: true,
      mode: 'fallback_verified',
      source: 'Base Oficial Verificada (INPE / TerraBrasilis / NASA FIRMS)',
      sourceUrl: 'https://terrabrasilis.dpi.inpe.br',
      lastUpdated: '08/11/2024',
      message: `Feed ao vivo temporariamente indisponível (${errorMsg}). Exibindo registros oficiais auditados.`,
      alerts: VERIFIED_ALERTS
    });
  }
}
