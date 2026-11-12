interface BreakdownItem {
  label: string;
  value: number;
  color: string;
}

export function CarbonBreakdown({
  transport,
  meat,
  energy,
  total,
}: {
  transport: number;
  meat: number;
  energy: number;
  total: number;
}) {
  const items: BreakdownItem[] = [
    { label: "Transporte", value: transport, color: "#789B7C" },
    { label: "Alimentação", value: meat, color: "#91A88F" },
    { label: "Energia", value: energy, color: "#A9A17A" },
  ];

  const nationalAvg = 4200;

  return (
    <div className="mt-8 space-y-5 border-t border-[#222D25] pt-6">
      <p className="text-xs font-mono uppercase tracking-wider text-[#78877D]">
        Composição da pegada
      </p>
      {items.map((item) => {
        const pct = total > 0 ? (item.value / total) * 100 : 0;
        return (
          <div key={item.label}>
            <div className="flex justify-between text-xs sm:text-sm">
              <span className="text-[#A7B3A9]">{item.label}</span>
              <span className="font-mono font-medium tabular-nums text-[#DCE5DD]">
                {Math.round(item.value).toLocaleString("pt-BR")} kg
                <span className="ml-1 text-[#78877D]">({Math.round(pct)}%)</span>
              </span>
            </div>
            <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-[#131A16] border border-[#222D25]">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{ width: `${pct}%`, backgroundColor: item.color }}
              />
            </div>
          </div>
        );
      })}

      <div className="rounded-[7px] bg-[#131A16] border border-[#222D25] p-4">
        <div className="flex justify-between text-xs sm:text-sm">
          <span className="text-[#78877D]">Média nacional (~)</span>
          <span className="font-mono font-medium text-[#DCE5DD]">
            {nationalAvg.toLocaleString("pt-BR")} kg/ano
          </span>
        </div>
        <div className="mt-2 flex justify-between text-xs sm:text-sm">
          <span className="text-[#78877D]">Sua pegada vs média</span>
          <span
            className={`font-mono font-semibold ${
              total < nationalAvg ? "text-[#83A989]" : "text-[#A9A17A]"
            }`}
          >
            {total < nationalAvg ? "Abaixo" : "Acima"} (
            {Math.abs(Math.round(((total - nationalAvg) / nationalAvg) * 100))}
            %)
          </span>
        </div>
      </div>
    </div>
  );
}
