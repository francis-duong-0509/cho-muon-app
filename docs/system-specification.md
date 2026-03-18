# System Specification — ThueDo Marketplace

**Version:** 1.0 | **Date:** 2026-03-18 | **Status:** Active

---

## 1. Architecture Overview

### 1.1 Stack

| Layer | Technology | Notes |
|-------|-----------|-------|
| Monorepo | Turborepo + Bun | Workspaces: `apps/*`, `packages/*` |
| Backend | Elysia (Bun) on port 3000 | Lightweight, type-safe HTTP |
| API Layer | oRPC + Zod | Type-safe RPC, OpenAPI compatible |
| Auth | better-auth | Email/password, email verification, role-based |
| Database | PostgreSQL 17 + Drizzle ORM | Schema-first migrations |
| Frontend | React 19 + TanStack Router | SSR-ready, file-based routing |
| UI | shadcn/ui + Tailwind CSS v4 | Radix primitives |
| State | TanStack Query | Server state + caching |
| Realtime | WebSocket / Supabase Realtime | Chat, booking status updates |
| Email | Nodemailer (Mailtrap dev / SMTP prod) | Verification, notifications |
| Push Notif | Firebase Cloud Messaging (FCM) | Mobile push |
| Storage | S3-compatible (private + public buckets) | Images, KYC docs |

### 1.2 Monorepo Structure

```
cho-muon-app/
├── apps/
│   ├── server/          # Elysia API — port 3000
│   └── web/             # TanStack Router SSR — port 5173
├── packages/
│   ├── api/             # oRPC routers (@chomuon/api)
│   ├── auth/            # better-auth config (@chomuon/auth)
│   ├── db/              # Drizzle schema + migrations (@chomuon/db)
│   ├── env/             # Zod-validated env vars (@chomuon/env)
│   ├── ui/              # shadcn/ui components (@chomuon/ui)
│   └── config/          # Shared TypeScript config
├── docs/
└── plans/
```

### 1.3 Request Flow

```
Browser → TanStack Router (SSR)
       → oRPC Client (/rpc) → Elysia Server → oRPC Router
                                             → Drizzle ORM → PostgreSQL
       → Auth Client (/api/auth/*) → better-auth handler
```

---

## 2. Data Models

> Full schema details in `DATA_MODEL_ThueDo.md`. Summary below.

### 2.1 Entity Relationship

```
users
 ├──< listings           (1:N owner)
 ├──< bookings           (1:N renter)
 ├──< reviews            (1:N reviewer / reviewee)
 ├──< disputes           (1:N opener / respondent)
 ├──< messages           (1:N sender)
 └──< notifications      (1:N recipient)

listings
 ├──< listing_images     (1:N, max 8)
 ├──< listing_blocked_dates (1:N)
 └──< bookings           (1:N)

bookings
 ├── conversations       (1:1)
 ├──< reviews            (1:N, max 2)
 └── disputes            (1:1 active max)

disputes
 └──< dispute_evidences  (1:N, max 10 files)
```

### 2.2 Core Tables Summary

| Table | Key Fields | Status Machine |
|-------|-----------|---------------|
| `users` | status, role, trust_score, trust_level | UNVERIFIED → VERIFIED → WARNED → SUSPENDED → BANNED |
| `user_kyc` | kyc_status, cccd_number_hash | PENDING → APPROVED / REJECTED / RESUBMIT |
| `listings` | status, category, price_per_day, deposit_amount | PENDING_REVIEW → ACTIVE → PAUSED / SUSPENDED / DELETED |
| `bookings` | status, start_date, end_date, price snapshots | PENDING → CONFIRMED → ACTIVE → COMPLETED / CANCELLED / OVERDUE |
| `conversations` | booking_id (1:1), is_locked | Created on CONFIRMED, locked on COMPLETED/CANCELLED |
| `reviews` | rating, is_visible (blind), reviewer_role | Visible after both submit or 72h |
| `disputes` | dispute_type, status, resolution | OPEN → UNDER_REVIEW → RESOLVED / CLOSED |
| `notifications` | type, channel, is_read, sent_at | Append-only |
| `audit_logs` | action, entity_type, entity_id | Append-only, immutable |

### 2.3 Business Rule Constraints

