import { Card, Note } from '../components/Card';

const MAP: { qty: string; eq: string; where: string }[] = [
  { qty: 'Membrane rigidities d_xx, d_v, d_yy, d_xy', eq: '3.11 – 3.13', where: '§3.2.2.1, App. B4.2.1' },
  { qty: 'Transverse flexural rigidity D_xx from frame rotation', eq: '3.2', where: '§3.2.1, App. B4.1/B4.2.2 (Fig. B4.3)' },
  { qty: 'Longitudinal flexural rigidity D_yy = E·I/b', eq: '3.14', where: '§3.2.2.2, App. B4.2.2' },
  { qty: 'Reduced transverse rigidity / lateral contraction D_v', eq: '3.15 – 3.16', where: '§3.2.2.2 (Fig. B4.5)' },
  { qty: 'Average torsional rigidity D_aa', eq: '3.17 – 3.21', where: '§3.2.2.2, App. B4.2.2' },
  { qty: 'Shear stiffness K_sx from frame deflection', eq: '3.22', where: '§3.2.2.3 (Fig. B4.6)' },
  { qty: 'Transverse shear rigidity D_sx', eq: '3.23', where: '§3.2.2.3, App. B4.2.3' },
  { qty: 'Longitudinal shear rigidity D_sy (Cowper factor)', eq: '3.24', where: '§3.2.2.3, Cowper (1966)' },
  { qty: 'General shell stiffness matrix D', eq: '3.10', where: '§3.2.2, App. B4.2.4' },
  { qty: 'Effective widths, shear lag of main girder flange', eq: 'EN 1993-1-5 §3.2.1', where: 'App. B2.1' },
  { qty: 'Cross-section class & plate reduction ρ', eq: 'EN 1993-1-1 T5.2 / EN 1993-1-5 §4.4', where: 'App. B3.3' },
  { qty: 'Global deflection & girder stresses', eq: 'beam theory', where: 'App. B2.2' },
  { qty: 'Cross-beam spring stiffness K_CB', eq: 'L³/(48EI)', where: 'App. B2.3' },
  { qty: 'Navier stress in rib σ = M/I·z + N/A', eq: '4.1', where: '§4.6, App. B3.2/B4.4' },
];

export default function References() {
  return (
    <div className="space-y-6">
      <Card title="Equation map" subtitle="where every computed quantity comes from">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-steel-200 text-[11px] uppercase tracking-wide text-steel-500">
                <th className="py-2 pr-4 font-medium">Quantity</th>
                <th className="num py-2 pr-4 font-medium">Equation</th>
                <th className="py-2 font-medium">Thesis location</th>
              </tr>
            </thead>
            <tbody>
              {MAP.map((m) => (
                <tr key={m.qty} className="border-b border-steel-100 last:border-0">
                  <td className="py-2 pr-4 text-steel-800">{m.qty}</td>
                  <td className="num py-2 pr-4 text-steel-600">{m.eq}</td>
                  <td className="py-2 text-steel-500">{m.where}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card title="Source document">
          <p className="text-sm leading-relaxed text-steel-700">
            J. Håkansson, H. Wallerman, <em>Finite Element Design of Orthotropic Steel Bridge Decks</em>,
            Master&apos;s Thesis 2015:112, Department of Civil and Environmental Engineering, Chalmers
            University of Technology, Göteborg, 2015. The PDF is part of this repository
            (<span className="num text-xs">Finite Element Design of Orthotropic_CHALMERS.pdf</span>).
          </p>
          <Note>
            The worked example implemented here is the case study of §4 / Appendix B: a 30 m simply supported
            plate-girder OSD bridge, 6 m wide deck, ten trapezoidal ribs (300/250×200×4 mm) at 600 mm c/c on a
            16 mm deck plate, reduced to an equivalent 2D orthotropic plate via general shell stiffness.
          </Note>
        </Card>
        <Card title="Secondary references used by the example">
          <ul className="list-disc space-y-1.5 pl-5 text-sm text-steel-700">
            <li>Blaauwendraad, J. (2010): <em>Plates and FEM: Formulations and Freedom</em> — rigidity matrices of orthotropic plates.</li>
            <li>Cowper, G. R. (1966): <em>The shear coefficient in Timoshenko&apos;s beam theory</em> — κ for thin-walled box sections.</li>
            <li>EN 1993-1-1 &amp; EN 1993-1-5: Eurocode 3 — plated steel elements, effective widths, cross-section classes.</li>
            <li>Johansson, B. et al. (2007): <em>Commentary and Worked Examples to EN 1993-1-1</em>.</li>
          </ul>
        </Card>
      </div>

      <Card title="About this app">
        <div className="grid gap-6 text-sm leading-relaxed text-steel-700 md:grid-cols-2">
          <p>
            <strong className="font-semibold text-steel-900">OrthoDeck Studio</strong> is a TypeScript + React +
            Vite + Tailwind web application with an Electron desktop shell. All calculations are pure functions
            in <span className="num text-xs">src/lib</span>, evaluated live from the Inputs page and covered by
            unit tests (<span className="num text-xs">npm test</span>) that assert agreement with the published
            reference values.
          </p>
          <p>
            Three deformation quantities of the example (frame rotation φ, reduced plate moment m_xx,1 and shear
            frame deflection δ_shear) are results of a 2D frame FE analysis in the source document; they are
            kept as explicit, editable inputs with the case-study values as defaults, so the equation chain
            remains exact while still accepting results from any frame solver.
          </p>
        </div>
      </Card>
    </div>
  );
}
