import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

/** Avaliação em estrelas, acessível via aria-label. */
export function Stars({ nota, size = 14, className }: { nota: number; size?: number; className?: string }) {
  return (
    <span
      className={cn("inline-flex items-center gap-0.5", className)}
      role="img"
      aria-label={`Avaliação ${nota.toFixed(1)} de 5`}
    >
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          width={size}
          height={size}
          aria-hidden="true"
          className={cn(
            i <= Math.round(nota) ? "fill-warning text-warning" : "text-muted-foreground/40",
          )}
        />
      ))}
    </span>
  );
}