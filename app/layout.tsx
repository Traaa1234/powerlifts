import type { Metadata } from "next";
import localFont from "next/font/local";
import Link from "next/link";
import "./globals.css";
import { SelectionProvider } from "@/components/selection-provider";
import { RoutineNavLink } from "@/components/routine-nav-link";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "PowerLifts — 80/20 lifting",
  description:
    "The minimum lifts for maximum gains. Ranked by impact-per-minute.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}
      >
        <SelectionProvider>
          <header className="border-b border-border">
            <div className="mx-auto max-w-5xl px-6 py-4 flex items-center justify-between">
              <Link
                href="/"
                className="font-mono text-lg font-bold tracking-tight"
              >
                POWERLIFTS
              </Link>
              <nav className="flex gap-6 text-sm font-mono uppercase tracking-wider text-muted-foreground">
                <Link href="/" className="hover:text-foreground">
                  Muscles
                </Link>
                <RoutineNavLink />
                <Link href="/method" className="hover:text-foreground">
                  Method
                </Link>
              </nav>
            </div>
          </header>
          <main className="mx-auto max-w-5xl px-6 py-10">{children}</main>
        </SelectionProvider>
      </body>
    </html>
  );
}
