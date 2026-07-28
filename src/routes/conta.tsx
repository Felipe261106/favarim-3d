import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/site/ProductCard";
import { PRODUTOS, brl } from "@/lib/catalog";
import { useLoja } from "@/lib/store";

export const Route = createFileRoute("/conta")({
  component: Conta,
  head: () => ({
    meta: [
      { title: "Minha conta | Favarim 3D" },
      { name: "description", content: "Acompanhe pedidos, endereços, favoritos e seus dados pessoais na Favarim 3D." },
      { property: "og:title", content: "Painel do cliente | Favarim 3D" },
      { property: "og:description", content: "Pedidos, endereços, favoritos e dados pessoais." },
      { property: "og:url", content: "/conta" },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: "/conta" }],
  }),
});

const ABAS = ["Pedidos", "Endereços", "Favoritos", "Dados pessoais", "Alterar senha"] as const;

const PEDIDOS = [
  { id: "#10241", data: "12/07/2026", status: "Entregue", total: 289.8 },
  { id: "#10188", data: "28/06/2026", status: "Em transporte", total: 4299 },
  { id: "#10122", data: "03/06/2026", status: "Cancelado", total: 149.9 },
];

function Conta() {
  const [aba, setAba] = useState<(typeof ABAS)[number]>("Pedidos");
  const { favoritos } = useLoja();
  const produtosFavoritos = PRODUTOS.filter((p) => favoritos.includes(p.id));

  const input = (id: string, label: string, tipo = "text", valor = "") => (
    <div>
      <label htmlFor={id} className="text-sm font-medium">{label}</label>
      <input id={id} name={id} type={tipo} defaultValue={valor} maxLength={120} className="mt-1 h-11 w-full rounded-lg border border-input bg-secondary px-3 text-sm outline-none focus:border-primary focus:bg-background" />
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="text-3xl font-extrabold tracking-tight">Painel do cliente</h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-[240px_1fr]">
        <nav aria-label="Seções da conta">
          <ul className="grid gap-1">
            {ABAS.map((a) => (
              <li key={a}>
                <button
                  type="button"
                  aria-current={aba === a}
                  onClick={() => setAba(a)}
                  className={`w-full rounded-lg px-4 py-3 text-left text-sm font-medium transition-colors ${aba === a ? "bg-primary text-primary-foreground" : "hover:bg-accent"}`}
                >
                  {a}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <section className="rounded-2xl border border-border bg-card p-6" id="favoritos">
          {aba === "Pedidos" && (
            <>
              <h2 className="text-lg font-bold">Meus pedidos</h2>
              <ul className="mt-4 grid gap-3">
                {PEDIDOS.map((p) => (
                  <li key={p.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 rounded-xl border border-border p-4 text-sm">
                    <div className="min-w-0">
                      <p className="font-semibold">{p.id}</p>
                      <p className="text-muted-foreground">{p.data} · {p.status}</p>
                    </div>
                    <p className="font-bold">{brl(p.total)}</p>
                  </li>
                ))}
              </ul>
            </>
          )}

          {aba === "Endereços" && (
            <>
              <h2 className="text-lg font-bold">Endereços</h2>
              <div className="mt-4 rounded-xl border border-border p-4 text-sm">
                <p className="font-semibold">Casa</p>
                <p className="text-muted-foreground">Av. Brasil, 1200 — Centro, Maringá/PR — 87013-000</p>
              </div>
              <Button variant="ink" className="mt-4" onClick={() => toast("Novo endereço adicionado")}>
                Adicionar endereço
              </Button>
            </>
          )}

          {aba === "Favoritos" && (
            <>
              <h2 className="text-lg font-bold">Favoritos</h2>
              {produtosFavoritos.length === 0 ? (
                <p className="mt-4 text-sm text-muted-foreground">Você ainda não favoritou nenhum produto.</p>
              ) : (
                <div className="mt-4 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {produtosFavoritos.map((p) => (
                    <ProductCard key={p.id} produto={p} />
                  ))}
                </div>
              )}
            </>
          )}

          {aba === "Dados pessoais" && (
            <form
              className="grid max-w-md gap-4"
              onSubmit={(e) => {
                e.preventDefault();
                toast.success("Dados atualizados");
              }}
            >
              <h2 className="text-lg font-bold">Dados pessoais</h2>
              {input("nome", "Nome completo", "text", "Cliente Favarim")}
              {input("email", "E-mail", "email", "cliente@favarim3d.com.br")}
              {input("telefone", "Telefone", "tel", "(44) 99999-9999")}
              <Button type="submit" variant="hero" size="lg">Salvar alterações</Button>
            </form>
          )}

          {aba === "Alterar senha" && (
            <form
              className="grid max-w-md gap-4"
              onSubmit={(e) => {
                e.preventDefault();
                const f = new FormData(e.currentTarget);
                if (String(f.get("nova")).length < 6) return toast.error("A nova senha precisa ter 6+ caracteres");
                if (f.get("nova") !== f.get("confirma")) return toast.error("As senhas não conferem");
                toast.success("Senha alterada com sucesso");
              }}
            >
              <h2 className="text-lg font-bold">Alterar senha</h2>
              {input("atual", "Senha atual", "password")}
              {input("nova", "Nova senha", "password")}
              {input("confirma", "Confirmar nova senha", "password")}
              <Button type="submit" variant="hero" size="lg">Atualizar senha</Button>
            </form>
          )}
        </section>
      </div>
    </div>
  );
}