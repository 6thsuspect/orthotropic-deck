import { useState } from 'react';
import { Card, Note } from '../components/Card';
import { NumberField } from '../components/NumberField';
import { CompareRow, ValueRow } from '../components/ResultRow';
import { RibSection } from '../components/SectionDrawings';
import { navierStress } from '../lib/equivalentPlate';
import { MPa, fmt, mm } from '../lib/format';
import { THESIS } from '../lib/thesis';
import { useModel } from '../state/ModelContext';

export default function SectionProps() {
  const { inputs, sec, redSec, euro, geom } = useModel();
  const [M, setM] = useState(100e3); // kN*m -> N*m
  const [N, setN] = useState(-1000e3); // kN -> N
  const nav = navierStress(inputs, M, N);

  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
        <Card title="Rib strip" subtitle="one stiffener with its share of deck plate" refs={['Fig B2.7']}>
          <RibSection />
          <div className="mt-4">
            <ValueRow label="Inclined web length" symbol="l_s" value={mm(geom.ls, 1)} />
            <ValueRow label="Rib strip width" symbol="b_rib" value={mm(geom.bRib, 0)} />
            <ValueRow label="Plate top → rib bottom" symbol="z_bot" value={mm(geom.zBot, 0)} />
          </div>
        </Card>

        <Card title="Composite section properties" subtitle="analytic thin-walled trapezoid model" refs={['B2.4']}>
          <CompareRow
            label="Area (rib walls + plate strip)"
            symbol="A_stiff"
            computed={sec.A}
            format={(v) => `${(v * 1e6).toFixed(0)} mm²`}
            reference={THESIS.section.Astiff}
          />
          <CompareRow
            label="Centroid below plate top"
            symbol="z_stiff,CG"
            computed={sec.zCG}
            format={(v) => mm(v, 2)}
            reference={THESIS.section.zstiffCG}
          />
          <CompareRow
            label="Second moment of area"
            symbol="I_stiff,y"
            computed={sec.Iy}
            format={(v) => `${(v * 1e12).toPrecision(7)} mm⁴`}
            reference={THESIS.section.IstiffY}
            note="Reference from AutoCAD; analytic value includes inclined-web exact terms."
          />
          <CompareRow
            label="Rib walls only (no plate)"
            symbol="A_b"
            computed={sec.ARib}
            format={(v) => `${(v * 1e6).toFixed(0)} mm²`}
            reference={THESIS.membrane.Ab}
          />
        </Card>
      </div>

      <Card title="Cross-section class & effective widths" subtitle="EN 1993-1-1 Table 5.2, EN 1993-1-5 §4.4" refs={['B3.3']}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-steel-200 text-[11px] uppercase tracking-wide text-steel-500">
                <th className="py-2 pr-4 font-medium">Part</th>
                <th className="py-2 pr-4 font-medium">Type</th>
                <th className="num py-2 pr-4 text-right font-medium">c/t</th>
                <th className="num py-2 pr-4 text-right font-medium">Class-4 limit</th>
                <th className="py-2 text-right font-medium">Class</th>
              </tr>
            </thead>
            <tbody>
              {euro.checks.map((c) => (
                <tr key={c.part} className="border-b border-steel-100 last:border-0">
                  <td className="py-2 pr-4 text-steel-800">{c.part}</td>
                  <td className="py-2 pr-4 text-steel-500">{c.type}</td>
                  <td className="num py-2 pr-4 text-right text-steel-900">{c.ct.toFixed(2)}</td>
                  <td className="num py-2 pr-4 text-right text-steel-500">{c.limit.toFixed(2)}·ε</td>
                  <td className="py-2 text-right">
                    <span
                      className={`num rounded-md border px-2 py-0.5 text-xs font-semibold ${
                        c.cls === 4
                          ? 'border-rose-200 bg-rose-50 text-rose-700'
                          : 'border-emerald-200 bg-emerald-50 text-emerald-700'
                      }`}
                    >
                      {c.cls}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-5 grid gap-6 md:grid-cols-2">
          <div>
            <h3 className="mb-1 text-xs font-semibold uppercase tracking-wide text-steel-500">
              Web of stiffener — reduction
            </h3>
            <ValueRow label="Plate slenderness" symbol="λ_p" value={fmt(euro.web.lambdaP, 3)} eq="EN 1993-1-5 4.4" />
            <ValueRow label="Reduction factor" symbol="ρ" value={fmt(euro.web.rho, 3)} eq="4.2" />
            <ValueRow label="Effective width" symbol="b_eff" value={mm(euro.web.beff, 1)} />
            <ValueRow label="At each edge" symbol="b_e1 = b_e2" value={mm(euro.web.be1, 1)} />
          </div>
          <div>
            <h3 className="mb-1 text-xs font-semibold uppercase tracking-wide text-steel-500">
              Bottom flange — reduction
            </h3>
            <ValueRow label="Plate slenderness" symbol="λ_p" value={fmt(euro.bottom.lambdaP, 3)} eq="EN 1993-1-5 4.4" />
            <ValueRow label="Reduction factor" symbol="ρ" value={fmt(euro.bottom.rho, 3)} eq="4.2" />
            <ValueRow label="Effective width" symbol="b_eff" value={mm(euro.bottom.beff, 1)} />
            <ValueRow label="At each edge" symbol="b_e1 = b_e2" value={mm(euro.bottom.be1, 1)} />
          </div>
        </div>

        <div className="mt-5 grid gap-x-8 md:grid-cols-2">
          <CompareRow
            label="Reduced area"
            symbol="A_stiff,red"
            computed={redSec.A}
            format={(v) => `${(v * 1e6).toFixed(0)} mm²`}
            reference={THESIS.section.AstiffRed}
          />
          <CompareRow
            label="Reduced centroid"
            symbol="z_stiff,CG,red"
            computed={redSec.zCG}
            format={(v) => mm(v, 2)}
            reference={THESIS.section.zstiffCGRed}
          />
          <CompareRow
            label="Reduced second moment of area"
            symbol="I_stiff,y,red"
            computed={redSec.Iy}
            format={(v) => `${(v * 1e12).toPrecision(6)} mm⁴`}
            reference={THESIS.section.IstiffYRed}
            note="Reference from AutoCAD (B3.4); effective widths placed half at each supported edge."
          />
        </div>
      </Card>

      <Card title="Navier stress tool" subtitle="σ = M/I·z + N/A for the rib strip" refs={['eq 4.1']}>
        <div className="grid gap-6 md:grid-cols-[220px_minmax(0,1fr)]">
          <div className="space-y-4">
            <NumberField label="Bending moment" symbol="M" unit="kN·m" siFactor={1e3} value={M} digits={1} step={10} onChange={setM} />
            <NumberField label="Normal force (compression −)" symbol="N" unit="kN" siFactor={1e3} value={N} digits={1} step={10} allowNegative onChange={setN} />
          </div>
          <div>
            <ValueRow label="Lever arm to plate top" symbol="z_top" value={mm(nav.zTop, 1)} />
            <ValueRow label="Lever arm to rib bottom" symbol="z_bot" value={mm(nav.zBot, 1)} />
            <ValueRow label="Stress at plate top" symbol="σ_top" value={MPa(nav.top, 2)} />
            <ValueRow label="Stress at rib bottom" symbol="σ_bot" value={MPa(nav.bottom, 2)} />
            <Note>
              Sign convention as in the thesis: sagging moment positive, compressive normal force negative.
              Use the sectional forces of a rib strip (Free Body Cut / equivalent plate) as M and N.
            </Note>
          </div>
        </div>
      </Card>
    </div>
  );
}
