import { useEffect, useState } from 'react';

/**
 * Numeric input bound to an SI value but displayed in a friendlier unit.
 * display = si / siFactor  (e.g. siFactor = 1e-3 shows metres as mm).
 */
export function NumberField({
  label,
  symbol,
  value,
  onChange,
  siFactor = 1,
  unit,
  step = 1,
  digits = 3,
  hint,
  allowNegative = false,
}: {
  label: string;
  symbol?: string;
  value: number;
  onChange: (si: number) => void;
  siFactor?: number;
  unit?: string;
  step?: number;
  digits?: number;
  hint?: string;
  allowNegative?: boolean;
}) {
  const [text, setText] = useState(() => (value / siFactor).toFixed(digits));
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    if (!focused) setText((value / siFactor).toFixed(digits));
  }, [value, siFactor, digits, focused]);

  const commit = () => {
    const parsed = parseFloat(text.replace(',', '.'));
    if (Number.isFinite(parsed) && (allowNegative || parsed > 0)) {
      onChange(parsed * siFactor);
      setText(parsed.toFixed(digits));
    } else {
      setText((value / siFactor).toFixed(digits));
    }
  };

  return (
    <label className="block">
      <span className="mb-1 flex items-baseline justify-between gap-2 text-xs font-medium text-steel-700">
        <span>
          {label}
          {symbol && <span className="num ml-1.5 italic text-steel-400">{symbol}</span>}
        </span>
        {unit && <span className="num text-[10px] text-steel-400">{unit}</span>}
      </span>
      <input
        type="number"
        inputMode="decimal"
        step={step}
        value={text}
        onFocus={() => setFocused(true)}
        onBlur={() => {
          setFocused(false);
          commit();
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') (e.target as HTMLInputElement).blur();
        }}
        onChange={(e) => setText(e.target.value)}
        className="num w-full rounded-lg border border-steel-200 bg-white px-2.5 py-1.5 text-sm text-steel-900 shadow-sm outline-none transition focus:border-steel-400 focus:ring-2 focus:ring-steel-200"
      />
      {hint && <span className="mt-1 block text-[10px] leading-snug text-steel-400">{hint}</span>}
    </label>
  );
}
