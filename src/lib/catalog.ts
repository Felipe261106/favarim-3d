/**
 * Catálogo da Favarim 3D.
 * Fonte única de dados dos produtos, categorias e depoimentos.
 * Estruturado para ser facilmente trocado por uma API/banco no futuro.
 */
import filamento from "@/assets/prod-filamento.jpg";
import impressora from "@/assets/prod-impressora.jpg";
import resina from "@/assets/prod-resina.jpg";
import acessorios from "@/assets/prod-acessorios.jpg";

export type Product = {
  id: string;
  slug: string;
  nome: string;
  categoria: string;
  marca: string;
  material: string;
  cor: string;
  preco: number;
  precoAntigo?: number;
  nota: number;
  avaliacoes: number;
  vendidos: number;
  estoque: number;
  lancamento: number; // ordem de novidade (maior = mais recente)
  imagem: string;
  galeria: string[];
  descricao: string;
  especificacoes: { label: string; valor: string }[];
};

export const CATEGORIAS = [
  { nome: "Filamentos", slug: "filamentos", icone: "Boxes", imagem: filamento },
  { nome: "Impressoras 3D", slug: "impressoras", icone: "Printer", imagem: impressora },
  { nome: "Resinas", slug: "resinas", icone: "FlaskConical", imagem: resina },
  { nome: "Peças", slug: "pecas", icone: "Cog", imagem: acessorios },
  { nome: "Bicos", slug: "bicos", icone: "Nut", imagem: acessorios },
  { nome: "Mesas Magnéticas", slug: "mesas", icone: "LayoutGrid", imagem: acessorios },
  { nome: "Ferramentas", slug: "ferramentas", icone: "Wrench", imagem: acessorios },
  { nome: "Eletrônica", slug: "eletronica", icone: "CircuitBoard", imagem: acessorios },
];

const imgPorCategoria: Record<string, string> = {
  Filamentos: filamento,
  "Impressoras 3D": impressora,
  Resinas: resina,
};

type Seed = Omit<Product, "id" | "slug" | "imagem" | "galeria" | "especificacoes"> &
  Partial<Pick<Product, "especificacoes">>;

