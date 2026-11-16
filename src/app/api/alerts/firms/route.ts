import { NextResponse } from "next/server";
import { VERIFIED_ALERTS } from "@/data/alerts";
import type { BiomeId, EnvironmentalAlert } from "@/data/types";
import { queryFocos } from "@/lib/firms/service";

export const revalidate = 900;

export async function GET() {
  const data = await queryFocos({ periodo: "24h" });

  const liveFireAlerts: EnvironmentalAlert[] = data.focos.slice(0, 60).map((f) => ({
    id: f.id,
    biomeId: (f.bioma === "fora_dos_biomas" ? "costeiro_marinho" : f.bioma) as BiomeId,
    biomeName: f.biomaNome,
    type: "foco_calor",
    typeName: "Foco de Calor Orbital (NASA FIRMS)",
    latitude: f.latitude,
    longitude: f.longitude,
    municipality: f.uf ? `Território (${f.uf})` : "Zona Monitorada",
    state: f.uf ?? "BR",
    date: f.dataHoraUtc.slice(0, 10),
    time: `${f.dataHoraUtc.slice(11, 16)} UTC`,
    confidence:
      f.confianca === "alta" ? "Alta" : f.confianca === "nominal" ? "Média" : "Baixa",
    satellite: f.satelite,
    sensor: f.instrumento === "VIIRS" ? "VIIRS (375 m)" : "MODIS (1 km)",
    frp: f.frp,
    source: `NASA FIRMS (${f.fonte})`,
    sourceUrl: "https://firms.modaps.eosdis.nasa.gov/",
    status: "Detectado",
    description: `Foco de calor ativo detectado pelo sensor ${f.instrumento} (${f.satelite}) com Potência Radiativa do Fogo (FRP) de ${f.frp.toFixed(1)} MW (${f.intensidade}). Foco de calor não é incêndio confirmado: é um alerta orbital para investigar.`,
  }));

  const nonFireAlerts = VERIFIED_ALERTS.filter((a) => a.type !== "foco_calor");

  return NextResponse.json({
    success: !data.resumo.erro || liveFireAlerts.length > 0,
    mode: data.resumo.desatualizado ? "cache" : "live",
    source: data.resumo.fonte,
    sourceUrl: "https://firms.modaps.eosdis.nasa.gov/",
    lastUpdated: data.resumo.atualizadoEm,
    desatualizado: data.resumo.desatualizado,
    erro: data.resumo.erro,
    totalInBrazil: data.resumo.total,
    alerts: [...liveFireAlerts, ...nonFireAlerts],
  });
}
