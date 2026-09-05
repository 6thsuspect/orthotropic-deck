import { Card } from '../components/Card';
import { CompareRow } from '../components/ResultRow';
import { BridgeSection } from '../components/SectionDrawings';
import { sci } from '../lib/format';
import { THESIS } from '../lib/thesis';
import { useModel } from '../state/ModelContext';

const fPaM = (v: number) => `${sci(v, 3)} Pa·m`;
const fPaM3 = (v: number) => `${sci(v, 3)} Pa·m³`;
const fMm = (v: number) => `${(v * 1e3).toFixed(2)} mm`;
const fMm2 = (v: number) => `${(v * 1e6).toFixed(0)} mm²`;
const fMm4 = (v: number) => `${(v * 1e12).toPrecision(6)} mm⁴`;

export default function Overview() {
  const { sec, plate, gv, inputs } = useModel();

  const kpis = [
    { label: 'Longitudinal membrane', sym: 'd_yy', value: fPaM(plate.membrane.dyy), sub: 'eq 3.13' },
    { label: 'Longitudinal flexural', sym: 'D_yy', value: fPaM3(plate.flexural.Dyy), sub: 'eq 3.14' },
    { label: 'Transverse flexural', sym: 'D_xx', value: fPaM3(plate.flexural.Dxx), sub: 'eq 3.2' },
    { label: 'Transverse shear', sym: 'D_sx', value: fPaM(plate.shear.Dsx), sub: 'eq 3.23' },
    { label: 'Longitudinal shear', sym: 'D_sy', value: fPaM(plate.shear.Dsy), sub: 'eq 3.24' },
    { label: 'Equivalent thickness', sym: 't_eq', value: fMm(plate.alt1.teq), sub: 'App. B4.1' },
  ];

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-2xl border border-steel-800 bg-steel-950 px-6 py-7 text-steel-100 shadow-card sm:px-8">
        <div className="pointer-events-none absolute inset-0 opacity-[0.07] [background-image:linear-gradient(#fff_1px,transparent_1px),linear-gradient(90deg,#fff_1px,transparent_1px)] [background-size:28px_28px]" />
        <div className="relative">
          <p className="chip num border-steel-700 bg-steel-900 text-steel-300">worked example · Chalmers thesis 2015:112</p>
          <h1 className="mt-3 max-w-2xl text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            Equivalent 2D orthotropic plate for an orthotropic steel bridge deck
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-steel-300">
            This app reproduces the hand-calculation example of Håkansson &amp; Wallerman,{' '}
            <em>Finite Element Design of Orthotropic Steel Bridge Decks</em> (Chalmers Master&apos;s Thesis
            2015:112): the membrane, flexural, torsional and shear rigidities of a deck plate with
            trapezoidal ribs are smeared into a general shell stiffness matrix{' '}
            <span className="num">D</span> for FE design, and compared with the published reference values
            (Appendix B4).
          </p>
        </div>
      </section>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        {kpis.map((k) => (
          <div key={k.sym} className="rounded-xl border border-steel-100 bg-white px-4 py-3 shadow-card">
            <p className="text-[11px] font-medium uppercase tracking-wide text-steel-500">{k.label}</p>
            <p className="num mt-1 truncate text-sm font-semibold text-steel-900" title={k.value}>
              {k.value}
            </p>
            <p className="num mt-0.5 text-[10px] text-steel-400">
              {k.sym} · {k.sub}
            </p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <Card title="Case-study cross-section" subtitle="Figures 4.1 & 4.2, parametric from Inputs">
          <BridgeSection />
        </Card>

        <Card title="Worked example vs. thesis" subtitle="computed ← → Appendix B reference" refs={['App. B4']}>
          <CompareRow
            label="Stiffener + plate area"
            symbol="A_stiff"
            computed={sec.A}
            format={fMm2}
            reference={THESIS.section.Astiff}
          />
          <CompareRow
            label="Stiffener second moment of area"
            symbol="I_stiff,y"
            computed={sec.Iy}
            format={fMm4}
            reference={THESIS.section.IstiffY}
            note="Thesis value from AutoCAD; analytic trapezoid model differs slightly."
          />
          <CompareRow label="Membrane rigidity, transverse" symbol="d_xx" computed={plate.membrane.dxx} format={fPaM} reference={THESIS.membrane.dxx} eq="3.11" />
          <CompareRow label="Membrane rigidity, longitudinal" symbol="d_yy" computed={plate.membrane.dyy} format={fPaM} reference={THESIS.membrane.dyy} eq="3.13" />
          <CompareRow label="Flexural rigidity, transverse" symbol="D_xx" computed={plate.flexural.Dxx} format={fPaM3} reference={THESIS.flexural.Dxx} eq="3.2" />
          <CompareRow label="Flexural rigidity, longitudinal" symbol="D_yy" computed={plate.flexural.Dyy} format={fPaM3} reference={THESIS.flexural.Dyy} eq="3.14" />
          <CompareRow label="Average torsional rigidity" symbol="D_aa" computed={plate.flexural.Dav} format={fPaM3} reference={THESIS.flexural.Dav} eq="3.17" />
          <CompareRow label="Shear rigidity, transverse" symbol="D_sx" computed={plate.shear.Dsx} format={fPaM} reference={THESIS.shear.Dsx} eq="3.23" />
          <CompareRow label="Shear rigidity, longitudinal" symbol="D_sy" computed={plate.shear.Dsy} format={fPaM} reference={THESIS.shear.Dsy} eq="3.24" />
          <CompareRow
            label="Global mid-span deflection (verification)"
            symbol="δ_max"
            computed={gv.deltaMax}
            format={fMm}
            reference={THESIS.global.deltaMax}
            note={`Hand calculation with uniform load ${inputs.bridge.Q / 1e3} kN/m²; FE shell model of the thesis gave 74.76 mm (4.3 % above hand calc).`}
          />
        </Card>
      </div>
    </div>
  );
}
