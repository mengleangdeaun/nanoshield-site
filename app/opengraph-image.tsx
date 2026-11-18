import { ImageResponse } from "next/og";

export const alt = "Nanoshield Cambodia — Shine like a diamond. Patented 10H Nanotube ceramic coating.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const ORANGE = "#ec5b25";

/** Double-circle mark drawn in code, no text: orange ring, white gap, orange ring, white centre (each band ~9% of the diameter, as in the logo). */
function DoubleCircle({ d }: { d: number }) {
  const band = Math.round(d * 0.09);
  const ring = (bg: string, children: React.ReactNode) => (
    <div style={{ display: "flex", flex: 1, borderRadius: "50%", background: bg, padding: band }}>{children}</div>
  );
  return (
    <div style={{ display: "flex", width: d, height: d }}>
      {ring(
        ORANGE,
        ring(
          "#fff",
          ring(
            ORANGE,
            <div style={{ display: "flex", flex: 1, borderRadius: "50%", background: "#fff" }} />,
          ),
        ),
      )}
    </div>
  );
}

// Latin-only text: the OG renderer's default font has no Khmer glyphs, so both locales share this card.
export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          background: "#0a0a0b",
          color: "#fff",
          borderBottom: `12px solid ${ORANGE}`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 28, letterSpacing: 6, color: "#bdbdbd" }}>NANOSHIELD CAMBODIA</div>
            <div style={{ fontSize: 108, fontWeight: 700, lineHeight: 1, marginTop: 24 }}>SHINE LIKE</div>
            <div style={{ fontSize: 108, fontWeight: 700, lineHeight: 1, color: ORANGE }}>A DIAMOND.</div>
          </div>
          <DoubleCircle d={300} />
        </div>
        <div style={{ fontSize: 30, color: "#bdbdbd", marginTop: 32 }}>
          Patented 10H Nanotube ceramic coating · Phnom Penh · 076 2222 188
        </div>
      </div>
    ),
    size,
  );
}
