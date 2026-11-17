/**
 * Suite de Testes Automatizados (Vitest) — Camada NASA FIRMS do EcoMind 360°
 *
 * NOTA: Os arquivos em `src/lib/firms/__fixtures__/` são amostras de teste estáticas
 * usadas exclusivamente para validação automatizada de parse, normalização e agregação.
 */
import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  applyFiltroFocos,
  buildResumoFocos,
  classifyFrpIntensity,
  normalizeConfidence,
  parseFirmsCsvToFocos,
} from "../parser";
import { classifyLocation } from "../spatial";
import { parseMapUrlState, serializeMapUrlState } from "../url-state";

const fixturesDir = path.join(__dirname, "..", "__fixtures__");

describe("1. Classificação por FRP nos limites exatos (Critério do Projeto)", () => {
  it("classifica corretamente os valores limites 14.9 / 15 / 39.9 / 40 / 99.9 / 100 MW", () => {
    expect(classifyFrpIntensity(0)).toBe("baixo");
    expect(classifyFrpIntensity(14.9)).toBe("baixo");
    expect(classifyFrpIntensity(15)).toBe("medio");
    expect(classifyFrpIntensity(39.9)).toBe("medio");
    expect(classifyFrpIntensity(40)).toBe("alto");
    expect(classifyFrpIntensity(99.9)).toBe("alto");
    expect(classifyFrpIntensity(100)).toBe("critico");
    expect(classifyFrpIntensity(250.5)).toBe("critico");
  });
});

describe("2. Parse e normalização do CSV do FIRMS (amostras de teste em fixtures)", () => {
  it("faz parse do CSV VIIRS de amostra, normaliza confiança, data/hora UTC e ignora linhas inválidas", () => {
    const csvViirs = fs.readFileSync(
      path.join(fixturesDir, "sample-viirs-test.csv"),
      "utf8",
    );
    const focos = parseFirmsCsvToFocos(csvViirs, "VIIRS_NOAA20_NRT");

    // 4 linhas válidas (a 5ª tem latitude inválida e é rejeitada pelo Zod)
    expect(focos).toHaveLength(4);

    // 1º foco: Manaus (AM) - Amazônia, alta confiança ('h'), FRP 112.4 -> crítico, noturno ('N')
    const f1 = focos[0];
    expect(f1.latitude).toBe(-3.119);
    expect(f1.longitude).toBe(-60.0217);
    expect(f1.dataHoraUtc).toBe("2026-11-15T03:49:00.000Z");
    expect(f1.satelite).toBe("NOAA-20");
    expect(f1.instrumento).toBe("VIIRS");
    expect(f1.confianca).toBe("alta");
    expect(f1.frp).toBe(112.4);
    expect(f1.intensidade).toBe("critico");
    expect(f1.diaNoite).toBe("N");
    expect(f1.bioma).toBe("amazonia");
    expect(f1.uf).toBe("AM");

    // 2º foco: Brasília (DF) - Cerrado, nominal ('n'), FRP 48.6 -> alto
    const f2 = focos[1];
    expect(f2.bioma).toBe("cerrado");
    expect(f2.uf).toBe("DF");
    expect(f2.confianca).toBe("nominal");
    expect(f2.intensidade).toBe("alto");

    // 3º foco: São Paulo (SP) - Mata Atlântica, baixa ('l'), FRP 9.2 -> baixo
    const f3 = focos[2];
    expect(f3.bioma).toBe("mata_atlantica");
    expect(f3.uf).toBe("SP");
    expect(f3.confianca).toBe("baixa");
    expect(f3.intensidade).toBe("baixo");

    // 4º foco: Oceano Atlântico fora da malha costeira -> fora_dos_biomas (entra só no total geral)
    const f4 = focos[3];
    expect(f4.bioma).toBe("fora_dos_biomas");
    expect(f4.uf).toBeNull();
  });

  it("faz parse do CSV MODIS de amostra e normaliza a escala numérica 0-100% de confiança", () => {
    const csvModis = fs.readFileSync(
      path.join(fixturesDir, "sample-modis-test.csv"),
      "utf8",
    );
    const focos = parseFirmsCsvToFocos(csvModis, "MODIS_NRT");

    expect(focos).toHaveLength(3);
    expect(focos[0].satelite).toBe("Aqua");
    expect(focos[0].instrumento).toBe("MODIS");
    expect(focos[0].confianca).toBe("alta"); // 88%
    expect(focos[0].bioma).toBe("pantanal");

    expect(focos[1].satelite).toBe("Terra");
    expect(focos[1].confianca).toBe("nominal"); // 55%
    expect(focos[1].bioma).toBe("caatinga");

    expect(focos[2].confianca).toBe("baixa"); // 22%
    expect(focos[2].bioma).toBe("pampa");
  });

  it("normaliza escalas diferentes de confiança entre VIIRS e MODIS", () => {
    expect(normalizeConfidence("l", "VIIRS").confianca).toBe("baixa");
    expect(normalizeConfidence("n", "VIIRS").confianca).toBe("nominal");
    expect(normalizeConfidence("h", "VIIRS").confianca).toBe("alta");

    expect(normalizeConfidence("15", "MODIS").confianca).toBe("baixa");
    expect(normalizeConfidence("65", "MODIS").confianca).toBe("nominal");
    expect(normalizeConfidence("85", "MODIS").confianca).toBe("alta");
  });
});

