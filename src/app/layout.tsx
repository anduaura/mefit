import "./globals.css";
import type { Metadata } from "next";
import Nav from "@/components/Nav";

export const metadata: Metadata = {
  title: "mefit — fitness catered to you",
  description: "Free, personalized daily fitness programs based on your schedule and goals.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <Nav />
        <main className="mx-auto max-w-3xl px-4 py-6 sm:py-10">{children}</main>
        <footer className="mx-auto max-w-3xl px-4 py-10 text-center text-xs text-slate-500">
          mefit · free for everyone · not medical advice
        </footer>
      </body>
    </html>
  );
}
