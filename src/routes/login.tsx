import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/login")({
  component: Login,
  head: () => ({
    meta: [
      { title: "Entrar na sua conta | Favarim 3D" },
      { name: "description", content: "Acesse sua conta Favarim 3D para acompanhar pedidos, favoritos e endereços." },
      { property: "og:title", content: "Login | Favarim 3D" },
      { property: "og:description", content: "Acesse sua conta Favarim 3D." },
      { property: "og:url", content: "/login" },
    ],
    links: [{ rel: "canonical", href: "/login" }],
  }),
});

function Login() {
  const [modo, setModo] = useState<"entrar" | "cadastrar">("entrar");

  const enviar = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const dados = new FormData(e.currentTarget);
    const email = String(dados.get("email") ?? "").trim();
    const senha = String(dados.get("senha") ?? "");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return toast.error("E-mail inválido");
    if (senha.length < 6) return toast.error("A senha precisa ter ao menos 6 caracteres");
    localStorage.setItem("f3d:usuario", JSON.stringify({ email }));
    toast.success(modo === "entrar" ? "Bem-vindo de volta!" : "Conta criada com sucesso!");
  };

  return (
    <div className="mx-auto grid max-w-md px-4 py-16">
      <div className="rounded-3xl border border-border bg-card p-8 shadow-[var(--shadow-card)]">
        <h1 className="text-2xl font-extrabold tracking-tight">
          {modo === "entrar" ? "Entrar" : "Criar conta"}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {modo === "entrar" ? "Acesse seus pedidos e favoritos." : "Leva menos de um minuto."}
        </p>

        <Button
          variant="outline"
          size="xl"
          className="mt-6 w-full"
          onClick={() => toast("Login com Google", { description: "Pronto para integração com Google/Firebase." })}
        >
          Continuar com Google
        </Button>

        <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
          <span className="h-px flex-1 bg-border" /> ou <span className="h-px flex-1 bg-border" />
        </div>

        <form onSubmit={enviar} className="grid gap-4">
          {modo === "cadastrar" && (
            <div>
              <label htmlFor="nome" className="text-sm font-medium">Nome completo</label>
              <input id="nome" name="nome" required maxLength={100} className="mt-1 h-11 w-full rounded-lg border border-input bg-secondary px-3 text-sm outline-none focus:border-primary focus:bg-background" />
            </div>
          )}
          <div>
            <label htmlFor="email" className="text-sm font-medium">E-mail</label>
            <input id="email" name="email" type="email" required maxLength={255} className="mt-1 h-11 w-full rounded-lg border border-input bg-secondary px-3 text-sm outline-none focus:border-primary focus:bg-background" />
          </div>
          <div>
            <label htmlFor="senha" className="text-sm font-medium">Senha</label>
            <input id="senha" name="senha" type="password" required minLength={6} maxLength={72} className="mt-1 h-11 w-full rounded-lg border border-input bg-secondary px-3 text-sm outline-none focus:border-primary focus:bg-background" />
          </div>
          <Button type="submit" variant="hero" size="xl">
            {modo === "entrar" ? "Entrar" : "Cadastrar-se"}
          </Button>
        </form>

        <div className="mt-6 flex flex-wrap justify-between gap-2 text-sm">
          <button
            type="button"
            className="text-primary hover:underline"
            onClick={() => setModo(modo === "entrar" ? "cadastrar" : "entrar")}
          >
            {modo === "entrar" ? "Criar uma conta" : "Já tenho conta"}
          </button>
          <button
            type="button"
            className="text-muted-foreground hover:text-primary"
            onClick={() => toast("Enviamos as instruções para o seu e-mail")}
          >
            Recuperar senha
          </button>
        </div>
      </div>
      <p className="mt-6 text-center text-xs text-muted-foreground">
        Ao continuar você aceita nossos <Link to="/sobre" className="text-primary hover:underline">termos de uso</Link>.
      </p>
    </div>
  );
}