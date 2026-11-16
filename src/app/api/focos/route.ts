import { NextResponse } from "next/server";
import zlib from "node:zlib";
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

    const jsonString = JSON.stringify(payload);
    const acceptEncoding = request.headers.get("accept-encoding") ?? "";

    const baseHeaders: Record<string, string> = {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, s-maxage=900, stale-while-revalidate=3600",
      Vary: "Accept-Encoding",
    };

    if (jsonString.length > 16384) {
      if (acceptEncoding.includes("br")) {
        const compressed = zlib.brotliCompressSync(Buffer.from(jsonString, "utf8"), {
          params: {
            [zlib.constants.BROTLI_PARAM_QUALITY]: 4,
          },
        });
        return new Response(compressed, {
          status: 200,
          headers: {
            ...baseHeaders,
            "Content-Encoding": "br",
          },
        });
      }
      if (acceptEncoding.includes("gzip")) {
        const compressed = zlib.gzipSync(Buffer.from(jsonString, "utf8"), {
          level: 6,
        });
        return new Response(compressed, {
          status: 200,
          headers: {
            ...baseHeaders,
            "Content-Encoding": "gzip",
          },
        });
      }
    }

    return new Response(jsonString, {
      status: 200,
      headers: baseHeaders,
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
