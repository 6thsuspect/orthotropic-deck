import type { AppInputs } from './types';

/** Geometry derived directly from the raw inputs. */
export interface DerivedGeometry {
  /** c/c distance between longitudinal stiffeners b_rib = bs.top + ds [m] */
  bRib: number;
  /** Total deck width btot = nstiff * b_rib [m] */
  bTot: number;
  /** Inclined rib web length ls [m] */
  ls: number;
  /** Distance from plate top to bottom of rib zbot [m] */
  zBot: number;
  /** Shear modulus G = E / (2(1+nu)) [Pa] */
  G: number;
  /** eps = sqrt(235/fy) [-] (EN 1993-1-1 Table 5.2) */
  eps: number;
}

export function derivedGeometry(inp: AppInputs): DerivedGeometry {
  const { deck, material } = inp;
  const bRib = deck.bsTop + deck.ds;
  return {
    bRib,
    bTot: deck.nStiff * bRib,
    ls: Math.sqrt(deck.hs ** 2 + ((deck.bsTop - deck.bsBot) / 2) ** 2),
    zBot: deck.tp + deck.hs + deck.ts / 2,
    G: material.E / (2 * (1 + material.nu)),
    eps: Math.sqrt(235e6 / material.fy),
  };
}

/** A thin rectangular wall of the cross-section. */
interface Part {
  name: string;
  /** area [m^2] */
  A: number;
  /** centroid depth from top of deck plate [m] */
  z: number;
  /** second moment of area about own horizontal centroidal axis [m^4] */
  I: number;
}

/**
 * Composite cross-section of one longitudinal stiffener together with its
 * share of the deck plate (width b_rib), cf. Figure B2.7 of the thesis.
 */
export interface CompositeSection {
  parts: Part[];
  /** total area Astiff [m^2] */
  A: number;
  /** centroid from top of deck plate zstiff.CG [m] */
  zCG: number;
  /** second moment of area about horizontal axis Istiff.y [m^4] */
  Iy: number;
  /** area of the rib alone (without deck plate) Ab [m^2] */
  ARib: number;
}

/** Second moment of area about the horizontal axis of a rotated thin rectangle. */
function rotatedRectI(thickness: number, length: number, angleFromVertical: number): number {
  const w = thickness;
  const h = length;
  const c = Math.cos(angleFromVertical);
  const s = Math.sin(angleFromVertical);
  return (w * h ** 3 * c * c + h * w ** 3 * s * s) / 12;
}

export function compositeSection(inp: AppInputs): CompositeSection {
  const { deck } = inp;
  const g = derivedGeometry(inp);
  const incl = Math.atan((deck.bsTop - deck.bsBot) / 2 / deck.hs);

  const plate: Part = {
    name: 'Deck plate (b_rib wide)',
    A: g.bRib * deck.tp,
    z: deck.tp / 2,
    I: (g.bRib * deck.tp ** 3) / 12,
  };
  const web: Part = {
    name: 'Rib web (each, inclined)',
    A: g.ls * deck.ts,
    z: deck.tp + deck.hs / 2,
    I: rotatedRectI(deck.ts, g.ls, incl),
  };
  const bottom: Part = {
    name: 'Rib bottom flange',
    A: deck.bsBot * deck.ts,
    z: deck.tp + deck.hs + deck.ts / 2,
    I: (deck.bsBot * deck.ts ** 3) / 12,
  };

  const parts = [plate, web, web, bottom];
  const A = parts.reduce((s, p) => s + p.A, 0);
  const zCG = parts.reduce((s, p) => s + p.A * p.z, 0) / A;
  const Iy = parts.reduce((s, p) => s + p.I + p.A * (p.z - zCG) ** 2, 0);
  const ARib = 2 * web.A + bottom.A;
  return { parts, A, zCG, Iy, ARib };
}

/**
 * Cross-section of the longitudinal stiffener after Eurocode effective-width
 * reduction of the class-4 parts (web and bottom flange), cf. B3.3.4/B3.3.5.
 * The ineffective middle portion of each wall is removed; the effective
 * width is placed half at each supported edge (thesis Figures B3.10/B3.11).
 */
export function reducedSection(
  inp: AppInputs,
  eff: { beffWeb: number; beffBot: number },
): CompositeSection {
  const { deck } = inp;
  const g = derivedGeometry(inp);
  const incl = Math.atan((deck.bsTop - deck.bsBot) / 2 / deck.hs);

  const cutWeb = Math.max(0, g.ls - eff.beffWeb);
  const cutBot = Math.max(0, deck.bsBot - eff.beffBot);

  const base = compositeSection(inp);
  const removals: Part[] = [
    {
      name: 'Removed web (each)',
      A: -cutWeb * deck.ts,
      z: deck.tp + deck.hs / 2,
      I: -rotatedRectI(deck.ts, cutWeb, incl),
    },
    {
      name: 'Removed web (each)',
      A: -cutWeb * deck.ts,
      z: deck.tp + deck.hs / 2,
      I: -rotatedRectI(deck.ts, cutWeb, incl),
    },
    {
      name: 'Removed bottom flange',
      A: -cutBot * deck.ts,
      z: deck.tp + deck.hs + deck.ts / 2,
      I: -(cutBot * deck.ts ** 3) / 12,
    },
  ];

  const parts = [...base.parts, ...removals];
  const A = parts.reduce((s, p) => s + p.A, 0);
  const zCG = parts.reduce((s, p) => s + p.A * p.z, 0) / A;
  const Iy = parts.reduce((s, p) => s + p.I + p.A * (p.z - zCG) ** 2, 0);
  return { parts, A, zCG, Iy, ARib: base.ARib - 2 * cutWeb * deck.ts - cutBot * deck.ts };
}

/**
 * Full bridge cross-section: deck (all rib strips) plus the two plate girders.
 * Reproduces A = 178 000 mm^2 of Appendix B1 (AutoCAD) for the case study.
 */
export function fullSectionArea(inp: AppInputs): number {
  const sec = compositeSection(inp);
  const girder = inp.bridge.hw * inp.bridge.tw + inp.bridge.bf * inp.bridge.tf;
  return inp.deck.nStiff * sec.A + 2 * girder;
}

/**
 * Web area of one cross beam excluding the rib cut-outs
 * (analytical stand-in for the AutoCAD area ACB.w.real of Figure B1.3).
 */
export function crossBeamWebArea(inp: AppInputs): number {
  const g = derivedGeometry(inp);
  const cutOut = ((inp.deck.bsTop + inp.deck.bsBot) / 2) * g.ls;
  return g.bTot * inp.bridge.hwCB - inp.deck.nStiff * cutOut;
}
