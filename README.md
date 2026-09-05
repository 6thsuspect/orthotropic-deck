# orthotropic-deck

Design of orthotropic steel bridge decks (OSD) — companion web + desktop application for the
Chalmers Master's Thesis 2015:112, *Finite Element Design of Orthotropic Steel Bridge Decks*
(J. Håkansson, H. Wallerman, 2015), whose PDF is stored in this repository.

## The worked example

The thesis reduces a detailed OSD bridge deck (16 mm deck plate with trapezoidal closed ribs
300/250 × 200 × 4 mm at 600 mm c/c) to an **equivalent 2D orthotropic plate** by smearing the rib
stiffness into membrane, flexural, torsional and shear rigidities, assembled into a general shell
stiffness matrix **D** (thesis §3.2.2, §4.4 and Appendix B4):

| Block      | Case-study result (thesis App. B4)                        |
| ---------- | --------------------------------------------------------- |
| Membrane   | d = [3.692, 1.108, 4.602, 1.292] ×10⁹ Pa·m                 |
| Flexural   | D = [7.317×10⁴, 2.151×10⁴, 1.945×10⁷, 2.275×10⁶] Pa·m³    |
| Shear      | D_shear = diag(7.706×10⁵, 2.351×10⁸) Pa·m                 |

`app/` re-implements the complete hand-calculation chain (equations 3.2, 3.10–3.24, the EN 1993
effective-width checks of Appendix B3 and the verification of Appendix B2) as live, tested
TypeScript, and compares every result with the published reference values.

## App — OrthoDeck Studio

TypeScript + React + Vite + Tailwind CSS, with an Electron desktop shell.

```
app/
├── electron/          # Electron main + preload (desktop shell)
├── src/
│   ├── lib/           # pure calculation engine (SI units) + vitest suites
│   │   ├── sections.ts        # rib-strip & bridge section properties
│   │   ├── eurocode.ts        # EN 1993-1-1/-1-5 classes, effective widths, shear lag
│   │   ├── equivalentPlate.ts # the worked example: rigidities + matrix D
│   │   ├── verification.ts    # Appendix B2 global / cross-beam checks
│   │   └── thesis.ts          # published reference values (read-only)
│   ├── pages/         # Overview, Inputs, Stiffener section, Equivalent plate, Verification, References
│   ├── components/    # cards, comparison rows, matrices, parametric section SVGs
│   └── state/         # input model with localStorage persistence
└── package.json
```

### Pages

- **Overview** – KPIs and a computed-vs-thesis comparison of the example.
- **Inputs** – material, deck, bridge and frame-analysis data (Appendix B1 defaults), live SVG
  cross-sections, JSON export.
- **Stiffener section** – composite rib-strip properties, cross-section class 4 checks and
  effective-width reduction, reduced section, Navier stress tool (eq 4.1).
- **Equivalent plate** – the worked example step by step (B4.2), the 6×6 general shell stiffness
  matrix and the equivalent-thickness alternative (B4.1).
- **Verification** – shear-lag effective widths, global deflection/stresses, cross-beam spring
  stiffness (B2), plus the thesis' FE benchmarks.
- **Equations & refs** – traceability of every quantity to thesis equations and pages.

### Run it

```bash
cd app
npm install

npm run dev          # web app on http://localhost:5173
npm test             # 28 vitest & smoke-test assertions against the thesis reference values
npm run build        # type-check + production build to dist/

npm run electron:dev # desktop shell around the Vite dev server
npm run electron:start  # desktop shell around dist/ (run npm run build first)
npm run electron:pack   # package with electron-builder
```

### Notes on fidelity

- All calculations are analytic thin-walled-section formulas in SI units; reference values from
  the thesis (AutoCAD-derived section properties, Strusoft frame results) are quoted for
  comparison. Residual deviations (≤ ~1.5 %, shown per row) are documented in the unit tests.
- The three deformation quantities that the thesis obtains from a 2D frame FE analysis
  (rotation φ = 0.041 rad, reduced plate moment m_xx,1 = 9.6 kN·m/m, shear deflection
  δ_shear = 10.246 mm, Figures B4.3/B4.5/B4.6) are explicit inputs with the case-study values as
  defaults, so the equation chain stays exact for any deck geometry.

## Repository

- `Finite Element Design of Orthotropic_CHALMERS.pdf` – source document (Chalmers, 2015).
- Work branch: `arena/01a070a0-orthotropic-deck`.
