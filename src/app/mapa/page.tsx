import type { Metadata } from "next";
import MapaQueimadasFirms from "@/components/mapa-firms/MapaQueimadasFirms";

export const metadata: Metadata = {
  title: "Mapa Interativo de Queimadas e Biomas",
  description:
    "Monitoramento orbital quase em tempo real (~3 h de latência) dos 7 ambientes brasileiros com dados reais do NASA FIRMS (VIIRS 375 m e MODIS 1 km) classificados por FRP.",
};

export default function MapaPage() {
  return <MapaQueimadasFirms />;
}
