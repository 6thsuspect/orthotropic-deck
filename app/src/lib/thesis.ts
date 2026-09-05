/**
 * Reference values quoted in Chalmers Master's Thesis 2015:112 for the case
 * study (Appendices B1-B4). They are used read-only, to compare the results
 * computed by this app against the published worked example.
 */
export const THESIS = {
  // B1 indata / AutoCAD section properties
  section: {
    Astiff: 12200e-6, // m^2
    zstiffCG: 39.21e-3, // m
    IstiffY: 55585098.53e-12, // m^4
    AstiffRed: 11402.92e-6,
    zstiffCGRed: 30.52e-3,
    IstiffYRed: 40256214.72e-12,
    AFull: 178000e-6,
    zCG: 353.54e-3,
    IyFull: 53095627213.07e-12,
    ACBwReal: 3036925e-6,
    GselfCB: 51.121e3,
  },
  // B2 verification
  shearLag: {
    beffCant: 1.185,
    beffMid: 1.749,
    beff: 2.933,
    Ihalf: 26420192820.89e-12,
    zCGMain: 357.69e-3,
  },
  global: {
    gSelf: 13.703e3,
    gSelfCBSmeared: 1.704e3,
    q: 75.407e3,
    deltaMax: 71.672e-3,
    Mmax: 4.242e6,
    sigmaTop: -54.857e6,
    sigmaBot: 185.961e6,
  },
  crossBeam: {
    beffCB: 0.2,
    zCGCB: 0.314,
    ICB: 1.182e9 * 1e-12,
    FCB: 3.916e-9,
    KCB: 2.554e5 * 1e3,
  },
  rib: {
    gStiff: 0.939e3,
    qRib: 6.939e3,
  },
  // B4.2 equivalent plate
  membrane: { dxx: 3.692e9, dv: 1.108e9, dyy: 4.602e9, dxy: 1.292e9, Ab: 2.6e-3 },
  flexural: {
    Dxx: 7.317e4,
    Dv: 2.151e4,
    Dyy: 19.455e6,
    Dav: 2.275e6,
    ixy: 6.827e-7,
    iyx: 1.12e-4,
    iav: 5.633e-5,
    It: 6.676e-5,
  },
  shear: {
    Ksx: 975.991e3,
    Dsx: 7.706e5,
    Dsy: 2.351e8,
    mbox: 5.5,
    nbox: 1.375,
    kappaBox: 0.143,
    Asy: 1.747e-3,
  },
  alt1: { Ieq: 9.26e-5, teq: 103.59e-3, E2: 0.79e9, G23: 0.304e9 },
  eurocode: {
    eps: 0.814,
    webLambda: 1.09,
    webRho: 0.732,
    webBeff: 0.148,
    botLambda: 1.352,
    botRho: 0.619,
    botBeff: 0.155,
  },
} as const;

/** Relative difference between computed and reference value, in percent. */
export function devPct(computed: number, reference: number): number {
  if (reference === 0) return Number.NaN;
  return ((computed - reference) / Math.abs(reference)) * 100;
}
