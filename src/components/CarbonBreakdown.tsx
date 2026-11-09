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
    { label: "Transporte", value: transport, color: "#2a8f55" },
    { label: "Alimentação", value: meat, color: "#8b5a3c" },
    { label: "Energia", value: energy, color: "#ca8a04" },
  ];

  const nationalAvg = 4200;

  return (
    <div className="mt-8 space-y-5 border-t border-sprout/15 pt-8">
      <p className="text-sm font-semibold uppercase tracking-wide text-sprout/80">
        Composição da pegada
      </p>
      {items.map((item) => {
        const pct = total > 0 ? (item.value / total) * 100 : 0;
        return (
          <div key={item.label}>
            <div className="flex justify-between text-sm">
              <span className="text-mist/90">{item.label}</span>
              <span className="font-medium tabular-nums text-mist">
                {Math.round(item.value).toLocaleString("pt-BR")} kg
                <span className="ml-1 text-mist/50">({Math.round(pct)}%)</span>
              </span>
            </div>
            <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-mist/10">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${pct}%`, backgroundColor: item.color }}
              />
            </div>
          </div>
        );
      })}

      <div className="rounded-xl bg-mist/5 p-4">
        <div className="flex justify-between text-sm">
          <span className="text-mist/70">Média nacional (~)</span>
          <span className="font-medium text-mist/90">
            {nationalAvg.toLocaleString("pt-BR")} kg/ano
          </span>
        </div>
        <div className="mt-2 flex justify-between text-sm">
          <span className="text-mist/70">Sua pegada vs média</span>
          <span
            className={`font-semibold ${
              total < nationalAvg ? "text-sprout" : "text-amber-400"
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
