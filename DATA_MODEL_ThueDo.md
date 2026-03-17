# Data Model Schema — ThueDo Marketplace

**Version:** 1.0  
**Ngày:** 2026-03-17  
**Scope:** Core entities cho MVP

---

## Mục lục

1. [Sơ đồ quan hệ tổng quan](#1-sơ-đồ-quan-hệ-tổng-quan)
2. [Users & Identity](#2-users--identity)
3. [Listings](#3-listings)
4. [Bookings](#4-bookings)
5. [Messaging](#5-messaging)
6. [Reviews](#6-reviews)
7. [Disputes](#7-disputes)
8. [Notifications](#8-notifications)
9. [Audit & Moderation](#9-audit--moderation)
10. [Enums & Constants](#10-enums--constants)

---

## 1. Sơ đồ quan hệ tổng quan

```
users
 ├──< listings          (1 user có nhiều listing)
 ├──< bookings          (1 user là renter trong nhiều booking)
 ├──< reviews_given     (1 user viết nhiều review)
 ├──< reviews_received  (1 user nhận nhiều review)
 ├──< disputes          (1 user mở nhiều dispute)
 ├──< messages          (1 user gửi nhiều tin nhắn)
 └──< notifications     (1 user nhận nhiều notification)

listings
 ├──< listing_images    (1 listing có nhiều ảnh)
 ├──< listing_blocked_dates  (1 listing có nhiều ngày bị block)
 └──< bookings          (1 listing có nhiều booking)

bookings
 ├──< messages          (1 booking có 1 conversation)
 ├──< reviews           (1 booking sinh ra tối đa 2 review)
 └──< disputes          (1 booking có tối đa 1 dispute active)

disputes
 └──< dispute_evidences (1 dispute có nhiều file bằng chứng)
```

---

## 2. Users & Identity

### Table: `users`

| Column | Type | Nullable | Default | Ghi chú |
|--------|------|----------|---------|---------|
| `id` | `uuid` | NO | `gen_random_uuid()` | Primary key |
| `phone_number` | `varchar(15)` | NO | — | Unique. Format: `+84xxxxxxxxx` |
| `display_name` | `varchar(50)` | NO | — | Tên hiển thị công khai |
| `avatar_url` | `text` | YES | NULL | URL ảnh đại diện |
| `bio` | `varchar(300)` | YES | NULL | Giới thiệu bản thân |
| `status` | `user_status` | NO | `'UNVERIFIED'` | Xem enum |
| `role` | `user_role` | NO | `'USER'` | `USER` hoặc `ADMIN` |
| `trust_score` | `smallint` | NO | `0` | 0–100, tính theo công thức |
| `trust_level` | `trust_level` | NO | `'NEW'` | Derived từ trust_score |
| `total_completed_as_owner` | `integer` | NO | `0` | Đếm giao dịch hoàn thành với tư cách owner |
| `total_completed_as_renter` | `integer` | NO | `0` | Đếm giao dịch hoàn thành với tư cách renter |
| `avg_rating_as_owner` | `numeric(3,2)` | YES | NULL | Trung bình rating khi là owner |
| `avg_rating_as_renter` | `numeric(3,2)` | YES | NULL | Trung bình rating khi là renter |
| `cancel_rate` | `numeric(5,2)` | NO | `0.00` | % cancel / tổng booking confirmed |
| `dispute_lost_count` | `smallint` | NO | `0` | Số lần thua dispute |
| `warning_count` | `smallint` | NO | `0` | Số lần bị cảnh báo |
| `suspended_until` | `timestamptz` | YES | NULL | NULL = không bị suspend |
| `fcm_token` | `text` | YES | NULL | Firebase push notification token |
| `created_at` | `timestamptz` | NO | `now()` | |
| `updated_at` | `timestamptz` | NO | `now()` | |
| `last_active_at` | `timestamptz` | YES | NULL | Lần cuối mở app |

**Indexes:**
```sql
CREATE UNIQUE INDEX idx_users_phone ON users(phone_number);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_users_trust_level ON users(trust_level);
```

**Constraints:**
```sql
CHECK (trust_score BETWEEN 0 AND 100)
CHECK (cancel_rate BETWEEN 0 AND 100)
CHECK (avg_rating_as_owner BETWEEN 1.00 AND 5.00)
CHECK (avg_rating_as_renter BETWEEN 1.00 AND 5.00)
```

---

### Table: `user_kyc`

Tách riêng khỏi `users` vì chứa thông tin nhạy cảm — access control riêng.

| Column | Type | Nullable | Default | Ghi chú |
|--------|------|----------|---------|---------|
| `id` | `uuid` | NO | `gen_random_uuid()` | Primary key |
| `user_id` | `uuid` | NO | — | FK → `users.id`, UNIQUE |
| `cccd_number_hash` | `varchar(255)` | NO | — | Hash của số CCCD (không lưu plaintext) |
| `full_name` | `varchar(100)` | NO | — | Tên đầy đủ trên CCCD |
| `date_of_birth` | `date` | NO | — | Ngày sinh (để check tuổi) |
| `gender` | `varchar(10)` | YES | NULL | |
| `address` | `text` | YES | NULL | Địa chỉ trên CCCD (encrypted) |
| `cccd_front_url` | `text` | NO | — | URL ảnh mặt trước CCCD (private bucket) |
| `cccd_back_url` | `text` | NO | — | URL ảnh mặt sau CCCD (private bucket) |
| `selfie_url` | `text` | NO | — | URL ảnh selfie (private bucket) |
| `kyc_status` | `kyc_status` | NO | `'PENDING'` | `PENDING / APPROVED / REJECTED / RESUBMIT` |
| `kyc_provider` | `varchar(50)` | YES | NULL | Tên eKYC provider (vd: `fpt_ai`) |
| `kyc_provider_ref` | `text` | YES | NULL | Reference ID từ provider |
| `kyc_score` | `numeric(5,2)` | YES | NULL | Confidence score từ provider |
| `rejection_reason` | `text` | YES | NULL | Lý do reject nếu failed |
| `verified_at` | `timestamptz` | YES | NULL | Thời điểm KYC approved |
| `created_at` | `timestamptz` | NO | `now()` | |
| `updated_at` | `timestamptz` | NO | `now()` | |

**Indexes:**
```sql
CREATE UNIQUE INDEX idx_kyc_user_id ON user_kyc(user_id);
CREATE UNIQUE INDEX idx_kyc_cccd_hash ON user_kyc(cccd_number_hash)
  WHERE kyc_status = 'APPROVED';
```

> **Bảo mật:** Bảng này cần Row Level Security (RLS) — chỉ admin và chính user đó được đọc. Ảnh CCCD lưu trong private storage bucket, không public URL.

---

### Table: `user_otp`

Quản lý OTP đăng nhập.

| Column | Type | Nullable | Default | Ghi chú |
|--------|------|----------|---------|---------|
| `id` | `uuid` | NO | `gen_random_uuid()` | |
| `phone_number` | `varchar(15)` | NO | — | |
| `otp_hash` | `varchar(255)` | NO | — | Hash của OTP (không lưu plaintext) |
| `purpose` | `varchar(20)` | NO | — | `LOGIN` / `REGISTER` / `RESET` |
| `attempt_count` | `smallint` | NO | `0` | Số lần nhập sai |
| `is_used` | `boolean` | NO | `false` | |
| `expires_at` | `timestamptz` | NO | — | `created_at + 5 minutes` |
| `created_at` | `timestamptz` | NO | `now()` | |

**Indexes:**
```sql
CREATE INDEX idx_otp_phone_expires ON user_otp(phone_number, expires_at)
  WHERE is_used = false;
```

---

## 3. Listings

### Table: `listings`

| Column | Type | Nullable | Default | Ghi chú |
|--------|------|----------|---------|---------|
| `id` | `uuid` | NO | `gen_random_uuid()` | Primary key |
| `owner_id` | `uuid` | NO | — | FK → `users.id` |
| `title` | `varchar(100)` | NO | — | Tên đồ vật |
| `description` | `text` | NO | — | Mô tả chi tiết |
| `category` | `listing_category` | NO | — | Xem enum |
| `status` | `listing_status` | NO | `'PENDING_REVIEW'` | Xem enum |
| `price_per_day` | `integer` | NO | — | VNĐ, bội số 1.000 |
| `deposit_amount` | `integer` | NO | — | VNĐ, deposit yêu cầu |
| `estimated_value` | `integer` | NO | — | VNĐ, giá trị ước tính của đồ |
| `min_rental_days` | `smallint` | NO | `1` | Số ngày tối thiểu mỗi lần thuê |
| `max_rental_days` | `smallint` | NO | `30` | Số ngày tối đa mỗi lần thuê |
| `notice_hours` | `smallint` | NO | `0` | Giờ báo trước tối thiểu trước khi nhận |
| `province` | `varchar(50)` | NO | — | Tỉnh/Thành phố |
| `district` | `varchar(100)` | NO | — | Quận/Huyện |
| `ward` | `varchar(100)` | YES | NULL | Phường/Xã (optional) |
| `pickup_method` | `pickup_method` | NO | `'IN_PERSON'` | `IN_PERSON` / `SHIP_AVAILABLE` |
| `condition_notes` | `varchar(500)` | YES | NULL | Ghi chú điều kiện thuê của owner |
| `thumbnail_url` | `text` | YES | NULL | Ảnh đại diện (= ảnh đầu tiên) |
| `view_count` | `integer` | NO | `0` | Số lượt xem |
| `total_bookings` | `integer` | NO | `0` | Tổng booking đã hoàn thành |
| `avg_rating` | `numeric(3,2)` | YES | NULL | Rating trung bình của listing này |
| `is_featured` | `boolean` | NO | `false` | Listing được boost (Phase 2) |
| `featured_until` | `timestamptz` | YES | NULL | Hết hạn featured |
| `paused_at` | `timestamptz` | YES | NULL | Thời điểm bị pause |
| `deleted_at` | `timestamptz` | YES | NULL | Soft delete |
| `created_at` | `timestamptz` | NO | `now()` | |
| `updated_at` | `timestamptz` | NO | `now()` | |

**Indexes:**
```sql
CREATE INDEX idx_listings_owner ON listings(owner_id);
CREATE INDEX idx_listings_status ON listings(status) WHERE deleted_at IS NULL;
CREATE INDEX idx_listings_category ON listings(category) WHERE status = 'ACTIVE';
CREATE INDEX idx_listings_district ON listings(province, district) WHERE status = 'ACTIVE';
CREATE INDEX idx_listings_price ON listings(price_per_day) WHERE status = 'ACTIVE';
CREATE INDEX idx_listings_search ON listings USING gin(
  to_tsvector('simple', title || ' ' || description)
);
```

**Constraints:**
```sql
CHECK (price_per_day >= 10000)
CHECK (price_per_day % 1000 = 0)
CHECK (deposit_amount >= 0)
CHECK (estimated_value > 0)
CHECK (min_rental_days >= 1)
CHECK (max_rental_days >= min_rental_days)
CHECK (min_rental_days <= 365)
CHECK (deposit_amount >= price_per_day * 3)  -- Deposit tối thiểu = 3× giá/ngày
```

---

### Table: `listing_images`

| Column | Type | Nullable | Default | Ghi chú |
|--------|------|----------|---------|---------|
| `id` | `uuid` | NO | `gen_random_uuid()` | |
| `listing_id` | `uuid` | NO | — | FK → `listings.id` ON DELETE CASCADE |
| `url` | `text` | NO | — | URL ảnh (public bucket) |
| `sort_order` | `smallint` | NO | `0` | 0 = thumbnail |
| `created_at` | `timestamptz` | NO | `now()` | |

**Constraints:**
```sql
-- Tối đa 8 ảnh mỗi listing (enforce ở application layer)
```

---

### Table: `listing_blocked_dates`

Quản lý ngày owner chủ động block (không tính các ngày bị block do booking).

| Column | Type | Nullable | Default | Ghi chú |
|--------|------|----------|---------|---------|
| `id` | `uuid` | NO | `gen_random_uuid()` | |
| `listing_id` | `uuid` | NO | — | FK → `listings.id` ON DELETE CASCADE |
| `blocked_date` | `date` | NO | — | Ngày bị block |
| `reason` | `varchar(100)` | YES | NULL | Lý do block (nội bộ, không hiển thị) |
| `created_at` | `timestamptz` | NO | `now()` | |

**Indexes:**
```sql
CREATE UNIQUE INDEX idx_blocked_dates_unique ON listing_blocked_dates(listing_id, blocked_date);
CREATE INDEX idx_blocked_dates_lookup ON listing_blocked_dates(listing_id, blocked_date);
```

> **Note:** Để check availability, query join cả `listing_blocked_dates` lẫn bookings có status `CONFIRMED` hoặc `ACTIVE` trong khoảng ngày đó.

---

## 4. Bookings

### Table: `bookings`

| Column | Type | Nullable | Default | Ghi chú |
|--------|------|----------|---------|---------|
| `id` | `uuid` | NO | `gen_random_uuid()` | Primary key |
| `listing_id` | `uuid` | NO | — | FK → `listings.id` |
| `owner_id` | `uuid` | NO | — | FK → `users.id` (denormalized để query nhanh) |
| `renter_id` | `uuid` | NO | — | FK → `users.id` |
| `status` | `booking_status` | NO | `'PENDING'` | Xem enum |
| `start_date` | `date` | NO | — | Ngày bắt đầu thuê |
| `end_date` | `date` | NO | — | Ngày kết thúc thuê (inclusive) |
| `total_days` | `smallint` | NO | — | `end_date - start_date + 1` |
| `price_per_day_snapshot` | `integer` | NO | — | Snapshot giá tại thời điểm booking (tránh thay đổi giá sau) |
| `total_rental_amount` | `integer` | NO | — | `price_per_day_snapshot × total_days` |
| `deposit_amount_snapshot` | `integer` | NO | — | Snapshot deposit tại thời điểm booking |
| `renter_message` | `varchar(300)` | NO | — | Tin nhắn giới thiệu của renter khi gửi request |
| `decline_reason` | `varchar(300)` | YES | NULL | Lý do decline (nếu bị từ chối) |
| `cancel_reason` | `varchar(300)` | YES | NULL | Lý do cancel |
| `cancelled_by` | `uuid` | YES | NULL | FK → `users.id` — ai cancel |
| `owner_handover_at` | `timestamptz` | YES | NULL | Thời điểm owner xác nhận đã giao đồ |
| `renter_received_at` | `timestamptz` | YES | NULL | Thời điểm renter xác nhận đã nhận đồ |
| `renter_returned_at` | `timestamptz` | YES | NULL | Thời điểm renter xác nhận đã trả đồ |
| `owner_received_back_at` | `timestamptz` | YES | NULL | Thời điểm owner xác nhận đã nhận lại đồ |
| `item_condition_on_return` | `return_condition` | YES | NULL | `GOOD` / `DAMAGED` / `LOST` |
| `return_notes` | `text` | YES | NULL | Ghi chú của owner khi nhận lại |
| `deposit_confirmed_by_owner` | `boolean` | NO | `false` | Owner xác nhận đã nhận deposit (MVP — ngoài app) |
| `deposit_confirmed_by_renter` | `boolean` | NO | `false` | Renter xác nhận đã đặt cọc (MVP — ngoài app) |
| `overdue_days` | `smallint` | NO | `0` | Số ngày trễ hạn trả |
| `request_expires_at` | `timestamptz` | NO | — | `created_at + 24h` — deadline owner phản hồi |
| `created_at` | `timestamptz` | NO | `now()` | |
| `updated_at` | `timestamptz` | NO | `now()` | |

**Indexes:**
```sql
CREATE INDEX idx_bookings_listing ON bookings(listing_id);
CREATE INDEX idx_bookings_owner ON bookings(owner_id);
CREATE INDEX idx_bookings_renter ON bookings(renter_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_dates ON bookings(listing_id, start_date, end_date)
  WHERE status IN ('CONFIRMED', 'ACTIVE');
CREATE INDEX idx_bookings_expires ON bookings(request_expires_at)
  WHERE status = 'PENDING';
```

**Constraints:**
```sql
CHECK (end_date >= start_date)
CHECK (total_days = (end_date - start_date + 1))
CHECK (total_rental_amount = price_per_day_snapshot * total_days)
CHECK (owner_id != renter_id)  -- Không tự thuê đồ của mình
```

---

### Booking Availability Check (Logic)

Để kiểm tra listing có available trong khoảng `[check_start, check_end]` không:

```sql
-- Trả về TRUE nếu listing KHÔNG available (đã có conflict)
SELECT EXISTS (
  -- Conflict với booking đang active/confirmed
  SELECT 1 FROM bookings
  WHERE listing_id = $listing_id
    AND status IN ('CONFIRMED', 'ACTIVE', 'OVERDUE')
    AND start_date <= $check_end
    AND end_date >= $check_start

  UNION ALL

  -- Conflict với ngày owner block thủ công
  SELECT 1 FROM listing_blocked_dates
  WHERE listing_id = $listing_id
    AND blocked_date BETWEEN $check_start AND $check_end
);
```

---

## 5. Messaging

### Table: `conversations`

Mỗi booking có đúng 1 conversation.

| Column | Type | Nullable | Default | Ghi chú |
|--------|------|----------|---------|---------|
| `id` | `uuid` | NO | `gen_random_uuid()` | |
| `booking_id` | `uuid` | NO | — | FK → `bookings.id`, UNIQUE |
| `owner_id` | `uuid` | NO | — | FK → `users.id` |
| `renter_id` | `uuid` | NO | — | FK → `users.id` |
| `is_locked` | `boolean` | NO | `false` | True sau khi booking COMPLETED/CANCELLED |
| `last_message_at` | `timestamptz` | YES | NULL | Để sort conversation list |
| `created_at` | `timestamptz` | NO | `now()` | |

**Indexes:**
```sql
CREATE UNIQUE INDEX idx_conversations_booking ON conversations(booking_id);
CREATE INDEX idx_conversations_owner ON conversations(owner_id, last_message_at DESC);
CREATE INDEX idx_conversations_renter ON conversations(renter_id, last_message_at DESC);
```

---

### Table: `messages`

| Column | Type | Nullable | Default | Ghi chú |
|--------|------|----------|---------|---------|
| `id` | `uuid` | NO | `gen_random_uuid()` | |
| `conversation_id` | `uuid` | NO | — | FK → `conversations.id` |
| `sender_id` | `uuid` | NO | — | FK → `users.id` |
| `message_type` | `message_type` | NO | `'TEXT'` | `TEXT` / `IMAGE` / `SYSTEM` |
| `content` | `text` | YES | NULL | Nội dung text (nullable nếu là ảnh) |
| `image_urls` | `text[]` | YES | NULL | Mảng URL ảnh (tối đa 5) |
| `is_flagged` | `boolean` | NO | `false` | Bị flag vì chứa thông tin nhạy cảm |
| `flag_reason` | `varchar(100)` | YES | NULL | Lý do flag |
| `is_deleted` | `boolean` | NO | `false` | Soft delete (người gửi xoá) |
| `read_by_owner` | `boolean` | NO | `false` | |
| `read_by_renter` | `boolean` | NO | `false` | |
| `created_at` | `timestamptz` | NO | `now()` | |

**Indexes:**
```sql
CREATE INDEX idx_messages_conversation ON messages(conversation_id, created_at ASC);
CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_messages_unread_owner ON messages(conversation_id)
  WHERE read_by_owner = false AND is_deleted = false;
```

> **System messages** (`message_type = 'SYSTEM'`): Tự động insert khi có sự kiện booking (vd: "Booking đã được xác nhận", "Đồ đã được giao"). `sender_id` = NULL cho system messages.

---

### Table: `conversation_read_receipts`

Track tin nhắn cuối cùng đã đọc của mỗi user (thay vì update từng message).

| Column | Type | Nullable | Default | Ghi chú |
|--------|------|----------|---------|---------|
| `conversation_id` | `uuid` | NO | — | FK → `conversations.id` |
| `user_id` | `uuid` | NO | — | FK → `users.id` |
| `last_read_message_id` | `uuid` | YES | NULL | FK → `messages.id` |
| `last_read_at` | `timestamptz` | NO | `now()` | |

**Indexes:**
```sql
CREATE UNIQUE INDEX idx_read_receipts_pk ON conversation_read_receipts(conversation_id, user_id);
```

---

## 6. Reviews

### Table: `reviews`

| Column | Type | Nullable | Default | Ghi chú |
|--------|------|----------|---------|---------|
| `id` | `uuid` | NO | `gen_random_uuid()` | |
| `booking_id` | `uuid` | NO | — | FK → `bookings.id` |
| `reviewer_id` | `uuid` | NO | — | FK → `users.id` — người viết review |
| `reviewee_id` | `uuid` | NO | — | FK → `users.id` — người được review |
| `listing_id` | `uuid` | NO | — | FK → `listings.id` (denormalized) |
| `reviewer_role` | `user_booking_role` | NO | — | `OWNER` hoặc `RENTER` — role của người viết |
| `rating` | `smallint` | NO | — | 1–5 |
| `comment` | `varchar(500)` | YES | NULL | Nhận xét (bắt buộc nếu rating ≤ 2) |
| `tags` | `text[]` | YES | NULL | Mảng tag chọn nhanh |
| `is_visible` | `boolean` | NO | `false` | False cho đến khi cả hai review hoặc hết 72h |
| `is_flagged` | `boolean` | NO | `false` | Bị flag để admin review |
| `flag_reason` | `varchar(100)` | YES | NULL | |
| `created_at` | `timestamptz` | NO | `now()` | |

**Indexes:**
```sql
CREATE UNIQUE INDEX idx_reviews_booking_reviewer ON reviews(booking_id, reviewer_id);
CREATE INDEX idx_reviews_reviewee ON reviews(reviewee_id, is_visible);
CREATE INDEX idx_reviews_listing ON reviews(listing_id, is_visible);
```

**Constraints:**
```sql
CHECK (rating BETWEEN 1 AND 5)
CHECK (reviewer_id != reviewee_id)
-- Bắt buộc có comment nếu rating <= 2 (enforce ở application layer + DB trigger)
```

---

### Blind Review Logic

```sql
-- Trigger: sau khi INSERT review, check xem có nên reveal chưa
CREATE OR REPLACE FUNCTION check_reveal_reviews()
RETURNS TRIGGER AS $$
DECLARE
  review_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO review_count
  FROM reviews
  WHERE booking_id = NEW.booking_id;

  -- Reveal cả hai nếu đủ 2 review
  IF review_count = 2 THEN
    UPDATE reviews
    SET is_visible = true
    WHERE booking_id = NEW.booking_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Scheduled job: reveal sau 72h dù chỉ có 1 review
-- Chạy mỗi giờ, update is_visible = true cho review
-- đã qua 72h kể từ booking COMPLETED
```

---

## 7. Disputes

### Table: `disputes`

| Column | Type | Nullable | Default | Ghi chú |
|--------|------|----------|---------|---------|
| `id` | `uuid` | NO | `gen_random_uuid()` | |
| `booking_id` | `uuid` | NO | — | FK → `bookings.id` |
| `opened_by` | `uuid` | NO | — | FK → `users.id` — ai mở dispute |
| `respondent_id` | `uuid` | NO | — | FK → `users.id` — bên bị kiện |
| `dispute_type` | `dispute_type` | NO | — | Xem enum |
| `status` | `dispute_status` | NO | `'OPEN'` | Xem enum |
| `description` | `text` | NO | — | Mô tả vấn đề (tối thiểu 100 ký tự) |
| `requested_resolution` | `text` | NO | — | Yêu cầu cụ thể của người mở |
| `respondent_response` | `text` | YES | NULL | Phản hồi của bên kia |
| `respondent_responded_at` | `timestamptz` | YES | NULL | |
| `admin_id` | `uuid` | YES | NULL | FK → `users.id` — admin được assign |
| `admin_notes` | `text` | YES | NULL | Ghi chú nội bộ của admin |
| `resolution` | `dispute_resolution` | YES | NULL | Kết quả cuối cùng |
| `resolution_notes` | `text` | YES | NULL | Giải thích quyết định |
| `compensation_amount` | `integer` | YES | NULL | Số tiền bồi thường (nếu có) |
| `mediation_deadline` | `timestamptz` | NO | — | `created_at + 48h` — deadline tự thoả thuận |
| `admin_deadline` | `timestamptz` | YES | NULL | Deadline admin giải quyết |
| `resolved_at` | `timestamptz` | YES | NULL | |
| `created_at` | `timestamptz` | NO | `now()` | |
| `updated_at` | `timestamptz` | NO | `now()` | |

**Indexes:**
```sql
CREATE UNIQUE INDEX idx_disputes_booking_active ON disputes(booking_id)
  WHERE status NOT IN ('RESOLVED', 'CLOSED');
CREATE INDEX idx_disputes_status ON disputes(status);
CREATE INDEX idx_disputes_admin ON disputes(admin_id) WHERE status = 'UNDER_REVIEW';
```

---

### Table: `dispute_evidences`

| Column | Type | Nullable | Default | Ghi chú |
|--------|------|----------|---------|---------|
| `id` | `uuid` | NO | `gen_random_uuid()` | |
| `dispute_id` | `uuid` | NO | — | FK → `disputes.id` ON DELETE CASCADE |
| `uploaded_by` | `uuid` | NO | — | FK → `users.id` |
| `file_url` | `text` | NO | — | URL file bằng chứng |
| `file_type` | `varchar(20)` | NO | — | `image/jpeg`, `image/png`, `video/mp4`... |
| `file_size_bytes` | `integer` | NO | — | |
| `description` | `varchar(200)` | YES | NULL | Mô tả bằng chứng |
| `created_at` | `timestamptz` | NO | `now()` | |

---

## 8. Notifications

### Table: `notifications`

| Column | Type | Nullable | Default | Ghi chú |
|--------|------|----------|---------|---------|
| `id` | `uuid` | NO | `gen_random_uuid()` | |
| `user_id` | `uuid` | NO | — | FK → `users.id` |
| `type` | `notification_type` | NO | — | Xem enum |
| `title` | `varchar(100)` | NO | — | Tiêu đề notification |
| `body` | `varchar(300)` | NO | — | Nội dung |
| `data` | `jsonb` | YES | NULL | Metadata (vd: `{"booking_id": "...", "listing_id": "..."}`) |
| `is_read` | `boolean` | NO | `false` | |
| `read_at` | `timestamptz` | YES | NULL | |
| `channel` | `text[]` | NO | `'{push}'` | `push`, `email`, `sms` |
| `sent_at` | `timestamptz` | YES | NULL | NULL = chưa gửi |
| `failed_at` | `timestamptz` | YES | NULL | NULL = chưa fail |
| `created_at` | `timestamptz` | NO | `now()` | |

**Indexes:**
```sql
CREATE INDEX idx_notifications_user ON notifications(user_id, created_at DESC);
CREATE INDEX idx_notifications_unread ON notifications(user_id)
  WHERE is_read = false;
CREATE INDEX idx_notifications_unsent ON notifications(created_at)
  WHERE sent_at IS NULL AND failed_at IS NULL;
```

---

## 9. Audit & Moderation

### Table: `listing_reports`

| Column | Type | Nullable | Default | Ghi chú |
|--------|------|----------|---------|---------|
| `id` | `uuid` | NO | `gen_random_uuid()` | |
| `listing_id` | `uuid` | NO | — | FK → `listings.id` |
| `reported_by` | `uuid` | NO | — | FK → `users.id` |
| `reason` | `report_reason` | NO | — | Xem enum |
| `description` | `varchar(300)` | YES | NULL | |
| `status` | `varchar(20)` | NO | `'PENDING'` | `PENDING / REVIEWED / DISMISSED` |
| `reviewed_by` | `uuid` | YES | NULL | FK → `users.id` (admin) |
| `created_at` | `timestamptz` | NO | `now()` | |

**Constraints:**
```sql
-- 1 user chỉ report 1 listing 1 lần
CREATE UNIQUE INDEX idx_reports_unique ON listing_reports(listing_id, reported_by);
```

---

### Table: `audit_logs`

Ghi lại mọi thay đổi quan trọng — không thể xoá, chỉ append.

| Column | Type | Nullable | Default | Ghi chú |
|--------|------|----------|---------|---------|
| `id` | `uuid` | NO | `gen_random_uuid()` | |
| `actor_id` | `uuid` | YES | NULL | FK → `users.id`. NULL = system action |
| `action` | `varchar(100)` | NO | — | Vd: `booking.status_changed`, `user.suspended` |
| `entity_type` | `varchar(50)` | NO | — | `booking`, `listing`, `user`, `dispute`... |
| `entity_id` | `uuid` | NO | — | ID của entity bị tác động |
| `old_value` | `jsonb` | YES | NULL | Giá trị trước khi thay đổi |
| `new_value` | `jsonb` | YES | NULL | Giá trị sau khi thay đổi |
| `ip_address` | `inet` | YES | NULL | |
| `user_agent` | `text` | YES | NULL | |
| `created_at` | `timestamptz` | NO | `now()` | |

**Indexes:**
```sql
CREATE INDEX idx_audit_entity ON audit_logs(entity_type, entity_id, created_at DESC);
CREATE INDEX idx_audit_actor ON audit_logs(actor_id, created_at DESC);
```

---

## 10. Enums & Constants

```sql
-- Trạng thái tài khoản người dùng
CREATE TYPE user_status AS ENUM (
  'UNVERIFIED',   -- Mới đăng ký, chưa KYC
  'VERIFIED',     -- Đã KYC thành công
  'WARNED',       -- Đã bị cảnh báo ≥1 lần
  'SUSPENDED',    -- Tạm khoá (có suspended_until)
  'BANNED'        -- Khoá vĩnh viễn
);

-- Role trong hệ thống
CREATE TYPE user_role AS ENUM ('USER', 'ADMIN', 'SUPPORT');

-- Trust level (derived từ trust_score)
CREATE TYPE trust_level AS ENUM ('NEW', 'TRUSTED', 'REPUTABLE', 'RELIABLE', 'SUPER');

-- Trạng thái KYC
CREATE TYPE kyc_status AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'RESUBMIT');

-- Category đồ vật
CREATE TYPE listing_category AS ENUM (
  'OUTDOOR_SPORTS',       -- Outdoor & Thể thao
  'ELECTRONICS',          -- Thiết bị điện tử
  'HOME_APPLIANCES',      -- Đồ gia dụng
  'FASHION_ACCESSORIES',  -- Trang phục & Phụ kiện
  'TOOLS_EQUIPMENT',      -- Dụng cụ & Thiết bị
  'MUSICAL_INSTRUMENTS',  -- Nhạc cụ
  'EVENT_PARTY',          -- Đồ dùng tiệc & Sự kiện
  'OTHER'
);

-- Trạng thái listing
CREATE TYPE listing_status AS ENUM (
  'PENDING_REVIEW',  -- Chờ kiểm duyệt
  'ACTIVE',          -- Đang hoạt động
  'PAUSED',          -- Tạm ẩn bởi owner
  'SUSPENDED',       -- Bị admin khoá
  'DELETED'          -- Đã xoá (soft delete)
);

-- Phương thức nhận đồ
CREATE TYPE pickup_method AS ENUM (
  'IN_PERSON',      -- Chỉ gặp mặt trực tiếp
  'SHIP_AVAILABLE'  -- Có thể ship (owner chịu phí hoặc thoả thuận)
);

-- Trạng thái booking
CREATE TYPE booking_status AS ENUM (
  'PENDING',     -- Chờ owner phản hồi
  'CONFIRMED',   -- Owner đã approve
  'ACTIVE',      -- Đang trong thời gian thuê
  'OVERDUE',     -- Quá hạn trả
  'COMPLETED',   -- Hoàn thành
  'CANCELLED',   -- Đã huỷ
  'DECLINED',    -- Owner từ chối
  'EXPIRED'      -- Hết 24h owner không phản hồi
);

-- Tình trạng đồ khi trả
CREATE TYPE return_condition AS ENUM (
  'GOOD',     -- Nguyên vẹn
  'DAMAGED',  -- Có hư hỏng
  'LOST'      -- Bị mất
);

-- Loại tin nhắn
CREATE TYPE message_type AS ENUM ('TEXT', 'IMAGE', 'SYSTEM');

-- Role của user trong 1 booking (dùng cho reviews)
CREATE TYPE user_booking_role AS ENUM ('OWNER', 'RENTER');

-- Loại dispute
CREATE TYPE dispute_type AS ENUM (
  'ITEM_DAMAGED',          -- Đồ bị hỏng
  'ITEM_LOST',             -- Đồ bị mất
  'ITEM_NOT_AS_DESCRIBED', -- Đồ không như mô tả
  'OWNER_NO_SHOW',         -- Owner không giao đồ
  'DEPOSIT_NOT_RETURNED',  -- Không hoàn deposit
  'OTHER'
);

-- Trạng thái dispute
CREATE TYPE dispute_status AS ENUM (
  'OPEN',          -- Mới mở, đang trong mediation phase
  'UNDER_REVIEW',  -- Admin đang xem xét
  'RESOLVED',      -- Đã giải quyết
  'CLOSED'         -- Đóng không có kết luận
);

-- Kết quả dispute
CREATE TYPE dispute_resolution AS ENUM (
  'RESOLVED_MUTUAL',  -- Hai bên tự thoả thuận
  'OWNER_WIN',        -- Admin xử: owner thắng
  'RENTER_WIN',       -- Admin xử: renter thắng
  'PARTIAL',          -- Lỗi cả hai
  'INCONCLUSIVE'      -- Không đủ bằng chứng
);

-- Loại notification
CREATE TYPE notification_type AS ENUM (
  'BOOKING_REQUEST',         -- Có booking request mới (owner)
  'BOOKING_CONFIRMED',       -- Booking được approve (renter)
  'BOOKING_DECLINED',        -- Booking bị từ chối (renter)
  'BOOKING_EXPIRED',         -- Hết giờ owner không phản hồi (renter)
  'BOOKING_CANCELLED',       -- Booking bị cancel (cả hai)
  'BOOKING_REMINDER_PICKUP', -- Nhắc gặp mặt ngày mai (cả hai)
  'BOOKING_RETURN_REMINDER', -- Nhắc trả đồ ngày mai (renter)
  'BOOKING_OVERDUE',         -- Quá hạn trả (cả hai)
  'BOOKING_COMPLETED',       -- Hoàn thành (cả hai)
  'NEW_MESSAGE',             -- Tin nhắn mới
  'REVIEW_REQUEST',          -- Được nhắc để lại review
  'REVIEW_RECEIVED',         -- Có review mới
  'DISPUTE_OPENED',          -- Dispute được mở
  'DISPUTE_RESOLVED',        -- Dispute đã giải quyết
  'KYC_APPROVED',            -- KYC thành công
  'KYC_REJECTED',            -- KYC thất bại
  'ACCOUNT_WARNING',         -- Bị cảnh báo
  'LISTING_APPROVED',        -- Listing được duyệt
  'LISTING_SUSPENDED'        -- Listing bị khoá
);

-- Lý do report listing
CREATE TYPE report_reason AS ENUM (
  'FRAUD',              -- Nghi là lừa đảo
  'FAKE_IMAGES',        -- Ảnh không đúng thực tế
  'PROHIBITED_ITEM',    -- Đồ bị cấm
  'WRONG_CATEGORY',     -- Sai category
  'SPAM',               -- Spam
  'OTHER'
);
```

---

## Ghi chú triển khai

### Về denormalization
Một số field được denormalize có chủ đích để tránh JOIN nặng:
- `bookings.owner_id` — copy từ `listings.owner_id`
- `reviews.listing_id` — copy từ `bookings.listing_id`
- `users.avg_rating_as_owner/renter` — cập nhật bằng trigger sau mỗi review

### Về soft delete
`listings` dùng `deleted_at` (soft delete) để giữ reference trong booking history.  
`users` **không** soft delete — dùng `status = 'BANNED'` thay thế.

### Về snapshot pricing
`bookings.price_per_day_snapshot` và `deposit_amount_snapshot` lưu giá tại thời điểm booking để tránh tranh chấp khi owner thay đổi giá sau.

### Scheduled jobs cần có
| Job | Tần suất | Mô tả |
|-----|----------|-------|
| `expire_pending_bookings` | Mỗi 5 phút | PENDING → EXPIRED nếu quá 24h |
| `mark_overdue_bookings` | Mỗi giờ | ACTIVE → OVERDUE nếu quá end_date |
| `auto_complete_bookings` | Mỗi giờ | ACTIVE → COMPLETED nếu owner không xác nhận sau 48h |
| `reveal_blind_reviews` | Mỗi giờ | Set `is_visible = true` cho review quá 72h |
| `send_reminder_notifications` | Mỗi giờ | Gửi reminder trước 1 ngày pickup/return |
| `recalculate_trust_scores` | Mỗi ngày | Tính lại trust_score cho toàn bộ users |