const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const seeds: Seed[] = [
  {
    nome: "Filamento PLA Premium 1kg 1.75mm",
    categoria: "Filamentos",
    marca: "Favarim",
    material: "PLA",
    cor: "Preto",
    preco: 89.9,
    precoAntigo: 129.9,
    nota: 4.8,
    avaliacoes: 342,
    vendidos: 1820,
    estoque: 47,
    lancamento: 9,
    descricao:
      "Filamento PLA de alta pureza com tolerância de diâmetro ±0,02mm. Excelente acabamento superficial, baixo empenamento e ótima aderência à mesa.",
  },
  {
    nome: "Filamento PETG Resistente 1kg",
    categoria: "Filamentos",
    marca: "Creality",
    material: "PETG",
    cor: "Azul",
    preco: 109.9,
    precoAntigo: 139.9,
    nota: 4.6,
    avaliacoes: 198,
    vendidos: 940,
    estoque: 30,
    lancamento: 7,
    descricao:
      "PETG com alta resistência mecânica e química, ideal para peças funcionais que exigem durabilidade e leve flexibilidade.",
  },
  {
    nome: "Filamento ABS Industrial 1kg",
    categoria: "Filamentos",
    marca: "Voolt3D",
    material: "ABS",
    cor: "Branco",
    preco: 99.9,
    nota: 4.4,
    avaliacoes: 121,
    vendidos: 610,
    estoque: 18,
    lancamento: 4,
    descricao:
      "ABS de engenharia com alta resistência térmica, indicado para peças automotivas e protótipos funcionais.",
  },
  {
    nome: "Impressora 3D Favarim X1 Carbon",
    categoria: "Impressoras 3D",
    marca: "Favarim",
    material: "Metal",
    cor: "Preto",
    preco: 4299,
    precoAntigo: 5199,
    nota: 4.9,
    avaliacoes: 87,
    vendidos: 210,
    estoque: 6,
    lancamento: 10,
    descricao:
      "Impressora CoreXY fechada com nivelamento automático, sensor de fluxo, câmera integrada e velocidade de até 500mm/s.",
  },
  {
    nome: "Impressora 3D Ender Pro Plus",
    categoria: "Impressoras 3D",
    marca: "Creality",
    material: "Metal",
    cor: "Preto",
    preco: 1899,
    precoAntigo: 2299,
    nota: 4.5,
    avaliacoes: 402,
    vendidos: 1520,
    estoque: 12,
    lancamento: 6,
    descricao:
      "Clássica repaginada: extrusora direct drive, mesa PEI magnética e firmware silencioso. Perfeita para começar com qualidade.",
  },
  {
    nome: "Impressora de Resina Mono 8K",
    categoria: "Impressoras 3D",
    marca: "Anycubic",
    material: "Metal",
    cor: "Preto",
    preco: 2499,
    nota: 4.7,
    avaliacoes: 156,
    vendidos: 380,
    estoque: 0,
    lancamento: 8,
    descricao:
      "Tela mono 8K de 10 polegadas para detalhes microscópicos em miniaturas, joias e modelos odontológicos.",
  },
  {
    nome: "Resina Standard 1L Cinza",
    categoria: "Resinas",
    marca: "Anycubic",
    material: "Resina",
    cor: "Cinza",
    preco: 179.9,
    precoAntigo: 219.9,
    nota: 4.6,
    avaliacoes: 233,
    vendidos: 870,
    estoque: 25,
    lancamento: 5,
    descricao:
      "Resina de cura rápida com baixo odor e contração mínima. Detalhamento excepcional para miniaturas.",
  },
  {
    nome: "Resina Water Washable 1L",
    categoria: "Resinas",
    marca: "Elegoo",
    material: "Resina",
    cor: "Transparente",
    preco: 199.9,
    nota: 4.5,
    avaliacoes: 98,
    vendidos: 420,
    estoque: 14,
    lancamento: 7,
    descricao: "Lavável em água, dispensa álcool isopropílico na pós-cura. Prática e econômica.",
  },
  {
    nome: "Kit 24 Bicos de Latão 0.2 a 1.0mm",
    categoria: "Bicos",
    marca: "Favarim",
    material: "Latão",
    cor: "Dourado",
    preco: 59.9,
    precoAntigo: 89.9,
    nota: 4.7,
    avaliacoes: 512,
    vendidos: 2400,
    estoque: 120,
    lancamento: 3,
    descricao: "Kit completo de bicos MK8 usinados com precisão, com estojo organizador.",
  },
  {
    nome: "Bico Endurecido de Aço 0.4mm",
    categoria: "Bicos",
    marca: "Voolt3D",
    material: "Aço",
    cor: "Prata",
    preco: 79.9,
    nota: 4.8,
    avaliacoes: 143,
    vendidos: 660,
    estoque: 60,
    lancamento: 6,
    descricao: "Indicado para filamentos abrasivos como fibra de carbono e madeira.",
  },
  {
    nome: "Mesa Magnética PEI Dupla Face 235x235",
    categoria: "Mesas Magnéticas",
    marca: "Favarim",
    material: "PEI",
    cor: "Preto",
    preco: 149.9,
    precoAntigo: 199.9,
    nota: 4.9,
    avaliacoes: 289,
    vendidos: 1310,
    estoque: 33,
    lancamento: 8,
    descricao: "Superfície texturizada de um lado e lisa do outro, com aderência perfeita e remoção fácil.",
  },
  {
    nome: "Kit Ferramentas de Acabamento 30 peças",
    categoria: "Ferramentas",
    marca: "Favarim",
    material: "Aço",
    cor: "Prata",
    preco: 129.9,
    nota: 4.4,
    avaliacoes: 76,
    vendidos: 340,
    estoque: 22,
    lancamento: 4,
    descricao: "Alicates, espátulas, limas e lâminas para dar acabamento profissional às suas peças.",
  },
  {
    nome: "Placa Controladora Silenciosa 32 bits",
    categoria: "Eletrônica",
    marca: "Creality",
    material: "Eletrônico",
    cor: "Preto",
    preco: 289.9,
    precoAntigo: 349.9,
    nota: 4.6,
    avaliacoes: 64,
    vendidos: 190,
    estoque: 9,
    lancamento: 9,
    descricao: "Drivers TMC2209 integrados para impressões praticamente silenciosas.",
  },
  {
    nome: "Sensor de Nivelamento Automático",
    categoria: "Eletrônica",
    marca: "Anycubic",
    material: "Eletrônico",
    cor: "Preto",
    preco: 199.9,
    nota: 4.3,
    avaliacoes: 51,
    vendidos: 160,
    estoque: 0,
    lancamento: 5,
    descricao: "Nivelamento automático em 16 pontos, compatível com as principais placas do mercado.",
  },
  {
    nome: "Kit Engrenagens de Extrusora Dual Drive",
    categoria: "Peças",
    marca: "Voolt3D",
    material: "Aço",
    cor: "Prata",
    preco: 89.9,
    precoAntigo: 119.9,
    nota: 4.7,
    avaliacoes: 132,
    vendidos: 520,
    estoque: 40,
    lancamento: 6,
    descricao: "Tração dupla endurecida que elimina falhas de extrusão em impressões longas.",
  },
  {
    nome: "Hotend All Metal 300°C",
    categoria: "Peças",
    marca: "Favarim",
    material: "Metal",
    cor: "Prata",
    preco: 249.9,
    nota: 4.8,
    avaliacoes: 91,
    vendidos: 280,
    estoque: 15,
    lancamento: 10,
    descricao: "Bloco aquecedor all metal para materiais de engenharia de alta temperatura.",
  },
];

