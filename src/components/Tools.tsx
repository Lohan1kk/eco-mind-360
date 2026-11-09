import Link from "next/link";
import { Reveal, StaggerItem, StaggerReveal } from "@/components/motion";
import { SectionAtmosphere } from "@/components/ui/section-atmosphere";
import { VerdantWash } from "@/components/ui/verdant-accent";
import { MapPin, LayoutDashboard, Calculator, HelpCircle } from "lucide-react";

const tools = [
  {
    href: "/mapa",
    step: "01",
    title: "Mapa de Queimadas",
    desc: "Focos em tempo real (INPE no Brasil e NASA FIRMS no mundo) graduados por potência de fogo (FRP) com a malha dos 7 biomas.",
    cta: "Abrir o mapa interativo",
    icon: MapPin,
  },
  {
    href: "/dashboard",
    step: "02",
    title: "Dashboard 360°",
    desc: "Indicadores territoriais oficiais: vegetação nativa remanescente, desmatamento PRODES 2024 e unidades de conservação.",
    cta: "Acessar o painel",
    icon: LayoutDashboard,
  },
  {
    href: "/calculadora",
    step: "03",
    title: "Calculadora de Pegada",
    desc: "Descubra sua emissão pessoal de CO₂e no transporte, alimentação e consumo elétrico diário com dicas práticas.",
    cta: "Calcular agora",
    icon: Calculator,
  },
  {
    href: "/quiz",
    step: "04",
    title: "Quiz & Folclore Protetor",
    desc: "Gincana educativa conectando a preservação florestal às lendas do folclore nacional: Curupira, Caipora e Boitatá.",
    cta: "Jogar o quiz",
    icon: HelpCircle,
  },
];

export function Tools() {
  return (
    <section id="ferramentas" className="section section-soft relative overflow-hidden">
      <SectionAtmosphere variant="soft" />
      <VerdantWash tone="light" speed={0.37} />
      <div className="section-inner relative z-[1]">
        <StaggerReveal staggerChildren={0.1} delayChildren={0.04}>
          <StaggerItem soft>
            <p className="eyebrow text-forest-mid">Ferramentas Integradas</p>
          </StaggerItem>
          <StaggerItem>
            <h2 className="display mt-4 max-w-3xl text-3xl text-ink md:text-5xl">
              Quatro caminhos para transformar preocupação em ação
            </h2>
          </StaggerItem>
          <StaggerItem soft>
            <p className="lede mt-5 max-w-2xl">
              Educação ambiental e dados abertos em uma só experiência: simples, sem ruído e construído por estudantes.
            </p>
          </StaggerItem>
        </StaggerReveal>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {tools.map((t, i) => {
            const Icon = t.icon;
            return (
              <Reveal key={t.title} delayMs={100 + i * 80} variant="fadeUp">
                <article className="panel-soft flex h-full flex-col justify-between p-6 transition-transform hover:-translate-y-1">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-display text-3xl font-bold text-forest/20">
                        {t.step}
                      </span>
                      <div className="h-10 w-10 rounded-full bg-forest/8 flex items-center justify-center text-forest">
                        <Icon size={18} />
                      </div>
                    </div>
                    <h3 className="font-display mt-4 text-xl font-bold text-forest">
                      {t.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-ash">
                      {t.desc}
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-forest/10">
                    <Link
                      href={t.href}
                      className="font-bold text-xs text-forest hover:text-forest-mid inline-flex items-center gap-1 group"
                    >
                      <span>{t.cta}</span>
                      <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </Link>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
