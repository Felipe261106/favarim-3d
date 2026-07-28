import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/site/ProductCard";
import { CATEGORIAS, CORES, MARCAS, MATERIAIS, PRODUTOS, brl } from "@/lib/catalog";

type Busca = { q?: string; cat?: string; promo?: boolean };

export const Route = createFileRoute("/produtos")({
  component: Produtos,
  validateSearch: (s: Record<string, unknown>): Busca => ({
    q: typeof s.q === "string" ? s.q : undefined,
    cat: typeof s.cat === "string" ? s.cat : undefined,
    promo: s.promo === true || s.promo === "true" ? true : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Produtos para impressão 3D | Favarim 3D" },
      {
        name: "description",
        content:
          "Catálogo completo: filamentos, impressoras 3D, resinas, bicos, mesas magnéticas, peças, ferramentas e eletrônica.",
      },
      { property: "og:title", content: "Catálogo Favarim 3D" },
      { property: "og:description", content: "Filtre por categoria, marca, material, cor e preço." },
      { property: "og:url", content: "/produtos" },
    ],
    links: [{ rel: "canonical", href: "/produtos" }],
  }),
});

const ORDENS = [
  { v: "vendidos", l: "Mais vendidos" },
  { v: "menor", l: "Menor preço" },
  { v: "maior", l: "Maior preço" },
  { v: "novos", l: "Mais recentes" },
] as const;

function Produtos() {
  const search = Route.useSearch();
  const [q, setQ] = useState(search.q ?? "");
  const [cats, setCats] = useState<string[]>(search.cat ? [search.cat] : []);
  const [marcas, setMarcas] = useState<string[]>([]);
  const [materiais, setMateriais] = useState<string[]>([]);
  const [cores, setCores] = useState<string[]>([]);
  const [maxPreco, setMaxPreco] = useState(5000);
  const [soDisponiveis, setSoDisponiveis] = useState(false);
  const [ordem, setOrdem] = useState<(typeof ORDENS)[number]["v"]>("vendidos");
  const [filtrosAbertos, setFiltrosAbertos] = useState(false);

  const toggle = (lista: string[], set: (v: string[]) => void, valor: string) =>
    set(lista.includes(valor) ? lista.filter((x) => x !== valor) : [...lista, valor]);

  const resultado = useMemo(() => {
    let itens = PRODUTOS.filter((p) => {
      const texto = `${p.nome} ${p.categoria} ${p.marca} ${p.material}`.toLowerCase();
      if (q && !texto.includes(q.toLowerCase())) return false;
      if (cats.length && !cats.includes(p.categoria)) return false;
      if (marcas.length && !marcas.includes(p.marca)) return false;
      if (materiais.length && !materiais.includes(p.material)) return false;
      if (cores.length && !cores.includes(p.cor)) return false;
      if (p.preco > maxPreco) return false;
      if (soDisponiveis && p.estoque === 0) return false;
      if (search.promo && !p.precoAntigo) return false;
      return true;
    });
    itens = [...itens].sort((a, b) => {
      if (ordem === "menor") return a.preco - b.preco;
      if (ordem === "maior") return b.preco - a.preco;
      if (ordem === "novos") return b.lancamento - a.lancamento;
      return b.vendidos - a.vendidos;
    });
    return itens;
  }, [q, cats, marcas, materiais, cores, maxPreco, soDisponiveis, ordem, search.promo]);

  const grupo = (titulo: string, opcoes: string[], sel: string[], set: (v: string[]) => void) => (
    <fieldset className="border-t border-border pt-4">
      <legend className="mb-2 text-sm font-bold">{titulo}</legend>
      <div className="grid gap-2">
        {opcoes.map((o) => (
          <label key={o} className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <input
              type="checkbox"
              checked={sel.includes(o)}
              onChange={() => toggle(sel, set, o)}
              className="size-4 accent-primary"
            />
            {o}
          </label>
        ))}
      </div>
    </fieldset>
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-10" id="catalogo">
      <nav aria-label="Trilha" className="text-xs text-muted-foreground">
        <Link to="/" className="hover:text-primary">Início</Link> / <span>Produtos</span>
      </nav>
      <h1 className="mt-2 text-3xl font-extrabold tracking-tight">
        {search.promo ? "Promoções" : "Catálogo completo"}
      </h1>

      <div className="mt-6 grid gap-8 lg:grid-cols-[260px_1fr]">
        {/* Filtros laterais */}
        <aside className={`${filtrosAbertos ? "block" : "hidden"} lg:block`} aria-label="Filtros">
          <div className="grid gap-4 rounded-2xl border border-border bg-card p-5">
            <div>
              <label htmlFor="filtro-busca" className="mb-2 block text-sm font-bold">Pesquisar</label>
              <input
                id="filtro-busca"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Digite para filtrar..."
                className="h-10 w-full rounded-lg border border-input bg-secondary px-3 text-sm outline-none focus:border-primary"
              />
            </div>
            {grupo("Categoria", CATEGORIAS.map((c) => c.nome), cats, setCats)}
            <fieldset className="border-t border-border pt-4">
              <legend className="mb-2 text-sm font-bold">Preço até {brl(maxPreco)}</legend>
              <input
                type="range"
                min={50}
                max={5000}
                step={50}
                value={maxPreco}
                onChange={(e) => setMaxPreco(Number(e.target.value))}
                className="w-full accent-primary"
                aria-label="Preço máximo"
              />
            </fieldset>
            {grupo("Marca", MARCAS, marcas, setMarcas)}
            {grupo("Material", MATERIAIS, materiais, setMateriais)}
            {grupo("Cor", CORES, cores, setCores)}
            <fieldset className="border-t border-border pt-4">
              <legend className="mb-2 text-sm font-bold">Disponibilidade</legend>
              <label className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground">
                <input type="checkbox" checked={soDisponiveis} onChange={(e) => setSoDisponiveis(e.target.checked)} className="size-4 accent-primary" />
                Somente em estoque
              </label>
            </fieldset>
          </div>
        </aside>

        <section>
          <div className="mb-5 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
            <p className="min-w-0 truncate text-sm text-muted-foreground">
              {resultado.length} produto(s) encontrado(s)
            </p>
            <div className="flex shrink-0 items-center gap-2">
              <Button variant="outline" size="sm" className="lg:hidden" onClick={() => setFiltrosAbertos((f) => !f)}>
                <SlidersHorizontal /> Filtros
              </Button>
              <label htmlFor="ordenar" className="sr-only">Ordenar por</label>
              <select
                id="ordenar"
                value={ordem}
                onChange={(e) => setOrdem(e.target.value as typeof ordem)}
                className="h-9 rounded-lg border border-input bg-card px-3 text-sm outline-none focus:border-primary"
              >
                {ORDENS.map((o) => (
                  <option key={o.v} value={o.v}>{o.l}</option>
                ))}
              </select>
            </div>
          </div>

          {resultado.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-border p-12 text-center text-sm text-muted-foreground">
              Nenhum produto encontrado com esses filtros.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {resultado.map((p) => (
                <ProductCard key={p.id} produto={p} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}