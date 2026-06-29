import { swatches, colorScales } from "../data";

export function PaletteSection() {
  return (
    <>
      <div className="uf-swatches">
        {swatches.map((s) => (
          <div className="uf-swatch" key={s.hex}>
            <div className="uf-swatch__chip" style={{ background: s.hex }} />
            <div className="uf-swatch__name">{s.name}</div>
            <div className="uf-swatch__hex">{s.hex}</div>
            <div className="uf-caption">{s.role}</div>
          </div>
        ))}
      </div>

      <div className="uf-scales">
        {colorScales.map((scale) => (
          <div className="uf-scale" key={scale.name}>
            <div className="uf-scale__name">{scale.name}</div>
            <div className="uf-scale__row">
              {scale.steps.map((step) => (
                <div
                  key={step}
                  className="uf-scale__step"
                  style={{ background: `var(${scale.prefix}${step})` }}
                  title={`${scale.prefix}${step}`}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default PaletteSection;
