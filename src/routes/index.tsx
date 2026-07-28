import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import * as Icons from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/site/Reveal";
import { ProductCard } from "@/components/site/ProductCard";
import { Stars } from "@/components/site/Stars";
import { CATEGORIAS, DEPOIMENTOS, PRODUTOS } from "@/lib/catalog";
import { useLoja } from "@/lib/store";
import { toast } from "sonner";
import hero from "@/assets/hero-3d.jpg";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Favarim 3D — Filamentos, Impressoras 3D e Acessórios" },
      {
        name: "description",
        content:
          "Loja online de impressão 3D: filamentos, impressoras, resinas, bicos, mesas e ferramentas. Frete grátis acima de R$199.",
      },
      { property: "og:title", content: "Favarim 3D — Transformando ideias em realidade" },
      {
        property: "og:description",
        content: "Filamentos, impressoras, peças e acessórios com qualidade profissional.",
      },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
});

const SLIDES = [
  {
    titulo: "Transformando ideias em realidade",
    sub: "Filamentos, impressoras, peças e acessórios com qualidade profissional.",
  },
  {
    titulo: "Impressoras de alta velocidade",
    sub: "Até 500mm/s com nivelamento automático e acabamento impecável.",
  },
  {
    titulo: "Filamentos com tolerância ±0,02mm",
    sub: "Consistência de camada em cada metro impresso.",
  },
];

