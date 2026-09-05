import { describe, expect, it } from 'vitest';
import { CASE_STUDY_INPUTS } from '../defaults';
import { shearLag } from '../eurocode';
import { crossBeamStiffness, globalVerification, ribBeam } from '../verification';
import { THESIS, devPct } from '../thesis';

const sl = shearLag(CASE_STUDY_INPUTS);
const gv = globalVerification(CASE_STUDY_INPUTS);
const cb = crossBeamStiffness(CASE_STUDY_INPUTS);
const rb = ribBeam(CASE_STUDY_INPUTS);

describe('B2.1 shear lag effective width', () => {
  it('effective widths of the main girder flange', () => {
    expect(sl.beffCant).toBeCloseTo(THESIS.shearLag.beffCant, 3);
    expect(sl.beffMid).toBeCloseTo(THESIS.shearLag.beffMid, 3);
    expect(sl.beff).toBeCloseTo(THESIS.shearLag.beff, 3);
  });
  it('half girder section (AutoCAD reference)', () => {
    expect(Math.abs(devPct(sl.zCGMain, THESIS.shearLag.zCGMain))).toBeLessThan(5);
    expect(Math.abs(devPct(sl.Ihalf, THESIS.shearLag.Ihalf))).toBeLessThan(8);
  });
});

describe('B2.2 global behaviour', () => {
  it('loads', () => {
    expect(Math.abs(devPct(gv.gSelf, THESIS.global.gSelf))).toBeLessThan(0.5);
    expect(Math.abs(devPct(gv.gSelfCBSmeared, THESIS.global.gSelfCBSmeared))).toBeLessThan(2);
    expect(Math.abs(devPct(gv.q, THESIS.global.q))).toBeLessThan(1);
  });
  it('deflection and stresses', () => {
    expect(Math.abs(devPct(gv.deltaMax, THESIS.global.deltaMax))).toBeLessThan(8);
    expect(gv.Mmax).toBeCloseTo(THESIS.global.Mmax, -4);
    expect(Math.abs(devPct(gv.sigmaTop, THESIS.global.sigmaTop))).toBeLessThan(8);
    expect(Math.abs(devPct(gv.sigmaBot, THESIS.global.sigmaBot))).toBeLessThan(8);
  });
});

describe('B2.3 cross beam spring stiffness', () => {
  it('effective section and K_CB', () => {
    expect(cb.beffCB).toBeCloseTo(THESIS.crossBeam.beffCB, 3);
    expect(cb.zCGCB).toBeCloseTo(THESIS.crossBeam.zCGCB, 3);
    expect(Math.abs(devPct(cb.ICB, THESIS.crossBeam.ICB))).toBeLessThan(1);
    expect(Math.abs(devPct(cb.FCB, THESIS.crossBeam.FCB))).toBeLessThan(1);
    expect(Math.abs(devPct(cb.KCB, THESIS.crossBeam.KCB))).toBeLessThan(1);
  });
});

describe('B2.4 rib line load', () => {
  it('self weight and line load of one rib', () => {
    expect(Math.abs(devPct(rb.gStiff, THESIS.rib.gStiff))).toBeLessThan(1);
    expect(Math.abs(devPct(rb.qRib, THESIS.rib.qRib))).toBeLessThan(1);
  });
});
