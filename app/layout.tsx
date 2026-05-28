import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Skill Swap — Trade What You Know",
  description: "A verified skill-barter platform for students and professionals in India. Trade what you know for what you want — no money, just skills.",
  keywords: ["skill swap", "skill barter", "learn skills", "peer learning", "india"],
  openGraph: {
    title: "Skill Swap — Trade What You Know",
    description: "Trade skills, not money. India's first verified skill-barter platform.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
