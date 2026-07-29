import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/reset-password")({
  component: ResetPassword,
  head: () => ({
    meta: [
      { title: "Redefinir senha | Favarim 3D" },
      { name: "description", content: "Defina uma nova senha para acessar sua conta Favarim 3D." },
      { property: "og:title", content: "Redefinir senha | Favarim 3D" },
      { property: "og:description", content: "Defina uma nova senha da sua conta Favarim 3D." },
      { name: "robots", content: "noindex" },
    ],
  }),
});

function ResetPassword() {
  const [senha, setSenha] = useState("");
  const navigate = useNavigate();

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (senha.length < 6) return toast.error("A senha precisa ter ao menos 6 caracteres");
    const { error } = await supabase.auth.updateUser({ password: senha });
    if (error) return toast.error(error.message);
    toast.success("Senha atualizada com sucesso");
    navigate({ to: "/conta", replace: true });
  };

  return (
    <div className="mx-auto grid max-w-md px-4 py-16">
      <form onSubmit={enviar} className="rounded-3xl border border-border bg-card p-8 shadow-[var(--shadow-card)]">
        <h1 className="text-2xl font-extrabold tracking-tight">Nova senha</h1>
        <label htmlFor="nova-senha" className="mt-6 block text-sm font-medium">Senha</label>
        <input
          id="nova-senha"
          type="password"
          value={senha}
          minLength={6}
          maxLength={72}
          onChange={(e) => setSenha(e.target.value)}
          className="mt-1 h-11 w-full rounded-lg border border-input bg-secondary px-3 text-sm outline-none focus:border-primary focus:bg-background"
        />
        <Button type="submit" variant="hero" size="xl" className="mt-6 w-full">Salvar senha</Button>
      </form>
    </div>
  );
}