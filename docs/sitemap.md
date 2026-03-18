# Sitemap — ThueDo Marketplace

**Version:** 1.0 | **Date:** 2026-03-18 | **Status:** Active

---

## 1. Route Tree

```
/                               ← Homepage (public)
├── /browse                     ← Browse marketplace (public)
│   └── /listing/:id            ← Listing detail (public)
│       └── /listing/:id/book   ← Booking form (protected, verified only)
│
├── /login                      ← Auth: Login / Register tabs (guest only)
├── /forgot-password            ← Auth: Forgot password (guest only)
├── /reset-password             ← Auth: Reset password via token (guest only)
│
├── /dashboard                  ← User dashboard (protected)
│   ├── /dashboard/bookings     ← My bookings (as renter)
│   │   └── /dashboard/bookings/:id   ← Booking detail (renter view)
│   ├── /dashboard/rentals      ← My rentals (as owner)
│   │   └── /dashboard/rentals/:id    ← Booking detail (owner view)
│   ├── /dashboard/listings     ← My listings management
│   │   ├── /dashboard/listings/new   ← Create listing
│   │   └── /dashboard/listings/:id/edit ← Edit listing
│   ├── /dashboard/messages     ← All conversations
│   │   └── /dashboard/messages/:bookingId ← Chat room
│   ├── /dashboard/reviews      ← My reviews (given/received)
│   ├── /dashboard/disputes     ← My disputes
│   └── /dashboard/profile      ← Profile settings
│       └── /dashboard/profile/kyc ← KYC verification flow
│
├── /notifications              ← Notification center (protected)
│
├── /how-it-works               ← Static info page (public)
├── /policy                     ← Terms & Privacy (public)
│
└── /admin                      ← Admin area (admin role only)
    ├── /admin/users            ← User management
    │   └── /admin/users/:id    ← User detail & actions
    ├── /admin/listings         ← Listing moderation queue
    │   └── /admin/listings/:id ← Listing review & actions
    ├── /admin/bookings         ← Booking overview
    ├── /admin/disputes         ← Dispute queue
    │   └── /admin/disputes/:id ← Dispute detail & resolution
    ├── /admin/reports          ← Listing reports queue
    └── /admin/kyc              ← KYC review queue
        └── /admin/kyc/:userId  ← KYC submission detail
```

---

## 2. Page Catalog

### 2.1 Public Pages

| Route | File | Auth | Status | Description |
|-------|------|------|--------|-------------|
| `/` | `index.tsx` | Guest/User | Active | Hero, category grid, featured listings, how it works |
| `/browse` | `browse.tsx` | Guest/User | Active | Search + filters sidebar, listing grid, pagination |
| `/listing/:id` | `listing.$id.tsx` | Guest/User | Stub → Build | Gallery, owner profile, availability calendar, reviews, booking CTA |
| `/how-it-works` | `how-it-works.tsx` | Guest/User | Stub → Build | FAQ, step-by-step flow explanation |
| `/policy` | `policy.tsx` | Guest/User | Stub → Build | Terms of Service, Privacy Policy |

### 2.2 Auth Pages (Guest Only — redirect if logged in)

| Route | File | Auth | Status | Description |
|-------|------|------|--------|-------------|
| `/login` | `login.tsx` | Guest | Active | Login tab + Register tab, Google OAuth |
| `/forgot-password` | `forgot-password.tsx` | Guest | Active | Email input → send reset link |
| `/reset-password` | `reset-password.tsx` | Guest | Active | New password form (token in URL) |

### 2.3 Dashboard Pages (Protected — requires login)

| Route | Auth | Status | Description |
|-------|------|--------|-------------|
| `/dashboard` | User | Build | Overview: stats, pending actions, recent activity |
| `/dashboard/bookings` | User | Build | Bookings as renter: list with status filter |
| `/dashboard/bookings/:id` | User | Build | Booking detail: timeline, chat shortcut, actions |
| `/dashboard/rentals` | User | Build | Bookings as owner: list with status filter, approve/decline queue |
| `/dashboard/rentals/:id` | User | Build | Rental detail: renter info, timeline, handover/return actions |
| `/dashboard/listings` | User | Build | My listings grid: status badges, quick actions |
| `/dashboard/listings/new` | User (Verified) | Build | Multi-step listing creation form |
| `/dashboard/listings/:id/edit` | User | Build | Edit listing form, availability calendar |
| `/dashboard/messages` | User | Build | Conversation list sorted by last message |
| `/dashboard/messages/:bookingId` | User | Build | Chat room: messages, booking info panel, image upload |
| `/dashboard/reviews` | User | Build | Pending reviews (72h window), given, received |
| `/dashboard/disputes` | User | Build | Open/resolved disputes list |
| `/dashboard/profile` | User | Build | Edit display name, bio, avatar |
| `/dashboard/profile/kyc` | User | Build | KYC upload flow: CCCD front/back + selfie, status tracking |
| `/notifications` | User | Build | Notification feed, mark read |

### 2.4 Booking Flow (Inline / Modal)

| Step | Location | Auth | Description |
|------|----------|------|-------------|
| 1. Select dates | `/listing/:id` | Verified | Calendar picker, availability check |
| 2. Review & confirm | `/listing/:id` (inline form) | Verified | Total calc, deposit, intro message |
| 3. Booking sent | `/listing/:id` → redirect | Verified | Confirmation toast → redirect to `/dashboard/bookings/:id` |

