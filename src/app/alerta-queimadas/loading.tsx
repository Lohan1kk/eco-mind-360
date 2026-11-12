export default function MapLoading() {
  return (
    <div className="flex h-[calc(100dvh-3.75rem)] w-full flex-col overflow-hidden bg-[#101512]">
      <div className="shrink-0 border-b border-[#222D25] bg-[#131A16] px-5 py-3 md:px-8">
        <div className="h-5 w-48 rounded-[5px] bg-[#1D2821] animate-pulse" />
        <div className="mt-1.5 h-3.5 w-72 max-w-full rounded-[5px] bg-[#171F1A] animate-pulse" />
      </div>
      <div className="flex flex-1 items-center justify-center bg-[#101512]">
        <div className="flex flex-col items-center gap-3 text-[#A7B3A9] text-xs font-mono">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#29362D] border-t-[#789B7C]" />
          <p>Carregando mapa de queimadas...</p>
        </div>
      </div>
    </div>
  );
}
