import { ImageResponse } from "next/og";

export const alt = "Nanoshield Cambodia — Shine like a diamond. Patented 10H Nanotube ceramic coating.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

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
          borderBottom: "12px solid #ec5b25",
        }}
      >
        <div style={{ fontSize: 28, letterSpacing: 6, color: "#bdbdbd" }}>NANOSHIELD CAMBODIA</div>
        <div style={{ fontSize: 108, fontWeight: 700, lineHeight: 1, marginTop: 24 }}>SHINE LIKE</div>
        <div style={{ fontSize: 108, fontWeight: 700, lineHeight: 1, color: "#ec5b25" }}>A DIAMOND.</div>
        <div style={{ fontSize: 34, color: "#bdbdbd", marginTop: 32 }}>
          Patented 10H Nanotube ceramic coating · Phnom Penh · 076 2222 188
        </div>
      </div>
    ),
    size,
  );
}
