import Link from "next/link";
import Image from "next/image";
import { ShieldCheck, Sparkles } from "lucide-react";

const links = [
  { href: "/", label: "Início" },
  { href: "/dashboard", label: "Painel" },
  { href: "/transactions", label: "Extrato" },
  { href: "/payment-keys", label: "Chaves de recebimento" },
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
              Simple Bank is a fully digital banking institution providing secure deposits, instant transactions, and encrypted financial statements regulated under international financial standards.
            </p>
          </div>

          <div>
            <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[var(--dracula-fg)]">
              <Sparkles className="h-3.5 w-3.5 text-[var(--dracula-cyan)]" />
              Navegação
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
              Segurança
            </div>
            <div className="grid gap-3 text-sm">
              <span>Criptografia de ponta a ponta</span>
              <span>Regulado pelo Banco Central</span>
              <span>Depósitos protegidos pelo FGC</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-[var(--dracula-border)]/50 pt-6 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} Simple Bank S.A. All rights reserved.</p>
          <p>CNPJ 00.000.000/0001-00 · Av. Paulista, 1000 - São Paulo, SP</p>
        </div>
      </div>
    </footer>
  );
}
