import { useEffect, useState } from "react";
import { ArrowUp, MessageCircle } from "lucide-react";

/** Botão flutuante do WhatsApp + voltar ao topo. */
export function FloatingButtons() {
  const [visivel, setVisivel] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisivel(window.scrollY > 500);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-3">
      {visivel && (
        <button
          type="button"
          aria-label="Voltar ao topo"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="grid size-12 place-items-center rounded-full border border-border bg-card shadow-[var(--shadow-card)] transition-transform hover:-translate-y-0.5"
        >
          <ArrowUp className="size-5" aria-hidden="true" />
        </button>
      )}
      <a
        href="https://wa.me/5544999999999"
        target="_blank"
        rel="noreferrer"
        aria-label="Falar no WhatsApp"
        className="grid size-14 place-items-center rounded-full bg-success text-primary-foreground shadow-[var(--shadow-elevated)] transition-transform hover:scale-105"
      >
        <MessageCircle className="size-6" aria-hidden="true" />
      </a>
    </div>
  );
}