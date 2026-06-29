import { Icon } from "../../components/Icon";
import { Waveform } from "../../components/Waveform";
import { ProgressRing } from "../../components/ProgressRing";
import { principles } from "../data";

/** Visual específico por princípio — pequeno, calmo, ilustrativo. */
function PrincipleVisual({ icon }: { icon: string }) {
  if (icon === "waveform") return <Waveform active height={34} bars={11} />;
  if (icon === "activity")
    return (
      <ProgressRing value={62} tone="forming" size={64} thickness={6}>
        <span style={{ fontSize: 12, fontWeight: 600 }}>62%</span>
      </ProgressRing>
    );
  if (icon === "trending-up")
    return <Icon name="trending-up" size={44} strokeWidth={1.4} />;
  return <Icon name={icon as never} size={40} strokeWidth={1.4} />;
}

export function PrinciplesSection() {
  return (
    <div className="uf-principles">
      {principles.map((p) => (
        <div className="uf-principle" key={p.title}>
          <div className="uf-principle__visual">
            <PrincipleVisual icon={p.icon} />
          </div>
          <div className="uf-principle__title">{p.title}</div>
          <p className="uf-principle__text">{p.text}</p>
        </div>
      ))}
    </div>
  );
}

export default PrinciplesSection;
