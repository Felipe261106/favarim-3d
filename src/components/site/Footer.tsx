import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Mail, MapPin, MessageCircle, Phone } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-border bg-secondary/60">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="grid size-9 place-items-center rounded-xl gradient-primary text-sm font-black text-primary-foreground">
              F3
            </span>
            <span className="text-lg font-extrabold">
              Favarim<span className="text-primary">3D</span>
            </span>
          </div>
          <p className="mt-4 max-w-xs text-sm text-muted-foreground">
            Filamentos, impressoras, peças e acessórios com qualidade profissional para makers e
            indústrias.
          </p>
          <div className="mt-5 flex gap-2">
            <a href="https://wa.me/5544999999999" aria-label="WhatsApp da Favarim 3D" className="grid size-10 place-items-center rounded-xl border border-border bg-background transition-colors hover:border-primary hover:text-primary">
              <MessageCircle className="size-4" aria-hidden="true" />
            </a>
            <a href="https://instagram.com" aria-label="Instagram da Favarim 3D" className="grid size-10 place-items-center rounded-xl border border-border bg-background transition-colors hover:border-primary hover:text-primary">
              <Instagram className="size-4" aria-hidden="true" />
            </a>
            <a href="https://facebook.com" aria-label="Facebook da Favarim 3D" className="grid size-10 place-items-center rounded-xl border border-border bg-background transition-colors hover:border-primary hover:text-primary">
              <Facebook className="size-4" aria-hidden="true" />
            </a>
            <a href="mailto:contato@favarim3d.com.br" aria-label="E-mail da Favarim 3D" className="grid size-10 place-items-center rounded-xl border border-border bg-background transition-colors hover:border-primary hover:text-primary">
              <Mail className="size-4" aria-hidden="true" />
            </a>
          </div>
        </div>

        <div>
          <h2 className="text-sm font-bold uppercase tracking-wide">Links úteis</h2>
          <ul className="mt-4 grid gap-2 text-sm text-muted-foreground">
            <li><Link to="/produtos" className="hover:text-primary">Todos os produtos</Link></li>
            <li><Link to="/produtos" search={{ promo: true }} className="hover:text-primary">Promoções</Link></li>
            <li><Link to="/conta" className="hover:text-primary">Meus pedidos</Link></li>
            <li><Link to="/sobre" className="hover:text-primary">Política de Privacidade</Link></li>
            <li><Link to="/sobre" className="hover:text-primary">Trocas e devoluções</Link></li>
            <li><Link to="/sobre" className="hover:text-primary">Termos de uso</Link></li>
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-bold uppercase tracking-wide">Contato</h2>
          <ul className="mt-4 grid gap-3 text-sm text-muted-foreground">
            <li className="flex gap-2"><Phone className="mt-0.5 size-4 shrink-0" aria-hidden="true" /> (44) 99999-9999</li>
            <li className="flex gap-2"><Mail className="mt-0.5 size-4 shrink-0" aria-hidden="true" /> contato@favarim3d.com.br</li>
            <li className="flex gap-2"><MapPin className="mt-0.5 size-4 shrink-0" aria-hidden="true" /> Av. Brasil, 1200 — Maringá/PR</li>
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-bold uppercase tracking-wide">Onde estamos</h2>
          <div className="mt-4 overflow-hidden rounded-xl border border-border">
            <iframe
              title="Mapa da loja Favarim 3D"
              src="https://www.openstreetmap.org/export/embed.html?bbox=-51.95%2C-23.44%2C-51.90%2C-23.40&layer=mapnik"
              className="h-40 w-full"
              loading="lazy"
            />
          </div>
        </div>
      </div>

      <div className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Favarim 3D. Todos os direitos reservados. CNPJ 00.000.000/0001-00
      </div>
    </footer>
  );
}