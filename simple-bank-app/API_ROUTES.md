# Simple Bank API Routes

Base URL in development: `http://localhost:3000`

The API is implemented with Next.js App Router route handlers under `app/api`. Authentication uses Auth.js v5 Credentials with JWT sessions stored in HTTP cookies. The current web frontend calls the API with `fetch("/api/...")` and `credentials: "same-origin"`. A native Expo app must persist and resend the Auth.js cookies returned by the login flow.

Amounts are stored as integer cents. `1000` means `R$ 10,00`.

## Common Shapes

### Public User

```ts
type User = {
  id: string;
  name: string;
  email: string;
  taxId: string;
  balance: number;
  createdAt: string;
};
```

### Payment Key

```ts
type PaymentKey = {
  id: string;
  key: string;
  userId: string;
  createdAt: string;
  user: User;
};
```

### Transaction

```ts
type Transaction = {
  id: string;
  userId: string;
  payerId: string | null;
  receiverId: string | null;
  amount: number;
  type: "DEBIT" | "CREDIT";
  referenceId: string;
  description: string | null;
  createdAt: string;
  payer: User | null;
  receiver: User | null;
  receiptUrl?: string;
};
```

`receiptUrl` is only generated for debit transfer rows that have both payer and receiver.

### Error

Most JSON errors use one of these shapes:

```ts
type ApiError = {
  message?: string;
  error?: string;
  errors?: unknown;
};
```

Validation errors come from Zod `error.flatten()`.

## Public Routes

### GET `/api/health`

Checks whether the Next.js API is awake.

Response `200`:

```json
{
  "ok": true,
  "service": "next-ledger-api"
}
```

### POST `/api/auth/register`

Creates a local account with an initial demo balance from the Prisma model default.

Request body:

```json
{
  "name": "Maria Silva",
  "email": "maria@example.com",
  "taxId": "12345678",
  "password": "password123"
}
```

Validation:

- `name`: trimmed string, 3 to 50 chars.
- `email`: valid email, max 64 chars, normalized to lowercase.
- `taxId`: exactly 8 digits.
- `password`: 8 to 128 chars.

Response `201`:

```json
{
  "user": {
    "id": "uuid",
    "name": "Maria Silva",
    "email": "maria@example.com",
    "taxId": "12345678",
    "balance": 1000,
    "createdAt": "2026-05-24T14:00:00.000Z"
  }
}
```

Errors:

- `400` invalid payload.
- `409` email or tax ID already registered.

## Auth.js Routes

### GET|POST `/api/auth/[...nextauth]`

Catch-all route handled by Auth.js v5.

Important endpoints for a native client:

- `GET /api/auth/csrf`: returns the CSRF token required by credentials sign-in.
- `POST /api/auth/callback/credentials`: validates email/password and sets Auth.js session cookies.
- `GET /api/auth/session`: returns the current session when cookies are valid.
- `POST /api/auth/signout`: signs the user out and clears session cookies.

Credentials payload for native login generally needs form-encoded data with:

```txt
csrfToken=<token from /api/auth/csrf>
email=<email>
password=<password>
redirect=false
json=true
```

The current web app uses `next-auth/react` `signIn("credentials")`, which abstracts this flow. In Expo, implement a small Auth.js client that:

1. Fetches CSRF.
2. Stores `Set-Cookie` headers in secure storage/cookie manager.
3. Posts credentials to the callback endpoint.
4. Calls `/api/users/me` to hydrate the app user.

## Protected Routes

All routes below require a valid Auth.js session cookie. Missing or invalid sessions return:

```json
{
  "message": "Unauthorized."
}
```

with HTTP `401`.

### GET `/api/users/me`

Returns the authenticated user's profile and current balance.

Response `200`:

```json
{
  "user": {
    "id": "uuid",
    "name": "Maria Silva",
    "email": "maria@example.com",
    "taxId": "12345678",
    "balance": 1000,
    "createdAt": "2026-05-24T14:00:00.000Z"
  }
}
```

Errors:

- `401` unauthorized.
- `404` authenticated user no longer exists.

### GET `/api/users/transactions`

Returns the authenticated user's ledger rows, newest first.

Query params:

- `limit`: optional number. Defaults to `50`. Clamped from `1` to `100`.

Example:

```txt
GET /api/users/transactions?limit=25
```

Response `200`:

```json
{
  "transactions": [
    {
      "id": "uuid",
      "userId": "user-uuid",
      "payerId": "payer-uuid",
      "receiverId": "receiver-uuid",
      "amount": 2500,
      "type": "CREDIT",
      "referenceId": "idempotency-key",
      "description": "Aluguel",
      "createdAt": "2026-05-24T14:00:00.000Z",
      "payer": {
        "id": "payer-uuid",
        "name": "Joao",
        "email": "joao@example.com",
        "taxId": "87654321",
        "balance": 500,
        "createdAt": "2026-05-24T13:00:00.000Z"
      },
      "receiver": {
        "id": "receiver-uuid",
        "name": "Maria Silva",
        "email": "maria@example.com",
        "taxId": "12345678",
        "balance": 3500,
        "createdAt": "2026-05-24T14:00:00.000Z"
      }
    }
  ]
}
```

### GET `/api/payment-keys`

Lists all payment keys owned by the authenticated user.

Response `200`:

