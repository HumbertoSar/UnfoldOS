import type { ReactNode } from "react";
import { Icon } from "../components/Icon";
import { BrandMark } from "../components/DiagnosisCard";
import { MicButton } from "../components/MicButton";
import { values } from "./data";
import { PaletteSection } from "./sections/Palette";
import { TypographySection } from "./sections/Typography";
import { ComponentsSection } from "./sections/Components";
import { PrinciplesSection } from "./sections/Principles";
import { CanvasDemoSection } from "./sections/CanvasDemo";
import "./Showcase.css";

function Section({
  label,
  title,
  intro,
  children,
}: {
  label: string;
  title?: string;
  intro?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="uf-section">
      <div className="uf-section__head">
        <span className="uf-section__label uf-overline">{label}</span>
        {title ? <h2 className="uf-title-2">{title}</h2> : null}
        {intro ? <p className="uf-body">{intro}</p> : null}
      </div>
      {children}
    </section>
  );
}

function Hero() {
  return (
    <header className="uf-hero">
      <div>
        <div className="uf-hero__brand">
          <BrandMark size={30} />
          <span className="uf-hero__brand-name">Unfold OS</span>
        </div>
        <h1 className="uf-hero__title">
          Unfold <em>OS</em>
        </h1>
        <p className="uf-hero__lede">
          Uma anamnese financeira que transforma a primeira conversa em clareza
          visual — em tempo real.
        </p>
        <hr className="uf-hero__rule" />
        <p className="uf-hero__note">
          Design system. Do diálogo ao diagnóstico: uma canvas onde cada
          informação vira card e se desdobra conforme o cliente compartilha.
        </p>
      </div>
      <div className="uf-hero__aside">
        <div style={{ display: "grid", placeItems: "center", gap: 16 }}>
          <MicButton size="lg" />
          <span className="uf-caption">Clique para falar</span>
        </div>
      </div>
    </header>
  );
}

function ValuesFooter() {
  return (
    <div className="uf-values">
      {values.map((v) => (
        <div className="uf-value" key={v.title}>
          <span className="uf-value__icon">
            <Icon name={v.icon} size={22} strokeWidth={1.5} />
          </span>
          <span className="uf-value__title">{v.title}</span>
          <span className="uf-value__text">{v.text}</span>
        </div>
      ))}
    </div>
  );
}

export function App() {
  return (
    <main className="uf-showcase">
      <div className="uf-showcase__inner">
        <Hero />

        <Section
          label="Paleta de cores"
          title="Calma, terrosa, confiável"
          intro="Sete tons-base do pôster Canvas Vivo, mais escalas derivadas para uso real de interface. A cor comunica por tom, nunca por alarme."
        >
          <PaletteSection />
        </Section>

        <Section
          label="Tipografia"
          title="Inter, em três pesos"
          intro="Hierarquia por tamanho e peso — generosa no respiro, sóbria no ritmo."
        >
          <TypographySection />
        </Section>

        <Section
          label="Componentes"
          title="A conversa, encapsulada"
          intro="Cada elemento da imagem, agora vivo: do botão de microfone ao medidor de confiança."
        >
          <ComponentsSection />
        </Section>

        <Section
          label="Princípios de interação"
          title="Como o entendimento se constrói"
          intro="Seis movimentos que regem a canvas — da captação da fala ao feedback progressivo."
        >
          <PrinciplesSection />
        </Section>

        <Section
          label="A canvas viva"
          title="Cards que se unfoldam no espaço"
          intro="Arraste, mova e dê zoom. O entendimento se organiza por proximidade — nada se fecha cedo demais."
        >
          <CanvasDemoSection />
        </Section>

        <ValuesFooter />

        <p className="uf-showcase__credits">
          Unfold OS · Design System — inspirado no pôster Canvas Vivo. Nada se
          fecha cedo demais. Tudo pode continuar a se unfoldar.
        </p>
      </div>
    </main>
  );
}

export default App;