```sql
-- Listings
price_per_day >= 10000 AND price_per_day % 1000 = 0
deposit_amount >= price_per_day * 3
price_per_day <= estimated_value * 0.30  -- max 30% value/day

-- Bookings
owner_id != renter_id
end_date >= start_date
total_rental_amount = price_per_day_snapshot * total_days

-- Reviews
rating BETWEEN 1 AND 5
comment required if rating <= 2 (min 50 chars)

-- Trust Score
trust_score BETWEEN 0 AND 100
```

---

## 3. API Contracts (oRPC Procedures)

### 3.1 Procedure Types

| Type | Auth Required | Role |
|------|--------------|------|
| `publicProcedure` | No | — |
| `protectedProcedure` | Yes | Any verified user |
| `adminProcedure` | Yes | role = ADMIN |

### 3.2 Auth Router (`/api/auth/*`)

Handled by better-auth, not oRPC.

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/sign-up/email` | POST | Register with email + password + phone |
| `/api/auth/sign-in/email` | POST | Login |
| `/api/auth/sign-out` | POST | Logout |
| `/api/auth/verify-email` | GET | Email verification callback |
| `/api/auth/forget-password` | POST | Request password reset |
| `/api/auth/reset-password` | POST | Reset with token |
| `/api/auth/get-session` | GET | Current session |

### 3.3 Listings Router

| Procedure | Type | Input | Output |
|-----------|------|-------|--------|
| `listings.list` | public | `{ category?, district?, province?, priceMin?, priceMax?, startDate?, endDate?, sortBy?, page, limit }` | `{ items: Listing[], total, page }` |
| `listings.getById` | public | `{ id: uuid }` | `Listing & { owner: UserPublic, images: string[], blockedDates: date[], reviews: Review[] }` |
| `listings.create` | protected | `ListingCreateInput` | `Listing` |
| `listings.update` | protected | `{ id } & Partial<ListingCreateInput>` | `Listing` |
| `listings.pause` | protected | `{ id }` | `Listing` |
| `listings.activate` | protected | `{ id }` | `Listing` |
| `listings.delete` | protected | `{ id }` | `void` |
| `listings.myListings` | protected | `{ status?, page, limit }` | `{ items: Listing[], total }` |
| `listings.blockDates` | protected | `{ id, dates: date[] }` | `void` |
| `listings.unblockDates` | protected | `{ id, dates: date[] }` | `void` |
| `listings.checkAvailability` | public | `{ id, startDate, endDate }` | `{ available: boolean, conflictDates?: date[] }` |

### 3.4 Bookings Router

| Procedure | Type | Input | Output |
|-----------|------|-------|--------|
| `bookings.create` | protected | `{ listingId, startDate, endDate, renterMessage }` | `Booking` |
| `bookings.approve` | protected | `{ id }` | `Booking` |
| `bookings.decline` | protected | `{ id, reason? }` | `Booking` |
| `bookings.cancel` | protected | `{ id, reason? }` | `Booking` |
| `bookings.confirmHandover` | protected | `{ id }` | `Booking` |
| `bookings.confirmReceived` | protected | `{ id }` | `Booking` |
| `bookings.confirmReturn` | protected | `{ id, condition: 'GOOD'\|'DAMAGED'\|'LOST', notes?, images? }` | `Booking` |
| `bookings.myBookings` | protected | `{ role: 'owner'\|'renter', status?, page, limit }` | `{ items: Booking[], total }` |
| `bookings.getById` | protected | `{ id }` | `Booking & { listing, owner, renter }` |

### 3.5 KYC Router

| Procedure | Type | Input | Output |
|-----------|------|-------|--------|
| `kyc.submit` | protected | `{ cccdFrontUrl, cccdBackUrl, selfieUrl }` | `{ status: kyc_status }` |
| `kyc.getStatus` | protected | `{}` | `{ status, rejectionReason? }` |
| `kyc.adminList` | admin | `{ status?, page }` | `{ items: KYCRequest[] }` |
| `kyc.adminApprove` | admin | `{ userId }` | `void` |
| `kyc.adminReject` | admin | `{ userId, reason }` | `void` |

### 3.6 Reviews Router

| Procedure | Type | Input | Output |
|-----------|------|-------|--------|
| `reviews.create` | protected | `{ bookingId, rating, comment?, tags? }` | `Review` |
| `reviews.forListing` | public | `{ listingId, page, limit }` | `{ items: Review[], total, avg }` |
| `reviews.forUser` | public | `{ userId, role?, page, limit }` | `{ items: Review[], total, avg }` |

### 3.7 Messaging Router

| Procedure | Type | Input | Output |
|-----------|------|-------|--------|
| `messages.getConversation` | protected | `{ bookingId }` | `{ conversation: Conversation, messages: Message[] }` |
| `messages.send` | protected | `{ conversationId, content?, imageUrls? }` | `Message` |
| `messages.markRead` | protected | `{ conversationId }` | `void` |
| `messages.myConversations` | protected | `{ page, limit }` | `{ items: ConversationPreview[] }` |

### 3.8 Disputes Router

| Procedure | Type | Input | Output |
|-----------|------|-------|--------|
| `disputes.open` | protected | `{ bookingId, type, description, requestedResolution, evidenceUrls? }` | `Dispute` |
| `disputes.respond` | protected | `{ id, response, evidenceUrls? }` | `Dispute` |
| `disputes.getById` | protected | `{ id }` | `Dispute & { evidences }` |
| `disputes.adminList` | admin | `{ status?, page }` | `{ items: Dispute[] }` |
| `disputes.adminResolve` | admin | `{ id, resolution, notes, compensationAmount? }` | `Dispute` |

### 3.9 Notifications Router

| Procedure | Type | Input | Output |
|-----------|------|-------|--------|
| `notifications.list` | protected | `{ page, limit }` | `{ items: Notification[], unreadCount }` |
| `notifications.markRead` | protected | `{ ids: uuid[] }` | `void` |
| `notifications.updateFcmToken` | protected | `{ token }` | `void` |

### 3.10 Users Router

| Procedure | Type | Input | Output |
|-----------|------|-------|--------|
| `users.me` | protected | `{}` | `UserProfile` |
| `users.updateProfile` | protected | `{ displayName?, bio?, avatarUrl? }` | `UserProfile` |
| `users.getPublicProfile` | public | `{ id }` | `UserPublic` |

### 3.11 Admin Router

| Procedure | Type | Input | Output |
|-----------|------|-------|--------|
| `admin.users.list` | admin | `{ status?, page }` | `{ items: User[] }` |
| `admin.users.warn` | admin | `{ userId, reason }` | `void` |
| `admin.users.suspend` | admin | `{ userId, days, reason }` | `void` |
| `admin.users.ban` | admin | `{ userId, reason }` | `void` |
| `admin.listings.list` | admin | `{ status?, page }` | `{ items: Listing[] }` |
| `admin.listings.approve` | admin | `{ id }` | `void` |
| `admin.listings.suspend` | admin | `{ id, reason }` | `void` |
| `admin.reports.list` | admin | `{ status?, page }` | `{ items: ListingReport[] }` |
| `admin.reports.review` | admin | `{ id, action: 'DISMISS'\|'SUSPEND_LISTING' }` | `void` |

---

## 4. Scheduled Jobs

| Job | Frequency | Action |
|-----|-----------|--------|
| `expire_pending_bookings` | Every 5 min | PENDING → EXPIRED if > 24h |
| `mark_overdue_bookings` | Every hour | ACTIVE → OVERDUE if past end_date |
| `auto_complete_bookings` | Every hour | ACTIVE → COMPLETED if owner no confirm after 48h |
| `reveal_blind_reviews` | Every hour | Set `is_visible = true` if > 72h since COMPLETED |
| `send_reminder_notifications` | Every hour | Pickup/return reminders 1 day before |
| `recalculate_trust_scores` | Daily | Recalculate trust_score for all users |
| `auto_pause_unresponsive_listings` | Daily | PAUSED if owner missed 3 consecutive bookings in 7d |

---

## 5. Non-Functional Requirements

### 5.1 Performance

| Metric | Target |
|--------|--------|
| API p95 response time | < 300ms |
| Listing search query | < 200ms (with GIN full-text index) |
| Image upload | < 5s for 10MB file |
| Realtime message delivery | < 500ms |
| Concurrent users (MVP) | 500 simultaneous |
| DB connection pool | Min 5, Max 50 |

### 5.2 Security

| Requirement | Implementation |
|-------------|---------------|
| Auth sessions | httpOnly secure cookies, 7-day expiry |
| Password hashing | bcrypt (rounds ≥ 12) |
| KYC images | Private storage bucket, signed URLs (15min TTL) |
| CCCD number | Stored as SHA-256 hash only, never plaintext |
| Personal data | Encrypted at rest (AES-256) for address, KYC fields |
| API rate limiting | 100 req/min per IP (public), 300/min (authenticated) |
| CORS | Whitelist only — `CORS_ORIGIN` env var |
| Chat content | Auto-detect phone numbers, external links, payment info |
| Admin access | Separate `adminProcedure` middleware, role check on every request |
| SQL injection | Drizzle ORM parameterized queries only |
| File upload | Type whitelist (JPEG, PNG, WEBP for images), max size enforcement |
| Fraud detection | Rules-based flags for suspicious patterns (see PRD §8.3) |

### 5.3 Scalability

- Stateless API server — horizontal scale via multiple instances
- DB read replicas for listing search (future)
- CDN for public images (listing photos)
- Redis for session cache and rate limiting (Phase 2)
- Message queue for notifications (Bull/BullMQ, Phase 2)

### 5.4 Availability & Reliability

| Requirement | Target |
|-------------|--------|
| Uptime | 99.5% (MVP), 99.9% (Phase 2) |
| Booking state transitions | Idempotent — safe to retry |
| Data integrity | All booking transitions in DB transactions |
| Backup | Daily PostgreSQL snapshots, 30-day retention |
| Error logging | Structured JSON logs, Sentry integration |

### 5.5 Compliance

- User data stored in Vietnam (or Vietnam-compliant data centers)
- CCCD data: access-controlled, encrypted, deletion-capable
- Chat logs retained for dispute resolution (min 6 months after booking)
- Audit logs: append-only, immutable, min 1 year retention
- Terms of Service must inform users that admin can read chats during disputes

---

## 6. Environment Variables

### Server (`packages/env/src/server.ts`)

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | ✓ | PostgreSQL connection string |
| `BETTER_AUTH_SECRET` | ✓ | Auth signing secret (min 32 chars) |
| `BETTER_AUTH_URL` | ✓ | Base URL for auth callbacks |
| `CORS_ORIGIN` | ✓ | Allowed CORS origins |
| `MAILTRAP_HOST` | ✓ | SMTP host (dev) |
| `MAILTRAP_PORT` | ✓ | SMTP port |
| `MAILTRAP_USER` | ✓ | SMTP username |
| `MAILTRAP_PASS` | ✓ | SMTP password |
| `STORAGE_BUCKET_PUBLIC` | Phase 1 | Public image bucket name |
| `STORAGE_BUCKET_PRIVATE` | Phase 1 | Private KYC bucket name |
| `FCM_SERVER_KEY` | Phase 1 | Firebase Cloud Messaging key |
| `KYC_PROVIDER_API_KEY` | Phase 1 | FPT.AI or VNPay eKYC API key |

### Web (`packages/env/src/web.ts`)

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_SERVER_URL` | ✓ | Backend API base URL |

---

## 7. File Upload Specification

| Type | Bucket | Max Size | Allowed Types | Access |
|------|--------|----------|---------------|--------|
| Listing images | public | 10 MB | JPEG, PNG, WEBP | Public URL |
| CCCD front/back | private | 10 MB | JPEG, PNG | Signed URL, 15min TTL |
| Selfie | private | 10 MB | JPEG, PNG | Signed URL, 15min TTL |
| Chat images | public | 10 MB | JPEG, PNG, WEBP | Public URL |
| Dispute evidence | private | 20 MB | JPEG, PNG, WEBP, MP4 | Signed URL, 1h TTL |

---

## 8. Realtime Requirements

| Feature | Protocol | Channel Pattern |
|---------|----------|----------------|
| Chat messages | WebSocket | `conversation:{id}` |
| Booking status | WebSocket | `booking:{id}` |
| Notification badge | WebSocket | `user:{id}:notifications` |
