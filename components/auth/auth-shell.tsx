import Link from "next/link";
import Image from "next/image";

export function AuthShell({
  children,
  eyebrow,
  title,
  description,
}: {
  children: React.ReactNode;
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10 sm:px-5 sm:py-12">
      <div className="grid-noise absolute inset-0 opacity-70" />
      <section className="relative z-10 grid w-full max-w-6xl gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <div className="hidden lg:block">
          <Link href="/" className="mb-10 inline-flex items-center gap-3">
            <span className="relative h-12 w-12 overflow-hidden rounded-2xl border border-white/10 shadow-lg shadow-purple-950/40">
              <Image src="/brand-logo.png" alt="Simple Bank logo" fill sizes="48px" className="object-cover" />
            </span>
            <span className="font-bold text-white">Simple Bank</span>
          </Link>
          <p className="text-sm font-bold uppercase tracking-[0.24em] text-[#8be9fd]">{eyebrow}</p>
          <h1 className="mt-4 max-w-xl text-5xl font-black leading-tight text-white">{title}</h1>
          <p className="mt-5 max-w-lg text-lg leading-8 text-[#a7b0c8]">{description}</p>
          <div className="mt-8 grid max-w-lg gap-3 sm:grid-cols-2">
            {["Auth.js JWT", "Ledger UX", "Local API routes", "Payment keys"].map((item) => (
              <div key={item} className="glass-surface rounded-2xl px-4 py-3 text-sm font-semibold text-[#f8f8f2]">
                {item}
              </div>
            ))}
          </div>
        </div>
        <Link href="/" className="mb-2 inline-flex min-w-0 items-center gap-3 lg:hidden">
          <span className="relative h-10 w-10 overflow-hidden rounded-lg border border-[var(--dracula-purple)]/40 shadow-lg shadow-black/20">
            <Image src="/brand-logo.png" alt="Simple Bank logo" fill sizes="40px" className="object-cover" />
          </span>
          <span className="min-w-0 truncate font-bold text-white">Simple Bank</span>
        </Link>
        <div className="glass-surface min-w-0 rounded-2xl p-4 sm:p-7">
          {children}
        </div>
      </section>
    </main>
  );
}
