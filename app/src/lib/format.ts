/** Formatting helpers: engineering-friendly numbers and SI units. */

const SUP = { '-': '⁻', '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹' } as const;

export function sup(n: number): string {
  return String(n)
    .split('')
    .map((c) => SUP[c as keyof typeof SUP] ?? c)
    .join('');
}

/** 3.692e9 -> "3.692 x 10^9" style with unicode superscript */
export function sci(value: number, digits = 3): string {
  if (value === 0) return '0';
  const exp = Math.floor(Math.log10(Math.abs(value)));
  const mant = value / 10 ** exp;
  if (Math.abs(exp) < 3) return mant.toFixed(digits).replace(/\.?0+$/, '') + `e${exp}`;
  return `${mant.toFixed(digits)}×10${sup(exp)}`;
}

export function fmt(value: number, digits = 3): string {
  if (!Number.isFinite(value)) return '–';
  const a = Math.abs(value);
  if (a !== 0 && (a < 1e-3 || a >= 1e6)) return sci(value, digits);
  return value.toFixed(digits);
}

/** millimetres */
export const mm = (v: number, d = 2) => `${(v * 1e3).toFixed(d)} mm`;
/** megapascals */
export const MPa = (v: number, d = 2) => `${(v / 1e6).toFixed(d)} MPa`;
/** kilonewton */
export const kN = (v: number, d = 2) => `${(v / 1e3).toFixed(d)} kN`;
/** kilonewton per metre */
export const kNm = (v: number, d = 2) => `${(v / 1e3).toFixed(d)} kN/m`;

/** Smart unit pick per magnitude, for rigidities etc. */
export function auto(v: number, unit: string, digits = 3): string {
  return `${fmt(v, digits)} ${unit}`;
}

export function pct(v: number, digits = 1): string {
  if (!Number.isFinite(v)) return '–';
  const sign = v > 0 ? '+' : '';
  return `${sign}${v.toFixed(digits)} %`;
}
