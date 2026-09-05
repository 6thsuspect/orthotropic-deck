import type { AppInputs } from './types';

/**
 * Default input set = the case study of Chalmers Master's Thesis 2015:112
 * (Appendix B1, Figures 4.1/4.2 and Appendix B4).
 * Units: SI (m, Pa, kg/m^3, rad, N).
 */
export const CASE_STUDY_INPUTS: AppInputs = {
  material: {
    E: 210e9, // 210 GPa
    nu: 0.3,
    rho: 7850, // kg/m^3
    fy: 355e6, // 355 MPa
    g: 9.81,
  },
  deck: {
    tp: 0.016, // 16 mm deck plate
    hs: 0.2, // 200 mm rib web height
    bsTop: 0.3, // 300 mm rib top width
    bsBot: 0.25, // 250 mm rib bottom width
    ts: 0.004, // 4 mm rib walls
    ds: 0.3, // 300 mm clear distance between ribs
    nStiff: 10,
  },
  bridge: {
    ltot: 30,
    hw: 1.5,
    tw: 0.012,
    tf: 0.025,
    bf: 0.4,
    nCB: 11,
    dcross: 3,
    hwCB: 0.6,
    twCB: 0.01,
    tfCB: 0.02,
    bfCB: 0.25,
    Q: 10e3, // 10 kN/m^2 uniform load (verification, load case 5)
  },
  frame: {
    mxx: 10e3, // 10 kN*m/m
    phi: 0.041, // rad, Strusoft (Fig. B4.3)
    mxx1: 9.6e3, // 9.6 kN*m/m, Strusoft (Fig. B4.5)
    vx: 10e3, // 10 kN/m
    deltaShear: 10.246e-3, // m, Strusoft (Fig. B4.6)
  },
};

export const cloneInputs = (i: AppInputs): AppInputs =>
  JSON.parse(JSON.stringify(i)) as AppInputs;
