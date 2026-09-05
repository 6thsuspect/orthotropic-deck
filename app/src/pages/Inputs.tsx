import { Card, Note } from '../components/Card';
import { NumberField } from '../components/NumberField';
import { useModel } from '../state/ModelContext';

const MM = 1e-3;
const GPA = 1e9;
const MPA = 1e6;
const KPA = 1e3;
const KNM = 1e3;

export default function Inputs() {
  const { inputs, update, reset } = useModel();
  const { material, deck, bridge, frame } = inputs;

  const downloadJson = () => {
    const blob = new Blob([JSON.stringify(inputs, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'orthodeck-inputs.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-steel-600">
          Default values reproduce the case study of the thesis (Appendix B1). Everything downstream —
          section properties, Eurocode checks, rigidities — updates live.
        </p>
        <div className="flex gap-2">
          <button
            onClick={downloadJson}
            className="rounded-lg border border-steel-200 bg-white px-3 py-1.5 text-xs font-medium text-steel-700 shadow-sm transition hover:bg-steel-50"
          >
            Export JSON
          </button>
          <button
            onClick={reset}
            className="rounded-lg border border-steel-700 bg-steel-800 px-3 py-1.5 text-xs font-medium text-white shadow-sm transition hover:bg-steel-700"
          >
            Reset to case study
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Material" subtitle="steel, linear elastic" refs={['B1']}>
          <div className="grid grid-cols-2 gap-4">
            <NumberField label="Young's modulus" symbol="E" unit="GPa" siFactor={GPA} value={material.E} digits={0} step={5} onChange={(v) => update((d) => void (d.material.E = v))} />
            <NumberField label="Poisson's ratio" symbol="ν" unit="–" value={material.nu} digits={2} step={0.05} onChange={(v) => update((d) => void (d.material.nu = v))} />
            <NumberField label="Density" symbol="ρ" unit="kg/m³" value={material.rho} digits={0} step={50} onChange={(v) => update((d) => void (d.material.rho = v))} />
            <NumberField label="Yield strength" symbol="f_y" unit="MPa" siFactor={MPA} value={material.fy} digits={0} step={5} onChange={(v) => update((d) => void (d.material.fy = v))} />
          </div>
        </Card>

        <Card title="Deck plate & longitudinal stiffeners" subtitle="trapezoidal closed ribs" refs={['Fig 4.2']}>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <NumberField label="Deck plate" symbol="t_p" unit="mm" siFactor={MM} value={deck.tp} digits={1} step={1} onChange={(v) => update((d) => void (d.deck.tp = v))} />
            <NumberField label="Rib web height" symbol="h_s" unit="mm" siFactor={MM} value={deck.hs} digits={0} step={10} onChange={(v) => update((d) => void (d.deck.hs = v))} />
            <NumberField label="Rib top width" symbol="b_s,top" unit="mm" siFactor={MM} value={deck.bsTop} digits={0} step={10} onChange={(v) => update((d) => void (d.deck.bsTop = v))} />
            <NumberField label="Rib bottom width" symbol="b_s,bot" unit="mm" siFactor={MM} value={deck.bsBot} digits={0} step={10} onChange={(v) => update((d) => void (d.deck.bsBot = v))} />
            <NumberField label="Rib wall thickness" symbol="t_s" unit="mm" siFactor={MM} value={deck.ts} digits={1} step={0.5} onChange={(v) => update((d) => void (d.deck.ts = v))} />
            <NumberField label="Clear rib spacing" symbol="d_s" unit="mm" siFactor={MM} value={deck.ds} digits={0} step={10} onChange={(v) => update((d) => void (d.deck.ds = v))} />
            <NumberField label="Number of ribs" symbol="n_stiff" unit="–" value={deck.nStiff} digits={0} step={1} onChange={(v) => update((d) => void (d.deck.nStiff = Math.round(v)))} />
          </div>
          <Note>
            Rib strip width b_rib = b_s,top + d_s = {((deck.bsTop + deck.ds) * 1e3).toFixed(0)} mm; deck width
            b_tot = n_stiff · b_rib = {((deck.bsTop + deck.ds) * deck.nStiff * 1e3).toFixed(0)} mm.
          </Note>
        </Card>

        <Card title="Bridge & cross beams" subtitle="simply supported plate-girder deck" refs={['Fig 4.1']}>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <NumberField label="Bridge length" symbol="L_tot" unit="m" value={bridge.ltot} digits={1} step={1} onChange={(v) => update((d) => void (d.bridge.ltot = v))} />
            <NumberField label="Girder web height" symbol="h_w" unit="mm" siFactor={MM} value={bridge.hw} digits={0} step={50} onChange={(v) => update((d) => void (d.bridge.hw = v))} />
            <NumberField label="Girder web thickness" symbol="t_w" unit="mm" siFactor={MM} value={bridge.tw} digits={1} step={1} onChange={(v) => update((d) => void (d.bridge.tw = v))} />
            <NumberField label="Girder flange thickness" symbol="t_f" unit="mm" siFactor={MM} value={bridge.tf} digits={1} step={1} onChange={(v) => update((d) => void (d.bridge.tf = v))} />
            <NumberField label="Girder flange width" symbol="b_f" unit="mm" siFactor={MM} value={bridge.bf} digits={0} step={10} onChange={(v) => update((d) => void (d.bridge.bf = v))} />
            <NumberField label="Cross-beam spacing" symbol="d_cross" unit="m" value={bridge.dcross} digits={1} step={0.5} onChange={(v) => update((d) => void (d.bridge.dcross = v))} />
            <NumberField label="Number of cross beams" symbol="n_CB" unit="–" value={bridge.nCB} digits={0} step={1} onChange={(v) => update((d) => void (d.bridge.nCB = Math.round(v)))} />
            <NumberField label="Cross-beam web height" symbol="h_w,CB" unit="mm" siFactor={MM} value={bridge.hwCB} digits={0} step={50} onChange={(v) => update((d) => void (d.bridge.hwCB = v))} />
            <NumberField label="Cross-beam web thickness" symbol="t_w,CB" unit="mm" siFactor={MM} value={bridge.twCB} digits={1} step={1} onChange={(v) => update((d) => void (d.bridge.twCB = v))} />
            <NumberField label="Cross-beam flange thickness" symbol="t_f,CB" unit="mm" siFactor={MM} value={bridge.tfCB} digits={1} step={1} onChange={(v) => update((d) => void (d.bridge.tfCB = v))} />
            <NumberField label="Cross-beam flange width" symbol="b_f,CB" unit="mm" siFactor={MM} value={bridge.bfCB} digits={0} step={10} onChange={(v) => update((d) => void (d.bridge.bfCB = v))} />
            <NumberField label="Uniform traffic load" symbol="Q" unit="kN/m²" siFactor={KPA} value={bridge.Q} digits={1} step={1} onChange={(v) => update((d) => void (d.bridge.Q = v))} />
          </div>
        </Card>

        <Card
          title="Transverse frame analysis"
          subtitle="2D rib-strip frame results (Strusoft in the thesis)"
          refs={['Fig B4.3', 'Fig B4.5', 'Fig B4.6']}
        >
          <div className="grid grid-cols-2 gap-4">
            <NumberField label="Frame moment" symbol="m_xx" unit="kN·m/m" siFactor={KNM} value={frame.mxx} digits={1} step={1} onChange={(v) => update((d) => void (d.frame.mxx = v))} />
            <NumberField label="End rotation" symbol="φ" unit="rad" value={frame.phi} digits={4} step={0.001} onChange={(v) => update((d) => void (d.frame.phi = v))} hint="Fig. B4.3 — rotation of the rib strip under m_xx" />
            <NumberField label="Plate moment between webs" symbol="m_xx,1" unit="kN·m/m" siFactor={KNM} value={frame.mxx1} digits={2} step={0.1} onChange={(v) => update((d) => void (d.frame.mxx1 = v))} hint="Fig. B4.5 — reduced moment over the rib" />
            <NumberField label="Shear frame force" symbol="v_x" unit="kN/m" siFactor={KNM} value={frame.vx} digits={1} step={1} onChange={(v) => update((d) => void (d.frame.vx = v))} />
            <NumberField label="Shear frame deflection" symbol="δ_shear" unit="mm" siFactor={MM} value={frame.deltaShear} digits={3} step={0.1} onChange={(v) => update((d) => void (d.frame.deltaShear = v))} hint="Fig. B4.6 — relative end deflection under v_x" />
          </div>
          <Note>
            In the reference document these three deformation quantities come from a 2D frame FE analysis
            (Strusoft Frame analysis) of one rib strip. They are therefore exposed here as explicit inputs so
            the full equation chain of Appendix B4.2 stays reproducible for any deck geometry.
          </Note>
        </Card>
      </div>
    </div>
  );
}