/** Contador regressivo da oferta do dia. */
function Countdown() {
  const [t, setT] = useState({ h: 0, m: 0, s: 0 });
  useEffect(() => {
    const alvo = new Date();
    alvo.setHours(23, 59, 59, 999);
    const tick = () => {
      const d = Math.max(0, alvo.getTime() - Date.now());
      setT({
        h: Math.floor(d / 3.6e6),
        m: Math.floor((d % 3.6e6) / 6e4),
        s: Math.floor((d % 6e4) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  const box = (v: number, l: string) => (
    <div className="rounded-lg bg-ink px-3 py-2 text-center text-ink-foreground">
      <span className="block text-lg font-bold tabular-nums">{String(v).padStart(2, "0")}</span>
      <span className="text-[10px] uppercase opacity-70">{l}</span>
    </div>
  );
  return (
    <div className="flex gap-2" aria-label="Tempo restante da oferta">
      {box(t.h, "horas")}
      {box(t.m, "min")}
      {box(t.s, "seg")}
    </div>
  );
}

function Index() {
  const [slide, setSlide] = useState(0);
  const { vistos } = useLoja();

  // Slider automático do hero
  useEffect(() => {
    const id = setInterval(() => setSlide((s) => (s + 1) % SLIDES.length), 6000);
    return () => clearInterval(id);
  }, []);

  const destaques = [...PRODUTOS].sort((a, b) => b.vendidos - a.vendidos).slice(0, 8);
  const promocoes = PRODUTOS.filter((p) => p.precoAntigo).slice(0, 4);
  const vistosProdutos = vistos
    .map((id) => PRODUTOS.find((p) => p.id === id))
    .filter(Boolean)
    .slice(0, 4);

  return (
    <>
      {/* ---------- HERO ---------- */}
      <section className="relative isolate overflow-hidden">
        <img
          src={hero}
          alt="Impressora 3D imprimindo uma peça geométrica azul luminosa"
          width={1920}
          height={1080}
          className="absolute inset-0 size-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/95 via-ink/80 to-ink/30" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-4 py-24 md:py-36">
          <div key={slide} className="reveal is-visible max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/15 px-3 py-1 text-xs font-medium text-primary-foreground">
              <Icons.Sparkles className="size-3.5" aria-hidden="true" /> Novidades da semana
            </span>
            <h1 className="mt-5 text-4xl font-extrabold leading-tight text-ink-foreground md:text-6xl">
              {SLIDES[slide].titulo}
            </h1>
            <p className="mt-4 max-w-xl text-base text-ink-foreground/80 md:text-lg">
              {SLIDES[slide].sub}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button variant="hero" size="xl" asChild>
                <Link to="/produtos">Comprar agora</Link>
              </Button>
              <Button variant="outline" size="xl" asChild className="border-ink-foreground/30 bg-transparent text-ink-foreground hover:bg-ink-foreground/10">
                <Link to="/produtos" hash="catalogo">Ver produtos</Link>
              </Button>
            </div>
          </div>
          <div className="mt-10 flex gap-2" role="tablist" aria-label="Banners">
            {SLIDES.map((s, i) => (
              <button
                key={s.titulo}
                role="tab"
                aria-selected={i === slide}
                aria-label={`Banner ${i + 1}`}
                onClick={() => setSlide(i)}
                className={`h-1.5 rounded-full transition-all ${i === slide ? "w-10 bg-primary" : "w-5 bg-ink-foreground/40"}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ---------- CATEGORIAS ---------- */}
      <section id="categorias" className="mx-auto max-w-7xl px-4 py-16">
        <Reveal>
          <h2 className="text-2xl font-extrabold tracking-tight md:text-3xl">Categorias</h2>
          <p className="mt-1 text-sm text-muted-foreground">Tudo que sua impressora precisa, organizado.</p>
        </Reveal>
        <ul className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {CATEGORIAS.map((c, i) => {
            const Icon = (Icons as unknown as Record<string, Icons.LucideIcon>)[c.icone] ?? Icons.Box;
            return (
              <Reveal as="li" key={c.slug} delay={i * 50}>
                <Link
                  to="/produtos"
                  search={{ cat: c.nome }}
                  className="card-hover group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card"
                >
                  <div className="relative h-28 overflow-hidden bg-secondary">
                    <img src={c.imagem} alt="" width={800} height={800} loading="lazy" className="size-full object-cover opacity-90 transition-transform duration-500 group-hover:scale-110" />
                  </div>
                  <div className="flex items-center gap-3 p-4">
                    <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-accent text-accent-foreground">
                      <Icon className="size-4" aria-hidden="true" />
                    </span>
                    <span className="min-w-0 truncate text-sm font-semibold">{c.nome}</span>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </ul>
      </section>

      {/* ---------- OFERTA DO DIA ---------- */}
      <section className="mx-auto max-w-7xl px-4 py-6">
        <Reveal className="grid gap-6 rounded-3xl border border-border bg-secondary/70 p-6 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <h2 className="text-xl font-extrabold md:text-2xl">Ofertas relâmpago</h2>
            <p className="text-sm text-muted-foreground">Preços válidos somente hoje ou enquanto durar o estoque.</p>
          </div>
          <Countdown />
        </Reveal>
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {promocoes.map((p, i) => (
            <Reveal key={p.id} delay={i * 60}>
              <ProductCard produto={p} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------- DESTAQUES ---------- */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <Reveal className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight md:text-3xl">Produtos em destaque</h2>
            <p className="mt-1 text-sm text-muted-foreground">Os mais vendidos da Favarim 3D.</p>
          </div>
          <Button variant="ghost" asChild>
            <Link to="/produtos">Ver catálogo completo →</Link>
          </Button>
        </Reveal>
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {destaques.map((p, i) => (
            <Reveal key={p.id} delay={i * 50}>
              <ProductCard produto={p} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------- BANNER PROMOCIONAL ---------- */}
      <section className="mx-auto max-w-7xl px-4">
        <Reveal className="gradient-ink flex flex-col items-start gap-6 rounded-3xl px-8 py-12 text-ink-foreground md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-primary">Frete grátis</p>
            <h2 className="mt-2 text-3xl font-extrabold md:text-4xl">Frete grátis acima de R$199</h2>
            <p className="mt-2 text-ink-foreground/70">Para todo o Brasil, em pedidos à vista ou parcelados.</p>
          </div>
          <Button variant="hero" size="xl" asChild>
            <Link to="/produtos">Comprar Agora</Link>
          </Button>
        </Reveal>
      </section>

      {/* ---------- VANTAGENS ---------- */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { i: Icons.Truck, t: "Entrega rápida", d: "Envio em até 24h úteis para todo o Brasil." },
            { i: Icons.ShieldCheck, t: "Pagamento seguro", d: "Criptografia e antifraude em todas as compras." },
            { i: Icons.BadgeCheck, t: "Garantia", d: "12 meses de garantia em todos os equipamentos." },
            { i: Icons.Headphones, t: "Suporte especializado", d: "Time maker pronto para te ajudar de verdade." },
          ].map((v, idx) => (
            <Reveal as="li" key={v.t} delay={idx * 60}>
              <div className="card-hover h-full rounded-2xl border border-border bg-card p-6">
                <span className="grid size-12 place-items-center rounded-2xl bg-accent text-accent-foreground">
                  <v.i className="size-6" aria-hidden="true" />
                </span>
                <h3 className="mt-4 font-bold">{v.t}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{v.d}</p>
              </div>
            </Reveal>
          ))}
        </ul>
      </section>

      {/* ---------- VISTOS RECENTEMENTE ---------- */}
      {vistosProdutos.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pb-8">
          <h2 className="text-2xl font-extrabold tracking-tight">Vistos recentemente</h2>
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {vistosProdutos.map((p) => p && <ProductCard key={p.id} produto={p} />)}
          </div>
        </section>
      )}

      {/* ---------- DEPOIMENTOS ---------- */}
      <section className="bg-secondary/60 py-16">
        <div className="mx-auto max-w-7xl px-4">
          <Reveal>
            <h2 className="text-2xl font-extrabold tracking-tight md:text-3xl">Quem compra, recomenda</h2>
          </Reveal>
          <ul className="mt-8 grid gap-5 md:grid-cols-3">
            {DEPOIMENTOS.map((d, i) => (
              <Reveal as="li" key={d.nome} delay={i * 80}>
                <figure className="h-full rounded-2xl border border-border bg-card p-6">
                  <div className="flex items-center gap-3">
                    <span className="grid size-12 place-items-center rounded-full gradient-primary text-lg font-bold text-primary-foreground" aria-hidden="true">
                      {d.inicial}
                    </span>
                    <figcaption>
                      <p className="font-semibold">{d.nome}</p>
                      <p className="text-xs text-muted-foreground">{d.cargo}</p>
                    </figcaption>
                  </div>
                  <Stars nota={d.nota} className="mt-4" />
                  <blockquote className="mt-3 text-sm text-muted-foreground">"{d.texto}"</blockquote>
                </figure>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------- NEWSLETTER ---------- */}
      <section className="mx-auto max-w-3xl px-4 py-16 text-center">
        <Reveal>
          <h2 className="text-2xl font-extrabold tracking-tight md:text-3xl">Receba ofertas exclusivas</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Cadastre seu e-mail e ganhe 5% OFF na primeira compra.
          </p>
          <form
            className="mx-auto mt-6 flex max-w-md flex-col gap-3 sm:flex-row"
            onSubmit={(e) => {
              e.preventDefault();
              const form = e.currentTarget;
              const email = (form.elements.namedItem("email") as HTMLInputElement).value.trim();
              if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
                toast.error("Informe um e-mail válido");
                return;
              }
              localStorage.setItem("f3d:newsletter", email);
              toast.success("Cadastro realizado!", { description: "Seu cupom chegará por e-mail." });
              form.reset();
            }}
          >
            <label htmlFor="news-email" className="sr-only">Seu melhor e-mail</label>
            <input
              id="news-email"
              name="email"
              type="email"
              required
              maxLength={120}
              placeholder="seuemail@exemplo.com"
              className="h-12 flex-1 rounded-xl border border-input bg-secondary px-4 text-sm outline-none focus:border-primary focus:bg-background"
            />
            <Button variant="hero" size="xl" type="submit">Cadastrar</Button>
          </form>
        </Reveal>
      </section>
    </>
  );
}
