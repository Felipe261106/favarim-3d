import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Minus, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { brl } from "@/lib/catalog";
import { itensDetalhados, useLoja } from "@/lib/store";

export const Route = createFileRoute("/carrinho")({
  component: Carrinho,
  head: () => ({
    meta: [
      { title: "Carrinho de compras | Favarim 3D" },
      { name: "description", content: "Revise seus itens, aplique cupom e finalize sua compra na Favarim 3D." },
      { property: "og:title", content: "Carrinho | Favarim 3D" },
      { property: "og:description", content: "Revise seus itens e finalize sua compra." },
      { property: "og:url", content: "/carrinho" },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: "/carrinho" }],
  }),
});

function Carrinho() {
  const { carrinho, alterarQtd, remover, subtotal } = useLoja();
  const [cupom, setCupom] = useState("");
  const [aplicado, setAplicado] = useState(0);
  const itens = itensDetalhados(carrinho);
  const frete = subtotal === 0 || subtotal >= 199 ? 0 : 24.9;
  const total = subtotal - subtotal * aplicado + frete;

  const aplicarCupom = (e: React.FormEvent) => {
    e.preventDefault();
    if (cupom.trim().toUpperCase() === "FAVARIM10") {
      setAplicado(0.1);
      toast.success("Cupom aplicado: 10% de desconto");
    } else {
      setAplicado(0);
      toast.error("Cupom inválido");
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="text-3xl font-extrabold tracking-tight">Seu carrinho</h1>

      {itens.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-border p-16 text-center">
          <p className="text-muted-foreground">Seu carrinho está vazio.</p>
          <Button variant="hero" size="xl" asChild className="mt-6">
            <Link to="/produtos">Ver produtos</Link>
          </Button>
        </div>
      ) : (
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
          <ul className="grid gap-4">
            {itens.map(({ produto, qtd }) => (
              <li key={produto.id} className="grid grid-cols-[80px_minmax(0,1fr)] gap-4 rounded-2xl border border-border bg-card p-4 sm:grid-cols-[100px_minmax(0,1fr)_auto]">
                <img src={produto.imagem} alt={produto.nome} width={100} height={100} loading="lazy" className="size-20 rounded-xl object-cover sm:size-24" />
                <div className="min-w-0">
                  <Link to="/produto/$slug" params={{ slug: produto.slug }} className="line-clamp-2 font-semibold hover:text-primary">
                    {produto.nome}
                  </Link>
                  <p className="text-xs text-muted-foreground">{produto.categoria} · {produto.marca}</p>
                  <div className="mt-3 flex items-center gap-3">
                    <div className="flex items-center rounded-lg border border-border">
                      <Button variant="ghost" size="icon" aria-label="Diminuir quantidade" onClick={() => alterarQtd(produto.id, qtd - 1)}>
                        <Minus />
                      </Button>
                      <span className="w-8 text-center text-sm tabular-nums">{qtd}</span>
                      <Button variant="ghost" size="icon" aria-label="Aumentar quantidade" onClick={() => alterarQtd(produto.id, qtd + 1)}>
                        <Plus />
                      </Button>
                    </div>
                    <Button variant="ghost" size="icon" aria-label={`Remover ${produto.nome}`} onClick={() => remover(produto.id)}>
                      <Trash2 className="text-destructive" />
                    </Button>
                  </div>
                </div>
                <p className="col-span-2 text-right font-bold sm:col-span-1">{brl(produto.preco * qtd)}</p>
              </li>
            ))}
          </ul>

          <aside className="h-fit rounded-2xl border border-border bg-card p-6">
            <h2 className="text-lg font-extrabold">Resumo</h2>
            <form onSubmit={aplicarCupom} className="mt-4 flex gap-2">
              <label htmlFor="cupom" className="sr-only">Cupom de desconto</label>
              <input
                id="cupom"
                value={cupom}
                onChange={(e) => setCupom(e.target.value)}
                maxLength={20}
                placeholder="Cupom (FAVARIM10)"
                className="h-10 flex-1 rounded-lg border border-input bg-secondary px-3 text-sm outline-none focus:border-primary"
              />
              <Button type="submit" variant="ink">Aplicar</Button>
            </form>
            <dl className="mt-5 grid gap-2 border-t border-border pt-5 text-sm">
              <div className="flex justify-between"><dt className="text-muted-foreground">Subtotal</dt><dd>{brl(subtotal)}</dd></div>
              {aplicado > 0 && (
                <div className="flex justify-between text-success"><dt>Desconto</dt><dd>-{brl(subtotal * aplicado)}</dd></div>
              )}
              <div className="flex justify-between"><dt className="text-muted-foreground">Frete</dt><dd>{frete === 0 ? "Grátis" : brl(frete)}</dd></div>
              <div className="mt-2 flex justify-between border-t border-border pt-3 text-lg font-extrabold"><dt>Total</dt><dd>{brl(total)}</dd></div>
            </dl>
            <Button variant="hero" size="xl" asChild className="mt-5 w-full">
              <Link to="/checkout">Finalizar Compra</Link>
            </Button>
          </aside>
        </div>
      )}
    </div>
  );
}