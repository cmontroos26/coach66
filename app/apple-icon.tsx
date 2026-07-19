import { ImageResponse } from "next/og";

// iOS requires 180×180 for apple-touch-icon
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          background: "#1C1C1E",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            fontSize: 80,
            fontWeight: 900,
            color: "#F2F0EB",
            lineHeight: 1,
            letterSpacing: -4,
          }}
        >
          66
        </div>
        <div
          style={{
            width: 56,
            height: 2,
            background: "#C1443C",
            borderRadius: 1,
            margin: "6px 0 7px",
          }}
        />
        <div
          style={{
            fontSize: 20,
            fontWeight: 700,
            color: "#C1443C",
            letterSpacing: 7,
          }}
        >
          DAYS
        </div>
      </div>
    ),
    { ...size },
  );
}