export const PRODUTOS: Product[] = seeds.map((s, i) => {
  const img = imgPorCategoria[s.categoria] ?? acessorios;
  return {
    ...s,
    id: `p${i + 1}`,
    slug: slugify(s.nome),
    imagem: img,
    galeria: [img, acessorios, impressora, filamento],
    especificacoes: [
      { label: "Marca", valor: s.marca },
      { label: "Categoria", valor: s.categoria },
      { label: "Material", valor: s.material },
      { label: "Cor", valor: s.cor },
      { label: "Garantia", valor: "12 meses" },
      { label: "Origem", valor: "Nacional" },
    ],
  };
});

export const getProduto = (slug: string) => PRODUTOS.find((p) => p.slug === slug);

export const MARCAS = [...new Set(PRODUTOS.map((p) => p.marca))].sort();
export const MATERIAIS = [...new Set(PRODUTOS.map((p) => p.material))].sort();
export const CORES = [...new Set(PRODUTOS.map((p) => p.cor))].sort();

export const brl = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export const desconto = (p: Product) =>
  p.precoAntigo ? Math.round((1 - p.preco / p.precoAntigo) * 100) : 0;

export const DEPOIMENTOS = [
  {
    nome: "Rafael Moreira",
    cargo: "Maker · Curitiba",
    texto:
      "Comprei filamento e uma mesa PEI. Chegou em 2 dias e a qualidade é absurda. Nunca mais tive problema de aderência.",
    nota: 5,
    inicial: "R",
  },
  {
    nome: "Juliana Prado",
    cargo: "Designer de produto · SP",
    texto:
      "O suporte me ajudou a escolher a impressora certa para o meu estúdio. Atendimento realmente especializado.",
    nota: 5,
    inicial: "J",
  },
  {
    nome: "Carlos Eduardo",
    cargo: "Prototipagem · Joinville",
    texto:
      "Uso a Favarim 3D para abastecer a empresa toda. Preço justo, nota fiscal e entrega sempre no prazo.",
    nota: 4,
    inicial: "C",
  },
];