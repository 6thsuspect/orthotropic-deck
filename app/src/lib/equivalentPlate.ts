import type { AppInputs } from './types';
import { compositeSection, derivedGeometry } from './sections';

/**
 * Equivalent 2D orthotropic plate rigidities, Section 3.2.2 / Appendix B4.2
 * of Chalmers Master's Thesis 2015:112.
 *
 * Units of the results:
 *  - membrane rigidities d** : Pa*m  (N/m per m/m, i.e. Pa*m^2/m)
 *  - flexural rigidities  D** : Pa*m^3 (Pa*m^4/m)
 *  - shear rigidities     Ds* : Pa*m  (Pa*m^2/m)
 */
export interface MembraneRigidity {
  /** d_xx, transverse membrane rigidity [Pa*m] */
  dxx: number;
  /** d_v = nu * d_xx, lateral contraction [Pa*m] */
  dv: number;
  /** d_yy, longitudinal membrane rigidity incl. ribs [Pa*m] */
  dyy: number;
  /** d_xy, membrane shear rigidity [Pa*m] */
  dxy: number;
  /** rib area without outstanding plate part Ab [m^2] */
  Ab: number;
}

export interface FlexuralRigidity {
  /** D_xx transverse flexural rigidity, eq 3.2 [Pa*m^3] */
  Dxx: number;
  /** D_v lateral contraction term, eq 3.15/3.16 [Pa*m^3] */
  Dv: number;
  /** D_yy longitudinal flexural rigidity, eq 3.14 [Pa*m^3] */
  Dyy: number;
  /** D_aa average torsional rigidity, eq 3.17 [Pa*m^3] */
  Dav: number;
  /** reduced transverse rigidity factor (b0*mxx + b1*mxx1)/(b*mxx) [-] */
  redFactor: number;
  /** torsional moment of inertia of the plate i_xy [m^4/m] */
  ixy: number;
  /** torsional moment of inertia incl. rib i_yx [m^4/m] */
  iyx: number;
  /** average torsional moment of inertia i_aa [m^4/m] */
  iav: number;
  /** polar (St. Venant) moment of inertia of the closed rib It [m^4] */
  It: number;
  /** average width of the rib b_av [m] */
  bav: number;
  /** area enclosed by the rib walls As [m^2] */
  As: number;
}

export interface ShearRigidity {
  /** shear stiffness of the rib strip K_sx [N/m^2] */
  Ksx: number;
  /** transverse shear rigidity D_sx, eq 3.23 [Pa*m] */
  Dsx: number;
  /** longitudinal shear rigidity D_sy, eq 3.24 [Pa*m] */
  Dsy: number;
  /** Cowper box parameter m_box [-] */
  mbox: number;
  /** Cowper box parameter n_box [-] */
  nbox: number;
  /** Cowper shear factor kappa_box [-] */
  kappaBox: number;
  /** shear-reduced stiffener area A_sy [m^2] */
  Asy: number;
}

export interface Alternative1 {
  /** equivalent second moment of area Ieq [m^4/m] */
  Ieq: number;
  /** equivalent thickness teq [m] */
  teq: number;
  /** equivalent transverse Young's modulus E2 [Pa] */
  E2: number;
  /** equivalent shear modulus G23 [Pa] */
  G23: number;
}

export interface EquivalentPlateResult {
  membrane: MembraneRigidity;
  flexural: FlexuralRigidity;
  shear: ShearRigidity;
  alt1: Alternative1;
  /** 6x6 general shell stiffness matrix D (eq 3.10), rows/cols 11,22,33,12,13,23 */
  D: number[][];
  /** 2x2 transverse shear rigidity matrix [K11, K12; K12, K22] */
  Dshear: number[][];
}

