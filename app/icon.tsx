import { ImageResponse } from "next/og";

export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 512,
          height: 512,
          background: "#1C1C1E",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* "66" — large, bold, fills ~70% of icon */}
        <div
          style={{
            fontSize: 226,
            fontWeight: 900,
            color: "#F2F0EB",
            lineHeight: 1,
            letterSpacing: -10,
          }}
        >
          66
        </div>
        {/* Red accent line */}
        <div
          style={{
            width: 160,
            height: 4,
            background: "#C1443C",
            borderRadius: 2,
            margin: "14px 0 16px",
          }}
        />
        {/* "DAYS" sub-label */}
        <div
          style={{
            fontSize: 54,
            fontWeight: 700,
            color: "#C1443C",
            letterSpacing: 18,
            textTransform: "uppercase",
          }}
        >
          DAYS
        </div>
      </div>
    ),
    { ...size },
  );
}
