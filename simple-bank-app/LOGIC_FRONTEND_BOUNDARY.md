# Logic / Frontend Boundary

This folder is split so one agent can own the mobile logic layer and another can own only the visual frontend.

## Logic Layer Already Implemented

The frontend must consume these modules instead of recreating fetch, auth, formatting, validation or polling logic.

```txt
src/api/
  auth.ts        Auth.js CSRF/login/register/session/logout flow.
  banking.ts    Banking API requests for wallet, transactions, keys and payments.
  client.ts     Fetch wrapper with base URL, cookies and API errors.
  errors.ts     ApiError helper.
  types.ts      Shared API contracts.

src/hooks/
  use-auth.ts                  Login, register, logout, current user.
  use-wallet.ts                Wallet profile query.
  use-payment-keys.ts          List/create/delete/copy payment keys.
  use-transactions.ts          Transactions query and list view-model.
  use-transfer.ts              Multi-step transfer state, resolve key, pay.
  use-receipt.ts               Download/share receipt PDF.
  use-credit-notifications.ts  Polling/local notifications for received credits.
  query-keys.ts                TanStack Query keys.

src/i18n/
  dictionaries.ts  Typed pt-BR dictionary keys.
  provider.tsx     I18nProvider, useI18n and translate().

src/lib/
  config.ts                EXPO_PUBLIC_API_URL handling.
  cookies.ts               Secure cookie jar for Auth.js cookies.
  format.ts                BRL/date/reference formatting.
  idempotency.ts           UUID idempotency key generation.
  mask.ts                  taxId/email/name helpers.
  notification-cursor.ts   Secure cursor for credit polling.
  notifications.ts         Expo notification permission and local notification.
  receipt.ts               Authenticated PDF download/share.

src/mappers/
  transaction.ts  Counterparty, grouping, filtering and summary helpers.

src/providers/
  query-client.ts  QueryClient factory.

src/theme/
  colors.ts  Dracula token values.
  tokens.ts  Shared spacing/shadow/semantic tokens.

src/validation/
  auth.ts      Login/register Zod schemas.
  transfer.ts  Payment key and amount schemas.
```

## Frontend Layer To Implement

The frontend agent should create:

```txt
app/
  _layout.tsx
  index.tsx
  (auth)/
  (tabs)/
  transaction/
  receipt/

src/components/
  app/
  feedback/
  forms/
  home/
  keys/
  transactions/
  transfer/
  ui/

global.css
metro.config.js
tailwind.config.js or NativeWind v5 config
app.json / app.config.ts
```

## Hard Rules For Frontend

- Do not implement `fetch` in screens or components.
- Do not call `/api/...` directly from UI.
- Do not duplicate API types.
- Do not hardcode UI strings; use `useI18n().t(...)`.
- Do not reimplement money/date/mask formatting.
- Do not create a second auth/session system.
- Do not create fake permanent data; use skeletons/empty states while hooks load.
- Do not implement visual components inside `src/hooks`, `src/api`, `src/lib`, `src/i18n`, `src/mappers`, `src/providers`, `src/theme` or `src/validation`.
- If a UI need exposes a missing dictionary key, add it to `src/i18n/dictionaries.ts` first.
- If a UI need exposes a missing reusable data transformation, add it to `src/mappers` or `src/lib`, not inside a component.

## Runtime Composition Expected

The app root should wrap screens with:

```tsx
const queryClient = createBankQueryClient();

<QueryClientProvider client={queryClient}>
  <I18nProvider>
    {/* Expo Router Slot */}
  </I18nProvider>
</QueryClientProvider>
```

Then screens should consume hooks:

- Login/Register: `useAuth`, `loginSchema`, `registerSchema`.
- Home: `useAuth`, `useWallet`, `useTransactions`, `useTransactionViewModel`.
- Transfer: `useTransferFlow`, `resolveKeySchema`, `paymentSchema`.
- Keys: `usePaymentKeys`, `useCreatePaymentKey`, `useDeletePaymentKey`, `useCopyPaymentKey`.
- Transactions: `useTransactions`, `useTransactionViewModel`, `findTransactionById`.
- Receipt: `useDownloadReceipt`, `useShareReceipt`.
- Notifications: `useCreditNotifications` in the authenticated app shell.

