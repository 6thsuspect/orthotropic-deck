import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import type { AppInputs } from '../lib/types';
import { CASE_STUDY_INPUTS, cloneInputs } from '../lib/defaults';
import { compositeSection, derivedGeometry, reducedSection } from '../lib/sections';
import { eurocodeReduction, shearLag } from '../lib/eurocode';
import { equivalentPlate } from '../lib/equivalentPlate';
import { crossBeamStiffness, globalVerification, ribBeam } from '../lib/verification';

const STORAGE_KEY = 'orthodeck-studio-inputs-v1';

export interface Model {
  inputs: AppInputs;
  update: (patch: (draft: AppInputs) => void) => void;
  reset: () => void;
  geom: ReturnType<typeof derivedGeometry>;
  sec: ReturnType<typeof compositeSection>;
  euro: ReturnType<typeof eurocodeReduction>;
  redSec: ReturnType<typeof reducedSection>;
  plate: ReturnType<typeof equivalentPlate>;
  sl: ReturnType<typeof shearLag>;
  gv: ReturnType<typeof globalVerification>;
  cb: ReturnType<typeof crossBeamStiffness>;
  rib: ReturnType<typeof ribBeam>;
}

const ModelContext = createContext<Model | null>(null);

function loadInputs(): AppInputs {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return cloneInputs(CASE_STUDY_INPUTS);
    const parsed = JSON.parse(raw) as AppInputs;
    // shallow-merge over defaults so new fields always exist
    return {
      material: { ...CASE_STUDY_INPUTS.material, ...parsed.material },
      deck: { ...CASE_STUDY_INPUTS.deck, ...parsed.deck },
      bridge: { ...CASE_STUDY_INPUTS.bridge, ...parsed.bridge },
      frame: { ...CASE_STUDY_INPUTS.frame, ...parsed.frame },
    };
  } catch {
    return cloneInputs(CASE_STUDY_INPUTS);
  }
}

export function ModelProvider({ children }: { children: ReactNode }) {
  const [inputs, setInputs] = useState<AppInputs>(loadInputs);

  const value = useMemo<Model>(() => {
    const geom = derivedGeometry(inputs);
    const sec = compositeSection(inputs);
    const euro = eurocodeReduction(inputs);
    const redSec = reducedSection(inputs, {
      beffWeb: euro.web.beff,
      beffBot: euro.bottom.beff,
    });
    return {
      inputs,
      update: (patch) => {
        setInputs((prev) => {
          const draft = cloneInputs(prev);
          patch(draft);
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
          } catch {
            /* storage unavailable (e.g. sandboxed iframe) - ignore */
          }
          return draft;
        });
      },
      reset: () => {
        try {
          localStorage.removeItem(STORAGE_KEY);
        } catch {
          /* ignore */
        }
        setInputs(cloneInputs(CASE_STUDY_INPUTS));
      },
      geom,
      sec,
      euro,
      redSec,
      plate: equivalentPlate(inputs),
      sl: shearLag(inputs),
      gv: globalVerification(inputs),
      cb: crossBeamStiffness(inputs),
      rib: ribBeam(inputs),
    };
  }, [inputs]);

  return <ModelContext.Provider value={value}>{children}</ModelContext.Provider>;
}

export function useModel(): Model {
  const ctx = useContext(ModelContext);
  if (!ctx) throw new Error('useModel must be used inside ModelProvider');
  return ctx;
}
