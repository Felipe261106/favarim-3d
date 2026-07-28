import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Heart, Minus, Plus, ShieldCheck, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/site/ProductCard";
import { Stars } from "@/components/site/Stars";
import { PRODUTOS, brl, desconto, getProduto } from "@/lib/catalog";
import { useLoja } from "@/lib/store";
import { toast } from "sonner";

export const Route = createFileRoute("/produto/$slug")({
  loader: ({ params }) => {
    const produto = getProduto(params.slug);
    if (!produto) throw notFound();
    return { produto };
  },
  component: Produto,
  head: ({ loaderData, params }) => {
    const p = loaderData?.produto;
    const titulo = p ? `${p.nome} | Favarim 3D` : "Produto | Favarim 3D";
    return {
      meta: [
        { title: titulo },
        { name: "description", content: p?.descricao ?? "Produto para impressão 3D." },
        { property: "og:title", content: titulo },
        { property: "og:description", content: p?.descricao ?? "" },
        { property: "og:type", content: "product" },
        { property: "og:url", content: `/produto/${params.slug}` },
      ],
      links: [{ rel: "canonical", href: `/produto/${params.slug}` }],
      scripts: p
        ? [
            {
              type: "application/ld+json",
              children: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Product",
                name: p.nome,
                description: p.descricao,
                brand: { "@type": "Brand", name: p.marca },
                aggregateRating: {
                  "@type": "AggregateRating",
                  ratingValue: p.nota,
                  reviewCount: p.avaliacoes,
                },
                offers: {
                  "@type": "Offer",
                  price: p.preco,
                  priceCurrency: "BRL",
                  availability: p.estoque > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
                },
              }),
            },
          ]
        : [],
    };
  },
});

