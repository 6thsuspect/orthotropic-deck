import { describe, expect, it } from 'vitest';
import { CASE_STUDY_INPUTS } from '../defaults';
import { compositeSection, derivedGeometry, fullSectionArea, reducedSection } from '../sections';
import { eurocodeReduction } from '../eurocode';
import { THESIS, devPct } from '../thesis';

const sec = compositeSection(CASE_STUDY_INPUTS);
const red = eurocodeReduction(CASE_STUDY_INPUTS);
const redSec = reducedSection(CASE_STUDY_INPUTS, {
  beffWeb: red.web.beff,
  beffBot: red.bottom.beff,
});

describe('geometry', () => {
  it('b_rib, b_tot, l_s, z_bot', () => {
    const g = derivedGeometry(CASE_STUDY_INPUTS);
    expect(g.bRib).toBeCloseTo(0.6, 9);
    expect(g.bTot).toBeCloseTo(6, 9);
    expect(g.ls).toBeCloseTo(0.202, 3);
    expect(g.zBot).toBeCloseTo(0.218, 9);
    expect(g.eps).toBeCloseTo(THESIS.eurocode.eps, 3);
  });
});

describe('stiffener composite section (AutoCAD reference B2.4)', () => {
  it('area, centroid and second moment of area', () => {
    expect(Math.abs(devPct(sec.A, THESIS.section.Astiff))).toBeLessThan(0.5);
    expect(Math.abs(devPct(sec.zCG, THESIS.section.zstiffCG))).toBeLessThan(1.5);
    expect(Math.abs(devPct(sec.Iy, THESIS.section.IstiffY))).toBeLessThan(2);
  });
  it('full bridge area (B1)', () => {
    expect(Math.abs(devPct(fullSectionArea(CASE_STUDY_INPUTS), THESIS.section.AFull))).toBeLessThan(0.5);
  });
});

describe('EN 1993 cross section class + effective widths (B3.3)', () => {
  it('web and bottom flange are class 4, plate is class 1', () => {
    expect(red.checks[0].cls).toBe(1);
    expect(red.checks[1].cls).toBe(4);
    expect(red.checks[2].cls).toBe(4);
  });
  it('reduction factors and effective widths', () => {
    expect(red.web.lambdaP).toBeCloseTo(THESIS.eurocode.webLambda, 2);
    expect(red.web.rho).toBeCloseTo(THESIS.eurocode.webRho, 2);
    expect(red.web.beff).toBeCloseTo(THESIS.eurocode.webBeff, 3);
    expect(red.bottom.lambdaP).toBeCloseTo(THESIS.eurocode.botLambda, 2);
    expect(red.bottom.rho).toBeCloseTo(THESIS.eurocode.botRho, 2);
    expect(red.bottom.beff).toBeCloseTo(THESIS.eurocode.botBeff, 3);
  });
  it('reduced section close to AutoCAD reference (B3.4)', () => {
    expect(Math.abs(devPct(redSec.A, THESIS.section.AstiffRed))).toBeLessThan(3);
    expect(Math.abs(devPct(redSec.Iy, THESIS.section.IstiffYRed))).toBeLessThan(6);
  });
});
