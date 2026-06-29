import type { IconName } from "../components/Icon";

export interface Swatch {
  name: string;
  hex: string;
  role: string;
  /** Texto legível sobre o chip. */
  onDark?: boolean;
}

export const swatches: Swatch[] = [
  { name: "Azul Profundo", hex: "#0E142B", role: "Confiança · texto", onDark: true },
  { name: "Índigo", hex: "#24385A", role: "Primário · ações", onDark: true },
  { name: "Cinza Grafite", hex: "#485563", role: "Texto de apoio", onDark: true },
  { name: "Cinza Pedra", hex: "#E7EAEE", role: "Bordas" },
  { name: "Areia", hex: "#F3F6F8", role: "A canvas" },
  { name: "Verde Sálvia", hex: "#3FA688", role: "Diagnóstico", onDark: true },
  { name: "Âmbar Suave", hex: "#D4AF37", role: "Acento sutil" },
];

export interface ScaleSpec {
  name: string;
  prefix: string;
  steps: string[];
}

export const colorScales: ScaleSpec[] = [
  {
    name: "Índigo",
    prefix: "--uf-indigo-",
    steps: ["50", "100", "200", "300", "400", "500", "600", "700", "800", "900"],
  },
  {
    name: "Sálvia",
    prefix: "--uf-sage-",
    steps: ["50", "100", "200", "300", "400", "500", "600", "700", "800", "900"],
  },
  {
    name: "Âmbar",
    prefix: "--uf-amber-",
    steps: ["50", "100", "200", "300", "400", "500", "600", "700", "800", "900"],
  },
  {
    name: "Neutros",
    prefix: "--uf-neutral-",
    steps: ["50", "100", "150", "200", "300", "400", "500", "700", "900", "950"],
  },
];

export interface TypeSpec {
  name: string;
  className: string;
  weight: string;
  size: string;
  sample: string;
}

export const typeScale: TypeSpec[] = [
  { name: "Título 1", className: "uf-title-1", weight: "Semibold", size: "40", sample: "A conversa vira clareza" },
  { name: "Título 2", className: "uf-title-2", weight: "Semibold", size: "28", sample: "Saúde Financeira" },
  { name: "Título 3", className: "uf-title-3", weight: "Semibold", size: "20", sample: "Metas e sonhos" },
  { name: "Texto", className: "uf-body", weight: "Regular", size: "16", sample: "Tudo pode continuar a se unfoldar." },
  { name: "Legenda", className: "uf-caption", weight: "Regular", size: "12", sample: "12 áreas conectadas" },
];

export interface Principle {
  icon: IconName;
  title: string;
  text: string;
}

export const principles: Principle[] = [
  {
    icon: "waveform",
    title: "Captação da fala",
    text: "A conversa flui. A IA escuta e entende em tempo real, sem formulários.",
  },
  {
    icon: "layers",
    title: "Informação vira objeto",
    text: "Cada dado captado encapsula-se em um card — manipulável, com proveniência.",
  },
  {
    icon: "cluster",
    title: "Organização por afinidade",
    text: "Cards se aproximam por sentido. Importância nasce do agrupamento, não do alarme.",
  },
  {
    icon: "activity",
    title: "Diagnóstico em formação",
    text: "Padrões se conectam e insights emergem progressivamente. Nada se fecha cedo.",
  },
  {
    icon: "recenter",
    title: "Pan + Zoom",
    text: "Explore o todo ou o detalhe do que importa, sem nunca perder o contexto.",
  },
  {
    icon: "trending-up",
    title: "Feedback progressivo",
    text: "Confiança e clareza crescem junto com a conversa. Falar mais gera mais nitidez.",
  },
];

export interface Value {
  icon: IconName;
  title: string;
  text: string;
}

export const values: Value[] = [
  {
    icon: "sparkle",
    title: "Inteligente",
    text: "A IA entende contexto e transforma fala em estrutura.",
  },
  {
    icon: "bookmark",
    title: "Confiável",
    text: "Diagnósticos baseados em dados e princípios financeiros sólidos.",
  },
  {
    icon: "eye",
    title: "Clara",
    text: "Visualização que revela padrões e orienta decisões.",
  },
  {
    icon: "users",
    title: "Humana",
    text: "Experiência consultiva, empática e feita para pessoas reais.",
  },
];
