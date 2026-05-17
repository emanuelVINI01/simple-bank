# Simple Bank

Simple Bank is a single Next.js application for a mobile-first fintech banking demo. The UI, authentication, API route handlers, Prisma data layer and receipt generation live in the repository root, so the project can be deployed to Vercel as one app.

## Short Description

Mobile-first Dracula banking ledger built with Next.js, Auth.js v5, JWT sessions, Prisma, PostgreSQL, TanStack Query, Framer Motion and Tailwind CSS. It demonstrates credential authentication, protected local API routes, account balances, payment keys, ledger transactions, idempotent transfer references and authenticated PDF receipts.

## Features

- Auth.js v5 Credentials provider with JWT sessions.
- Server-side `AUTH_SECRET` support for encrypted Auth.js session tokens.
- Local Next.js API route handlers under `app/api`.
- Prisma/PostgreSQL models for users, payment keys and transactions.
- Register and login flows with password hashing through `bcryptjs`.
- Protected dashboard with balance, sent, received, total transactions and last movement.
- Payment key generation, listing, copy and deletion.
- Two-step transfer modal with payment-key resolution and confirmation.
- Idempotency key sent from the UI and stored as the transaction reference.
- Debit and credit ledger rows created inside a Prisma transaction.
- Authenticated PDF receipt endpoint for debit transactions.
- Mobile bottom navigation, responsive modals and responsive tables.
- Dracula theme, glass panels, Framer Motion transitions and charted ledger activity.

## Tech Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Auth.js v5 / NextAuth beta
- JWT session strategy
- Prisma 7
- PostgreSQL
- TanStack Query
- React Hook Form
- Zod
- Tailwind CSS 4
- Framer Motion
- Recharts
- Lucide React

## Project Structure

```txt
app/
  api/
    auth/
    health/
    payment-keys/
    payments/
    transactions/
    users/
  dashboard/page.tsx
  login/page.tsx
  payment-keys/page.tsx
  register/page.tsx
  transactions/page.tsx
components/
hooks/
lib/
  api-types.ts
  ledger.ts
  prisma.ts
  receipt.ts
prisma/
  schema.prisma
auth.ts
next-auth.d.ts
```

## Environment

Create `.env.local` in the repository root:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
AUTH_SECRET="generate-a-long-random-secret"
AUTH_URL="http://localhost:3000"
NEXT_PUBLIC_GITHUB_URL="https://github.com/emanuelVINI01"
```

For Vercel, set the same variables in the project dashboard. `AUTH_SECRET` must be a long random value. You can generate one with:

```bash
openssl rand -base64 32
```

## Running Locally

```bash
npm install
npm run prisma:push
npm run dev
```

Open `http://localhost:3000`.

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run prisma:generate
npm run prisma:push
npm run prisma:studio
```

`npm run build` runs `prisma generate` before `next build`, which keeps Vercel builds aligned with the Prisma schema.

## Local API Surface

- `GET /api/health`
- `POST /api/auth/register`
- `GET|POST /api/auth/[...nextauth]`
- `GET /api/users/me`
- `GET /api/users/transactions`
- `GET /api/payment-keys`
- `POST /api/payment-keys`
- `GET /api/payment-keys/:key`
- `DELETE /api/payment-keys/:key`
- `POST /api/payments`
- `GET /api/transactions/:id/receipt`

The frontend hooks call these local routes directly with `fetch("/api/...")`; there is no external API base URL or browser-stored bearer token.

## Data Model

- `User` stores identity, hashed password, tax ID and balance.
- `PaymentKey` stores receivable UUID keys owned by users.
- `Transaction` stores debit and credit rows with shared references, payer, receiver, amount, description and timestamp.

New demo users start with a default balance so transfer flows can be tested immediately.

## Deployment Notes

Deploy the repository root on Vercel:

- Framework Preset: `Next.js`
- Build Command: `npm run build`
- Install Command: `npm install`
- Output Directory: `.next`

Use a hosted PostgreSQL database and set `DATABASE_URL`, `AUTH_SECRET`, `AUTH_URL` and `NEXT_PUBLIC_GITHUB_URL` in Vercel.

## License

No open-source license is declared yet.
