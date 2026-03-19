# Development Roadmap — ThueDo Marketplace

**Version:** 1.0 | **Date:** 2026-03-18 | **Status:** Active

---

## 1. Current State (as of 2026-03-18)

**Completed:**
- [x] Monorepo setup (Turborepo + Bun + TypeScript)
- [x] PostgreSQL + Drizzle ORM (auth schema only)
- [x] Auth: email/password, email verification, password reset (better-auth)
- [x] Frontend: TanStack Router + shadcn/ui + Tailwind v4
- [x] Pages: Homepage (mock data), Browse (mock data), Login/Register, Forgot/Reset password
- [x] oRPC server setup with publicProcedure / protectedProcedure / adminProcedure
- [x] Docker Compose: MinIO (S3-compatible object storage) — API `localhost:19000`, Console `localhost:19001`
- [x] S3 environment variables declared in `packages/env/src/server.ts`

**In Progress / Stub:**
- [ ] Listing detail page (route exists, no real data)
- [ ] Admin dashboard (route exists, empty)
- [ ] How-it-works, Policy pages (stubs)

---

## 2. MoSCoW Priority Matrix

### Must Have (MVP — Phase 1)

| # | Feature | Effort |
|---|---------|--------|
| M1 | DB schema: all core tables (listings, bookings, reviews, etc.) | M |
| M2 | KYC verification upload + admin approve flow | L |
| M3 | Listing CRUD (create, edit, pause, delete) | M |
| M4 | Listing search + filter (full-text, category, district, price, date) | M |
| M5 | Listing detail page (gallery, calendar, reviews, booking CTA) | M |
| M6 | Booking flow: request → approve/decline → handover → return → complete | L |
| M7 | In-app chat (real-time) between confirmed booking parties | L |
| M8 | Review system (blind, 72h window, tags) | M |
| M9 | Notification system (push + email) for all booking events | M |
| M10 | Admin: listing moderation queue (approve, suspend) | S |
| M11 | Admin: dispute management (view, resolve) | M |
| M12 | User dashboard (bookings as renter, rentals as owner) | M |
| M13 | Availability calendar (block/unblock dates, view conflicts) | M |

### Should Have (Phase 1 — nice to ship in MVP)

| # | Feature | Effort |
|---|---------|--------|
| S1 | Dispute opening flow (with evidence upload) | M |
| S2 | Trust score display on user profiles | S |
| S3 | Admin: user management (warn, suspend, ban) | S |
| S4 | Listing report flow (3+ reports → auto PENDING_REVIEW) | S |
| S5 | Content auto-moderation (chat: phone/link detection) | S |
| S6 | Scheduled jobs (expire pending, overdue, blind review reveal) | M |
| S7 | OTP / phone-based login | M |

### Could Have (Phase 2)

| # | Feature | Effort |
|---|---------|--------|
| C1 | Payment escrow (PayOS/VNPay) — deposit held in platform | XL |
| C2 | Cancellation penalty enforcement (25%/50% rules) | M |
| C3 | Commission fee collection (15% platform fee) | L |
| C4 | Premium listing boost (29k/59k/99k packages) | M |
| C5 | Fraud detection rules (flagging suspicious accounts) | M |
| C6 | Redis session cache + rate limiting | M |
| C7 | Message queue for notifications (BullMQ) | M |
| C8 | Google Vision API for image moderation | M |
| C9 | Recurring unavailability (e.g. every Sunday blocked) | S |

### Won't Have Now (Phase 3+)

| # | Feature |
|---|---------|
| W1 | Mobile app (iOS/Android native) |
| W2 | Delivery / shipping integration |
| W3 | Insurance per rental (Bảo Việt / PVI) |
| W4 | Auto bank transfer integration |
| W5 | Multi-city expansion beyond HCM + HN |

---

## 3. Phase Breakdown

### Phase 0 — Foundation ✅ (Complete)
**Duration:** 2 weeks | **Target:** 2026-03-14

- Monorepo, dev tooling, CI/CD skeleton
- Auth (email/password, verification, password reset)
- Homepage + Browse wireframe (mock data)
- Basic route structure

---

### Phase 1A — Core Data Layer ✅ (Complete)
**Duration:** 1 week | **Completed:** 2026-03-19

**Goal:** Real database schema for all marketplace entities.

| Task | Table(s) | Status |
|------|---------|--------|
| Drizzle schema: users extended (trust_score, etc.) | `user_profile` | ✅ |
| Drizzle schema: user_kyc, user_otp | `user_kyc`, `user_otp` | ✅ |
| Drizzle schema: listings + images + blocked_dates | `listings`, `listing_images`, `listing_blocked_dates` | ✅ |
| Drizzle schema: bookings | `bookings` | ✅ |
| Drizzle schema: conversations + messages + read_receipts | `conversations`, `messages`, `conversation_read_receipts` | ✅ |
| Drizzle schema: reviews | `reviews` | ✅ |
| Drizzle schema: disputes + dispute_evidences | `disputes`, `dispute_evidences` | ✅ |
| Drizzle schema: notifications | `notifications` | ✅ |
| Drizzle schema: listing_reports + audit_logs | `listing_reports`, `audit_logs` | ✅ |
| Drizzle schema: categories | `categories` | ✅ |
| All DB indexes + constraints + enums | All | ✅ |
| Drizzle migrations applied | — | ✅ |
| Seed script (categories) | — | ✅ |

