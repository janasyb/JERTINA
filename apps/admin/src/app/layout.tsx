import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "JERTINA Admin",
  description: "Internal operations portal for JERTINA",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
