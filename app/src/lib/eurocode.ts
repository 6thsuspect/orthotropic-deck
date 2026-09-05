import type { AppInputs } from './types';
import { compositeSection, derivedGeometry } from './sections';

/** Cross-section class limits used by the case study (EN 1993-1-1 Table 5.2). */
export interface ClassCheck {
  part: string;
  type: string;
  /** slenderness c/t [-] */
  ct: number;
  /** class-4 limit [-] */
  limit: number;
  /** governing class (1..4), simplified like the thesis */
  cls: 1 | 3 | 4;
  isClass4: boolean;
}

export function classChecks(inp: AppInputs): ClassCheck[] {
  const { deck } = inp;
  const g = derivedGeometry(inp);
  const checks: ClassCheck[] = [];

  checks.push({
    part: 'Deck plate between stiffeners',
    type: 'Internal compression part',
    ct: deck.ds / deck.tp,
    limit: 33 * g.eps,
    cls: deck.ds / deck.tp <= 33 * g.eps ? 1 : 4,
    isClass4: deck.ds / deck.tp > 33 * g.eps,
  });
  checks.push({
    part: 'Web of longitudinal stiffener',
    type: 'Internal compression part',
    ct: g.ls / deck.ts,
    limit: 42 * g.eps,
    cls: g.ls / deck.ts <= 42 * g.eps ? 3 : 4,
    isClass4: g.ls / deck.ts > 42 * g.eps,
  });
  checks.push({
    part: 'Bottom flange of longitudinal stiffener',
    type: 'Internal compression part',
    ct: deck.bsBot / deck.ts,
    limit: 42 * g.eps,
    cls: deck.bsBot / deck.ts <= 42 * g.eps ? 3 : 4,
    isClass4: deck.bsBot / deck.ts > 42 * g.eps,
  });
  return checks;
}

/** Plate slenderness and reduction factor, EN 1993-1-5 Section 4.4. */
export interface PlateReduction {
  /** plate slenderness lambda_p [-] */
  lambdaP: number;
  /** reduction factor rho [-] */
  rho: number;
  /** effective width beff [m] */
  beff: number;
  /** effective width at each edge be1 = be2 = beff/2 [m] */
  be1: number;
  be2: number;
}

export function plateReduction(
  b: number,
  t: number,
  eps: number,
  kSigma = 4.0,
  psi = 1.0,
): PlateReduction {
  const lambdaP = b / t / (28.4 * eps * Math.sqrt(kSigma));
  const rho = lambdaP > 0.748 ? (lambdaP - 0.055 * (3 + psi)) / lambdaP ** 2 : 1;
  const beff = Math.min(rho, 1) * b;
  return { lambdaP, rho: Math.min(rho, 1), beff, be1: beff / 2, be2: beff / 2 };
}

export interface EurocodeResults {
  eps: number;
  checks: ClassCheck[];
  web: PlateReduction;
  bottom: PlateReduction;
}

export function eurocodeReduction(inp: AppInputs): EurocodeResults {
  const g = derivedGeometry(inp);
  const checks = classChecks(inp);
  return {
    eps: g.eps,
    checks,
    web: plateReduction(g.ls, inp.deck.ts, g.eps),
    bottom: plateReduction(inp.deck.bsBot, inp.deck.ts, g.eps),
  };
}

/**
 * Half-bridge (one main girder) section with the shear-lag effective width
 * of the deck plate as top flange, EN 1993-1-5 Section 3.2.1 (Appendix B2.1).
 */
export interface ShearLag {
  Le: number;
  b0Cant: number;
  b0Mid: number;
  aSlI: number;
  aSlCant: number;
  aSlMid: number;
  alpha0Cant: number;
  alpha0Mid: number;
  kappaCant: number;
  kappaMid: number;
  betaCant: number;
  betaMid: number;
  beffCant: number;
  beffMid: number;
  /** total effective width of one main girder beff [m] */
  beff: number;
  /** number of ribs inside the effective width [-] */
  nRibEff: number;
  /** centroid from top of plate zCG.Main [m] */
  zCGMain: number;
  /** second moment of area Ihalf [m^4] */
  Ihalf: number;
}

export function shearLag(inp: AppInputs): ShearLag {
  const { bridge, deck } = inp;
  const g = derivedGeometry(inp);
  const sec = compositeSection(inp);

  const Le = bridge.ltot;
  const b0Cant = 2 * deck.bsTop + 2 * deck.ds;
  const b0Mid = g.bTot / 2 - b0Cant;

  // Area of one rib (walls only), Appendix B2.1: Asl.i = ts(2*ls + bs.bot)
  const aSlI = deck.ts * (2 * g.ls + deck.bsBot);
  const aSlCant = 2 * aSlI;
  const aSlMid = 3 * aSlI;

  const alpha0Cant = Math.sqrt(1 + aSlCant / (b0Cant * deck.tp));
  const alpha0Mid = Math.sqrt(1 + aSlMid / (b0Mid * deck.tp));
  const kappaCant = (alpha0Cant * b0Cant) / Le;
  const kappaMid = (alpha0Mid * b0Mid) / Le;
  const betaCant = 1 / (1 + 6.4 * kappaCant ** 2);
  const betaMid = 1 / (1 + 6.4 * kappaMid ** 2);
  const beffCant = betaCant * b0Cant;
  const beffMid = betaMid * b0Mid;
  const beff = beffCant + beffMid;

  // Half-girder composite section: effective plate + ribs within beff + girder
  const nRibEff = Math.max(1, Math.round(beff / g.bRib));
  const plate: [number, number, number] = [beff * deck.tp, deck.tp / 2, (beff * deck.tp ** 3) / 12];
  const ribs: [number, number, number] = [
    nRibEff * sec.ARib,
    deck.tp + deck.hs / 2 + 0.002,
    nRibEff * (sec.Iy - (g.bRib * deck.tp ** 3) / 12 - g.bRib * deck.tp * (deck.tp / 2 - sec.zCG) ** 2),
  ];
  const web: [number, number, number] = [
    bridge.hw * bridge.tw,
    deck.tp + bridge.hw / 2,
    (bridge.tw * bridge.hw ** 3) / 12,
  ];
  const flange: [number, number, number] = [
    bridge.bf * bridge.tf,
    deck.tp + bridge.hw + bridge.tf / 2,
    (bridge.bf * bridge.tf ** 3) / 12,
  ];
  const parts = [plate, ribs, web, flange];
  const A = parts.reduce((s, p) => s + p[0], 0);
  const zCGMain = parts.reduce((s, p) => s + p[0] * p[1], 0) / A;
  const Ihalf = parts.reduce((s, p) => s + p[2] + p[0] * (p[1] - zCGMain) ** 2, 0);

  return {
    Le,
    b0Cant,
    b0Mid,
    aSlI,
    aSlCant,
    aSlMid,
    alpha0Cant,
    alpha0Mid,
    kappaCant,
    kappaMid,
    betaCant,
    betaMid,
    beffCant,
    beffMid,
    beff,
    nRibEff,
    zCGMain,
    Ihalf,
  };
}
