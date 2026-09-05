import { pct } from '../lib/format';

/** Deviation badge: green < 1 %, amber < 5 %, red otherwise. */
export function DevBadge({ dev }: { dev: number }) {
  if (!Number.isFinite(dev)) return <span className="num text-xs text-steel-400">–</span>;
  const a = Math.abs(dev);
  const cls =
    a < 1
      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
      : a < 5
        ? 'bg-amber-50 text-amber-700 border-amber-200'
        : 'bg-rose-50 text-rose-700 border-rose-200';
  return (
    <span className={`num inline-flex min-w-[64px] justify-center rounded-md border px-1.5 py-0.5 text-[11px] font-medium ${cls}`}>
      {pct(dev)}
    </span>
  );
}