function Produto() {
  const { produto } = Route.useLoaderData();
  const { adicionar, favoritar, favoritos, registrarVisto } = useLoja();
  const [img, setImg] = useState(0);
  const [zoom, setZoom] = useState(false);
  const [qtd, setQtd] = useState(1);
  const [cep, setCep] = useState("");
  const [frete, setFrete] = useState<string | null>(null);

  useEffect(() => {
    registrarVisto(produto.id);
    setImg(0);
    setQtd(1);
  }, [produto.id, registrarVisto]);

  const off = desconto(produto);
  const relacionados = PRODUTOS.filter(
    (p) => p.categoria === produto.categoria && p.id !== produto.id,
  ).slice(0, 4);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <nav aria-label="Trilha" className="text-xs text-muted-foreground">
        <Link to="/" className="hover:text-primary">Início</Link> /{" "}
        <Link to="/produtos" className="hover:text-primary">Produtos</Link> /{" "}
        <span>{produto.categoria}</span>
      </nav>

      <div className="mt-4 grid gap-10 lg:grid-cols-2">
        {/* Galeria com zoom */}
        <div>
          <div
            className="overflow-hidden rounded-2xl border border-border bg-secondary"
            onMouseEnter={() => setZoom(true)}
            onMouseLeave={() => setZoom(false)}
          >
            <img
              src={produto.galeria[img]}
              alt={`${produto.nome} — imagem ${img + 1}`}
              width={800}
              height={800}
              className={`aspect-square w-full object-cover transition-transform duration-500 ${zoom ? "scale-125" : "scale-100"}`}
            />
          </div>
          <ul className="mt-3 flex gap-3">
            {produto.galeria.map((g: string, i: number) => (
              <li key={i}>
                <button
                  type="button"
                  onClick={() => setImg(i)}
                  aria-label={`Ver imagem ${i + 1}`}
                  aria-current={i === img}
                  className={`overflow-hidden rounded-xl border-2 transition-colors ${i === img ? "border-primary" : "border-border"}`}
                >
                  <img src={g} alt="" width={80} height={80} loading="lazy" className="size-20 object-cover" />
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Informações */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">{produto.marca}</p>
          <h1 className="mt-1 text-3xl font-extrabold tracking-tight">{produto.nome}</h1>
          <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
            <Stars nota={produto.nota} size={16} />
            <span>{produto.nota.toFixed(1)} · {produto.avaliacoes} avaliações</span>
          </div>

          <div className="mt-6 rounded-2xl border border-border bg-card p-6">
            {produto.precoAntigo && (
              <p className="text-sm text-muted-foreground line-through">{brl(produto.precoAntigo)}</p>
            )}
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-4xl font-extrabold tracking-tight">{brl(produto.preco)}</span>
              {off > 0 && (
                <span className="rounded-full bg-destructive px-2.5 py-1 text-xs font-semibold text-destructive-foreground">
                  -{off}%
                </span>
              )}
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              ou 12x de {brl(produto.preco / 12)} sem juros
            </p>
            <p className="mt-3 text-sm font-medium">
              {produto.estoque > 0 ? (
                <span className="text-success">Em estoque · {produto.estoque} unidades</span>
              ) : (
                <span className="text-destructive">Produto esgotado</span>
              )}
            </p>

            {/* Quantidade */}
            <div className="mt-5 flex items-center gap-3">
              <span className="text-sm font-medium">Quantidade</span>
              <div className="flex items-center rounded-lg border border-border">
                <Button variant="ghost" size="icon" aria-label="Diminuir quantidade" onClick={() => setQtd((q) => Math.max(1, q - 1))}>
                  <Minus />
                </Button>
                <span className="w-10 text-center text-sm tabular-nums">{qtd}</span>
                <Button variant="ghost" size="icon" aria-label="Aumentar quantidade" onClick={() => setQtd((q) => Math.min(99, q + 1))}>
                  <Plus />
                </Button>
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
              <Button variant="hero" size="xl" disabled={produto.estoque === 0} asChild={false} onClick={() => adicionar(produto.id, qtd)}>
                Comprar Agora
              </Button>
              <Button variant="cart" size="xl" disabled={produto.estoque === 0} onClick={() => adicionar(produto.id, qtd)}>
                Adicionar ao Carrinho
              </Button>
              <Button
                variant="outline"
                size="icon-lg"
                aria-label="Favoritar produto"
                aria-pressed={favoritos.includes(produto.id)}
                onClick={() => favoritar(produto.id)}
              >
                <Heart className={favoritos.includes(produto.id) ? "fill-destructive text-destructive" : ""} />
              </Button>
            </div>

            {/* Frete */}
            <form
              className="mt-6 border-t border-border pt-5"
              onSubmit={(e) => {
                e.preventDefault();
                if (!/^\d{5}-?\d{3}$/.test(cep)) {
                  toast.error("Informe um CEP válido (00000-000)");
                  return;
                }
                setFrete(produto.preco >= 199 ? "Frete grátis · 2 a 4 dias úteis" : "R$ 24,90 · 2 a 4 dias úteis");
              }}
            >
              <label htmlFor="cep" className="text-sm font-medium">Calcular frete e prazo</label>
              <div className="mt-2 flex gap-2">
                <input
                  id="cep"
                  value={cep}
                  onChange={(e) => setCep(e.target.value)}
                  maxLength={9}
                  placeholder="00000-000"
                  className="h-10 flex-1 rounded-lg border border-input bg-secondary px-3 text-sm outline-none focus:border-primary"
                />
                <Button type="submit" variant="ink">Calcular</Button>
              </div>
              {frete && <p className="mt-2 text-sm text-success">{frete}</p>}
            </form>

            <ul className="mt-5 grid gap-2 border-t border-border pt-5 text-sm text-muted-foreground">
              <li className="flex items-center gap-2"><Truck className="size-4" aria-hidden="true" /> Frete grátis acima de R$199</li>
              <li className="flex items-center gap-2"><ShieldCheck className="size-4" aria-hidden="true" /> Garantia de 12 meses e nota fiscal</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Descrição e especificações */}
      <div className="mt-14 grid gap-8 lg:grid-cols-2">
        <section>
          <h2 className="text-xl font-extrabold">Descrição completa</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{produto.descricao}</p>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Todos os itens passam por conferência de qualidade antes do envio. Em caso de dúvida sobre
            compatibilidade, fale com nosso suporte técnico especializado.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-extrabold">Especificações</h2>
          <dl className="mt-3 overflow-hidden rounded-xl border border-border">
            {produto.especificacoes.map((e: { label: string; valor: string }, i: number) => (
              <div key={e.label} className={`grid grid-cols-2 gap-4 px-4 py-3 text-sm ${i % 2 ? "bg-secondary/60" : ""}`}>
                <dt className="font-medium">{e.label}</dt>
                <dd className="text-muted-foreground">{e.valor}</dd>
              </div>
            ))}
          </dl>
        </section>
      </div>

      {/* Avaliações */}
      <section className="mt-14">
        <h2 className="text-xl font-extrabold">Avaliações dos clientes</h2>
        <ul className="mt-4 grid gap-4 md:grid-cols-3">
          {[
            { n: "Marcos A.", t: "Superou as expectativas, entrega rapidíssima.", s: 5 },
            { n: "Fernanda L.", t: "Ótimo custo-benefício, recomendo demais.", s: 5 },
            { n: "Diego S.", t: "Bom produto, embalagem poderia ser melhor.", s: 4 },
          ].map((a) => (
            <li key={a.n} className="rounded-2xl border border-border bg-card p-5">
              <p className="font-semibold">{a.n}</p>
              <Stars nota={a.s} className="mt-1" />
              <p className="mt-2 text-sm text-muted-foreground">{a.t}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* Relacionados */}
      {relacionados.length > 0 && (
        <section className="mt-14">
          <h2 className="text-xl font-extrabold">Produtos relacionados</h2>
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {relacionados.map((p) => (
              <ProductCard key={p.id} produto={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}