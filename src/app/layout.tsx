import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Amawal aɣurbiz — Dictionnaire tamazight",
    template: "%s | Amawal aɣurbiz",
  },
  description:
    "Dictionnaire tamazight–tamazight : tabadut, taseddast, agdazal et amedya.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fr"
      data-scroll-behavior="smooth"
      className={`${jakarta.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-screen flex-col font-sans">
        <SiteHeader />
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 lg:py-12">
          {children}
        </main>
        <footer className="border-t border-zinc-200/70 bg-white/60 backdrop-blur-sm">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-6 text-sm text-zinc-500 sm:flex-row sm:px-6">
            <p>
              <span className="font-bold text-brand-700">Amawal aɣurbiz</span>{" "}
              · Dictionnaire tamazight
            </p>
            <p className="font-mono text-zinc-400">ⴰⵎⴰⵡⴰⵍ ⴰⵖⵓⵔⴱⵉⵣ</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
