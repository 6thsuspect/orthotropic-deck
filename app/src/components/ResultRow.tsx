import { DevBadge } from './DevBadge';
import { devPct } from '../lib/thesis';

/** Row comparing a computed value with a reference value from the thesis. */
export function CompareRow({
  label,
  symbol,
  computed,
  format,
  reference,
  refFormat,
  refText,
  eq,
  note,
  isInput = false,
}: {
  label: string;
  symbol?: string;
  computed: number;
  format: (v: number) => string;
  reference?: number;
  refFormat?: (v: number) => string;
  refText?: string;
  eq?: string;
  note?: string;
  isInput?: boolean;
}) {
  const fmt = format;
  const refShown =
    refText ?? (reference !== undefined ? (refFormat ?? fmt)(reference) : '–');
  return (
    <div className="grid grid-cols-2 items-center gap-x-4 gap-y-1 border-b border-steel-100 py-2 last:border-0 md:grid-cols-[minmax(0,1.5fr)_auto_auto_auto]">
      <div className="col-span-2 min-w-0 md:col-span-1">
        <span className="text-sm text-steel-800">{label}</span>
        {symbol && <span className="num ml-2 text-xs italic text-steel-500">{symbol}</span>}
        {eq && <span className="chip num ml-2">{eq}</span>}
      </div>
      <div className="num text-right text-sm font-semibold text-steel-900">{fmt(computed)}</div>
      <div className="num text-right text-xs text-steel-500 md:min-w-[130px]">{refShown}</div>
      <div className="justify-self-end">
        {isInput ? (
          <span className="num rounded-md border border-steel-200 bg-steel-50 px-1.5 py-0.5 text-[11px] text-steel-500">
            FE input
          </span>
        ) : reference !== undefined ? (
          <DevBadge dev={devPct(computed, reference)} />
        ) : (
          <span className="text-xs text-steel-400">–</span>
        )}
      </div>
      {note && <p className="col-span-2 -mt-1 text-[11px] text-steel-400 md:col-span-4">{note}</p>}
    </div>
  );
}

/** Plain label/value row without comparison. */
export function ValueRow({
  label,
  symbol,
  value,
  eq,
}: {
  label: string;
  symbol?: string;
  value: string;
  eq?: string;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-steel-100 py-2 last:border-0">
      <div className="min-w-0">
        <span className="text-sm text-steel-800">{label}</span>
        {symbol && <span className="num ml-2 text-xs italic text-steel-500">{symbol}</span>}
        {eq && <span className="chip num ml-2">{eq}</span>}
      </div>
      <div className="num shrink-0 text-right text-sm font-semibold text-steel-900">{value}</div>
    </div>
  );
}
