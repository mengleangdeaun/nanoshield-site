import type { Dictionary } from "@/content";

type Labels = Dictionary["coating"]["diagram"];

// UV rays: amber that stays visible on both the dark (#141416) and light (#f4f4f2) panel.
const uvStroke = "stroke-[#f2c14e] light:stroke-[#b7791f]";
const uvFill = "fill-[#f2c14e] light:fill-[#b7791f]";
const WATER = "#8fc3f0";
const WATER_EDGE = "#5aa2e0";

/**
 * Paint cross-section, split "without" vs "with Nanoshield". Ported 1:1 from the Claude Design canvas
 * "Nanoshield — paint cross-section" (960×720 artboard). Physical layers keep fixed material colours;
 * the panel, labels and lines follow the theme tokens.
 */
export function PaintDiagram({ labels: l }: { labels: Labels }) {
  return (
    <svg role="img" aria-label={l.alt} viewBox="0 0 960 720" className="block h-auto w-full font-display">
      <rect width="960" height="720" className="fill-raised" />

      {/* column headings */}
      <text x="260" y="100" textAnchor="middle" fontSize="34" fontWeight="500" letterSpacing="4" className="fill-muted">
        {l.without}
      </text>
      <text x="700" y="100" textAnchor="middle" fontSize="34" fontWeight="700" letterSpacing="4" fill="#ec5b25">
        {l.with}
      </text>

      {/* sun */}
      <circle cx="480" cy="160" r="26" className={uvFill} />
      <g strokeWidth="4" strokeLinecap="round" className={uvStroke}>
        <line x1="480" y1="118" x2="480" y2="106" />
        <line x1="450" y1="130" x2="442" y2="122" />
        <line x1="510" y1="130" x2="518" y2="122" />
        <line x1="438" y1="160" x2="426" y2="160" />
        <line x1="522" y1="160" x2="534" y2="160" />
      </g>

      {/* paint layers */}
      <rect x="40" y="596" width="880" height="72" fill="#5b6168" />
      <rect x="40" y="532" width="880" height="64" fill="#d6d2c8" />
      <rect x="40" y="436" width="880" height="96" fill="#1f3d63" />
      <rect x="40" y="380" width="880" height="56" fill="#cfe1f2" />
      <line x1="40" y1="381" x2="920" y2="381" stroke="#fff" strokeWidth="2" opacity="0.8" />
      <line x1="40" y1="598" x2="920" y2="598" stroke="#8b929a" strokeWidth="2" />

      {/* layer names, right-aligned on the clean "with" side (fixed text colours on fixed layer colours) */}
      <g fontSize="30" fontWeight="500" letterSpacing="3" textAnchor="end">
        <text x="896" y="418" fill="#0a0a0b">{l.clearCoat}</text>
        <text x="896" y="495" fill="#fff">{l.baseCoat}</text>
        <text x="896" y="575" fill="#0a0a0b">{l.primer}</text>
        <text x="896" y="643" fill="#fff">{l.panel}</text>
      </g>

      {/* WITHOUT: scratch, water film, acid rain, UV reaching the paint */}
      <polygon points="282,380 300,420 318,380" className="fill-raised" />
      <polyline points="282,380 300,420 318,380" fill="none" stroke="#8aa3bd" strokeWidth="2" />
      <path d="M40 380 L40 368 Q90 361 140 367 T240 366 T340 368 T440 365 L480 367 L480 380 Z" fill={WATER} opacity="0.7" />
      <path d="M40 368 Q90 361 140 367 T240 366 T340 368 T440 365 L480 367" fill="none" stroke={WATER_EDGE} strokeWidth="2" />
      <g fill={WATER} stroke={WATER_EDGE} strokeWidth="2">
        <path d="M110 226 C115 236 118 242 110 248 C102 242 105 236 110 226 Z" />
        <path d="M196 286 C201 296 204 302 196 308 C188 302 191 296 196 286 Z" />
        <path d="M290 232 C295 242 298 248 290 254 C282 248 285 242 290 232 Z" />
      </g>
      <g strokeWidth="4" strokeLinecap="round" className={uvStroke}>
        <line x1="452" y1="192" x2="333" y2="434" />
        <line x1="448" y1="186" x2="176" y2="438" />
      </g>
      <g className={uvFill}>
        <polygon points="326,450 323,424 344,434" />
        <polygon points="162,452 168,427 186,442" />
      </g>

      {/* WITH: Nanoshield layer, reflected UV, water beading off */}
      <rect x="480" y="344" width="440" height="36" fill="#ec5b25" />
      <line x1="480" y1="345" x2="920" y2="345" stroke="#ffb08a" strokeWidth="3" />
      <text x="700" y="372" textAnchor="middle" fontSize="26" fontWeight="700" letterSpacing="3" fill="#fff">
        {l.nanoshield}
      </text>
      <g strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" className={uvStroke}>
        <polyline points="506,190 625,342 712,226" />
        <polyline points="512,186 785,342 888,226" />
      </g>
      <g className={uvFill}>
        <polygon points="722,212 716,238 700,222" />
        <polygon points="898,212 892,238 876,222" />
      </g>
      <g fill={WATER} fillOpacity="0.75" stroke={WATER_EDGE} strokeWidth="2">
        <ellipse cx="590" cy="328" rx="22" ry="17" />
        <ellipse cx="668" cy="333" rx="15" ry="12" />
        <ellipse cx="740" cy="324" rx="26" ry="21" />
        <ellipse cx="832" cy="330" rx="18" ry="15" />
        <ellipse cx="910" cy="336" rx="11" ry="9" />
      </g>
      <g fill="#fff" opacity="0.85">
        <ellipse cx="582" cy="321" rx="6" ry="4" />
        <ellipse cx="663" cy="328" rx="4" ry="3" />
        <ellipse cx="731" cy="315" rx="7" ry="5" />
        <ellipse cx="826" cy="324" rx="5" ry="4" />
      </g>
      <g stroke={WATER_EDGE} strokeWidth="3" strokeLinecap="round">
        <line x1="870" y1="330" x2="886" y2="330" />
        <line x1="874" y1="340" x2="890" y2="340" />
      </g>

      {/* split line + section outline */}
      <line x1="480" y1="206" x2="480" y2="690" strokeWidth="2" strokeDasharray="6 8" opacity="0.7" className="stroke-muted" />
      <rect x="40" y="380" width="880" height="288" fill="none" strokeWidth="2" className="stroke-line" />
    </svg>
  );
}
