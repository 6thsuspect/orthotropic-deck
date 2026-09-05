// @vitest-environment happy-dom
import { describe, expect, it } from 'vitest';
import { act, createElement } from 'react';
import { createRoot, type Root } from 'react-dom/client';

(globalThis as unknown as { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
import { ModelProvider } from '../state/ModelContext';
import Overview from '../pages/Overview';
import Inputs from '../pages/Inputs';
import SectionProps from '../pages/SectionProps';
import EquivalentPlate from '../pages/EquivalentPlate';
import Verification from '../pages/Verification';
import References from '../pages/References';

function renderPage(Page: () => JSX.Element): { root: Root; host: HTMLDivElement } {
  const host = document.createElement('div');
  document.body.appendChild(host);
  const root = createRoot(host);
  act(() => {
    root.render(createElement(ModelProvider, null, createElement(Page)));
  });
  return { root, host };
}

describe('page smoke renders', () => {
  const cases: [string, () => JSX.Element, string][] = [
    ['Overview', Overview, 'Equivalent 2D orthotropic plate'],
    ['Inputs', Inputs, 'Reset to case study'],
    ['Stiffener section', SectionProps, 'Navier stress tool'],
    ['Equivalent plate', EquivalentPlate, 'General shell stiffness matrix'],
    ['Verification', Verification, 'Shear-lag effective width'],
    ['References', References, 'Equation map'],
  ];

  for (const [name, Page, expected] of cases) {
    it(`renders ${name} without runtime errors`, () => {
      const { root, host } = renderPage(Page);
      expect(host.textContent ?? '').toContain(expected);
      act(() => root.unmount());
      host.remove();
    });
  }

  it('shows the thesis rigidity values on the equivalent plate page', () => {
    const { root, host } = renderPage(EquivalentPlate);
    const text = host.textContent ?? '';
    expect(text).toContain('3.692×10⁹'); // d_xx
    expect(text).toContain('7.317×10⁴'); // D_xx
    expect(text).toContain('2.275×10⁶'); // D_aa
    act(() => root.unmount());
    host.remove();
  });
});
