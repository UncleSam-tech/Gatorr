import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gatorr | Pain-Signal Intelligence",
  description: "Public-web pain-signal intelligence for startup customer acquisition.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
