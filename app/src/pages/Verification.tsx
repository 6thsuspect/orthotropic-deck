import { Card, Note } from '../components/Card';
import { CompareRow, ValueRow } from '../components/ResultRow';
import { MPa, fmt, kNm, mm } from '../lib/format';
import { THESIS } from '../lib/thesis';
import { useModel } from '../state/ModelContext';

export default function Verification() {
  const { sl, gv, cb, rib, inputs } = useModel();

  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-2">
        <Card title="B2.1 Shear-lag effective width of the main girder" subtitle="EN 1993-1-5 §3.2.1, Table 3.1" refs={['B2.1']}>
          <ValueRow label="Effective length (zero-moment distance)" symbol="L_e" value={`${sl.Le.toFixed(1)} m`} />
          <ValueRow label="Outstand width" symbol="b_0,cant" value={mm(sl.b0Cant, 0)} />
          <ValueRow label="Internal width" symbol="b_0,mid" value={mm(sl.b0Mid, 0)} />
          <ValueRow label="α₀ (cantilever / internal)" symbol="α_0" value={`${fmt(sl.alpha0Cant, 3)} / ${fmt(sl.alpha0Mid, 3)}`} />
          <ValueRow label="κ (cantilever / internal)" symbol="κ" value={`${fmt(sl.kappaCant, 3)} / ${fmt(sl.kappaMid, 3)}`} />
          <ValueRow label="β (cantilever / internal)" symbol="β" value={`${fmt(sl.betaCant, 3)} / ${fmt(sl.betaMid, 3)}`} />
          <CompareRow label="Effective width, outstand" symbol="b_eff,cant" computed={sl.beffCant} format={(v) => `${v.toFixed(3)} m`} reference={THESIS.shearLag.beffCant} />
          <CompareRow label="Effective width, internal" symbol="b_eff,mid" computed={sl.beffMid} format={(v) => `${v.toFixed(3)} m`} reference={THESIS.shearLag.beffMid} />
          <CompareRow label="Total effective flange" symbol="b_eff" computed={sl.beff} format={(v) => `${v.toFixed(3)} m`} reference={THESIS.shearLag.beff} />
          <CompareRow
            label="Half-girder second moment of area"
            symbol="I_half"
            computed={sl.Ihalf}
            format={(v) => `${(v * 1e12 / 1e9).toFixed(2)} ×10⁹ mm⁴`}
            reference={THESIS.shearLag.Ihalf}
            note="Analytic girder + ribs + effective plate; thesis value from AutoCAD."
          />
          <CompareRow label="Half-girder centroid" symbol="z_CG,Main" computed={sl.zCGMain} format={(v) => mm(v, 1)} reference={THESIS.shearLag.zCGMain} />
        </Card>

        <Card title="B2.2 Global behaviour" subtitle="simply supported half-girder beam, UDL 10 kN/m²" refs={['B2.2']}>
          <CompareRow label="Self weight of cross section" symbol="g_self" computed={gv.gSelf} format={kNm} reference={THESIS.global.gSelf} />
          <CompareRow label="Smeared cross-beam weight" symbol="g_self,CB" computed={gv.gSelfCBSmeared} format={kNm} reference={THESIS.global.gSelfCBSmeared} />
          <CompareRow label="Total line load" symbol="q" computed={gv.q} format={kNm} reference={THESIS.global.q} />
          <CompareRow label="Mid-span deflection" symbol="δ_max" computed={gv.deltaMax} format={(v) => mm(v, 2)} reference={THESIS.global.deltaMax} note="Thesis FE shell model: 74.76 mm (+4.3 % vs hand calc, shear deformation)." />
          <CompareRow label="Mid-span moment (half bridge)" symbol="M_max" computed={gv.Mmax} format={(v) => `${(v / 1e6).toFixed(1)} MN·m`} reference={THESIS.global.Mmax} />
          <CompareRow label="Stress top of girder" symbol="σ_top" computed={gv.sigmaTop} format={MPa} reference={THESIS.global.sigmaTop} />
          <CompareRow label="Stress bottom of girder" symbol="σ_bot" computed={gv.sigmaBot} format={MPa} reference={THESIS.global.sigmaBot} note="Thesis FE shell model: 182.22 MPa (−2.0 % vs hand calc)." />
        </Card>

        <Card title="B2.3 Cross beam as spring support" subtitle="effective T-section, simply supported" refs={['B2.3']}>
          <CompareRow label="Effective plate width each side" symbol="b_eff,CB" computed={cb.beffCB} format={(v) => mm(v, 0)} reference={THESIS.crossBeam.beffCB} />
          <ValueRow label="Effective span" symbol="L_CB" value={`${cb.LCB.toFixed(2)} m`} />
          <ValueRow label="Effective web height (no cut-outs)" symbol="h_CB,av" value={mm(cb.hCBAv, 0)} />
          <CompareRow label="Centroid from plate top" symbol="z_CG,CB" computed={cb.zCGCB} format={(v) => mm(v, 1)} reference={THESIS.crossBeam.zCGCB} />
          <CompareRow label="Second moment of area" symbol="I_CB" computed={cb.ICB} format={(v) => `${(v * 1e12 / 1e9).toFixed(3)} ×10⁹ mm⁴`} reference={THESIS.crossBeam.ICB} />
          <CompareRow label="Flexibility per unit force" symbol="F_CB" computed={cb.FCB} format={(v) => `${(v * 1e9).toFixed(3)} ×10⁻⁹ m/N`} reference={THESIS.crossBeam.FCB} />
          <CompareRow label="Spring stiffness" symbol="K_CB" computed={cb.KCB} format={(v) => `${(v / 1e6).toFixed(2)} ×10³ kN/m`} reference={THESIS.crossBeam.KCB} />
        </Card>

        <Card title="B2.4 Longitudinal rib beam" subtitle="rib strip on the cross beams" refs={['B2.4']}>
          <CompareRow label="Rib self weight" symbol="g_stiff" computed={rib.gStiff} format={kNm} reference={THESIS.rib.gStiff} />
          <CompareRow label="Line load on one rib" symbol="q_rib" computed={rib.qRib} format={kNm} reference={THESIS.rib.qRib} />
          <ValueRow label="Mid-span moment, simply supported spans" symbol="M_simply" value={`${(rib.MSimply / 1e3).toFixed(2)} kN·m`} />
          <Note>
            The thesis evaluates the continuous rib on rigid vs. spring supports with beam software (GoBeam):
            mid-span moment ≈ 4.85–4.92 kN·m per rib for Q = 10 kN/m². The simply-supported estimate above
            bounds that value from below; the spring-support model attracts slightly more moment.
          </Note>
          <Note>
            Wheel load cases of the case study: 300 kN concentrated load on a 400×400 mm contact square
            (1 875 kN/m²), placed over/between ribs at and between cross beams (load cases 1–7).
          </Note>
        </Card>
      </div>

      <Card title="Model verification summary (thesis §4.3.2 / §4.4.1)" subtitle="published FE vs hand-calculation checks">
        <div className="grid gap-x-10 gap-y-2 text-sm text-steel-700 md:grid-cols-2">
          <ValueRow label="Bridge deflection — hand / FE shell" value="71.67 mm / 74.76 mm (4.3 %)" />
          <ValueRow label="Girder stress — hand / FE shell" value="185.96 MPa / 182.22 MPa (2.0 %)" />
          <ValueRow label="Equivalent plate, longitudinal deflection" value="0.065 mm vs 0.064 mm detailed" />
          <ValueRow label="Equivalent plate, transverse deflection" value="0.016 mm vs 0.016 mm detailed" />
          <ValueRow label="Plate bending, supported on short sides" value="5.440 m vs 5.437 m (simply supported)" />
          <ValueRow label="Uniform load" symbol="Q" value={`${inputs.bridge.Q / 1e3} kN/m²`} />
        </div>
        <Note>
          Values in this card are quoted from the thesis (Tables 4.3, 4.5, 4.6, 4.7) as acceptance benchmarks for
          the equivalent-plate modelling technique; they are not recomputed here because they originate from
          the Brigade Plus / Abaqus shell models.
        </Note>
      </Card>
    </div>
  );
}