```json
{
  "paymentKeys": [
    {
      "id": "key-row-uuid",
      "key": "receivable-key-uuid",
      "userId": "user-uuid",
      "createdAt": "2026-05-24T14:00:00.000Z",
      "user": {
        "id": "user-uuid",
        "name": "Maria Silva",
        "email": "maria@example.com",
        "taxId": "12345678",
        "balance": 1000,
        "createdAt": "2026-05-24T14:00:00.000Z"
      }
    }
  ]
}
```

### POST `/api/payment-keys`

Creates a new receivable UUID key for the authenticated user.

Body: none.

Response `201`:

```json
{
  "paymentKey": {
    "id": "key-row-uuid",
    "key": "receivable-key-uuid",
    "userId": "user-uuid",
    "createdAt": "2026-05-24T14:00:00.000Z",
    "user": {
      "id": "user-uuid",
      "name": "Maria Silva",
      "email": "maria@example.com",
      "taxId": "12345678",
      "balance": 1000,
      "createdAt": "2026-05-24T14:00:00.000Z"
    }
  }
}
```

Rules:

- Each user may have at most 10 payment keys.

Errors:

- `400` when the key limit is reached.

### GET `/api/payment-keys/:key`

Resolves a payment key before paying. `:key` can be either `PaymentKey.key` or `PaymentKey.id`.

Example:

```txt
GET /api/payment-keys/4249f155-11df-4d90-8ef6-7f3b97bc1644
```

Response `200`:

```json
{
  "paymentKey": {
    "id": "key-row-uuid",
    "key": "receivable-key-uuid",
    "userId": "receiver-user-uuid",
    "createdAt": "2026-05-24T14:00:00.000Z",
    "user": {
      "id": "receiver-user-uuid",
      "name": "Receiver",
      "email": "receiver@example.com",
      "taxId": "11112222",
      "balance": 1000,
      "createdAt": "2026-05-24T14:00:00.000Z"
    }
  }
}
```

Errors:

- `404` payment key not found.

### DELETE `/api/payment-keys/:key`

Deletes one owned payment key. `:key` can be either `PaymentKey.key` or `PaymentKey.id`, but deletion is scoped to the authenticated user.

Response:

- `204` no body on success.

Errors:

- `404` payment key not found or belongs to another user.

### POST `/api/payments`

Creates a transfer from the authenticated payer to the owner of a payment key.

Headers:

```txt
Content-Type: application/json
Idempotency-Key: <stable uuid generated by the app>
```

If `Idempotency-Key` is omitted, the backend creates a random UUID. For mobile, always send one and keep it stable while retrying a payment.

Request body:

```json
{
  "paymentKey": "payment-key-row-id-uuid",
  "amount": 2500,
  "description": "Aluguel"
}
```

Important: the current backend validates `paymentKey` as UUID and then looks it up by `PaymentKey.id`, not by `PaymentKey.key`. The app should call `GET /api/payment-keys/:key` first and submit the returned `paymentKey.id` to this route.

Validation:

- `paymentKey`: UUID.
- `amount`: positive integer cents.
- `description`: optional trimmed string, max 255 chars.

Success response `201`:

```json
{
  "success": true,
  "transactionId": "debit-transaction-uuid",
  "receiptUrl": "/api/transactions/debit-transaction-uuid/receipt"
}
```

Business rules:

- Payment key must exist.
- Payer cannot pay themselves.
- Payer balance must be greater than or equal to `amount`.
- A debit row is created for the payer and a credit row is created for the receiver in the same Prisma transaction.
- Repeating the same `Idempotency-Key` for the same payer returns the original debit transaction result.

Errors `400`:

```json
{
  "success": false,
  "error": "Insufficient balance.",
  "message": "Insufficient balance."
}
```

Possible business errors:

- `Payment key not found.`
- `You cannot pay yourself.`
- `Authenticated user not found.`
- `Insufficient balance.`

### GET `/api/transactions/:id/receipt`

Returns a PDF receipt for an authenticated user's debit transaction.

Example:

```txt
GET /api/transactions/f4dc6a3f-b07e-4a27-bbe7-e830e177c38d/receipt
```

Response `200`:

- `Content-Type: application/pdf`
- `Content-Disposition: inline; filename="transaction-receipt-<id>.pdf"`
- Body: PDF bytes.

Rules:

- Only debit rows owned by the authenticated user can generate receipts.
- Credit rows do not generate receipts in the current backend.

Errors:

- `404` receipt not found for this account.

## Mobile Notification Strategy

The current API has no websocket, SSE, webhook, device-token registration, or server-side push endpoint. To notify a mobile user when a transfer is received while still using the same API, implement client-side detection:

1. After login, fetch `/api/users/transactions?limit=25`.
2. Store the newest seen transaction ID and timestamp in secure/local storage.
3. Poll in foreground every 15 to 30 seconds, and on app resume/focus.
4. Detect new transactions where `type === "CREDIT"` and `createdAt` is newer than the stored cursor.
5. Trigger an Expo local notification with the amount and payer name.
6. Invalidate the `me`, `transactions`, and `paymentKeys` queries after detecting new credit.
7. Deep link notification taps to the transaction detail/extrato screen.

For true push when the app is killed, the backend would need an extension such as:

- `POST /api/devices/expo-token` to save Expo push tokens.
- A notification send in `createLedgerPayment` after `creditReceiver`.

That extension does not exist today, so the first version of the Expo app should use polling plus local notifications and document this limitation in code comments near the notification service.

