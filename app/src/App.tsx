import { useState } from 'react';
import { ModelProvider } from './state/ModelContext';
import Overview from './pages/Overview';
import Inputs from './pages/Inputs';
import SectionProps from './pages/SectionProps';
import EquivalentPlate from './pages/EquivalentPlate';
import Verification from './pages/Verification';
import References from './pages/References';

type PageId = 'overview' | 'inputs' | 'section' | 'plate' | 'verification' | 'references';

const NAV: { id: PageId; label: string; title: string; blurb: string }[] = [
  {
    id: 'overview',
    label: 'Overview',
    title: 'Overview',
    blurb: 'Equivalent orthotropic plate of the case-study deck, compared with the thesis.',
  },
  {
    id: 'inputs',
    label: 'Inputs',
    title: 'Input data',
    blurb: 'Material, deck, bridge and frame-analysis data (Appendix B1 defaults).',
  },
  {
    id: 'section',
    label: 'Stiffener section',
    title: 'Stiffener section & Eurocode checks',
    blurb: 'Composite rib-strip properties, class-4 reduction, Navier stress tool.',
  },
  {
    id: 'plate',
    label: 'Equivalent plate',
    title: 'Equivalent 2D orthotropic plate',
    blurb: 'The worked example: rigidities and the general shell stiffness matrix D.',
  },
  {
    id: 'verification',
    label: 'Verification',
    title: 'Verification hand calculations',
    blurb: 'Shear lag, global beam behaviour and cross-beam springs (Appendix B2).',
  },
  {
    id: 'references',
    label: 'Equations & refs',
    title: 'Equation map & references',
    blurb: 'Traceability of every quantity to the source document.',
  },
];

function Shell() {
  const [page, setPage] = useState<PageId>('overview');
  const active = NAV.find((n) => n.id === page)!;

  return (
    <div className="flex min-h-screen">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-60 flex-col border-r border-steel-800 bg-steel-950 lg:flex">
        <div className="px-5 py-5">
          <div className="flex items-center gap-2.5">
            <svg viewBox="0 0 32 32" className="h-8 w-8 shrink-0" aria-hidden>
              <rect x="2" y="6" width="28" height="4" rx="1" fill="#95b6d2" />
              <path d="M7 10 L9 22 L14 22 L15 10 Z M17 10 L18 22 L23 22 L25 10 Z" fill="none" stroke="#5f8fba" strokeWidth="1.6" />
            </svg>
            <div>
              <p className="text-sm font-semibold tracking-tight text-white">OrthoDeck Studio</p>
              <p className="num text-[10px] text-steel-400">equivalent plate designer</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 space-y-0.5 px-3">
          {NAV.map((n) => (
            <button
              key={n.id}
              onClick={() => setPage(n.id)}
              className={`w-full rounded-lg px-3 py-2 text-left text-sm transition ${
                page === n.id
                  ? 'bg-steel-800 font-medium text-white'
                  : 'text-steel-300 hover:bg-steel-900 hover:text-white'
              }`}
            >
              {n.label}
            </button>
          ))}
        </nav>
        <div className="px-5 py-4">
          <p className="text-[10px] leading-relaxed text-steel-500">
            After Håkansson &amp; Wallerman (2015), Chalmers Master&apos;s Thesis 2015:112.
          </p>
        </div>
      </aside>

      {/* mobile nav */}
      <div className="fixed inset-x-0 top-0 z-20 flex gap-1 overflow-x-auto border-b border-steel-800 bg-steel-950 px-3 py-2 lg:hidden">
        {NAV.map((n) => (
          <button
            key={n.id}
            onClick={() => setPage(n.id)}
            className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-xs ${
              page === n.id ? 'bg-steel-800 font-medium text-white' : 'text-steel-300'
            }`}
          >
            {n.label}
          </button>
        ))}
      </div>

      <main className="min-w-0 flex-1 lg:pl-60">
        <div className="mx-auto max-w-6xl px-4 pb-16 pt-16 sm:px-6 lg:px-8 lg:pt-8">
          <header className="mb-6">
            <h1 className="text-xl font-semibold tracking-tight text-steel-900">{active.title}</h1>
            <p className="mt-1 text-sm text-steel-500">{active.blurb}</p>
          </header>
          {page === 'overview' && <Overview />}
          {page === 'inputs' && <Inputs />}
          {page === 'section' && <SectionProps />}
          {page === 'plate' && <EquivalentPlate />}
          {page === 'verification' && <Verification />}
          {page === 'references' && <References />}
        </div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <ModelProvider>
      <Shell />
    </ModelProvider>
  );
}
