import type { Metadata } from "next";
import MapaQueimadasFirms from "@/components/mapa-firms/MapaQueimadasFirms";

export const metadata: Metadata = {
  title: "Alerta de Queimadas — NASA FIRMS",
  description:
    "Mapa brasileiro de focos de calor quase em tempo real (~3 h de latência) com níveis por FRP via NASA FIRMS (VIIRS 375 m e MODIS 1 km).",
};

export default function AlertaQueimadasPage() {
  return <MapaQueimadasFirms />;
}
