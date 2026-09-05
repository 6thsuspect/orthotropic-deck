import { useModel } from '../state/ModelContext';

/** Parametric SVG of the full bridge cross-section (Figure 4.1 style). */
export function BridgeSection() {
  const { inputs, geom } = useModel();
  const { deck, bridge } = inputs;

  // drawing space in mm, then scaled
  const W = geom.bTot * 1e3;
  const ribDepth = (deck.hs + deck.ts) * 1e3;
  const girderDepth = (bridge.hw + bridge.tf) * 1e3;
  const H = ribDepth + 0 + girderDepth; // deck plate drawn at top
  const pad = 0.06 * W;
  const vbW = W + 2 * pad;
  const vbH = H + 2 * pad;
  const s = 1; // 1 unit = 1 mm in viewBox

  const ox = pad;
  const oy = pad;

  const ribXs = Array.from({ length: deck.nStiff }, (_, i) => i * geom.bRib * 1e3);
  const girderXs = [W / 2 - 1800, W / 2 + 1800];

  const stroke = 1.6;
  return (
    <svg
      viewBox={`0 0 ${vbW * s} ${vbH * s}`}
      className="h-auto w-full max-w-3xl text-steel-700"
      role="img"
      aria-label="Bridge cross-section"
    >
      {/* deck plate */}
      <rect x={ox} y={oy} width={W} height={deck.tp * 1e3} fill="#c4d6e6" stroke="currentColor" strokeWidth={stroke / 2} />
      {/* ribs */}
      {ribXs.map((x, i) => {
        const x1 = ox + x + deck.ds * 500; // centre rib in its strip
        const topL = x1;
        const topR = x1 + deck.bsTop * 1e3;
        const botL = x1 + ((deck.bsTop - deck.bsBot) / 2) * 1e3;
        const botR = botL + deck.bsBot * 1e3;
        const yT = oy + deck.tp * 1e3;
        const yB = yT + deck.hs * 1e3;
        return (
          <path
            key={i}
            d={`M ${topL} ${yT} L ${botL} ${yB} L ${botR} ${yB} L ${topR} ${yT}`}
            fill="none"
            stroke="currentColor"
            strokeWidth={stroke}
          />
        );
      })}
      {/* cross beam hint */}
      <line
        x1={ox}
        y1={oy + deck.tp * 1e3 + ribDepth - deck.ts * 1e3}
        x2={ox + W}
        y2={oy + deck.tp * 1e3 + ribDepth - deck.ts * 1e3}
        stroke="currentColor"
        strokeWidth={stroke / 2}
        strokeDasharray="6 5"
        opacity={0.45}
      />
      {/* main girders */}
      {girderXs.map((x, i) => {
        const yTop = oy + deck.tp * 1e3;
        return (
          <g key={i} stroke="currentColor" fill="#e2ebf3" strokeWidth={stroke}>
            <rect x={ox + x - (bridge.tw * 1e3) / 2} y={yTop} width={bridge.tw * 1e3} height={bridge.hw * 1e3} />
            <rect
              x={ox + x - (bridge.bf * 1e3) / 2}
              y={yTop + bridge.hw * 1e3}
              width={bridge.bf * 1e3}
              height={bridge.tf * 1e3}
            />
          </g>
        );
      })}
      {/* dimensions */}
      <g className="num" fill="currentColor" stroke="none" fontSize={vbW * 0.021} opacity={0.75}>
        <line x1={ox} y1={oy - vbH * 0.035} x2={ox + W} y2={oy - vbH * 0.035} stroke="currentColor" strokeWidth={0.8} />
        <text x={ox + W / 2} y={oy - vbH * 0.045} textAnchor="middle">
          {Math.round(W)} mm
        </text>
        <line
          x1={ox + girderXs[0]}
          y1={oy + H + vbH * 0.045}
          x2={ox + girderXs[1]}
          y2={oy + H + vbH * 0.045}
          stroke="currentColor"
          strokeWidth={0.8}
        />
        <text x={ox + W / 2} y={oy + H + vbH * 0.075} textAnchor="middle">
          {Math.round(girderXs[1] - girderXs[0])} mm
        </text>
        <text x={ox + W + vbW * 0.012} y={oy + H / 2} textAnchor="start">
          {Math.round(bridge.hw * 1e3)} mm
        </text>
      </g>
    </svg>
  );
}

/** Parametric SVG of one rib strip (Figure 4.2 style). */
export function RibSection() {
  const { inputs, geom } = useModel();
  const { deck } = inputs;
  const mm = 1e3;
  const W = geom.bRib * mm;
  const H = (deck.tp + deck.hs + deck.ts) * mm;
  const pad = W * 0.12;
  const vbW = W + 2 * pad;
  const vbH = H + 2 * pad;
  const ox = pad;
  const oy = pad;

  const x1 = ox + deck.ds * mm * 0.5;
  const topL = x1;
  const topR = x1 + deck.bsTop * mm;
  const botL = x1 + ((deck.bsTop - deck.bsBot) / 2) * mm;
  const botR = botL + deck.bsBot * mm;
  const yT = oy + deck.tp * mm;
  const yB = yT + deck.hs * mm;

  return (
    <svg viewBox={`0 0 ${vbW} ${vbH}`} className="h-auto w-full max-w-md text-steel-700" role="img" aria-label="Rib strip">
      <rect x={ox} y={oy} width={W} height={deck.tp * mm} fill="#c4d6e6" stroke="currentColor" strokeWidth={1} />
      <path
        d={`M ${topL} ${yT} L ${botL} ${yB} L ${botR} ${yB + deck.ts * mm} L ${botL} ${yB + deck.ts * mm} L ${botL} ${yB} M ${botR} ${yB} L ${topR} ${yT}`}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.4}
      />
      <path d={`M ${botL} ${yB} L ${botR} ${yB}`} fill="none" stroke="currentColor" strokeWidth={1.4} />
      <g fill="currentColor" stroke="none" fontSize={vbW * 0.045} opacity={0.8} className="num">
        <text x={ox + (x1 - ox) / 2} y={oy - vbH * 0.03} textAnchor="middle">
          {Math.round((deck.ds / 2) * mm)}
        </text>
        <text x={(topL + topR) / 2} y={oy - vbH * 0.03} textAnchor="middle">
          {Math.round(deck.bsTop * mm)}
        </text>
        <text x={(botL + botR) / 2} y={yB + deck.ts * mm + vbH * 0.09} textAnchor="middle">
          {Math.round(deck.bsBot * mm)}
        </text>
        <text x={ox - vbW * 0.02} y={(yT + yB) / 2} textAnchor="end">
          {Math.round(deck.hs * mm)}
        </text>
        <text x={topR + vbW * 0.03} y={oy + (deck.tp * mm) / 2 + vbH * 0.015} textAnchor="start">
          {Math.round(deck.tp * mm)}
        </text>
      </g>
    </svg>
  );
}
