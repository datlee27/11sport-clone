import type { Metadata } from "next";
import "./globals.css";
import VersionChecker from "@/components/VersionChecker";

export const metadata: Metadata = {
  title: "11Sport CMS — Hệ thống Quản trị",
  description:
    "Trang quản trị CMS 11Sport",
  icons: {
    icon: [
      { url: "/logo-11sport-icon.svg", type: "image/svg+xml" },
      { url: "/logo-11sport.svg", type: "image/svg+xml" },
    ],
    shortcut: "/logo-11sport-icon.svg",
    apple: "/logo-11sport-icon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className="min-h-screen antialiased font-sans">
        {children}
        <VersionChecker />
      </body>
    </html>
  );
}
