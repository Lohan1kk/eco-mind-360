import { NextResponse } from "next/server";
import { queryFocos } from "@/lib/firms/service";

export const revalidate = 900;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const forceRefresh = searchParams.get("refresh") === "1";
  const data = await queryFocos({ periodo: "24h" }, { forceRefresh });

  return NextResponse.json({
    alerts: data.focos.map((f) => ({
      id: f.id,
      lat: f.latitude,
      lng: f.longitude,
      level: f.intensidade,
      description: `${f.satelite} (${f.instrumento}) · conf. ${f.confianca}`,
      reportedAt: f.dataHoraUtc,
      source: "nasa" as const,
      satelite: f.satelite,
      estado: f.uf ?? undefined,
      bioma: f.biomaNome,
      frp: f.frp,
    })),
    meta: {
      count: data.resumo.total,
      inpe: 0,
      nasa: data.resumo.total,
      inpeSource: null,
      nasaEnabled: !data.resumo.semChave,
      firmsKeyConfigured: !data.resumo.semChave,
      updatedAt: data.resumo.atualizadoEm,
      desatualizado: data.resumo.desatualizado,
      errors: data.resumo.erro ? [data.resumo.erro] : undefined,
    },
  });
}
