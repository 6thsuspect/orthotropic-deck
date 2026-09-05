import { sci } from '../lib/format';

const UNITS = ['Pa·m', 'Pa·m', 'Pa·m', 'Pa·m³', 'Pa·m³', 'Pa·m³'];

export function MatrixGrid({ M, labels }: { M: number[][]; labels?: string[] }) {
  const n = M.length;
  return (
    <div className="overflow-x-auto">
      <table className="num w-full border-separate border-spacing-0 text-right text-[11px]">
        <thead>
          <tr>
            <th className="w-24" />
            {Array.from({ length: n }, (_, j) => (
              <th key={j} className="px-1.5 pb-1 font-medium text-steel-400">
                {labels ? labels[j] : `${j + 1}`}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {M.map((row, i) => (
            <tr key={i}>
              <td className="pr-2 text-left font-medium text-steel-400">
                {labels ? labels[i] : `${i + 1}`}
                <span className="ml-1 hidden text-[9px] text-steel-300 lg:inline">{UNITS[i]}</span>
              </td>
              {row.map((v, j) => (
                <td
                  key={j}
                  className={`border-t border-steel-100 px-1.5 py-1 ${
                    v === 0 ? 'text-steel-300' : i === j ? 'font-semibold text-steel-900' : 'text-steel-700'
                  }`}
                >
                  {v === 0 ? '0' : sci(v, 3)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