**Success Criteria:** ✅ `bun db:migrate` runs clean, all tables exist, categories seeded.

---

### Phase 1B — KYC & User Profile 🔄 (In Progress)
**Duration:** 1 week | **Target:** 2026-04-04

**Goal:** Users can verify identity and manage profile.

| Task | Route | Status |
|------|-------|--------|
| File upload service (S3 integration, signed URLs) | — | ✅ |
| oRPC: `kyc.getUploadUrls` | — | ✅ |
| oRPC: `kyc.submit`, `kyc.getStatus` | — | ✅ |
| oRPC: `kyc.adminList`, `kyc.adminApprove`, `kyc.adminReject` | — | ✅ |
| `databaseHooks`: auto-create `user_profile` on register | — | ✅ |
| KYC upload UI: CCCD front/back + selfie | `/dashboard/profile/kyc` | ✅ |
| KYC status tracking page (pending/approved/rejected) | `/dashboard/profile/kyc` | ✅ |
| Admin KYC queue UI | `/admin/kyc` | ✅ |
| Admin KYC review UI + approve/reject | `/admin/kyc/:userId` | ✅ |
| Email notification: KYC approved/rejected | — | ⬜ |
| "Verified" badge on user profiles | User cards | ⬜ |

**Success Criteria:** User can upload CCCD, admin can approve, user status changes to VERIFIED.

---

### Phase 1C — Listings
**Duration:** 1.5 weeks | **Target:** 2026-04-14

**Goal:** Owners can create/manage listings; renters can search and view.

| Task | Route | Effort |
|------|-------|--------|
| oRPC: `listings.create`, `.update`, `.pause`, `.delete`, `.myListings` | — | M |
| oRPC: `listings.list` (full-text + filters + pagination) | — | M |
| oRPC: `listings.getById` (with images, blocked dates, reviews) | — | S |
| oRPC: `listings.blockDates`, `.unblockDates`, `.checkAvailability` | — | S |
| Multi-step listing creation form | `/dashboard/listings/new` | L |
| Image upload (2-8 photos, drag-reorder) | Inline | M |
| Edit listing form + availability calendar | `/dashboard/listings/:id/edit` | M |
| My Listings management page | `/dashboard/listings` | S |
| Browse page: connect real API (replace mock data) | `/browse` | S |
| Listing detail page: gallery, info, owner card, calendar, reviews | `/listing/:id` | L |
| Admin listing moderation queue | `/admin/listings` | S |

**Success Criteria:** Owner can create listing, it shows in browse, detail page loads correctly.

---

### Phase 1D — Booking Flow
**Duration:** 2 weeks | **Target:** 2026-04-28

**Goal:** Full booking lifecycle works end-to-end.

| Task | Route | Effort |
|------|-------|--------|
| oRPC: `bookings.create` (availability check, validation) | — | M |
| oRPC: `bookings.approve`, `.decline`, `.cancel` | — | S |
| oRPC: `bookings.confirmHandover`, `.confirmReceived`, `.confirmReturn` | — | S |
| oRPC: `bookings.myBookings`, `.getById` | — | S |
| Booking request form on listing detail | `/listing/:id` | M |
| Renter: My Bookings list + detail | `/dashboard/bookings`, `/dashboard/bookings/:id` | M |
| Owner: Rental Requests list + detail + approve/decline | `/dashboard/rentals`, `/dashboard/rentals/:id` | M |
| Handover / Return confirmation UI | `/dashboard/rentals/:id` | M |
| Return condition form (Good / Damaged / Lost + photos) | Inline modal | M |
| Overdue indicator + countdown timer | Booking detail | S |
| Scheduled jobs: expire_pending, mark_overdue, auto_complete | — | M |

**Success Criteria:** Complete booking from request → confirm → handover → return → COMPLETED.

---

### Phase 1E — Messaging
**Duration:** 1 week | **Target:** 2026-05-05

**Goal:** Real-time chat between confirmed booking parties.

| Task | Route | Effort |
|------|-------|--------|
| WebSocket / Supabase Realtime setup | — | M |
| oRPC: `messages.getConversation`, `.send`, `.markRead`, `.myConversations` | — | M |
| Conversation list | `/dashboard/messages` | S |
| Chat room UI (bubbles, image upload, system messages) | `/dashboard/messages/:bookingId` | L |
| Booking info panel in chat | Inline | S |
| Content detection (phone numbers, links) — flag + warn | — | S |
| Auto-create conversation when booking CONFIRMED | — | S |
| Lock conversation after COMPLETED/CANCELLED | — | S |

**Success Criteria:** Owner and renter can chat in real-time after booking confirmed.

---