export function equivalentPlate(inp: AppInputs): EquivalentPlateResult {
  const { material, deck, frame } = inp;
  const g = derivedGeometry(inp);
  const sec = compositeSection(inp);
  const { E, nu } = material;

  // ---- B4.2.1 membrane rigidity (eq 3.11 - 3.13) -------------------------
  const Ab = sec.A - deck.tp * g.bRib; // rib walls only
  const dPlate = (E * deck.tp) / (1 - nu ** 2);
  const membrane: MembraneRigidity = {
    dxx: dPlate,
    dv: (nu * E * deck.tp) / (1 - nu ** 2),
    dyy: dPlate + (E * Ab) / g.bRib,
    dxy: (dPlate * (1 - nu)) / 2,
    Ab,
  };

  // ---- B4.2.2 flexural rigidity (eq 3.2, 3.14 - 3.21) --------------------
  const Dxx = (frame.mxx / (2 * frame.phi)) * g.bRib; // eq 3.2
  const Dyy = (E * sec.Iy) / g.bRib; // eq 3.14
  const b0 = g.bRib - deck.bsTop; // outstanding plate parts
  const b1 = deck.bsTop; // plate between the webs
  const redFactor = (b0 * frame.mxx + b1 * frame.mxx1) / (g.bRib * frame.mxx); // eq 3.15
  const Dv = nu * redFactor * Dxx; // eq 3.16

  const ixy = deck.tp ** 3 / 6; // eq 3.19
  const bav = (deck.bsTop + deck.bsBot) / 2;
  const As = deck.hs * bav;
  const It =
    (4 * As ** 2) / (deck.bsTop / deck.tp + deck.bsBot / deck.ts + (2 * deck.hs) / deck.ts); // eq 3.21
  const iyx =
    (It +
      (deck.tp ** 3 * g.bRib) / 6 +
      (deck.ts ** 3 * deck.bsBot) / 3 +
      (2 * deck.ts ** 3 * deck.hs) / 3) /
    g.bRib; // eq 3.20
  const iav = (iyx + ixy) / 2; // eq 3.18
  const Dav = (g.G * iav) / 2; // eq 3.17

  const flexural: FlexuralRigidity = {
    Dxx,
    Dv,
    Dyy,
    Dav,
    redFactor,
    ixy,
    iyx,
    iav,
    It,
    bav,
    As,
  };

  // ---- B4.2.3 shear rigidity (eq 3.22 - 3.24, Cowper 1966) ---------------
  const Ksx = frame.vx / frame.deltaShear; // eq 3.22
  const Dsx = g.bRib / (1 / Ksx - g.bRib ** 3 / (12 * Dxx)); // eq 3.23

  const mbox = (bav * deck.tp) / (deck.hs * deck.ts);
  const nbox = bav / deck.hs;
  const kappaBox =
    (10 * (1 + nu) * (1 + 3 * mbox) ** 2) /
    (12 +
      72 * mbox +
      150 * mbox ** 2 +
      90 * mbox ** 3 +
      nu * (11 + 66 * mbox + 135 * mbox ** 2 + 90 * mbox ** 3) +
      10 * nbox ** 2 * ((3 + nu) * mbox + 3 * mbox ** 2));
  const Asy = sec.A * kappaBox;
  const Dsy = (g.G * Asy) / g.bRib; // eq 3.24

  const shear: ShearRigidity = { Ksx, Dsx, Dsy, mbox, nbox, kappaBox, Asy };

  // ---- B4.1 alternative 1: equivalent thickness --------------------------
  const Ieq = Dyy / E;
  const alt1: Alternative1 = {
    Ieq,
    teq: (12 * Ieq) ** (1 / 3),
    E2: Dxx / Ieq,
    G23: Dxx / Ieq / (2 * (1 + nu)),
  };

  // ---- B4.2.4 stiffness matrices (eq 3.10) -------------------------------
  const z = 0;
  const D = [
    [membrane.dxx, membrane.dv, z, z, z, z],
    [membrane.dv, membrane.dyy, z, z, z, z],
    [z, z, membrane.dxy, z, z, z],
    [z, z, z, flexural.Dxx, flexural.Dv, z],
    [z, z, z, flexural.Dv, flexural.Dyy, z],
    [z, z, z, z, z, flexural.Dav],
  ];
  const Dshear = [
    [shear.Dsx, 0],
    [0, shear.Dsy],
  ];

  return { membrane, flexural, shear, alt1, D, Dshear };
}

/**
 * Navier stress in the longitudinal stiffener for given sectional forces
 * (eq 4.1): sigma = M/I * z + N/A.
 */
export function navierStress(
  inp: AppInputs,
  M: number,
  N: number,
): { top: number; bottom: number; zTop: number; zBot: number } {
  const sec = compositeSection(inp);
  const g = derivedGeometry(inp);
  const zTop = sec.zCG - inp.deck.tp / 2;
  const zBot = g.zBot - sec.zCG;
  return {
    top: (-M / sec.Iy) * zTop + N / sec.A,
    bottom: (M / sec.Iy) * zBot + N / sec.A,
    zTop,
    zBot,
  };
}