describe("3. Atribuição foco → bioma e UF com pontos conhecidos (IBGE)", () => {
  it("atribui corretamente pontos conhecidos aos 7 ambientes brasileiros e fora dos biomas", () => {
    // Amazônia (Manaus, AM)
    const amz = classifyLocation(-3.119, -60.0217);
    expect(amz.bioma).toBe("amazonia");
    expect(amz.uf).toBe("AM");

    // Cerrado (Brasília, DF)
    const cer = classifyLocation(-15.7939, -47.8828);
    expect(cer.bioma).toBe("cerrado");
    expect(cer.uf).toBe("DF");

    // Mata Atlântica (São Paulo, SP)
    const mat = classifyLocation(-23.5505, -46.6333);
    expect(mat.bioma).toBe("mata_atlantica");
    expect(mat.uf).toBe("SP");

    // Caatinga (Petrolina, PE)
    const caa = classifyLocation(-9.3891, -40.5027);
    expect(caa.bioma).toBe("caatinga");
    expect(caa.uf).toBe("PE");

    // Pampa (Alegrete, RS)
    const pmp = classifyLocation(-29.7831, -55.7919);
    expect(pmp.bioma).toBe("pampa");
    expect(pmp.uf).toBe("RS");

    // Pantanal (Corumbá, MS)
    const ptn = classifyLocation(-19.008, -57.651);
    expect(ptn.bioma).toBe("pantanal");
    expect(ptn.uf).toBe("MS");

    // Sistema Costeiro-Marinho (Parque Nacional Marinho dos Abrolhos, BA)
    const mar = classifyLocation(-17.9642, -38.7042);
    expect(mar.bioma).toBe("costeiro_marinho");

    // Oceano Atlântico aberto fora do polígono costeiro-marinho -> fora_dos_biomas
    const oceanoFora = classifyLocation(-20.5, -30.0);
    expect(oceanoFora.bioma).toBe("fora_dos_biomas");
    expect(oceanoFora.isForeignContinent).toBe(false);
  });

  it("contabiliza pontos 'fora_dos_biomas' apenas no total geral do resumo", () => {
    const csvViirs = fs.readFileSync(
      path.join(fixturesDir, "sample-viirs-test.csv"),
      "utf8",
    );
    const focos = parseFirmsCsvToFocos(csvViirs, "VIIRS_NOAA20_NRT");
    const resumo = buildResumoFocos(focos, {
      periodo: "24h",
      atualizadoEm: "2026-11-15T20:00:00.000Z",
      fontesAtivas: ["VIIRS_NOAA20_NRT"],
      desatualizado: false,
      semChave: false,
    });

    expect(resumo.total).toBe(4);
    expect(resumo.totalNosBiomas).toBe(3);
    expect(resumo.foraDosBiomas).toBe(1);
    const somaBiomas = Object.values(resumo.porBioma).reduce(
      (acc, b) => acc + b.total,
      0,
    );
    expect(somaBiomas).toBe(3);
  });
});