### 2.5 Admin Pages (Admin Role Only)

| Route | Status | Description |
|-------|--------|-------------|
| `/admin` | Build | Dashboard: stats, pending queues |
| `/admin/users` | Build | User list with filters, search, quick actions |
| `/admin/users/:id` | Build | User profile, transaction history, warn/suspend/ban |
| `/admin/listings` | Build | Moderation queue (PENDING_REVIEW + reported) |
| `/admin/listings/:id` | Build | Listing review, approve/suspend, content check |
| `/admin/disputes` | Build | Dispute queue sorted by deadline |
| `/admin/disputes/:id` | Build | Full dispute: chat history, evidence, resolution form |
| `/admin/kyc` | Build | KYC queue sorted by submission date |
| `/admin/kyc/:userId` | Build | KYC submission: images, info, approve/reject |
| `/admin/reports` | Build | Listing reports by count, review + dismiss/action |

---

## 3. Navigation Structure

### 3.1 Header Nav (All Users)

```
Logo → /
[Browse] → /browse
[How It Works] → /how-it-works

If guest:
  [Login / Register] → /login

If logged in:
  [Notifications icon] + badge → /notifications
  [Avatar dropdown]:
    - My Dashboard → /dashboard
    - My Listings → /dashboard/listings
    - Messages → /dashboard/messages
    - Profile → /dashboard/profile
    - [Admin Panel] → /admin  (admin only)
    - Logout
```

### 3.2 Dashboard Sidebar Nav

```
Overview → /dashboard
─── As Renter ───
My Bookings → /dashboard/bookings
─── As Owner ───
Rental Requests → /dashboard/rentals
My Listings → /dashboard/listings
─── Common ───
Messages → /dashboard/messages
Reviews → /dashboard/reviews
Disputes → /dashboard/disputes
─── Account ───
Profile → /dashboard/profile
Verify Identity (KYC) → /dashboard/profile/kyc  (if not verified)
```

### 3.3 Admin Sidebar Nav

```
Dashboard → /admin
─── Moderation ───
KYC Queue → /admin/kyc
Listing Queue → /admin/listings
Reports → /admin/reports
─── Disputes ───
Active Disputes → /admin/disputes
─── Users ───
All Users → /admin/users
─── Overview ───
All Bookings → /admin/bookings
```

---

## 4. User Journey Maps

### 4.1 Owner Journey

```
Register → /login (register tab)
  ↓
Email verification (link in email)
  ↓
KYC Upload → /dashboard/profile/kyc
  ↓  (async approval, 30s - 10min)
Status: VERIFIED
  ↓
Create Listing → /dashboard/listings/new
  ↓  (PENDING_REVIEW → auto ACTIVE in 2-4h)
Receive notification: booking request
  ↓
Review Request → /dashboard/rentals/:id
  ↓  (Approve / Decline within 24h)
Approve → Chat with renter → /dashboard/messages/:bookingId
  ↓
Confirm Handover → /dashboard/rentals/:id (confirm handed over)
  ↓
Booking ACTIVE
  ↓
Renter returns item → Confirm Return → /dashboard/rentals/:id
  ↓  (Good condition → COMPLETED | Damaged → open dispute)
Leave Review → /dashboard/reviews
  ↓
Repeat
```

### 4.2 Renter Journey

```
Register → /login (register tab)
  ↓
Email verification
  ↓
KYC Upload → /dashboard/profile/kyc
  ↓  (VERIFIED)
Browse → /browse (search + filter)
  ↓
View Listing → /listing/:id
  ↓  (check calendar, read reviews)
Send Booking Request → dates + message → /listing/:id
  ↓  (wait ≤ 24h for owner response)
Booking CONFIRMED → notification received
  ↓
Chat with owner → /dashboard/messages/:bookingId
  ↓
Meet & Receive item → Confirm Received → /dashboard/bookings/:id
  ↓
Use item within rental period
  ↓
Return item → owner confirms
  ↓  (COMPLETED)
Leave Review → /dashboard/reviews (72h window)
  ↓
Repeat
```

### 4.3 Admin Dispute Flow

```
Dispute opened by user → notification to admin
  ↓
Admin: /admin/disputes → pick dispute
  ↓
/admin/disputes/:id — view:
  - Full chat history
  - Both sides' evidence
  - Booking timeline
  - User reputation
  ↓
Mediation phase (48h) — allow self-resolution
  ↓
Admin decision:
  OWNER_WIN / RENTER_WIN / PARTIAL / INCONCLUSIVE
  ↓
Both parties notified → dispute RESOLVED
  ↓
Account flags updated if needed
```

---

## 5. Page Component Patterns

| Pattern | Used On |
|---------|---------|
| Listing Card | Browse, Homepage, My Listings |
| Booking Status Badge | Booking lists, Rental lists |
| Availability Calendar | Listing detail, Listing edit |
| Review Stars + Tags | Listing detail, User profile, Review form |
| Chat Bubble | Messages room |
| KYC Status Banner | Dashboard header (if unverified) |
| Notification Dot | Header nav icon |
| Infinite Scroll / Pagination | Browse, Conversations, Reviews |
| Toast Notifications | Booking actions, Message send, Form submit |
| Countdown Timer | Active booking (time until return) |
