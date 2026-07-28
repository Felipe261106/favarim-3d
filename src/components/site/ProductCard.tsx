import { Link } from "@tanstack/react-router";
import { Heart, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { brl, desconto, type Product } from "@/lib/catalog";
import { useLoja } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Stars } from "./Stars";

/** Card de produto usado na home, catálogo e relacionados. */
export function ProductCard({ produto }: { produto: Product }) {
  const { adicionar, favoritar, favoritos } = useLoja();
  const off = desconto(produto);
  const favorito = favoritos.includes(produto.id);

  return (
    <article className="card-hover group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-card)]">
      <div className="relative aspect-square overflow-hidden bg-secondary">
        <Link to="/produto/$slug" params={{ slug: produto.slug }} aria-label={produto.nome}>
          <img
            src={produto.imagem}
            alt={produto.nome}
            width={800}
            height={800}
            loading="lazy"
            className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </Link>
        {off > 0 && (
          <span className="absolute left-3 top-3 rounded-full bg-destructive px-2.5 py-1 text-xs font-semibold text-destructive-foreground">
            -{off}%
          </span>
        )}
        {produto.estoque === 0 && (
          <span className="absolute left-3 bottom-3 rounded-full bg-ink px-2.5 py-1 text-xs font-medium text-ink-foreground">
            Esgotado
          </span>
        )}
        <Button
          type="button"
          variant="secondary"
          size="icon"
          aria-label={favorito ? `Remover ${produto.nome} dos favoritos` : `Favoritar ${produto.nome}`}
          aria-pressed={favorito}
          onClick={() => favoritar(produto.id)}
          className="absolute right-3 top-3 rounded-full shadow-sm"
        >
          <Heart className={cn(favorito && "fill-destructive text-destructive")} />
        </Button>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-primary">{produto.categoria}</p>
        <h3 className="line-clamp-2 text-sm font-semibold leading-snug">
          <Link to="/produto/$slug" params={{ slug: produto.slug }} className="hover:text-primary">
            {produto.nome}
          </Link>
        </h3>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Stars nota={produto.nota} />
          <span>({produto.avaliacoes})</span>
        </div>
        <div className="mt-auto pt-2">
          {produto.precoAntigo && (
            <p className="text-xs text-muted-foreground line-through">{brl(produto.precoAntigo)}</p>
          )}
          <p className="text-xl font-bold tracking-tight">{brl(produto.preco)}</p>
          <p className="text-xs text-muted-foreground">
            12x de {brl(produto.preco / 12)} sem juros
          </p>
        </div>
        <div className="mt-3 grid grid-cols-[1fr_auto] gap-2">
          <Button
            variant="hero"
            disabled={produto.estoque === 0}
            onClick={() => adicionar(produto.id)}
            aria-label={`Comprar ${produto.nome}`}
          >
            Comprar
          </Button>
          <Button
            variant="cart"
            size="icon"
            disabled={produto.estoque === 0}
            onClick={() => adicionar(produto.id)}
            aria-label={`Adicionar ${produto.nome} ao carrinho`}
          >
            <ShoppingCart />
          </Button>
        </div>
      </div>
    </article>
  );
}