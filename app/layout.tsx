import type { Metadata, Viewport } from "next";
import { invitation } from "@/config/invitation";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: invitation.title,
  description: invitation.description,
  robots: { index: false, follow: false },
  openGraph: {
    title: invitation.title,
    description: invitation.description,
    type: "website",
    images: [{ url: "/images/invitation-desktop.svg", alt: "Wedding invitation for Muhammed Mushraf and Sharfina Sherin" }],
  },
  twitter: {
    card: "summary_large_image",
    title: invitation.title,
    description: invitation.description,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: invitation.themeColor,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
