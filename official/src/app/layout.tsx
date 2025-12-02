import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PLEASURE - Experience Pleasure Reimagined by AI",
  description: "The next generation of personal wellness technology. AI-powered rhythm engine with adaptive learning and personalized experiences.",
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

