/**
 * Input data for the orthotropic steel deck (OSD) case study.
 * All values are stored in SI base units: m, Pa, kg/m^3, rad, N.
 *
 * Source of the default set: Appendix B1 ("Indata") of
 * Håkansson & Wallerman, "Finite Element Design of Orthotropic Steel
 * Bridge Decks", Chalmers Master's Thesis 2015:112.
 */
export interface MaterialInputs {
  /** Young's modulus E [Pa] */
  E: number;
  /** Poisson's ratio nu [-] */
  nu: number;
  /** Steel density rho [kg/m^3] */
  rho: number;
  /** Yield strength fy [Pa] */
  fy: number;
  /** Gravitational acceleration g [m/s^2] */
  g: number;
}

export interface DeckInputs {
  /** Deck plate thickness tp [m] */
  tp: number;
  /** Stiffener (rib) web height hs [m] */
  hs: number;
  /** Stiffener top width bs.top [m] */
  bsTop: number;
  /** Stiffener bottom width bs.bot [m] */
  bsBot: number;
  /** Stiffener wall thickness ts [m] */
  ts: number;
  /** Clear distance between stiffeners ds [m] */
  ds: number;
  /** Number of longitudinal stiffeners [-] */
  nStiff: number;
}

export interface BridgeInputs {
  /** Bridge length ltot [m] */
  ltot: number;
  /** Main girder web height hw [m] */
  hw: number;
  /** Main girder web thickness tw [m] */
  tw: number;
  /** Main girder bottom flange thickness tf [m] */
  tf: number;
  /** Main girder bottom flange width bf [m] */
  bf: number;
  /** Number of transversal stiffeners (cross beams) [-] */
  nCB: number;
  /** Spacing between cross beams dcross [m] */
  dcross: number;
  /** Cross beam web height hw.CB [m] */
  hwCB: number;
  /** Cross beam web thickness tw.CB [m] */
  twCB: number;
  /** Cross beam flange thickness tf.CB [m] */
  tfCB: number;
  /** Cross beam flange width bf.CB [m] */
  bfCB: number;
  /** Uniform traffic load used in the verification Q [Pa] */
  Q: number;
}

/**
 * Results of the 2D transverse frame analysis ("Strusoft Frame analysis",
 * Figures B4.3, B4.5 and B4.6 of the thesis). These three quantities are
 * FE-derived in the reference document and are therefore kept as explicit
 * inputs with the case-study values as defaults.
 */
export interface FrameAnalysisInputs {
  /** Bending moment applied in the rotation frame mxx [N*m/m] */
  mxx: number;
  /** End rotation of the rib strip frame phi [rad] (Fig. B4.3) */
  phi: number;
  /** Reduced plate moment between the rib webs mxx,1 [N*m/m] (Fig. B4.5) */
  mxx1: number;
  /** Shear force applied in the shear frame vx [N/m] */
  vx: number;
  /** Relative end deflection of the shear frame delta_shear [m] (Fig. B4.6) */
  deltaShear: number;
}

export interface AppInputs {
  material: MaterialInputs;
  deck: DeckInputs;
  bridge: BridgeInputs;
  frame: FrameAnalysisInputs;
}
