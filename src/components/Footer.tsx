import Image from "next/image";
import Link from "next/link";
import { Reveal, StaggerItem, StaggerReveal } from "@/components/motion";

const links = [
  { href: "/calculadora", label: "Calculadora" },
  { href: "/quiz", label: "Quiz" },
  { href: "/alerta-queimadas", label: "Mapa de queimadas" },
  { href: "/#glossario", label: "Termos" },
  { href: "/#avaliacao", label: "Avaliar" },
  { href: "/baixar", label: "Baixar app" },
  { href: "/#agir", label: "Começar" },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-[#222D25] bg-[#131A16] py-14 text-[#A7B3A9]">
      <div className="section-inner relative z-[1] flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
        <Reveal variant="fadeUp">
          <div className="flex items-center gap-2.5">
            <Image
              src="/brand/icon-ecomind.png"
              alt=""
              width={36}
              height={36}
              className="h-9 w-9 object-contain"
            />
            <span className="font-display text-xl font-semibold text-[#DCE5DD]">
              EcoMind
            </span>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-[#78877D]">
            Consciência ambiental + tecnologia. Calculadora, quiz, mapa INPE e
            ações concretas para o planeta.
          </p>
        </Reveal>

        <nav aria-label="Rodapé">
          <StaggerReveal
            className="flex flex-wrap gap-x-6 gap-y-2 text-sm"
            staggerChildren={0.06}
            delayChildren={0.12}
          >
            {links.map((link) => (
              <StaggerItem key={link.href} soft>
                <Link href={link.href} className="text-[#A7B3A9] hover:text-[#DCE5DD] transition-colors">
                  {link.label}
                </Link>
              </StaggerItem>
            ))}
          </StaggerReveal>
        </nav>
      </div>

      <Reveal
        className="section-inner relative z-[1] mt-10 border-t border-[#222D25] pt-6 text-xs text-[#78877D]"
        delayMs={140}
        variant="fade"
      >
        <p>EcoMind · Projeto de alunos · Colégio Paulo de Tarso</p>
        <p className="mt-2">
          Dados:{" "}
          <a
            href="https://queimadas.dgi.inpe.br/"
            className="text-[#91A88F] underline hover:text-[#DCE5DD]"
            target="_blank"
            rel="noopener noreferrer"
          >
            INPE Queimadas
          </a>
        </p>
      </Reveal>
    </footer>
  );
}
