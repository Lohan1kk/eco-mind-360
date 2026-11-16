import { NextResponse } from "next/server";
import { queryFocos } from "@/lib/firms/service";

export const revalidate = 900; // 15 minutos

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const rawFiltro = {
      periodo: searchParams.get("periodo") ?? undefined,
      bioma: searchParams.get("bioma") ?? undefined,
      uf: searchParams.get("uf") ?? undefined,
      frpMin:
        searchParams.get("frpMin") !== null
          ? Number(searchParams.get("frpMin"))
          : undefined,
      fonte: searchParams.get("fonte") ?? undefined,
      diaNoite: searchParams.get("diaNoite") ?? undefined,
      intensidadeMin: searchParams.get("intensidadeMin") ?? undefined,
    };

    const forceRefresh = searchParams.get("refresh") === "1";
    const resumoOnly = searchParams.get("resumo") === "1";

    const data = await queryFocos(rawFiltro, { forceRefresh });

    const payload = resumoOnly
      ? {
          resumo: data.resumo,
          filtrosAplicados: data.filtrosAplicados,
        }
      : data;

    return NextResponse.json(payload, {
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=900, stale-while-revalidate=3600",
      },
    });
  } catch {
    return NextResponse.json(
      {
        erro: "Serviço de monitoramento orbital temporariamente indisponível. Tente novamente em instantes.",
      },
      { status: 503 },
    );
  }
}
