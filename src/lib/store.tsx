/**
 * Estado global da loja (carrinho, favoritos, vistos e tema).
 * Persistência 100% em LocalStorage — pronto para trocar por API futuramente.
 */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { PRODUTOS, type Product } from "./catalog";

export type CartItem = { id: string; qtd: number };

type LojaContexto = {
  carrinho: CartItem[];
  favoritos: string[];
  vistos: string[];
  totalItens: number;
  subtotal: number;
  tema: "light" | "dark";
  adicionar: (id: string, qtd?: number) => void;
  remover: (id: string) => void;
  alterarQtd: (id: string, qtd: number) => void;
  limpar: () => void;
  favoritar: (id: string) => void;
  registrarVisto: (id: string) => void;
  alternarTema: () => void;
};

const Ctx = createContext<LojaContexto | null>(null);

const ler = <T,>(chave: string, padrao: T): T => {
  if (typeof window === "undefined") return padrao;
  try {
    const v = window.localStorage.getItem(chave);
    return v ? (JSON.parse(v) as T) : padrao;
  } catch {
    return padrao;
  }
};

export function LojaProvider({ children }: { children: React.ReactNode }) {
  const [carrinho, setCarrinho] = useState<CartItem[]>([]);
  const [favoritos, setFavoritos] = useState<string[]>([]);
  const [vistos, setVistos] = useState<string[]>([]);
  const [tema, setTema] = useState<"light" | "dark">("light");
  const [pronto, setPronto] = useState(false);

  // Hidrata a partir do LocalStorage somente no cliente (evita mismatch de SSR)
  useEffect(() => {
    setCarrinho(ler<CartItem[]>("f3d:carrinho", []));
    setFavoritos(ler<string[]>("f3d:favoritos", []));
    setVistos(ler<string[]>("f3d:vistos", []));
    setTema(ler<"light" | "dark">("f3d:tema", "light"));
    setPronto(true);
  }, []);

  useEffect(() => {
    if (pronto) localStorage.setItem("f3d:carrinho", JSON.stringify(carrinho));
  }, [carrinho, pronto]);
  useEffect(() => {
    if (pronto) localStorage.setItem("f3d:favoritos", JSON.stringify(favoritos));
  }, [favoritos, pronto]);
  useEffect(() => {
    if (pronto) localStorage.setItem("f3d:vistos", JSON.stringify(vistos));
  }, [vistos, pronto]);
  useEffect(() => {
    if (!pronto) return;
    localStorage.setItem("f3d:tema", JSON.stringify(tema));
    document.documentElement.classList.toggle("dark", tema === "dark");
  }, [tema, pronto]);

  const adicionar = useCallback((id: string, qtd = 1) => {
    setCarrinho((c) => {
      const existe = c.find((i) => i.id === id);
      if (existe) return c.map((i) => (i.id === id ? { ...i, qtd: i.qtd + qtd } : i));
      return [...c, { id, qtd }];
    });
    const p = PRODUTOS.find((x) => x.id === id);
    toast.success("Adicionado ao carrinho", { description: p?.nome });
  }, []);

  const remover = useCallback((id: string) => {
    setCarrinho((c) => c.filter((i) => i.id !== id));
    toast("Item removido do carrinho");
  }, []);

  const alterarQtd = useCallback((id: string, qtd: number) => {
    setCarrinho((c) =>
      c.map((i) => (i.id === id ? { ...i, qtd: Math.max(1, Math.min(99, qtd)) } : i)),
    );
  }, []);

  const limpar = useCallback(() => setCarrinho([]), []);

  const favoritar = useCallback((id: string) => {
    setFavoritos((f) => {
      const tem = f.includes(id);
      toast(tem ? "Removido dos favoritos" : "Adicionado aos favoritos");
      return tem ? f.filter((x) => x !== id) : [...f, id];
    });
  }, []);

  const registrarVisto = useCallback((id: string) => {
    setVistos((v) => [id, ...v.filter((x) => x !== id)].slice(0, 8));
  }, []);

  const alternarTema = useCallback(() => setTema((t) => (t === "dark" ? "light" : "dark")), []);

  const totalItens = carrinho.reduce((s, i) => s + i.qtd, 0);
  const subtotal = carrinho.reduce((s, i) => {
    const p = PRODUTOS.find((x) => x.id === i.id);
    return s + (p ? p.preco * i.qtd : 0);
  }, 0);

  const value = useMemo(
    () => ({
      carrinho,
      favoritos,
      vistos,
      totalItens,
      subtotal,
      tema,
      adicionar,
      remover,
      alterarQtd,
      limpar,
      favoritar,
      registrarVisto,
      alternarTema,
    }),
    [
      carrinho,
      favoritos,
      vistos,
      totalItens,
      subtotal,
      tema,
      adicionar,
      remover,
      alterarQtd,
      limpar,
      favoritar,
      registrarVisto,
      alternarTema,
    ],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useLoja() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useLoja precisa estar dentro de <LojaProvider>");
  return ctx;
}

export const itensDetalhados = (carrinho: CartItem[]) =>
  carrinho
    .map((i) => ({ produto: PRODUTOS.find((p) => p.id === i.id) as Product, qtd: i.qtd }))
    .filter((i) => Boolean(i.produto));