import { createFileRoute } from "@tanstack/react-router";
import { Reveal } from "@/components/site/Reveal";
import hero from "@/assets/hero-3d.jpg";
import impressora from "@/assets/prod-impressora.jpg";
import filamento from "@/assets/prod-filamento.jpg";

export const Route = createFileRoute("/sobre")({
  component: Sobre,
  head: () => ({
    meta: [
      { title: "Sobre a Favarim 3D — nossa história" },
      { name: "description", content: "Conheça a história, missão, visão e valores da Favarim 3D, especialista em impressão 3D no Brasil." },
      { property: "og:title", content: "Sobre a Favarim 3D" },
      { property: "og:description", content: "História, missão, visão e valores da Favarim 3D." },
      { property: "og:url", content: "/sobre" },
    ],
    links: [{ rel: "canonical", href: "/sobre" }],
  }),
});

function Sobre() {
  return (
    <div>
      <section className="relative isolate overflow-hidden">
        <img src={hero} alt="Oficina de impressão 3D da Favarim 3D" width={1920} height={1080} className="absolute inset-0 size-full object-cover" />
        <div className="absolute inset-0 bg-ink/85" aria-hidden="true" />
        <div className="relative mx-auto max-w-4xl px-4 py-24 text-center text-ink-foreground">
          <h1 className="text-4xl font-extrabold md:text-5xl">Feita por makers, para makers</h1>
          <p className="mx-auto mt-4 max-w-2xl text-ink-foreground/80">
            Desde 2018 ajudamos criadores, escolas e indústrias a transformar ideias em objetos reais.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16">
        <Reveal className="grid gap-10 md:grid-cols-2 md:items-center">
          <div>
            <h2 className="text-2xl font-extrabold">Nossa história</h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              A Favarim 3D nasceu em uma garagem em Maringá, com uma única impressora e muita
              curiosidade. Depois de milhares de horas de impressão e testes de materiais, viramos
              referência em curadoria de insumos: só vendemos o que usamos no nosso próprio chão de fábrica.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Hoje atendemos todo o Brasil com estoque próprio, suporte técnico especializado e
              garantia real em todos os equipamentos.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <img src={impressora} alt="Impressora 3D em operação na loja" width={800} height={800} loading="lazy" className="aspect-square rounded-2xl object-cover" />
            <img src={filamento} alt="Estoque de filamentos coloridos" width={800} height={800} loading="lazy" className="aspect-square rounded-2xl object-cover" />
          </div>
        </Reveal>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20">
        <ul className="grid gap-5 md:grid-cols-3">
          {[
            { t: "Missão", d: "Democratizar a manufatura aditiva no Brasil com produtos confiáveis e suporte de verdade." },
            { t: "Visão", d: "Ser a loja de impressão 3D mais recomendada do país até 2030." },
            { t: "Valores", d: "Transparência, curadoria técnica, respeito ao cliente e paixão por fazer." },
          ].map((v, i) => (
            <Reveal as="li" key={v.t} delay={i * 80}>
              <div className="card-hover h-full rounded-2xl border border-border bg-card p-6">
                <h3 className="text-lg font-extrabold text-primary">{v.t}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{v.d}</p>
              </div>
            </Reveal>
          ))}
        </ul>
      </section>
    </div>
  );
}