### Phase 1F — Reviews & Disputes
**Duration:** 1 week | **Target:** 2026-05-12

**Goal:** Review system and dispute opening flow.

| Task | Route | Effort |
|------|-------|--------|
| oRPC: `reviews.create`, `.forListing`, `.forUser` | — | S |
| Review form (stars, tags, comment) | `/dashboard/reviews` | M |
| Blind review reveal logic (trigger + scheduled job) | — | S |
| Reviews display on listing detail + user profile | Multiple | S |
| oRPC: `disputes.open`, `.respond`, `.getById` | — | M |
| Dispute opening form (type, description, evidence upload) | `/dashboard/disputes` | M |
| Admin: dispute queue + detail + resolution form | `/admin/disputes`, `/admin/disputes/:id` | M |

**Success Criteria:** After COMPLETED booking, both parties can review; disputes can be opened and resolved.

---

### Phase 1G — Notifications & Polish
**Duration:** 1 week | **Target:** 2026-05-19

**Goal:** Full notification system, UI polish, launch readiness.

| Task | Effort |
|------|--------|
| oRPC: `notifications.list`, `.markRead`, `.updateFcmToken` | S |
| Email notifications for all booking events | M |
| Push notifications (FCM) | M |
| In-app notification center | `/notifications` | S |
| Notification badge in header | S |
| User dashboard overview page | `/dashboard` | M |
| Trust score display (badge on profile) | S |
| Listing report flow | S |
| Admin: reports queue | S |
| Static pages: How it Works, Policy | S |
| Error pages (404, 500) | S |
| Loading states, empty states, error boundaries | M |
| SEO meta tags (listing detail, browse) | S |

**Success Criteria:** All MVP features working, all notification events trigger correctly.

---

## 4. Timeline Overview

```
Mar 2026      Apr 2026           May 2026
|-------------|------------------|----------|
Phase 0  ✅
Phase 1A     |------|
Phase 1B            |------|
Phase 1C                   |---------|
Phase 1D                             |------------|
Phase 1E                                          |------|
Phase 1F                                                 |------|
Phase 1G                                                        |------|
                                                                       ^ MVP Launch ~2026-05-24
```

**MVP Launch Target:** End of May 2026 (~10 weeks from now)

---

## 5. Phase 2 — Monetization & Growth
**Target:** 3 months post-MVP launch (~Sep 2026)

| Feature | Priority | Description |
|---------|----------|-------------|
| Payment escrow (PayOS/VNPay) | Must | Deposit held in platform account |
| Commission 15% collection | Must | Auto-deduct on COMPLETED bookings |
| Cancellation penalty enforcement | Must | 25%/50% rules with payment |
| Premium listing boost | Should | 29k/59k/99k packages |
| Redis + rate limiting | Should | Performance + abuse prevention |
| BullMQ notification queue | Should | Reliable async notification delivery |
| Google Vision image moderation | Should | Auto-detect prohibited content |
| Fraud detection rules | Should | Flag suspicious account behavior |
| Retention: re-engagement emails | Could | Dormant user nudges |
| Analytics dashboard (admin) | Could | Revenue, GMV, booking trends |

---

## 6. Phase 3 — Scale
**Target:** 6 months post-MVP (~Dec 2026)

| Feature | Notes |
|---------|-------|
| Insurance integration | Bảo Việt / PVI per rental |
| Mobile PWA optimization | Offline support, add to homescreen |
| Multi-city expansion | Da Nang, Can Tho |
| Read replica for search | Scale browse performance |
| Recommendation engine | Personalized listing suggestions |

---

## 7. Definition of Done (MVP)

- [ ] User can register, verify email, and verify CCCD
- [ ] Verified owner can create listing with photos
- [ ] Listing appears in browse with working search + filters
- [ ] Renter can send booking request with date selection
- [ ] Owner can approve/decline within 24h (auto-expire otherwise)
- [ ] Both parties can chat after booking confirmed
- [ ] Handover and return confirmation flow works
- [ ] Review system works (blind, 72h window)
- [ ] Dispute can be opened and admin can resolve
- [ ] All major booking events trigger email + push notifications
- [ ] Admin can moderate listings (approve/suspend)
- [ ] Admin can manage users (warn/suspend/ban)
- [ ] Admin can resolve disputes
- [ ] No booking possible for unverified users
- [ ] Scheduled jobs running (expire, overdue, auto-complete, reveal reviews)
- [ ] All data persisted in PostgreSQL (no mock data in production)

---

## 8. Risk & Mitigation

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| KYC provider API delays / cost | Medium | High | Use FPT.AI as primary, manual admin review as fallback |
| Cold start — no listings at launch | High | High | Seed 20-30 real listings with team/friends before launch |
| Chat infra complexity | Medium | Medium | Start with polling, upgrade to WebSocket when stable |
| Phase 1 timeline slip | Medium | Medium | Phase 1G (notifications/polish) can slip to post-launch |
| eKYC integration complexity | Medium | High | Build admin manual approval first, integrate eKYC API after |
| S3 storage cost | Low | Low | Compress images on upload, set lifecycle rules |
