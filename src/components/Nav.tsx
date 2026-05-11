import Link from "next/link";

export default function Nav() {
  return (
    <header className="border-b border-slate-200 bg-white/70 backdrop-blur">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <span className="inline-block h-6 w-6 rounded-md bg-brand-500" aria-hidden />
          <span className="font-semibold tracking-tight">mefit</span>
        </Link>
        <nav className="flex gap-4 text-sm">
          <Link href="/today" className="hover:text-brand-700">
            Today
          </Link>
          <Link href="/week" className="hover:text-brand-700">
            Week
          </Link>
          <Link href="/profile" className="hover:text-brand-700">
            Profile
          </Link>
        </nav>
      </div>
    </header>
  );
}
