import { createFileRoute } from "@tanstack/react-router";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/contato")({
  component: Contato,
  head: () => ({
    meta: [
      { title: "Fale com a Favarim 3D — contato e suporte" },
      { name: "description", content: "Tire dúvidas sobre impressoras, filamentos e pedidos: telefone, WhatsApp, e-mail e formulário." },
      { property: "og:title", content: "Contato | Favarim 3D" },
      { property: "og:description", content: "Telefone, WhatsApp, e-mail e formulário de atendimento." },
      { property: "og:url", content: "/contato" },
    ],
    links: [{ rel: "canonical", href: "/contato" }],
  }),
});

function Contato() {
  const enviar = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const nome = String(f.get("nome") ?? "").trim();
    const email = String(f.get("email") ?? "").trim();
    const msg = String(f.get("mensagem") ?? "").trim();
    if (nome.length < 2) return toast.error("Informe seu nome");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return toast.error("E-mail inválido");
    if (msg.length < 10) return toast.error("Escreva uma mensagem com pelo menos 10 caracteres");
    toast.success("Mensagem enviada!", { description: "Respondemos em até 1 dia útil." });
    e.currentTarget.reset();
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="text-3xl font-extrabold tracking-tight">Fale com a gente</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Atendimento de segunda a sexta, das 8h às 18h.
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
        <form onSubmit={enviar} className="grid gap-4 rounded-2xl border border-border bg-card p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="nome" className="text-sm font-medium">Nome</label>
              <input id="nome" name="nome" required maxLength={100} className="mt-1 h-11 w-full rounded-lg border border-input bg-secondary px-3 text-sm outline-none focus:border-primary focus:bg-background" />
            </div>
            <div>
              <label htmlFor="email" className="text-sm font-medium">E-mail</label>
              <input id="email" name="email" type="email" required maxLength={255} className="mt-1 h-11 w-full rounded-lg border border-input bg-secondary px-3 text-sm outline-none focus:border-primary focus:bg-background" />
            </div>
          </div>
          <div>
            <label htmlFor="assunto" className="text-sm font-medium">Assunto</label>
            <input id="assunto" name="assunto" maxLength={120} className="mt-1 h-11 w-full rounded-lg border border-input bg-secondary px-3 text-sm outline-none focus:border-primary focus:bg-background" />
          </div>
          <div>
            <label htmlFor="mensagem" className="text-sm font-medium">Mensagem</label>
            <textarea id="mensagem" name="mensagem" rows={6} required maxLength={1000} className="mt-1 w-full rounded-lg border border-input bg-secondary p-3 text-sm outline-none focus:border-primary focus:bg-background" />
          </div>
          <Button type="submit" variant="hero" size="xl" className="justify-self-start">Enviar mensagem</Button>
        </form>

        <aside className="grid h-fit gap-4">
          <ul className="grid gap-3 rounded-2xl border border-border bg-card p-6 text-sm">
            <li className="flex gap-3"><Phone className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" /> (44) 99999-9999</li>
            <li className="flex gap-3"><MessageCircle className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
              <a href="https://wa.me/5544999999999" className="hover:text-primary">WhatsApp da loja</a>
            </li>
            <li className="flex gap-3"><Mail className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" /> contato@favarim3d.com.br</li>
            <li className="flex gap-3"><MapPin className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" /> Av. Brasil, 1200 — Maringá/PR</li>
          </ul>
          <div className="overflow-hidden rounded-2xl border border-border">
            <iframe
              title="Mapa com a localização da Favarim 3D"
              src="https://www.openstreetmap.org/export/embed.html?bbox=-51.95%2C-23.44%2C-51.90%2C-23.40&layer=mapnik"
              className="h-64 w-full"
              loading="lazy"
            />
          </div>
        </aside>
      </div>
    </div>
  );
}