describe("4. Restauração e serialização de filtros, posição e camadas pela URL", () => {
  it("restaura corretamente todos os filtros, coordenadas e camadas a partir da query string", () => {
    const query =
      "?periodo=7d&bioma=pantanal&uf=ms&frpMin=40&intensidadeMin=alto&fonte=VIIRS_NOAA20_NRT&diaNoite=N&lat=-19.0125&lon=-57.6521&zoom=7.5&camadas=focos,gibs,heatmap";

    const state = parseMapUrlState(query);
    expect(state.filtros.periodo).toBe("7d");
    expect(state.filtros.bioma).toBe("pantanal");
    expect(state.filtros.uf).toBe("MS");
    expect(state.filtros.frpMin).toBe(40);
    expect(state.filtros.intensidadeMin).toBe("alto");
    expect(state.filtros.fonte).toBe("VIIRS_NOAA20_NRT");
    expect(state.filtros.diaNoite).toBe("N");
    expect(state.lat).toBe(-19.0125);
    expect(state.lon).toBe(-57.6521);
    expect(state.zoom).toBe(7.5);
    expect(state.camadas).toEqual({
      focos: true,
      biomas: false,
      gibs: true,
      heatmap: true,
    });

    // Roundtrip: serializar e fazer parse novamente reproduz exatamente o mesmo estado
    const serialized = serializeMapUrlState(state);
    const roundtrip = parseMapUrlState(serialized);
    expect(roundtrip).toEqual(state);
  });

  it("normaliza uf vazio ou 'ALL' para 'all' (minúsculo) sem filtrar focos indevidamente", () => {
    const emptyState = parseMapUrlState("");
    expect(emptyState.filtros.uf).toBe("all");
    expect(serializeMapUrlState(emptyState)).not.toContain("uf=");

    const allUpperState = parseMapUrlState("?periodo=24h&uf=ALL");
    expect(allUpperState.filtros.uf).toBe("all");
    expect(serializeMapUrlState(allUpperState)).not.toContain("uf=");

    const csvViirs = fs.readFileSync(
      path.join(fixturesDir, "sample-viirs-test.csv"),
      "utf8",
    );
    const focos = parseFirmsCsvToFocos(csvViirs, "VIIRS_NOAA20_NRT");
    expect(applyFiltroFocos(focos, emptyState.filtros)).toHaveLength(4);
    expect(applyFiltroFocos(focos, allUpperState.filtros)).toHaveLength(4);
  });
});

describe("5. Auditoria de páginas: nenhuma página exibe focos sem fonte e data/hora nem contém números fixos", () => {
  const srcDir = path.resolve(__dirname, "../../..");

  const pagesDisplayingFocos = [
    "components/Hero.tsx",
    "components/BiomesSection.tsx",
    "components/dashboard/BiomeSummaryGrid.tsx",
    "app/dashboard/page.tsx",
    "app/comparacao/page.tsx",
    "app/biomas/page.tsx",
    "app/biomas/[id]/page.tsx",
    "components/mapa-firms/MapaQueimadasFirms.tsx",
  ];

  it("garante que nenhuma página/componente usa activeFireHotspots24h fixo", () => {
    for (const rel of pagesDisplayingFocos) {
      const content = fs.readFileSync(path.join(srcDir, rel), "utf8");
      expect(content).not.toContain("activeFireHotspots24h");
    }
  });

  it("garante que todas as páginas que exibem focos incluem a fonte (NASA FIRMS / FreshnessSeal) e carimbo de data/hora (atualizadoEm)", () => {
    for (const rel of pagesDisplayingFocos) {
      const content = fs.readFileSync(path.join(srcDir, rel), "utf8");
      const hasSource =
        content.includes("NASA FIRMS") || content.includes("FreshnessSeal");
      const hasTimestamp =
        content.includes("atualizadoEm") || content.includes("FreshnessSeal");
      expect(hasSource, `Arquivo ${rel} deve exibir a fonte dos focos`).toBe(true);
      expect(
        hasTimestamp,
        `Arquivo ${rel} deve exibir a data/hora (atualizadoEm) dos focos`,
      ).toBe(true);
    }
  });
});
