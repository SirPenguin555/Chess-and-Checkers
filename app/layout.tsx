import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Chess & Checkers Platform",
  description:
    "A comprehensive chess and checkers gaming platform featuring AI opponents, multiplayer gameplay, and stunning visual customization.",
  keywords: [
    "chess",
    "checkers",
    "game",
    "multiplayer",
    "ai",
    "stockfish",
    "online chess",
  ],
  authors: [{ name: "SirPenguin555" }],
  creator: "SirPenguin555",
  publisher: "Chess & Checkers Platform",
  metadataBase: new URL("https://chess-and-checkers.vercel.app"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://chess-and-checkers.vercel.app",
    siteName: "Chess & Checkers Platform",
    title: "Chess & Checkers Platform",
    description:
      "Play chess and checkers with AI opponents or friends online. Features 3D chess, game variations, and beautiful customization.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Chess & Checkers Platform",
    description:
      "Play chess and checkers with AI opponents or friends online. Features 3D chess, game variations, and beautiful customization.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
          {children}
        </div>
      </body>
    </html>
  );
}