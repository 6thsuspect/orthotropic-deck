import { describe, expect, it } from 'vitest';
import { CASE_STUDY_INPUTS } from '../defaults';
import { equivalentPlate } from '../equivalentPlate';
import { THESIS, devPct } from '../thesis';

const res = equivalentPlate(CASE_STUDY_INPUTS);

describe('B4.2.1 membrane rigidity', () => {
  it('matches thesis Appendix B4.2.1', () => {
    expect(res.membrane.dxx).toBeCloseTo(THESIS.membrane.dxx, -6);
    expect(res.membrane.dv).toBeCloseTo(THESIS.membrane.dv, -6);
    // d_yy carries the analytic-vs-AutoCAD area difference of the rib (~0.1 %)
    expect(Math.abs(devPct(res.membrane.dyy, THESIS.membrane.dyy))).toBeLessThan(0.5);
    expect(res.membrane.dxy).toBeCloseTo(THESIS.membrane.dxy, -6);
    expect(Math.abs(devPct(res.membrane.Ab, THESIS.membrane.Ab))).toBeLessThan(1);
  });
});

describe('B4.2.2 flexural rigidity', () => {
  it('D_xx from the rotation frame (eq 3.2)', () => {
    expect(res.flexural.Dxx).toBeCloseTo(THESIS.flexural.Dxx, -1);
  });
  it('D_yy = E*I/b (eq 3.14)', () => {
    expect(Math.abs(devPct(res.flexural.Dyy, THESIS.flexural.Dyy))).toBeLessThan(1.5);
  });
  it('D_v reduced lateral contraction (eq 3.15/3.16)', () => {
    expect(res.flexural.Dv).toBeCloseTo(THESIS.flexural.Dv, -1);
  });
  it('torsional terms (eq 3.17-3.21)', () => {
    expect(Math.abs(devPct(res.flexural.It, THESIS.flexural.It))).toBeLessThan(0.5);
    expect(Math.abs(devPct(res.flexural.ixy, THESIS.flexural.ixy))).toBeLessThan(0.5);
    expect(Math.abs(devPct(res.flexural.iyx, THESIS.flexural.iyx))).toBeLessThan(1);
    expect(Math.abs(devPct(res.flexural.iav, THESIS.flexural.iav))).toBeLessThan(1);
    expect(res.flexural.Dav).toBeCloseTo(THESIS.flexural.Dav, -3);
  });
});

describe('B4.2.3 shear rigidity', () => {
  it('Cowper shear factor and reduced area', () => {
    expect(res.shear.mbox).toBeCloseTo(THESIS.shear.mbox, 6);
    expect(res.shear.nbox).toBeCloseTo(THESIS.shear.nbox, 6);
    expect(res.shear.kappaBox).toBeCloseTo(THESIS.shear.kappaBox, 3);
    expect(Math.abs(devPct(res.shear.Asy, THESIS.shear.Asy))).toBeLessThan(0.5);
  });
  it('K_sx, D_sx and D_sy (eq 3.22-3.24)', () => {
    expect(res.shear.Ksx).toBeCloseTo(THESIS.shear.Ksx, 0);
    expect(Math.abs(devPct(res.shear.Dsx, THESIS.shear.Dsx))).toBeLessThan(0.05);
    expect(Math.abs(devPct(res.shear.Dsy, THESIS.shear.Dsy))).toBeLessThan(0.5);
  });
});

describe('B4.2.4 stiffness matrices', () => {
  it('D is the 6x6 general shell stiffness of eq 3.10', () => {
    expect(res.D[0][0]).toBeCloseTo(THESIS.membrane.dxx, -6);
    expect(Math.abs(devPct(res.D[1][1], THESIS.membrane.dyy))).toBeLessThan(0.5);
    expect(res.D[2][2]).toBeCloseTo(THESIS.membrane.dxy, -6);
    expect(res.D[3][3]).toBeCloseTo(THESIS.flexural.Dxx, -1);
    expect(Math.abs(devPct(res.D[4][4], THESIS.flexural.Dyy))).toBeLessThan(2.5);
    expect(res.D[5][5]).toBeCloseTo(THESIS.flexural.Dav, -3);
    expect(res.D[0][3]).toBe(0);
    // thesis rounds D_sx to 4 significant digits (7.706e5); exact value 770613.9
    expect(Math.abs(devPct(res.Dshear[0][0], THESIS.shear.Dsx))).toBeLessThan(0.05);
    expect(Math.abs(devPct(res.Dshear[1][1], THESIS.shear.Dsy))).toBeLessThan(0.5);
  });
});

describe('B4.1 alternative 1: equivalent thickness', () => {
  it('Ieq, teq, E2, G23', () => {
    // all four inherit the analytic-vs-AutoCAD difference of I_stiff,y (~1.5 %)
    expect(Math.abs(devPct(res.alt1.Ieq, THESIS.alt1.Ieq))).toBeLessThan(2.5);
    expect(Math.abs(devPct(res.alt1.teq, THESIS.alt1.teq))).toBeLessThan(2.5);
    expect(Math.abs(devPct(res.alt1.E2, THESIS.alt1.E2))).toBeLessThan(2.5);
    expect(Math.abs(devPct(res.alt1.G23, THESIS.alt1.G23))).toBeLessThan(2.5);
  });
});
