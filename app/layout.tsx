import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bucket List Travel — Plan Adventures, Collect Memories",
  description:
    "A travel planning and memory platform for couples. Explore destinations, plan trips, and preserve unforgettable moments together.",
  openGraph: {
    title: "Bucket List Travel",
    description: "Plan adventures. Collect memories. Travel together.",
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
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
