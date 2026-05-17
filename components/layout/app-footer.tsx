import Link from "next/link";
import Image from "next/image";
import { ExternalLink, ShieldCheck, Sparkles } from "lucide-react";

const links = [
  { href: "/", label: "Home" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/transactions", label: "Transactions" },
  { href: "/payment-keys", label: "Payment keys" },
];

export function AppFooter() {
  return (
    <footer className="relative z-10 mt-10 border-t border-[var(--dracula-border)]/70 bg-[var(--dracula-bg)] text-[var(--dracula-comment)]">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 pb-32 pt-10 sm:px-6 lg:pb-12">
        <div className="grid gap-8 md:grid-cols-[1.2fr_0.8fr_0.8fr]">
          <div className="max-w-md">
            <Link href="/" className="inline-flex items-center gap-3 text-[var(--dracula-fg)]">
              <span className="relative h-10 w-10 overflow-hidden rounded-lg border border-[var(--dracula-purple)]/40">
                <Image src="/brand-logo.png" alt="Simple Bank logo" fill sizes="40px" className="object-cover" />
              </span>
              <span className="font-semibold tracking-tight">Simple Bank</span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed">
              Technical fintech demo with protected auth, payment keys, ledger transactions, receipt downloads and mobile-first Dracula UI.
            </p>
          </div>

          <div>
            <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[var(--dracula-fg)]">
              <Sparkles className="h-3.5 w-3.5 text-[var(--dracula-cyan)]" />
              Navigation
            </div>
            <div className="grid gap-2 text-sm">
              {links.map((link) => (
                <Link key={link.href} href={link.href} className="transition-colors hover:text-[var(--dracula-cyan)]">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[var(--dracula-fg)]">
              <ShieldCheck className="h-3.5 w-3.5 text-[var(--dracula-green)]" />
              Architecture
            </div>
            <div className="grid gap-3 text-sm">
              <span>Next.js API routes + Auth.js JWT</span>
              <a
                href="https://github.com/emanuelVINI01"
                target="_blank"
                rel="noreferrer"
                className="inline-flex w-fit items-center gap-2 rounded-lg border border-[var(--dracula-cyan)]/20 bg-[var(--dracula-cyan)]/10 px-3 py-2 text-[var(--dracula-fg)] transition-colors hover:border-[var(--dracula-cyan)]/50 hover:text-[var(--dracula-cyan)]"
              >
                GitHub
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-[var(--dracula-border)]/50 pt-6 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} Simple Bank.</p>
          <p>ACID-minded banking demo</p>
        </div>
      </div>
    </footer>
  );
}
