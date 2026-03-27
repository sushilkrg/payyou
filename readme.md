# PayYou — Digital Wallet Platform

A full-stack digital wallet platform that allows users to register, verify their identity via OTP, manage their wallet, send/receive money, add funds via card, and get help through an AI-powered chatbot.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)
- [API Reference](#api-reference)
- [Environment Variables](#environment-variables)
- [Local Development Setup](#local-development-setup)
- [Docker Deployment (Backend)](#docker-deployment-backend)
- [Vercel Deployment (Frontend)](#vercel-deployment-frontend)
- [Security Highlights](#security-highlights)

---

## Overview

PayYou is a production-grade digital wallet application built with a modern, fully type-safe stack. Users can sign up, verify their account via email OTP, send money to other users by username, add money to their wallet via Stripe, view their full transaction history, and interact with a Gemini-powered AI assistant for feature guidance.

---

## Features

### Authentication
- Signup with full name, unique username, unique email, and password
- Email OTP verification via Nodemailer (OTP stored in Redis with 5-minute TTL)
- OTP rate limiting — max 3 requests per 15 minutes per email
- JWT-based authentication with access token (15 min) + refresh token (7 days)
- Refresh token stored in `httpOnly` cookie — never accessible via JavaScript
- Access token stored in Redux memory — never in `localStorage`
- Silent token refresh via Axios interceptor with request queue (handles concurrent 401s)
- Secure logout clears cookie and Redux state

### Wallet
- One wallet per user, auto-created on OTP verification
- Real-time balance display
- Daily transfer limit (default ₹10,000, user-configurable up to ₹1,00,000)
- Today's spent amount and remaining daily limit calculated on every request
- Wallet status: `ACTIVE` or `FROZEN`

### Send Money
- Send money to any user by their username
- Real-time recipient lookup with debounced API call
- Self-transfer prevention
- Balance and daily limit checks before every transfer
- Fully atomic transaction using Prisma `$transaction` — if any step fails, everything rolls back
- Ledger-based accounting — every transfer creates both a `DEBIT` and `CREDIT` entry

### Transaction History
- Filter by type (`SEND`, `RECEIVE`, `ADD`) and status (`SUCCESS`, `PENDING`, `FAILED`)
- Paginated results (10 per page)
- Direction indicator (`IN` / `OUT`) for each transaction
- Sender and receiver details included

### Add Money (Stripe)
- Stripe PaymentIntent created server-side — amount never trusted from frontend
- Stripe.js collects card details directly — server never sees raw card numbers
- Webhook signature verification — fake webhook requests rejected
- Idempotency key prevents duplicate PaymentIntents on rapid clicks
- Redis deduplication prevents double wallet credit if webhook fires multiple times
- 3-step UI: Amount → Card Payment → Success

### AI Chatbot
- Powered by Gemini 1.5 Flash
- Strictly scoped to PayYou feature guidance via system prompt
- No access to user's financial data
- Full conversation history sent on every request (Gemini is stateless)
- Rate limited to 10 messages per user per minute via Upstash Redis
- Floating chat widget available on all dashboard pages

### Settings
- Update full name and username (with uniqueness check)
- Change password (verifies current password, prevents reuse of same password)
- Update daily transfer limit with preset options
- Email is read-only and cannot be changed

### UI / UX
- Responsive layout — full sidebar on desktop, hamburger drawer on mobile
- Sidebar open/close state managed globally via Redux
- Loading skeletons and optimistic UI updates
- Suggested questions in chatbot before first message

---

## Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express | HTTP server |
| TypeScript | Type safety end to end |
| Prisma ORM | Type-safe database queries |
| PostgreSQL (Neon) | Primary database |
| Upstash Redis | OTP storage, rate limiting, idempotency |
| Nodemailer | OTP email delivery |
| JSON Web Tokens | Access + refresh token auth |
| bcryptjs | Password hashing |
| Zod | Runtime request validation |
| Stripe | Card payment processing |
| Google Gemini API | AI chatbot |
| Docker | Backend containerization |

### Frontend
| Technology | Purpose |
|---|---|
| React + TypeScript | UI framework |
| Tailwind CSS v4 | Styling |
| Redux Toolkit | Global state (auth, user, sidebar) |
| React Hook Form | Form management |
| Zod + @hookform/resolvers | Form validation |
| Axios | HTTP client with interceptors |
| React Router DOM | Client-side routing |
| Stripe.js + React Stripe | PCI-compliant card UI |
| Vercel | Frontend deployment |

---

## Project Structure

```
payyou/
│
├── payyou-backend/
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── .env
│   ├── package.json
│   ├── tsconfig.json
│   ├── nodemon.json
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── migrations/
│   └── src/
│       ├── app.ts
│       ├── modules/
│       │   ├── auth/
│       │   │   ├── auth.controller.ts
│       │   │   ├── auth.service.ts
│       │   │   ├── auth.routes.ts
│       │   │   └── auth.schema.ts
│       │   ├── user/
│       │   │   ├── user.controller.ts
│       │   │   ├── user.service.ts
│       │   │   ├── user.routes.ts
│       │   │   └── user.schema.ts
│       │   ├── wallet/
│       │   │   ├── wallet.controller.ts
│       │   │   ├── wallet.service.ts
│       │   │   └── wallet.routes.ts
│       │   ├── transaction/
│       │   │   ├── transaction.controller.ts
│       │   │   ├── transaction.service.ts
│       │   │   ├── transaction.routes.ts
│       │   │   └── transaction.schema.ts
│       │   ├── payment/
│       │   │   ├── payment.controller.ts
│       │   │   ├── payment.service.ts
│       │   │   ├── payment.routes.ts
│       │   │   └── payment.schema.ts
│       │   └── chatbot/
│       │       ├── chatbot.controller.ts
│       │       ├── chatbot.service.ts
│       │       ├── chatbot.routes.ts
│       │       └── chatbot.schema.ts
│       ├── middlewares/
│       │   ├── auth.middleware.ts
│       │   └── validate.middleware.ts
│       └── lib/
│           ├── prisma.ts
│           ├── redis.ts
│           ├── mailer.ts
│           ├── tokens.ts
│           ├── stripe.ts
│           └── gemini.ts
│
└── payyou-frontend/
    ├── vercel.json
    ├── .env
    ├── package.json
    ├── vite.config.ts
    ├── index.html
    └── src/
        ├── main.tsx
        ├── App.tsx
        ├── index.css
        ├── store/
        │   ├── store.ts
        │   └── slices/
        │       ├── authSlice.ts
        │       ├── userSlice.ts
        │       └── uiSlice.ts
        ├── api/
        │   └── axiosInstance.ts
        ├── hooks/
        │   └── useDebounce.ts
        ├── lib/
        │   └── schemas.ts
        ├── components/
        │   ├── Sidebar.tsx
        │   ├── DashboardLayout.tsx
        │   ├── ProtectedRoute.tsx
        │   └── ChatBot.tsx
        └── pages/
            ├── Signup.tsx
            ├── Login.tsx
            ├── VerifyOtp.tsx
            ├── Dashboard.tsx
            ├── SendMoney.tsx
            ├── AddMoney.tsx
            ├── Transactions.tsx
            └── Settings.tsx
```

---

## Database Schema

### Enums

```prisma
enum TransactionType   { SEND  RECEIVE  ADD }
enum TransactionStatus { PENDING  SUCCESS  FAILED }
enum EntryType         { DEBIT  CREDIT }
enum WalletStatus      { ACTIVE  FROZEN }
```

### Models

```
User
├── id, fullName, username (unique), email (unique)
├── passwordHash, isVerified, role
└── wallet → Wallet (1:1)

Wallet
├── id, userId (unique)
├── balance, dailyLimit, status (WalletStatus)
├── sentTx    → Transaction[] (as sender)
└── receivedTx → Transaction[] (as receiver)

Transaction
├── id, senderWalletId, receiverWalletId
├── amount, type (TransactionType), status (TransactionStatus)
├── note, createdAt
└── ledgerEntries → LedgerEntry[]

LedgerEntry
├── id, transactionId, walletId
├── entryType (EntryType), amount
└── createdAt
```

---

## API Reference

### Auth

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/signup` | No | Register, send OTP |
| POST | `/api/auth/verify-otp` | No | Verify OTP, create wallet, issue tokens |
| POST | `/api/auth/login` | No | Login, issue tokens |
| POST | `/api/auth/refresh-token` | Cookie | Get new access token |
| POST | `/api/auth/logout` | No | Clear refresh token cookie |
| GET | `/api/auth/check-email` | No | Check email availability |
| GET | `/api/auth/check-username` | No | Check username availability |

### Users

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/users/profile` | Yes | Get profile + wallet info |
| PATCH | `/api/users/profile` | Yes | Update name or username |
| PATCH | `/api/users/password` | Yes | Change password |
| PATCH | `/api/users/daily-limit` | Yes | Update daily transfer limit |

### Wallet

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/wallet` | Yes | Get balance, daily limit, today spent |

### Transactions

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/transactions/check-recipient` | Yes | Validate recipient username |
| POST | `/api/transactions/send` | Yes | Send money (atomic) |
| GET | `/api/transactions` | Yes | Get history with filters + pagination |

### Payment

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/payment/create-intent` | Yes | Create Stripe PaymentIntent |
| POST | `/api/payment/webhook` | Stripe | Handle successful payment, credit wallet |
| GET | `/api/payment/status/:id` | Yes | Poll payment status |

### Chatbot

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/chatbot/message` | Yes | Send message, get Gemini response |

---

## Environment Variables

### Backend `.env`

```env
# Database
DATABASE_URL=postgresql://user:password@ep-xxx.neon.tech/payyou?sslmode=require

# JWT
ACCESS_TOKEN_SECRET=your_long_random_access_secret
REFRESH_TOKEN_SECRET=your_long_random_refresh_secret

# Email (Gmail App Password)
MAIL_USER=your@gmail.com
MAIL_PASS=your_gmail_app_password

# Upstash Redis
UPSTASH_REDIS_REST_URL=https://your-upstash-url
UPSTASH_REDIS_REST_TOKEN=your_upstash_token

# Stripe
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# Gemini
GEMINI_API_KEY=your_gemini_api_key

# App
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:5173
```

### Frontend `.env`

```env
VITE_API_URL=http://localhost:5000/api
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
```

> **Never commit `.env` files.** Add them to `.gitignore`.

---

## Local Development Setup

### Prerequisites

- Node.js 20+
- npm
- Docker (optional, for local backend containerization)
- A [Neon](https://neon.tech) PostgreSQL database
- An [Upstash](https://upstash.com) Redis database
- A [Stripe](https://stripe.com) account (test mode)
- A [Google AI Studio](https://aistudio.google.com) API key
- A Gmail account with [App Password](https://myaccount.google.com/apppasswords) enabled

---

### 1. Clone the repository

```bash
git clone https://github.com/sushilkrg/payyou.git
cd payyou
```

---

### 2. Backend setup

```bash
cd backend
npm install
```

Create `.env` file and fill in all variables (see [Environment Variables](#environment-variables) above).

Run Prisma migrations to create all tables:

```bash
npx prisma migrate dev --name init
npx prisma generate
```

Start the development server:

```bash
npm run dev
```

Backend runs at: `http://localhost:5000`

---

### 3. Frontend setup

```bash
cd frontend
npm install
```

Create `.env` file:

```env
VITE_API_URL=http://localhost:5000/api
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
```

Start the development server:

```bash
npm run dev
```

Frontend runs at: `http://localhost:5173`

---

### 4. Stripe webhook (local testing)

Install the Stripe CLI:

```bash
# macOS
brew install stripe/stripe-cli/stripe

# Windows — download from https://stripe.com/docs/stripe-cli
```

Login and forward webhooks to your local server:

```bash
stripe login
stripe listen --forward-to localhost:5000/api/payment/webhook
```

The CLI prints a webhook signing secret — copy it to `.env` as `STRIPE_WEBHOOK_SECRET`.

To test a payment:

```bash
stripe trigger payment_intent.succeeded
```

#### Stripe test cards

| Card Number | Result |
|---|---|
| `4242 4242 4242 4242` | Payment succeeds |
| `4000 0000 0000 0002` | Card declined |
| `4000 0025 0000 3155` | Requires 3D Secure |

Use any future expiry, any 3-digit CVV, any postal code.

---

## Docker Deployment (Backend)

### Build the image

```bash
cd backend
docker build -t backend .
```

### Run the container

```bash
# Use Node LTS
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Copy prisma schema before npm install
# so postinstall can run prisma generate
COPY prisma ./prisma/

# Install all dependencies
RUN npm install

# Generate Prisma client
RUN npx prisma generate

# Copy remaining source code
COPY . .

# Build TypeScript
RUN npm run build

# Expose port
EXPOSE 5000

# Start app
CMD ["npm", "run", "start"]
```

### Run migrations before first start

```bash
# From your local machine against the production DB
DATABASE_URL=your_neon_url npx prisma migrate deploy
```

### Useful Docker commands

```bash
# View logs
docker logs -f backend

# Check running containers
docker ps

# Stop container
docker stop backend

# Remove container
docker rm backend

# Rebuild after code changes
docker build -t backend . && docker stop backend && docker rm backend
docker run -d --name backend ... backend
```

---

## Vercel Deployment (Frontend)

### 1. Add vercel.json to frontend root

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

This is required for React Router — without it, refreshing any route returns a 404.

### 2. Push to GitHub

```bash
git init
git add .
git commit -m "initial commit"
git remote add origin https://github.com/sushilkrg/payyou.git
git push -u origin master
```

### 3. Import to Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click **Import Git Repository**
3. Select `payyou`
4. In Directory - put `frontend`
5. Vercel auto-detects Vite — no build config changes needed

### 4. Add environment variables in Vercel Dashboard

Go to: **Project → Settings → Environment Variables**

| Key | Value |
|---|---|
| `VITE_API_URL` | `https://your-backend-domain.com/api` |
| `VITE_STRIPE_PUBLISHABLE_KEY` | `pk_live_xxx` |

### 5. Update backend CORS

Set `CLIENT_URL` in your Docker run command to your Vercel URL:

```
CLIENT_URL=https://payyou.vercel.app
```

### 6. Update Stripe webhook URL

Go to Stripe Dashboard → Developers → Webhooks → Update endpoint URL to:

```
https://your-backend-domain.com/api/webhook/stripe
```

---

## Security Highlights

| Area | Implementation |
|---|---|
| Passwords | Hashed with bcrypt (salt rounds: 12) |
| Access token | Short-lived JWT (15 min), stored in Redux memory only |
| Refresh token | Long-lived JWT (7 days), stored in `httpOnly` cookie — not readable by JS |
| OTP | 6-digit numeric, stored in Redis with 5-min TTL, deleted after use |
| OTP abuse | Rate limited to 3 requests per 15 minutes per email |
| Card data | Never touches our server — Stripe.js handles collection directly |
| Stripe webhooks | Signature verified with `stripe.webhooks.constructEvent()` |
| Duplicate webhooks | Redis deduplication key with 24-hour TTL |
| Duplicate PaymentIntents | Redis idempotency key scoped to userId + amount + minute |
| Self-transfer | Blocked at service layer before any DB operations |
| Wallet frozen | Checked before every send, add, and limit update |
| Atomic transfers | Prisma `$transaction` — balance debit + credit + ledger entries all succeed or all roll back |
| Chatbot scope | System prompt strictly limits Gemini to PayYou feature guidance only |
| Chatbot abuse | Rate limited to 10 messages per user per minute via Redis |
| Docker security | Non-root user inside container, `.env` never copied into image |
| Input validation | Zod schemas on every API endpoint via `validate` middleware |

---
Thank you 💖