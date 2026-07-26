# Simple Bank 🏦

> Mobile-first fintech banking demo built with Next.js 16, Auth.js v5, Prisma, PostgreSQL and an integrated AI assistant powered by Google Gemini.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?logo=prisma)](https://www.prisma.io/)
[![Auth.js](https://img.shields.io/badge/Auth.js-v5-purple)](https://authjs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)](https://vercel.com/)

---

## Overview

**Simple Bank** is a full-stack, single-repository Next.js application that simulates a mobile banking ledger. It demonstrates real-world patterns for authentication, protected API routes, double-entry bookkeeping, idempotent transfers, QR-code payment keys, authenticated PDF receipt generation and AI-powered transaction intelligence — all inside a single deployable Vercel project.

The UI follows the **Dracula** colour palette with glassmorphism panels, Framer Motion page transitions and a responsive bottom navigation for mobile users.

---

## Features

- **Authentication** — Credentials provider via Auth.js v5, JWT sessions, `bcryptjs` password hashing, encrypted `AUTH_SECRET`.
- **Dashboard** — Real-time balance, total sent/received, transaction count and last movement.
- **Payment Keys** — Generate, list, copy and delete UUID-based receivable keys; QR code available per key.
- **Two-Step Transfers** — Resolve payment key → confirm amount/description modal; idempotency key generated client-side and stored as `referenceId`.
- **Double-Entry Ledger** — Debit and credit rows written atomically inside a Prisma transaction; balance updated in the same transaction.
- **PDF Receipts** — Authenticated endpoint streams a generated PDF for any debit transaction owned by the session user.
- **AI Banking Assistant** — Google Gemini integration for:
  - Transaction categorisation and friendly explanations.
  - Natural-language transfer intent parsing (`/api/ai/parse-transfer`).
  - Budget advice based on the user's ledger history (`/api/ai/budget-advice`).
  - AI usage event tracking with SHA-256 cache keying to avoid duplicate LLM calls.
- **i18n** — Fully internationalised UI via a typed dictionary provider; no hardcoded labels in components.
- **Mobile UX** — Fixed bottom navigation, responsive modals, Recharts ledger activity chart.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Auth | Auth.js v5 / NextAuth beta — JWT strategy |
| ORM | Prisma 7 + `@prisma/adapter-pg` |
| Database | PostgreSQL |
| AI | Google Gemini (`@google/genai`) |
| State / Fetching | TanStack Query v5 |
| Forms | React Hook Form + Zod |
| Styling | Tailwind CSS 4 |
| Animation | Framer Motion 12 |
| Charts | Recharts |
| Icons | Lucide React |
| PDF | Custom receipt generator (`receipt-pdf.ts`) |
| QR Codes | `qrcode` |
| Testing | Vitest |
| Deployment | Vercel |

---

## Architecture

```
simple-bank/
├── app/                          # Next.js App Router — routes only, thin pages
│   ├── api/
│   │   ├── ai/
│   │   │   ├── budget-advice/    # POST  — Gemini budget analysis
│   │   │   ├── parse-transfer/   # POST  — NL → transfer intent
│   │   │   ├── transaction/      # POST  — categorise & explain a transaction
│   │   │   └── usage/            # GET   — AI usage stats for session user
│   │   ├── auth/
│   │   │   ├── [...nextauth]/    # Auth.js catch-all handler
│   │   │   └── register/         # POST  — create account
│   │   ├── health/               # GET   — liveness probe
│   │   ├── payment-keys/         # GET, POST, DELETE /[key]
│   │   ├── payments/             # POST  — execute transfer
│   │   ├── transactions/
│   │   │   └── [id]/receipt/     # GET   — stream PDF receipt
│   │   └── users/
│   │       ├── me/               # GET   — session user profile
│   │       └── transactions/     # GET   — paginated ledger
│   ├── dashboard/page.tsx
│   ├── login/page.tsx
│   ├── payment-keys/page.tsx
│   ├── register/page.tsx
│   ├── transactions/page.tsx
│   ├── globals.css               # Dracula design tokens + Tailwind base
│   ├── layout.tsx
│   └── providers.tsx             # TanStack Query + i18n providers
│
├── components/                   # Pure rendering components
│   ├── auth/                     # Login & register forms
│   ├── dashboard/                # Balance card, stat cards, activity chart
│   ├── landing/                  # Public landing page sections
│   ├── layout/                   # AppHeader, AppFooter
│   ├── modals/                   # Transfer modal (step 1 + step 2), key modal
│   ├── payment-keys/             # Key list, key card, QR display
│   ├── transactions/             # Ledger table, receipt button, AI insight
│   └── ui/                       # Shared primitives (StatCard, …)
│
├── hooks/                        # React hooks — state, effects, API integration
│   ├── use-ai.ts                 # AI endpoints + cache-aware fetching
│   ├── use-auth.ts               # Register / login mutations
│   ├── use-payment-key-actions.ts
│   ├── use-payment.ts            # Transfer mutation
│   ├── use-receipt-download.ts   # Blob download helper
│   ├── use-transaction-modal.ts  # Two-step transfer state machine
│   ├── use-transactions.ts       # Ledger query
│   └── use-wallet.ts             # Balance & summary query
│
├── lib/                          # Business logic, services, mappers, utils
│   ├── services/
│   │   ├── ai-service.ts         # Gemini client, cache logic, usage tracking
│   │   ├── banking-api.ts        # Client-side fetch wrappers for /api/*
│   │   └── health-api.ts
│   ├── ledger-mappers.ts         # Raw DB row → UI TransactionRow
│   ├── ledger-selects.ts         # Prisma select shapes for ledger queries
│   ├── payment-key-service.ts    # Payment key CRUD helpers
│   ├── payment-qr.ts             # QR data-URL generation
│   ├── payment-service.ts        # Transfer & balance update logic
│   ├── receipt-pdf.ts            # PDF byte generation
│   ├── receipt.ts                # Receipt data assembly
│   ├── transaction-mappers.ts    # Transaction type formatters
│   ├── user-service.ts           # User lookup helpers
│   ├── format.ts                 # Currency / date formatters
│   ├── prisma.ts                 # Singleton Prisma client
│   ├── query-client.ts           # TanStack Query singleton
│   └── api-types.ts              # Shared API request/response types
│
├── src/
│   └── i18n/
│       ├── dictionaries.ts       # Typed i18n dictionaries (pt-BR / en)
│       └── provider.tsx          # i18n context provider
│
├── prisma/
│   └── schema.prisma             # Data models (User, PaymentKey, Transaction, AI*)
│
├── auth.ts                       # Auth.js config — Credentials provider, JWT callbacks
├── next-auth.d.ts                # Session type augmentation
├── next.config.ts
└── vercel.json
```

### Data Flow

```
Browser
  └─► hooks/ (TanStack Query mutations/queries)
        └─► lib/services/banking-api.ts  (fetch wrappers)
              └─► app/api/*              (Next.js Route Handlers)
                    ├─► lib/payment-service.ts / payment-key-service.ts / …
                    │     └─► lib/prisma.ts  (Prisma client → PostgreSQL)
                    └─► lib/services/ai-service.ts  (Google Gemini API)
```

### Key Design Decisions

- **Single-repo, single Vercel project** — no micro-frontend split; API and UI deploy together.
- **No external bearer tokens in the browser** — the session cookie from Auth.js is the only credential; API routes validate via `auth()`.
- **Idempotent transfers** — clients generate a `referenceId` (UUID v4) before submission; the DB enforces `@@unique([userId, referenceId])` to prevent duplicate debits on retry.
- **AI caching** — transaction analyses are keyed by a SHA-256 hash of `(payerId, receiverId, description, amount)` and stored in `AiTransactionAnalysis`; repeated requests hit the DB cache, not Gemini.
- **Double-entry bookkeeping** — every transfer creates exactly one DEBIT row (payer's ledger) and one CREDIT row (receiver's ledger) inside a Prisma `$transaction`, keeping `balance` consistent.

---

## Data Model

```prisma
User            → balance (Int, cents), email, taxId, passwordHash
PaymentKey      → UUID key owned by a User
Transaction     → DEBIT | CREDIT, userId, payerId, receiverId, referenceId
AiTransactionAnalysis → txnHash (SHA-256), result (JSON), cached per unique transfer
AiUsageEvent    → per-request log for usage analytics
```

---

## Environment Variables

Create `.env.local` in the repository root:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
AUTH_SECRET="generate-a-long-random-secret"
AUTH_URL="http://localhost:3000"
NEXT_PUBLIC_GITHUB_URL="https://github.com/emanuelVINI01"
GOOGLE_AI_API_KEY="your-gemini-api-key"
```

Generate a secure `AUTH_SECRET`:

```bash
openssl rand -base64 32
```

For Vercel, set the same variables in the project dashboard.

---

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Push Prisma schema to your database
npm run prisma:push

# 3. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | `prisma generate` + `next build` |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run test` | Run Vitest test suite |
| `npm run prisma:generate` | Regenerate Prisma client |
| `npm run prisma:push` | Push schema to database (dev) |
| `npm run prisma:studio` | Open Prisma Studio |

> `npm run build` runs `prisma generate` before `next build` to keep Vercel builds in sync with the schema.

---

## API Surface

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/health` | — | Liveness probe |
| `POST` | `/api/auth/register` | — | Create account |
| `GET\|POST` | `/api/auth/[...nextauth]` | — | Auth.js handler |
| `GET` | `/api/users/me` | ✅ | Session user profile |
| `GET` | `/api/users/transactions` | ✅ | Paginated ledger |
| `GET` | `/api/payment-keys` | ✅ | List payment keys |
| `POST` | `/api/payment-keys` | ✅ | Create payment key |
| `GET` | `/api/payment-keys/:key` | — | Resolve key → owner |
| `DELETE` | `/api/payment-keys/:key` | ✅ | Delete payment key |
| `POST` | `/api/payments` | ✅ | Execute transfer |
| `GET` | `/api/transactions/:id/receipt` | ✅ | Stream PDF receipt |
| `POST` | `/api/ai/parse-transfer` | ✅ | NL → transfer intent |
| `POST` | `/api/ai/transaction` | ✅ | Categorise transaction |
| `POST` | `/api/ai/budget-advice` | ✅ | Budget analysis |
| `GET` | `/api/ai/usage` | ✅ | AI usage stats |

---

## Deployment

Deploy the repository root to Vercel:

| Setting | Value |
|---|---|
| Framework Preset | `Next.js` |
| Build Command | `npm run build` |
| Install Command | `npm install` |
| Output Directory | `.next` |

Use a hosted PostgreSQL database (e.g. Vercel Postgres, Neon, Supabase) and add all environment variables in the Vercel dashboard.

---

## License

No open-source license is declared yet.
