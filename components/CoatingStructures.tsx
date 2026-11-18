import type { Dictionary } from "@/content";

type Level = Dictionary["tech"]["levels"][number];
type Pt = [number, number];

// Geometry for the molecule drawings, computed once on the server. Ported from the Claude Design
// canvas "Nanoshield — coating structures" (each drawing is a 240×170 viewBox).
const r1 = (n: number) => Math.round(n * 10) / 10;
const hexPts = (cx: number, cy: number, r: number): Pt[] =>
  Array.from({ length: 6 }, (_, i) => {
    const a = (Math.PI / 180) * (60 * i - 30);
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  });
const key = (p: Pt) => `${r1(p[0])},${r1(p[1])}`;
const toPath = (edges: Map<string, [Pt, Pt]>) =>
  [...edges.values()].map(([a, b]) => `M${r1(a[0])} ${r1(a[1])}L${r1(b[0])} ${r1(b[1])}`).join("");

/** Graphene: a honeycomb sheet, rotated and squashed so it reads as a plane in perspective. */
function grapheneGeometry() {
  const r = 14, w = Math.sqrt(3) * r, cx0 = 120, cy0 = 85, rot = (-18 * Math.PI) / 180, squash = 0.6;
  const tf = ([x, y]: Pt): Pt => {
    const dx = x - cx0, dy = y - cy0;
    return [cx0 + dx * Math.cos(rot) - dy * Math.sin(rot), cy0 + (dx * Math.sin(rot) + dy * Math.cos(rot)) * squash];
  };
  const edges = new Map<string, [Pt, Pt]>(), atoms = new Map<string, Pt>();
  for (let row = 0; row < 5; row++)
    for (let col = 0; col < 7; col++) {
      const p = hexPts(cx0 + (col - 3) * w + (row % 2 ? w / 2 : 0) - w / 4, cy0 + (row - 2) * 1.5 * r, r).map(tf);
      p.forEach((a, i) => {
        const b = p[(i + 1) % 6];
        edges.set([key(a), key(b)].sort().join("|"), [a, b]);
        atoms.set(key(a), a);
      });
    }
  return { d: toPath(edges), atoms: [...atoms.values()] };
}

