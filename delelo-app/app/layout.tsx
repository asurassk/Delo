import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import HydrationGate from "@/components/layout/HydrationGate";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "cyrillic"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin", "cyrillic"],
});

export const metadata: Metadata = {
  title: "ДЕЛО — симулятор предпринимателя",
  description:
    "Интерактивный симулятор предпринимательства. Первый бизнес в MVP — кофейня.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ru"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-screen bg-slate-50 font-sans text-slate-800">
        <HydrationGate>{children}</HydrationGate>
      </body>
    </html>
  );
}
