import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Check } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { brl } from "@/lib/catalog";
import { itensDetalhados, useLoja } from "@/lib/store";

export const Route = createFileRoute("/_authenticated/checkout")({
  component: Checkout,
  head: () => ({
    meta: [
      { title: "Checkout seguro | Favarim 3D" },
      { name: "description", content: "Finalize seu pedido em etapas simples e seguras na Favarim 3D." },
      { property: "og:title", content: "Checkout | Favarim 3D" },
      { property: "og:description", content: "Dados, endereço, entrega, pagamento e resumo." },
      { property: "og:url", content: "/checkout" },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: "/checkout" }],
  }),
});

const ETAPAS = ["Dados pessoais", "Endereço", "Entrega", "Pagamento", "Resumo"];

const campo = (id: string, label: string, tipo = "text", ph = "") => (
  <div key={id}>
    <label htmlFor={id} className="text-sm font-medium">{label}</label>
    <input
      id={id}
      name={id}
      type={tipo}
      required
      maxLength={120}
      placeholder={ph}
      className="mt-1 h-11 w-full rounded-lg border border-input bg-secondary px-3 text-sm outline-none focus:border-primary focus:bg-background"
    />
  </div>
);

function Checkout() {
  const [etapa, setEtapa] = useState(0);
  const [entrega, setEntrega] = useState("expressa");
  const [pagamento, setPagamento] = useState("pix");
  const { carrinho, subtotal, limpar } = useLoja();
  const itens = itensDetalhados(carrinho);
  const frete = entrega === "expressa" && subtotal < 199 ? 34.9 : 0;
  const total = subtotal + frete;

  const avancar = (e: React.FormEvent) => {
    e.preventDefault();
    setEtapa((s) => Math.min(ETAPAS.length - 1, s + 1));
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-3xl font-extrabold tracking-tight">Checkout</h1>

      {/* Passos */}
      <ol className="mt-6 flex flex-wrap gap-2" aria-label="Etapas do checkout">
        {ETAPAS.map((e, i) => (
          <li
            key={e}
            aria-current={i === etapa ? "step" : undefined}
            className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium ${
              i < etapa
                ? "border-success/40 bg-success/10 text-success"
                : i === etapa
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border text-muted-foreground"
            }`}
          >
            {i < etapa ? <Check className="size-3.5" aria-hidden="true" /> : <span>{i + 1}</span>}
            {e}
          </li>
        ))}
      </ol>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
        <form onSubmit={avancar} className="grid gap-4 rounded-2xl border border-border bg-card p-6">
          {etapa === 0 && (
            <>
              <h2 className="text-lg font-bold">Dados pessoais</h2>
              {campo("nome", "Nome completo")}
              {campo("email", "E-mail", "email", "voce@exemplo.com")}
              {campo("cpf", "CPF", "text", "000.000.000-00")}
              {campo("tel", "Telefone", "tel", "(00) 00000-0000")}
            </>
          )}
          {etapa === 1 && (
            <>
              <h2 className="text-lg font-bold">Endereço de entrega</h2>
              {campo("cep", "CEP", "text", "00000-000")}
              {campo("rua", "Rua e número")}
              {campo("bairro", "Bairro")}
              {campo("cidade", "Cidade / Estado")}
            </>
          )}
          {etapa === 2 && (
            <>
              <h2 className="text-lg font-bold">Forma de entrega</h2>
              {[
                { v: "expressa", t: "Expressa — 1 a 2 dias úteis", p: subtotal >= 199 ? "Grátis" : brl(34.9) },
                { v: "padrao", t: "Padrão — 4 a 8 dias úteis", p: "Grátis" },
              ].map((o) => (
                <label key={o.v} className="flex cursor-pointer items-center justify-between rounded-xl border border-border p-4 text-sm has-[:checked]:border-primary has-[:checked]:bg-accent">
                  <span className="flex items-center gap-3">
                    <input type="radio" name="entrega" value={o.v} checked={entrega === o.v} onChange={() => setEntrega(o.v)} className="size-4 accent-primary" />
                    {o.t}
                  </span>
                  <span className="font-semibold">{o.p}</span>
                </label>
              ))}
            </>
          )}
          {etapa === 3 && (
            <>
              <h2 className="text-lg font-bold">Pagamento</h2>
              {[
                { v: "pix", t: "PIX — 5% de desconto" },
                { v: "cartao", t: "Cartão de crédito — até 12x sem juros" },
                { v: "boleto", t: "Boleto bancário" },
              ].map((o) => (
                <label key={o.v} className="flex cursor-pointer items-center gap-3 rounded-xl border border-border p-4 text-sm has-[:checked]:border-primary has-[:checked]:bg-accent">
                  <input type="radio" name="pagamento" value={o.v} checked={pagamento === o.v} onChange={() => setPagamento(o.v)} className="size-4 accent-primary" />
                  {o.t}
                </label>
              ))}
              <p className="text-xs text-muted-foreground">
                Ambiente preparado para integração com Mercado Pago, Stripe ou PagSeguro.
              </p>
            </>
          )}
          {etapa === 4 && (
            <>
              <h2 className="text-lg font-bold">Resumo do pedido</h2>
              <ul className="grid gap-2 text-sm">
                {itens.map(({ produto, qtd }) => (
                  <li key={produto.id} className="flex justify-between gap-4">
                    <span className="min-w-0 truncate">{qtd}× {produto.nome}</span>
                    <span>{brl(produto.preco * qtd)}</span>
                  </li>
                ))}
              </ul>
              <p className="text-sm text-muted-foreground">Entrega {entrega} · Pagamento via {pagamento}</p>
            </>
          )}

          <div className="mt-2 flex gap-3">
            {etapa > 0 && (
              <Button type="button" variant="outline" size="lg" onClick={() => setEtapa((s) => s - 1)}>
                Voltar
              </Button>
            )}
            {etapa < ETAPAS.length - 1 ? (
              <Button type="submit" variant="hero" size="lg">Continuar</Button>
            ) : (
              <Button
                type="button"
                variant="hero"
                size="lg"
                disabled={itens.length === 0}
                onClick={() => {
                  limpar();
                  toast.success("Pedido confirmado!", { description: "Você receberá os detalhes por e-mail." });
                  setEtapa(0);
                }}
              >
                Confirmar pedido
              </Button>
            )}
          </div>
        </form>

        <aside className="h-fit rounded-2xl border border-border bg-card p-6">
          <h2 className="font-extrabold">Total do pedido</h2>
          <dl className="mt-4 grid gap-2 text-sm">
            <div className="flex justify-between"><dt className="text-muted-foreground">Subtotal</dt><dd>{brl(subtotal)}</dd></div>
            <div className="flex justify-between"><dt className="text-muted-foreground">Frete</dt><dd>{frete === 0 ? "Grátis" : brl(frete)}</dd></div>
            <div className="mt-2 flex justify-between border-t border-border pt-3 text-lg font-extrabold"><dt>Total</dt><dd>{brl(total)}</dd></div>
          </dl>
          <Button variant="ghost" asChild className="mt-4 w-full">
            <Link to="/carrinho">Editar carrinho</Link>
          </Button>
        </aside>
      </div>
    </div>
  );
}