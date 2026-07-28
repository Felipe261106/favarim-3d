import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Heart, Menu, Moon, Search, ShoppingCart, Sun, User, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PRODUTOS } from "@/lib/catalog";
import { useLoja } from "@/lib/store";
import { cn } from "@/lib/utils";

const LINKS = [
  { label: "Início", to: "/" },
  { label: "Produtos", to: "/produtos" },
  { label: "Categorias", to: "/produtos", hash: "categorias" },
  { label: "Promoções", to: "/produtos", search: { promo: true } },
  { label: "Sobre", to: "/sobre" },
  { label: "Contato", to: "/contato" },
] as const;

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  const [busca, setBusca] = useState("");
  const [aberto, setAberto] = useState(false);
  const navigate = useNavigate();
  const boxRef = useRef<HTMLDivElement>(null);
  const { totalItens, favoritos, tema, alternarTema } = useLoja();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setAberto(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const sugestoes = busca.trim().length > 1
    ? PRODUTOS.filter((p) => `${p.nome} ${p.categoria} ${p.marca}`.toLowerCase().includes(busca.toLowerCase())).slice(0, 6)
    : [];

  const submeter = (e: React.FormEvent) => {
    e.preventDefault();
    setAberto(false);
    navigate({ to: "/produtos", search: { q: busca } });
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b border-border/70 backdrop-blur transition-all",
        scrolled ? "bg-background/95 shadow-[var(--shadow-card)]" : "bg-background",
      )}
    >
      <div className="mx-auto grid max-w-7xl grid-cols-[auto_1fr_auto] items-center gap-3 px-4 py-3 lg:gap-6">
        <Link to="/" className="flex min-w-0 items-center gap-2" aria-label="Favarim 3D — página inicial">
          <span className="grid size-9 shrink-0 place-items-center rounded-xl gradient-primary text-sm font-black text-primary-foreground">
            F3
          </span>
          <span className="truncate text-lg font-extrabold tracking-tight">
            Favarim<span className="text-primary">3D</span>
          </span>
        </Link>

        {/* Barra de pesquisa inteligente */}
        <div ref={boxRef} className="relative hidden md:block">
          <form onSubmit={submeter} role="search">
            <label htmlFor="busca-topo" className="sr-only">
              Pesquisar produtos
            </label>
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <input
              id="busca-topo"
              value={busca}
              onChange={(e) => {
                setBusca(e.target.value);
                setAberto(true);
              }}
              placeholder="Busque por filamento, impressora, bico..."
              className="h-11 w-full rounded-xl border border-input bg-secondary pl-10 pr-4 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:bg-background focus:ring-2 focus:ring-ring/30"
            />
          </form>
          {aberto && sugestoes.length > 0 && (
            <ul className="absolute z-50 mt-2 w-full overflow-hidden rounded-xl border border-border bg-popover shadow-[var(--shadow-elevated)]">
              {sugestoes.map((p) => (
                <li key={p.id}>
                  <Link
                    to="/produto/$slug"
                    params={{ slug: p.slug }}
                    onClick={() => setAberto(false)}
                    className="flex items-center gap-3 px-3 py-2 text-sm hover:bg-accent"
                  >
                    <img src={p.imagem} alt="" width={40} height={40} loading="lazy" className="size-10 rounded-md object-cover" />
                    <span className="min-w-0 flex-1 truncate">{p.nome}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" aria-label="Alternar modo escuro" onClick={alternarTema}>
            {tema === "dark" ? <Sun /> : <Moon />}
          </Button>
          <Button variant="ghost" size="icon" asChild aria-label={`Favoritos (${favoritos.length})`}>
            <Link to="/conta" hash="favoritos">
              <Heart />
            </Link>
          </Button>
          <Button variant="ghost" size="icon" asChild aria-label="Entrar na conta">
            <Link to="/login">
              <User />
            </Link>
          </Button>
          <Button variant="ghost" size="icon" asChild aria-label={`Carrinho com ${totalItens} itens`}>
            <Link to="/carrinho" className="relative">
              <ShoppingCart />
              {totalItens > 0 && (
                <span className="absolute -right-0.5 -top-0.5 grid min-w-4 place-items-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground">
                  {totalItens}
                </span>
              )}
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            aria-label={menu ? "Fechar menu" : "Abrir menu"}
            aria-expanded={menu}
            onClick={() => setMenu((m) => !m)}
          >
            {menu ? <X /> : <Menu />}
          </Button>
        </div>
      </div>

      {/* Navegação desktop */}
      <nav aria-label="Principal" className="hidden border-t border-border/70 lg:block">
        <ul className="mx-auto flex max-w-7xl items-center gap-1 px-4">
          {LINKS.map((l) => (
            <li key={l.label}>
              <Link
                to={l.to}
                search={"search" in l ? (l.search as never) : undefined}
                hash={"hash" in l ? (l.hash as string) : undefined}
                className="inline-block px-3 py-3 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Menu mobile */}
      {menu && (
        <nav aria-label="Menu mobile" className="border-t border-border bg-background px-4 pb-4 lg:hidden">
          <form onSubmit={submeter} role="search" className="py-3">
            <label htmlFor="busca-mobile" className="sr-only">
              Pesquisar produtos
            </label>
            <input
              id="busca-mobile"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="O que você procura?"
              className="h-11 w-full rounded-xl border border-input bg-secondary px-4 text-sm outline-none focus:border-primary"
            />
          </form>
          <ul className="grid gap-1">
            {LINKS.map((l) => (
              <li key={l.label}>
                <Link
                  to={l.to}
                  search={"search" in l ? (l.search as never) : undefined}
                  onClick={() => setMenu(false)}
                  className="block rounded-lg px-3 py-3 text-sm font-medium hover:bg-accent"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}