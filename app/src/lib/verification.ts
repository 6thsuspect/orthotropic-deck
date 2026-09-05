import type { AppInputs } from './types';
import { compositeSection, crossBeamWebArea, derivedGeometry, fullSectionArea } from './sections';
import { shearLag } from './eurocode';

/**
 * Global verification hand calculations, Appendix B2.2 / B2.3 of the thesis:
 * simply supported half-girder beam with the shear-lag effective flange.
 */
export interface GlobalVerification {
  /** self weight of the cross section gself [N/m] */
  gSelf: number;
  /** weight of all cross beams Gself.CB [N] */
  GselfCB: number;
  /** smeared cross beam weight gself.CB.smeared [N/m] */
  gSelfCBSmeared: number;
  /** total distributed load q = Q*btot + gself + gself.CB.smeared [N/m] */
  q: number;
  /** mid-span deflection of half the bridge [m] */
  deltaMax: number;
  /** maximum mid-span moment of half the bridge [N*m] */
  Mmax: number;
  /** tensile stress at top of main girder [Pa] */
  sigmaTop: number;
  /** compressive stress at bottom of main girder [Pa] */
  sigmaBot: number;
}

export function globalVerification(inp: AppInputs): GlobalVerification {
  const { bridge, material, deck } = inp;
  const g = derivedGeometry(inp);
  const sl = shearLag(inp);

  const AFull = fullSectionArea(inp);
  const gSelf = material.rho * AFull * material.g;

  const VCB = crossBeamWebArea(inp) * bridge.twCB + bridge.bfCB * bridge.tfCB * g.bTot;
  const GselfCB = bridge.nCB * VCB * material.rho * material.g;
  const gSelfCBSmeared = GselfCB / bridge.ltot;

  const q = bridge.Q * g.bTot + gSelf + gSelfCBSmeared;

  const deltaMax = (5 * (q / 2) * bridge.ltot ** 4) / (384 * material.E * sl.Ihalf);
  const Mmax = ((q / 2) * bridge.ltot ** 2) / 8;
  const sigmaTop = (-Mmax / sl.Ihalf) * (sl.zCGMain - deck.tp);
  const sigmaBot = (Mmax / sl.Ihalf) * (deck.tp + bridge.hw - sl.zCGMain);

  return { gSelf, GselfCB, gSelfCBSmeared, q, deltaMax, Mmax, sigmaTop, sigmaBot };
}

/**
 * Transversal stiffener modelled as a simply supported beam with effective
 * plate flange, Appendix B2.3: flexibility and spring stiffness K_CB.
 */
export interface CrossBeamStiffness {
  /** effective plate width each side beff.CB [m] */
  beffCB: number;
  /** effective span LCB [m] */
  LCB: number;
  /** effective web height (without cut-outs) hCB.av [m] */
  hCBAv: number;
  /** centroid from top of plate zCG.CB [m] */
  zCGCB: number;
  /** second moment of area ICB [m^4] */
  ICB: number;
  /** deflection per unit force FCB [m/N] */
  FCB: number;
  /** spring stiffness KCB [N/m] */
  KCB: number;
}

export function crossBeamStiffness(inp: AppInputs): CrossBeamStiffness {
  const { bridge, deck } = inp;
  const g = derivedGeometry(inp);

  const beffCB = bridge.twCB / 2 + 15 * g.eps * deck.tp;
  const LCB = 6 * g.bRib;
  // thesis B2.3: effective web height = cross beam web height minus rib depth
  const hCBAv = bridge.hwCB - deck.hs;

  const aPlate = 2 * beffCB * deck.tp;
  const zPlate = deck.tp / 2;
  const aWeb = hCBAv * bridge.twCB;
  const zWeb = deck.tp + (bridge.hwCB - hCBAv) + hCBAv / 2;
  const aFlange = bridge.bfCB * bridge.tfCB;
  const zFlange = deck.tp + bridge.hwCB + bridge.tfCB / 2;

  const zCGCB = (aPlate * zPlate + aWeb * zWeb + aFlange * zFlange) / (aPlate + aWeb + aFlange);

  const ICB =
    (2 * beffCB * deck.tp ** 3) / 12 +
    aPlate * (zPlate - zCGCB) ** 2 +
    (bridge.twCB * hCBAv ** 3) / 12 +
    aWeb * (zWeb - zCGCB) ** 2 +
    (bridge.bfCB * bridge.tfCB ** 3) / 12 +
    aFlange * (zFlange - zCGCB) ** 2;

  const FCB = LCB ** 3 / (48 * inp.material.E * ICB);
  return { beffCB, LCB, hCBAv, zCGCB, ICB, FCB, KCB: 1 / FCB };
}

/**
 * Longitudinal rib as a continuous beam on the cross beams (3 m spans),
 * used for the local bending moments of Appendix B2.4.
 * Returns mid-span moment of the end-span rib strip under line load qrib.
 */
export interface RibBeam {
  /** line load on one rib qrib = Q*srib + gstiff [N/m] */
  qRib: number;
  /** self weight of one rib gstiff [N/m] */
  gStiff: number;
  /** mid-span bending moment, simply supported spans [N*m] */
  MSimply: number;
}

export function ribBeam(inp: AppInputs): RibBeam {
  const { bridge, material } = inp;
  const g = derivedGeometry(inp);
  const sec = compositeSection(inp);
  const gStiff = sec.A * material.rho * material.g;
  const qRib = bridge.Q * g.bRib + gStiff;
  const MSimply = (qRib * bridge.dcross ** 2) / 8;
  return { qRib, gStiff, MSimply };
}
