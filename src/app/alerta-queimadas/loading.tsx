import { Header } from "@/components/Header";

export default function MapLoading() {
  return (
    <>
      <Header solid />
      <main className="pt-16">
        <div className="border-b border-forest/10 bg-mist px-5 py-3 md:px-8">
          <div className="skeleton h-7 w-48" />
          <div className="skeleton mt-2 h-4 w-72 max-w-full" />
        </div>
        <div className="flex h-[calc(100svh-8.5rem)] items-center justify-center bg-mist-soft">
          <div className="flex flex-col items-center gap-4 text-ash">
            <div className="h-12 w-12 animate-pulse-soft rounded-full border-2 border-forest/30 border-t-forest" />
            <p>Carregando mapa de queimadas...</p>
          </div>
        </div>
      </main>
    </>
  );
}
