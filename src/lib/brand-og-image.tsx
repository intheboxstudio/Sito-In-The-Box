import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const OG_IMAGE_ALT = "IN THE BOX STUDIO";
export const OG_IMAGE_SIZE = { width: 1200, height: 630 };
export const OG_IMAGE_CONTENT_TYPE = "image/png";

export async function buildBrandOgImage() {
  const logoData = await readFile(join(process.cwd(), "public/logo-bianco.png"));
  const logoSrc = `data:image/png;base64,${logoData.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#05060a",
          backgroundImage:
            "radial-gradient(circle at 18% 20%, rgba(124,92,255,0.4), transparent 50%), radial-gradient(circle at 82% 82%, rgba(34,211,238,0.35), transparent 50%)",
        }}
      >
        {/* logo-bianco.png is a full lockup (icon + "IN THE BOX STUDIO"
            wordmark baked in), so it's shown large on its own rather than
            paired with a second, redundant text rendering. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logoSrc} width={420} height={420} alt="" />
        <div style={{ display: "flex", marginTop: 4, fontSize: 32, color: "#9a9fae" }}>
          Agenti AI &amp; Automazione Aziendale
        </div>
      </div>
    ),
    { ...OG_IMAGE_SIZE }
  );
}
