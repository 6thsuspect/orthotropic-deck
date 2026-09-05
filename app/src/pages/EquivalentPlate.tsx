import { Card, Note } from '../components/Card';
import { MatrixGrid } from '../components/MatrixGrid';
import { CompareRow, ValueRow } from '../components/ResultRow';
import { fmt, sci } from '../lib/format';
import { THESIS } from '../lib/thesis';
import { useModel } from '../state/ModelContext';

const fPaM = (v: number) => `${sci(v, 3)} Pa·m`;
const fPaM3 = (v: number) => `${sci(v, 3)} Pa·m³`;

export default function EquivalentPlate() {
  const { plate, inputs } = useModel();
  const { membrane, flexural, shear, alt1, D, Dshear } = plate;

  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-2">
        <Card title="B4.2.1 Membrane rigidity" subtitle="plate + smeared rib area" refs={['eq 3.11–3.13']}>
          <CompareRow
            label="Rib area without plate part"
            symbol="A_b"
            computed={membrane.Ab}
            format={(v) => `${(v * 1e6).toFixed(0)} mm²`}
            reference={THESIS.membrane.Ab}
          />
          <CompareRow label="Transverse membrane" symbol="d_xx" computed={membrane.dxx} format={fPaM} reference={THESIS.membrane.dxx} eq="3.11" />
          <CompareRow label="Lateral contraction" symbol="d_v" computed={membrane.dv} format={fPaM} reference={THESIS.membrane.dv} eq="3.11" />
          <CompareRow label="Longitudinal membrane" symbol="d_yy" computed={membrane.dyy} format={fPaM} reference={THESIS.membrane.dyy} eq="3.13" />
          <CompareRow label="Membrane shear" symbol="d_xy" computed={membrane.dxy} format={fPaM} reference={THESIS.membrane.dxy} eq="3.11" />
          <Note>d_yy = E·t_p/(1−ν²) + E·A_b/b_rib — only the longitudinal ribs are smeared; the cross beams sit too far apart (thesis §3.2.2.1).</Note>
        </Card>

        <Card title="B4.2.2 Flexural rigidity" subtitle="separate terms per direction" refs={['eq 3.2, 3.14–3.17']}>
          <CompareRow label="Frame end rotation" symbol="φ" computed={inputs.frame.phi} format={(v) => `${v.toFixed(4)} rad`} reference={0.041} isInput />
          <CompareRow label="Transverse flexural" symbol="D_xx" computed={flexural.Dxx} format={fPaM3} reference={THESIS.flexural.Dxx} eq="3.2" />
          <CompareRow label="Longitudinal flexural" symbol="D_yy" computed={flexural.Dyy} format={fPaM3} reference={THESIS.flexural.Dyy} eq="3.14" />
          <CompareRow label="Moment reduction factor" symbol="(b₀m+b₁m₁)/bm" computed={flexural.redFactor} format={(v) => fmt(v, 3)} reference={0.98} eq="3.15" />
          <CompareRow label="Lateral contraction" symbol="D_v" computed={flexural.Dv} format={fPaM3} reference={THESIS.flexural.Dv} eq="3.16" />
          <CompareRow label="Average torsional" symbol="D_aa" computed={flexural.Dav} format={fPaM3} reference={THESIS.flexural.Dav} eq="3.17" />
        </Card>

        <Card title="Torsional moments of inertia" subtitle="closed rib + deck plate" refs={['eq 3.18–3.21']}>
          <ValueRow label="Average rib width" symbol="b_av" value={`${(flexural.bav * 1e3).toFixed(0)} mm`} />
          <ValueRow label="Enclosed rib area" symbol="A_s" value={`${(flexural.As * 1e4).toFixed(1)} ×10² mm²`} />
          <CompareRow label="Polar moment of inertia" symbol="I_t" computed={flexural.It} format={(v) => `${sci(v, 4)} m⁴`} reference={THESIS.flexural.It} eq="3.21" />
          <CompareRow label="Plate torsion inertia" symbol="i_xy" computed={flexural.ixy} format={(v) => `${sci(v, 4)} m⁴/m`} reference={THESIS.flexural.ixy} eq="3.19" />
          <CompareRow label="Rib + plate torsion inertia" symbol="i_yx" computed={flexural.iyx} format={(v) => `${sci(v, 4)} m⁴/m`} reference={THESIS.flexural.iyx} eq="3.20" />
          <CompareRow label="Average torsion inertia" symbol="i_aa" computed={flexural.iav} format={(v) => `${sci(v, 4)} m⁴/m`} reference={THESIS.flexural.iav} eq="3.18" />
        </Card>

        <Card title="B4.2.3 Shear rigidity" subtitle="frame shear test + Cowper box factor" refs={['eq 3.22–3.24']}>
          <CompareRow label="Shear frame deflection" symbol="δ_shear" computed={inputs.frame.deltaShear} format={(v) => `${(v * 1e3).toFixed(3)} mm`} reference={10.246e-3} isInput />
          <CompareRow label="Shear stiffness of strip" symbol="K_sx" computed={shear.Ksx} format={(v) => `${(v / 1e3).toFixed(2)} kN/m`} reference={THESIS.shear.Ksx} eq="3.22" />
          <CompareRow label="Transverse shear rigidity" symbol="D_sx" computed={shear.Dsx} format={fPaM} reference={THESIS.shear.Dsx} eq="3.23" />
          <CompareRow label="Cowper parameter" symbol="m_box" computed={shear.mbox} format={(v) => fmt(v, 3)} reference={THESIS.shear.mbox} />
          <CompareRow label="Cowper parameter" symbol="n_box" computed={shear.nbox} format={(v) => fmt(v, 3)} reference={THESIS.shear.nbox} />
          <CompareRow label="Shear factor (thin-walled box)" symbol="κ_box" computed={shear.kappaBox} format={(v) => fmt(v, 3)} reference={THESIS.shear.kappaBox} note="Cowper (1966), simplified thin-walled box section." />
          <CompareRow label="Shear-reduced area" symbol="A_sy" computed={shear.Asy} format={(v) => `${(v * 1e6).toFixed(0)} mm²`} reference={THESIS.shear.Asy} />
          <CompareRow label="Longitudinal shear rigidity" symbol="D_sy" computed={shear.Dsy} format={fPaM} reference={THESIS.shear.Dsy} eq="3.24" />
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
        <Card title="B4.2.4 General shell stiffness matrix D" subtitle="input for Brigade Plus / Abaqus shell sections" refs={['eq 3.10']}>
          <MatrixGrid M={D} labels={['11', '22', '33', '12', '13', '23']} />
          <div className="mt-4">
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-steel-500">
              Transverse shear rigidity matrix
            </h3>
            <MatrixGrid M={Dshear} labels={['1', '2']} />
          </div>
          <Note>
            Units: membrane block and shear matrix in Pa·m (N per m/m); flexural block in Pa·m³ (N·m per m/m).
            Thesis reference matrix: d = [3.692, 1.108, 4.602, 1.292]×10⁹ Pa·m, D = [7.317×10⁴, 2.151×10⁴,
            1.945×10⁷, 2.275×10⁶] Pa·m³, D_shear = diag(7.706×10⁵, 2.351×10⁸) Pa·m.
          </Note>
        </Card>

        <Card title="B4.1 Alternative 1 — equivalent thickness" subtitle="fictitious isotropic plate" refs={['App. B4.1']}>
          <CompareRow label="Equivalent second moment of area" symbol="I_eq" computed={alt1.Ieq} format={(v) => `${sci(v * 1e12, 3)} mm⁴/m`} reference={THESIS.alt1.Ieq} />
          <CompareRow label="Equivalent thickness" symbol="t_eq" computed={alt1.teq} format={(v) => `${(v * 1e3).toFixed(2)} mm`} reference={THESIS.alt1.teq} />
          <CompareRow label="Equivalent transverse modulus" symbol="E_2" computed={alt1.E2} format={(v) => `${(v / 1e9).toFixed(3)} GPa`} reference={THESIS.alt1.E2} />
          <CompareRow label="Equivalent shear modulus" symbol="G_23" computed={alt1.G23} format={(v) => `${(v / 1e9).toFixed(3)} GPa`} reference={THESIS.alt1.G23} />
          <Note>
            The thesis discards this alternative for the deck: fictitious E and t mix membrane and flexural
            action. It is kept here because the equivalent thickness is a useful sanity check — the case study
            deck behaves in bending like a ≈104 mm isotropic plate while weighing only ≈110 kg/m² of steel.
          </Note>
        </Card>
      </div>
    </div>
  );
}
