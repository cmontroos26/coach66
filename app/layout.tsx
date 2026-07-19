import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "coach 66",
  description: "A 66-day comeback strength program. Concrete, chalk, iron.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "coach 66",
  },
  openGraph: {
    title: "coach 66",
    description: "A 66-day comeback strength program. Concrete, chalk, iron.",
    type: "website",
    siteName: "coach 66",
  },
  twitter: {
    card: "summary",
    title: "coach 66",
    description: "A 66-day comeback strength program. Concrete, chalk, iron.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#1C1C1E",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#1C1C1E] text-[#F2F0EB]">
        {children}
      </body>
    </html>
  );
}