/** Nanotube: a hex lattice wrapped on a cylinder seen slightly from above; only the front face is drawn. */
function tubeGeometry() {
  const cx = 120, R = 44, ry = 12, C = 2 * Math.PI * R, n = 12, w = C / n, r = w / Math.sqrt(3);
  const wrap = ([u, y]: Pt) => {
    const t = u / R;
    return { p: [cx + R * Math.sin(t), y + ry * Math.cos(t)] as Pt, front: Math.cos(t) };
  };
  const edges = new Map<string, [Pt, Pt]>(), atoms = new Map<string, Pt>();
  for (let row = 0; row * 1.5 * r <= 112; row++)
    for (let col = 0; col < n; col++) {
      const hex = hexPts(col * w + (row % 2 ? w / 2 : 0) - C / 2, 30 + row * 1.5 * r, r);
      hex.forEach((a, i) => {
        const b = hex[(i + 1) % 6], A = wrap(a), B = wrap(b);
        if (wrap([(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]).front > 0.12) edges.set([key(A.p), key(B.p)].sort().join("|"), [A.p, B.p]);
        if (A.front > 0.2) atoms.set(key(A.p), A.p);
      });
    }
  return { d: toPath(edges), atoms: [...atoms.values()] };
}

const graphene = grapheneGeometry();
const tube = tubeGeometry();
const TUBE_FACE = "M76 24 A44 12 0 0 0 164 24 V146 A44 12 0 0 1 76 146 Z";

const svgProps = { "aria-hidden": true, viewBox: "0 0 240 170", className: "mx-auto block h-auto w-full max-w-[240px]" } as const;

function SiO2() {
  return (
    <svg {...svgProps}>
      <g stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 5" fill="none">
        <polyline points="46,128 120,22 194,128 46,128" />
        <polyline points="46,128 142,150 194,128" />
        <line x1="120" y1="22" x2="142" y2="150" />
      </g>
      <g stroke="currentColor" strokeWidth="5" strokeLinecap="round">
        <line x1="120" y1="92" x2="120" y2="22" />
        <line x1="120" y1="92" x2="46" y2="128" />
        <line x1="120" y1="92" x2="194" y2="128" />
        <line x1="120" y1="92" x2="142" y2="150" />
      </g>
      <circle cx="142" cy="150" r="13" stroke="currentColor" strokeWidth="3" opacity="0.6" className="fill-surface" />
      <circle cx="120" cy="92" r="24" fill="currentColor" />
      <circle cx="112" cy="84" r="6" opacity="0.35" className="fill-surface" />
      <g stroke="currentColor" strokeWidth="3" className="fill-surface">
        <circle cx="120" cy="22" r="16" />
        <circle cx="46" cy="128" r="16" />
        <circle cx="194" cy="128" r="16" />
      </g>
    </svg>
  );
}

function Graphene() {
  return (
    <svg {...svgProps}>
      <path d={graphene.d} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <g fill="currentColor">
        {graphene.atoms.map(([x, y]) => (
          <circle key={`${x},${y}`} cx={r1(x)} cy={r1(y)} r="3.4" />
        ))}
      </g>
    </svg>
  );
}

function Nanotube() {
  return (
    <svg {...svgProps}>
      <defs>
        <clipPath id="nanotube-face">
          <path d={TUBE_FACE} />
        </clipPath>
      </defs>
      <path d={TUBE_FACE} fill="currentColor" fillOpacity="0.12" />
      <g clipPath="url(#nanotube-face)">
        <path d={tube.d} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <g fill="currentColor">
          {tube.atoms.map(([x, y]) => (
            <circle key={`${x},${y}`} cx={r1(x)} cy={r1(y)} r="3" />
          ))}
        </g>
      </g>
      <path d="M76 24 V146 A44 12 0 0 0 164 146 V24" fill="none" stroke="currentColor" strokeWidth="3" />
      <ellipse cx="120" cy="24" rx="44" ry="12" stroke="currentColor" strokeWidth="3" className="fill-surface" />
    </svg>
  );
}

const ART = [SiO2, Graphene, Nanotube];
const TONE = ["text-muted", "text-fg", "text-orange"];

/** SiO₂ → Graphene → Nanotube as one ordered progression; the text carries the meaning, drawings are decorative. */
export function CoatingStructures({ levels }: { levels: Level[] }) {
  return (
    <ol className="m-0 grid min-w-0 flex-[1_1_100%] list-none grid-cols-1 gap-4 p-0 md:grid-cols-3 md:gap-12">
      {levels.map((l, i) => {
        const Art = ART[i];
        const top = i === levels.length - 1;
        return (
          <li
            key={l.name}
            className={`relative flex min-w-0 flex-col gap-3 bg-surface p-7 ${top ? "border-2 border-orange" : "border border-line"}`}
          >
            {i > 0 && (
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`absolute top-1/2 -left-9 hidden size-6 -translate-y-1/2 md:block ${top ? "stroke-orange" : "stroke-muted"}`}
              >
                <path d="M4 12h16M14 6l6 6-6 6" />
              </svg>
            )}
            <div className={TONE[i]}>
              <Art />
            </div>
            <h3 className={`m-0 font-display text-[32px] leading-[1.1] font-bold ${TONE[i]}`}>{l.name}</h3>
            {l.grade ? (
              <span
                className={`inline-flex h-9 items-center self-start border px-3 font-display text-xl font-bold tracking-[0.08em] ${top ? "border-orange text-orange" : "border-muted text-fg"}`}
              >
                {l.grade}
              </span>
            ) : (
              <span aria-hidden="true" className="hidden h-9 md:block" />
            )}
            <p className={`m-0 ${top ? "text-fg" : "text-muted"}`}>{l.text}</p>
          </li>
        );
      })}
    </ol>
  );
}
