import { typeScale } from "../data";

export function TypographySection() {
  return (
    <div className="uf-type">
      <div>
        <div className="uf-type__specimen">
          <span className="uf-type__big">Aa</span>
          <div>
            <div className="uf-overline">Tipografia</div>
            <div className="uf-title-3" style={{ marginTop: 4 }}>
              Inter
            </div>
            <p className="uf-caption" style={{ maxWidth: "26ch", marginTop: 6 }}>
              Humanista, neutra e legível em qualquer densidade. Três pesos
              bastam para toda a hierarquia.
            </p>
          </div>
        </div>

        <div className="uf-type__weights" style={{ marginTop: 32 }}>
          <div>
            <div className="uf-type__weight-name">Regular · 400</div>
            <div
              className="uf-type__sample"
              style={{ fontWeight: 400, fontSize: 18 }}
            >
              ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnop 0123456789
            </div>
          </div>
          <div>
            <div className="uf-type__weight-name">Medium · 500</div>
            <div
              className="uf-type__sample"
              style={{ fontWeight: 500, fontSize: 18 }}
            >
              ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnop 0123456789
            </div>
          </div>
          <div>
            <div className="uf-type__weight-name">Semibold · 600</div>
            <div
              className="uf-type__sample"
              style={{ fontWeight: 600, fontSize: 18 }}
            >
              ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnop 0123456789
            </div>
          </div>
        </div>
      </div>

      <div className="uf-type__scale">
        {typeScale.map((t) => (
          <div className="uf-type__scale-row" key={t.name}>
            <span className={t.className}>{t.sample}</span>
            <span className="uf-type__scale-meta">
              {t.name} · {t.weight} / {t.size}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TypographySection;
