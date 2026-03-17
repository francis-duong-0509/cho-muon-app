# PRD: Marketplace Thuê Đồ Vật Ngắn Hạn (P2P Rental)

**Version:** 1.0  
**Ngày:** 2026-03-17  
**Trạng thái:** Draft  
**Tác giả:** Internal

---

## Mục lục

1. [Tổng quan sản phẩm](#1-tổng-quan-sản-phẩm)
2. [Mục tiêu & Thành công](#2-mục-tiêu--thành-công)
3. [Đối tượng người dùng](#3-đối-tượng-người-dùng)
4. [User Stories](#4-user-stories)
5. [Business Rules & Logic nghiệp vụ](#5-business-rules--logic-nghiệp-vụ)
6. [Edge Cases & Xử lý ngoại lệ](#6-edge-cases--xử-lý-ngoại-lệ)
7. [Luồng xử lý tranh chấp (Dispute Resolution)](#7-luồng-xử-lý-tranh-chấp-dispute-resolution)
8. [Trust & Safety System](#8-trust--safety-system)
9. [Monetization Logic](#9-monetization-logic)
10. [Phân tích rủi ro](#10-phân-tích-rủi-ro)

---

## 1. Tổng quan sản phẩm

### 1.1 Tên & Định vị

**Tên tạm:** ThueDo (thuedo.vn)

**Tagline:** *Mọi thứ bạn cần — không cần phải mua.*

**Định vị:** Marketplace P2P (peer-to-peer) cho phép người dùng tại Việt Nam đăng cho thuê hoặc thuê đồ vật từ người dùng khác trong thời gian ngắn hạn (theo ngày/tuần). Khác với mua bán (Shopee, Chợ Tốt), ThueDo tập trung vào **tài sản nhàn rỗi** — những đồ vật mà chủ sở hữu không dùng thường xuyên nhưng vẫn còn giá trị cao.

### 1.2 Vấn đề đang giải quyết

| Vấn đề | Người gặp | Hiện tại giải quyết bằng |
|--------|-----------|--------------------------|
| Cần đồ dùng 1–3 ngày, mua thì lãng phí | Người thuê | Mua rồi bán lại, hoặc không dùng |
| Có đồ đắt tiền nằm không, muốn sinh lời | Người cho thuê | Bán rẻ, hoặc để không |
| Không biết ai có đồ để mượn | Cả hai | Hỏi miệng qua mạng xã hội |
| Lo lắng bị lừa khi giao dịch người lạ | Cả hai | Không dám giao dịch |

### 1.3 Phạm vi MVP (Phase 1)

**Trong scope:**
- Đăng listing đồ cho thuê (ảnh, mô tả, giá, deposit)
- Tìm kiếm & duyệt listing theo category và quận/huyện
- Gửi yêu cầu thuê (booking request) và approve/decline
- Chat trong app giữa hai bên
- Verify danh tính (CCCD)
- Review 2 chiều sau khi hoàn thành giao dịch
- Quản lý lịch thuê (calendar availability)

**Ngoài scope MVP:**
- Payment escrow trong app
- Bảo hiểm theo ngày
- App mobile (iOS/Android) — chỉ PWA/web
- Giao hàng/vận chuyển
- Tích hợp ngân hàng tự động

---

## 2. Mục tiêu & Thành công

### 2.1 Mục tiêu kinh doanh (6 tháng sau launch)

| Chỉ số | Mục tiêu |
|--------|----------|
| Tổng listing active | 500+ |
| Giao dịch hoàn thành | 200+ |
| Người dùng verified | 300+ |
| Tỉ lệ dispute / tổng giao dịch | < 5% |
| Tỉ lệ review completion | > 70% |

### 2.2 Định nghĩa thành công theo giai đoạn

**Phase 1 (Tháng 1–2):** Có 50 listing thật, 20 giao dịch hoàn thành, 0 tranh chấp nghiêm trọng chưa giải quyết.

**Phase 2 (Tháng 3–4):** Người dùng tự nhiên quay lại thuê/cho thuê lần 2 (retention > 40%).

**Phase 3 (Tháng 5–6):** Bắt đầu thu phí, doanh thu đầu tiên, NPS > 40.

---

## 3. Đối tượng người dùng

### 3.1 Persona

#### Persona A — Người cho thuê (Owner / Lender)

**Tên đại diện:** Minh (32 tuổi, HCMC)  
**Nghề nghiệp:** Nhân viên văn phòng  
**Đặc điểm:**
- Có nhiều đồ đắt tiền dùng thỉnh thoảng: lều cắm trại, máy ảnh mirrorless, máy chiếu
- Muốn thu thêm tiền từ tài sản nhàn rỗi
- Quan tâm: đồ có được giữ gìn không, nếu hỏng thì sao
- Kênh hiện tại: đăng Facebook group, hỏi bạn bè

**Kỳ vọng từ ThueDo:**
- Dễ đăng listing, quản lý lịch
- Có cơ chế bảo vệ nếu đồ bị hỏng
- Biết người thuê là ai (danh tính rõ ràng)

#### Persona B — Người thuê (Renter / Borrower)

**Tên đại diện:** Lan (26 tuổi, HCMC)  
**Nghề nghiệp:** Freelancer  
**Đặc điểm:**
- Thường xuyên cần đồ dùng ngắn hạn cho sự kiện, du lịch, công việc
- Nhạy cảm về giá, không muốn mua đồ chỉ dùng 1–2 lần
- Quan tâm: đồ có như mô tả không, chủ có uy tín không
- Kênh hiện tại: mượn bạn bè, mua rồi bán lại trên Chợ Tốt

**Kỳ vọng từ ThueDo:**
- Tìm được đồ cần dễ dàng, gần nhà
- Quy trình booking rõ ràng, không phức tạp
- Biết đồ thật sự như ảnh

### 3.2 Hành trình người dùng tổng quát

```
[Owner]
Đăng ký → Verify CCCD → Đăng listing → Nhận request → Approve → Gặp mặt/giao đồ
→ Theo dõi thời hạn → Nhận đồ lại → Review người thuê → Nhận tiền (Phase 2)

[Renter]
Đăng ký → Verify CCCD → Tìm kiếm → Xem listing → Gửi booking request
→ Chat với owner → Gặp mặt/nhận đồ → Sử dụng → Trả đồ → Review owner
```

---

## 4. User Stories

### 4.1 Đăng ký & Xác thực danh tính

#### US-001: Đăng ký tài khoản
> **Với tư cách** người dùng mới,  
> **Tôi muốn** đăng ký bằng số điện thoại,  
> **Để** tạo tài khoản nhanh không cần nhớ email/password phức tạp.

**Acceptance Criteria:**
- Nhập số điện thoại VN (10 số, bắt đầu 03x/07x/08x/09x)
- Nhận OTP qua SMS trong vòng 60 giây
- OTP có hiệu lực 5 phút, tối đa 3 lần nhập sai thì khoá 10 phút
- Sau verify OTP thành công, yêu cầu đặt tên hiển thị (2–50 ký tự)
- Tài khoản mới mặc định ở trạng thái `UNVERIFIED` — chưa được đăng listing hoặc gửi booking

**Business Rule:**
- 1 số điện thoại = 1 tài khoản duy nhất
- Số điện thoại không thể thay đổi sau khi đăng ký (dùng để định danh)

---

#### US-002: Verify CCCD (eKYC)
> **Với tư cách** người dùng đã đăng ký,  
> **Tôi muốn** xác thực CCCD của mình,  
> **Để** được phép đăng listing và thuê đồ.

**Acceptance Criteria:**
- Upload ảnh mặt trước và mặt sau CCCD
- Upload ảnh selfie cầm CCCD
- Hệ thống gọi eKYC API (FPT.AI hoặc VNPay) để:
  - Đọc thông tin từ CCCD (họ tên, ngày sinh, địa chỉ, số CCCD)
  - So sánh khuôn mặt trên CCCD với ảnh selfie (liveness check)
- Kết quả trả về trong vòng 30 giây
- Khi passed: tài khoản chuyển sang `VERIFIED`, hiển thị badge "Đã xác thực"
- Khi failed: hiển thị lý do cụ thể, cho phép thử lại tối đa 3 lần/ngày

**Business Rule:**
- 1 CCCD chỉ được verify cho 1 tài khoản duy nhất
- Thông tin CCCD được mã hoá và lưu trữ, không hiển thị công khai ngoại trừ tên và badge verified
- Người dùng dưới 18 tuổi (theo ngày sinh trên CCCD): không được tạo listing, không được thuê đồ có giá trị > 500.000đ/ngày
- Thông tin CCCD không được chia sẻ cho bên kia trong giao dịch

---

### 4.2 Quản lý Listing (Owner)

#### US-003: Tạo listing mới
> **Với tư cách** owner đã verified,  
> **Tôi muốn** đăng đồ của mình để cho thuê,  
> **Để** kiếm thêm thu nhập từ tài sản nhàn rỗi.

**Acceptance Criteria:**
- Upload 2–8 ảnh (ảnh đầu tiên là ảnh thumbnail)
- Điền các trường bắt buộc:
  - Tên đồ vật (5–100 ký tự)
  - Mô tả chi tiết (20–2000 ký tự)
  - Category (xem danh sách categories)
  - Giá thuê theo ngày (VNĐ, tối thiểu 10.000đ/ngày)
  - Deposit yêu cầu (VNĐ, tối thiểu = 50% giá trị đồ ước tính, tối đa = 100% giá trị)
  - Giá trị ước tính của đồ (để tính deposit gợi ý)
  - Quận/Huyện (danh sách địa giới hành chính HCMC & HN)
  - Phương thức nhận/trả: gặp mặt trực tiếp / có thể ship (owner chịu phí)
- Trường tuỳ chọn:
  - Ghi chú điều kiện thuê (vd: "chỉ cho người có review > 4 sao")
  - Số ngày tối thiểu / tối đa mỗi lần thuê
  - Thời gian notice trước khi nhận (vd: báo trước ít nhất 1 ngày)
- Sau khi submit: listing ở trạng thái `PENDING_REVIEW` trong 2–4 tiếng, sau đó tự động `ACTIVE` nếu không vi phạm policy

**Business Rule (Pricing):**
- Deposit tối thiểu = max(50% giá trị ước tính, 3× giá thuê/ngày)
- Không cho phép giá thuê > 30% giá trị ước tính/ngày (để tránh việc cho thuê đồ hỏng với giá cao)
- Giá phải là bội số của 1.000đ

**Categories hợp lệ (MVP):**
```
- Outdoor & Thể thao (lều, ba lô, dụng cụ leo núi, phao bơi, ván surf...)
- Thiết bị điện tử (máy ảnh, máy chiếu, loa bluetooth, gimbal...)
- Đồ gia dụng (máy làm bánh, nồi lẩu điện, máy xay sinh tố công suất lớn...)
- Trang phục & Phụ kiện (váy cưới, trang phục cosplay, đồ truyền thống...)
- Dụng cụ & Thiết bị (máy khoan, máy hút bụi công nghiệp, thang nhôm...)
- Nhạc cụ (guitar, ukulele, keyboard...)
- Đồ dùng tiệc & Sự kiện (bàn ghế, máy karaoke mini, đèn trang trí...)
```

---

#### US-004: Quản lý lịch availability
> **Với tư cách** owner,  
> **Tôi muốn** chặn các ngày tôi không muốn cho thuê,  
> **Để** tránh nhận booking khi đồ đang bận hoặc tôi không có mặt.

**Acceptance Criteria:**
- Calendar view theo tháng, có thể click chọn ngày để block/unblock
- Block theo range: chọn ngày bắt đầu → ngày kết thúc
- Các ngày đang có booking confirmed tự động bị block, không thể thay đổi
- Owner có thể set recurring unavailability (vd: chủ nhật hàng tuần)
- Khi listing có booking active: không thể block ngày đó
- Hệ thống tự động block ngày sau khi booking được approve, unblock sau khi trả đồ xong

---

#### US-005: Tạm ẩn / Xoá listing
> **Với tư cách** owner,  
> **Tôi muốn** tạm ẩn hoặc xoá listing của mình,  
> **Để** linh hoạt quản lý khi không muốn cho thuê nữa.

**Acceptance Criteria:**
- Tạm ẩn (Pause): listing chuyển sang `PAUSED`, không hiển thị trong search, nhưng URL trực tiếp vẫn truy cập được → Lý do: người đã lưu link vẫn thấy "tạm ngừng"
- Xoá: chỉ cho phép khi không có booking active/pending. Listing chuyển sang `DELETED`, không hiển thị, nhưng dữ liệu vẫn lưu trong DB (để reference trong lịch sử giao dịch)
- Nếu có pending booking request khi pause/xoá: tự động decline tất cả pending requests và gửi thông báo cho renter

---

### 4.3 Tìm kiếm & Khám phá (Renter)

#### US-006: Tìm kiếm listing
> **Với tư cách** renter,  
> **Tôi muốn** tìm đồ cần thuê theo từ khoá và bộ lọc,  
> **Để** nhanh chóng tìm được đồ phù hợp gần nhà.

**Acceptance Criteria:**
- Tìm kiếm full-text theo tên + mô tả listing
- Bộ lọc:
  - Category
  - Quận/Huyện (single hoặc multi-select)
  - Khoảng giá thuê/ngày (min–max)
  - Ngày cần (lọc ra listing available trong khoảng ngày đó)
  - Chỉ hiện listing của owner đã verified
  - Có deposit ≤ X đồng
- Sắp xếp: Mới nhất / Giá tăng / Giá giảm / Đánh giá cao nhất
- Kết quả mặc định ưu tiên: listing cùng quận → cùng thành phố → toàn quốc
- Không hiển thị listing của chính người dùng đang đăng nhập
- Không hiển thị listing `PAUSED`, `DELETED`, hoặc owner bị `SUSPENDED`

---

#### US-007: Xem chi tiết listing
> **Với tư cách** renter,  
> **Tôi muốn** xem đầy đủ thông tin về đồ trước khi thuê,  
> **Để** ra quyết định có nên thuê hay không.

**Acceptance Criteria:**
- Hiển thị: tất cả ảnh (gallery), tên, mô tả, category, giá/ngày, deposit, quận/huyện
- Hiển thị profile owner: tên, ảnh đại diện, badge verified, điểm rating trung bình, số lượng giao dịch hoàn thành, ngày tham gia
- Calendar: ngày available (xanh) / unavailable (xám) trong 3 tháng tới
- Tất cả reviews từ renter trước đó về listing này
- Nút "Gửi yêu cầu thuê" (disabled nếu renter chưa verified)
- Nút "Lưu vào wishlist"
- Nút "Báo cáo listing" (nếu vi phạm)

---

### 4.4 Booking Flow

#### US-008: Gửi booking request
> **Với tư cách** renter đã verified,  
> **Tôi muốn** gửi yêu cầu thuê đồ,  
> **Để** bắt đầu quy trình thuê.

**Acceptance Criteria:**
- Chọn ngày bắt đầu và ngày kết thúc thuê (hệ thống validate available)
- Số ngày tối thiểu: do owner config (default = 1 ngày)
- Hệ thống tự tính: tổng tiền thuê, deposit yêu cầu, hiển thị rõ ràng trước khi submit
- Renter điền thêm: tin nhắn giới thiệu bản thân / lý do thuê (tối đa 300 ký tự, bắt buộc)
- Sau khi submit: booking ở trạng thái `PENDING`, owner nhận notification
- Renter không thể gửi 2 booking request cho cùng 1 listing cùng lúc
- Renter không thể gửi booking nếu có bất kỳ booking nào đang ở trạng thái `ACTIVE` bị overdue (quá hạn trả)

**Business Rule:**
- Thời gian tối thiểu giữa ngày gửi request và ngày bắt đầu thuê: theo config của owner (default = 0, tức có thể thuê ngay hôm nay)
- Thời gian tối đa mỗi lần thuê: do owner config (default = 30 ngày)
- Renter chỉ được có tối đa 5 pending request cùng lúc (để tránh spam)

---

#### US-009: Owner xử lý booking request
> **Với tư cách** owner,  
> **Tôi muốn** xem và phê duyệt/từ chối yêu cầu thuê,  
> **Để** kiểm soát ai được dùng đồ của mình.

**Acceptance Criteria:**
- Owner nhận push notification và email khi có request mới
- Xem được: thông tin renter (tên, badge verified, rating, số giao dịch đã hoàn thành), tin nhắn giới thiệu, ngày thuê, tổng tiền
- Có thể xem full profile renter trước khi quyết định
- 2 lựa chọn: **Approve** hoặc **Decline** (kèm lý do decline tuỳ chọn)
- Thời hạn phản hồi: **24 giờ** kể từ khi nhận request
- Nếu không phản hồi sau 24 giờ: booking tự động `EXPIRED`, renter được thông báo
- Khi Approve: booking chuyển sang `CONFIRMED`, calendar tự block ngày thuê, cả hai nhận notification
- Khi Decline: booking chuyển sang `DECLINED`, renter nhận notification kèm lý do

**Business Rule (Auto-decline):**
- Tự động decline nếu renter có rating trung bình < 3.0 và owner đã bật tùy chọn "Chỉ cho thuê người có rating > 3 sao"
- Tự động decline nếu renter có dispute chưa giải quyết

---

#### US-010: Xác nhận giao/nhận đồ
> **Với tư cách** cả owner và renter,  
> **Tôi muốn** xác nhận việc giao/nhận đồ trong app,  
> **Để** hệ thống tracking chính xác trạng thái giao dịch.

**Acceptance Criteria:**
- Trước ngày bắt đầu 1 ngày: cả hai nhận reminder notification
- Tại thời điểm giao đồ, **owner** thực hiện: bấm "Xác nhận đã giao đồ" → hệ thống ghi timestamp, booking chuyển sang `ACTIVE`
- **Renter** xác nhận: bấm "Xác nhận đã nhận đồ" → ghi timestamp phía renter
- Nếu chỉ owner xác nhận mà renter chưa xác nhận sau 2 tiếng: hệ thống tự coi là renter đã nhận (để tránh lạm dụng)
- Nếu chỉ renter xác nhận mà owner chưa xác nhận: gửi alert cho owner
- Trong trạng thái `ACTIVE`: đồng hồ đếm ngược hiển thị thời gian còn lại đến hạn trả

---

#### US-011: Xác nhận trả đồ & Hoàn thành giao dịch
> **Với tư cách** owner,  
> **Tôi muốn** xác nhận đã nhận lại đồ,  
> **Để** kết thúc giao dịch và mở lại lịch cho thuê.

**Acceptance Criteria:**
- Khi renter trả đồ, **owner** bấm "Xác nhận đã nhận đồ lại"
- Owner có thể chọn: "Đồ nguyên vẹn" hoặc "Đồ có vấn đề" (kèm ảnh, mô tả)
- Nếu "Đồ nguyên vẹn": booking chuyển sang `COMPLETED`, unlock review cho cả hai
- Nếu "Đồ có vấn đề": mở dispute flow (xem US-015)
- Sau khi `COMPLETED`: cả hai có **72 giờ** để để lại review (sau đó không thể review nữa)
- Calendar tự động unblock các ngày đã block

**Business Rule:**
- Nếu owner không xác nhận trả đồ sau 48 giờ kể từ ngày trả dự kiến: hệ thống tự động `COMPLETED` (trừ khi đã mở dispute)
- Booking `COMPLETED` không thể bị cancel hoặc thay đổi trạng thái

---

### 4.5 Review System

#### US-012: Viết review sau giao dịch
> **Với tư cách** người dùng sau giao dịch hoàn thành,  
> **Tôi muốn** đánh giá bên kia,  
> **Để** xây dựng hệ thống tin cậy cho cộng đồng.

**Acceptance Criteria:**
- Cả hai bên có thể review trong vòng **72 giờ** sau `COMPLETED`
- Review bao gồm:
  - Rating: 1–5 sao (bắt buộc)
  - Nhận xét dạng text (tùy chọn, 10–500 ký tự)
  - Tags nhanh (chọn nhiều): Owner — [Đồ như mô tả, Giao tiếp tốt, Đúng hẹn, Đồ sạch sẽ, Giá hợp lý]; Renter — [Giữ gìn cẩn thận, Đúng hẹn, Giao tiếp tốt, Đáng tin cậy]
- **Blind review**: cả hai review độc lập, không thấy review của bên kia cho đến khi cả hai đã submit hoặc hết 72 giờ. Mục đích: tránh bias (nếu thấy bị review xấu thì sẽ review lại xấu hơn)
- Sau khi submit: không thể chỉnh sửa, nhưng có thể report review vi phạm
- Nếu chỉ 1 bên review: review vẫn được hiển thị sau 72 giờ
- Điểm rating được tính trung bình cộng tất cả ratings nhận được

**Business Rule:**
- Không thể review nếu không có giao dịch `COMPLETED` với người đó
- Rating < 2 sao bắt buộc phải có text nhận xét tối thiểu 50 ký tự
- Review bị ẩn tự động nếu chứa: số điện thoại, link ngoài, từ ngữ thô tục (auto-detect)

---

### 4.6 Messaging

#### US-013: Chat giữa owner và renter
> **Với tư cách** người dùng trong một booking,  
> **Tôi muốn** nhắn tin với bên kia trong app,  
> **Để** thoả thuận chi tiết mà không cần trao đổi số điện thoại.

**Acceptance Criteria:**
- Chat chỉ được mở sau khi booking được `CONFIRMED`
- Hỗ trợ: text, ảnh (tối đa 5 ảnh/tin nhắn, mỗi ảnh < 10MB)
- Tin nhắn được lưu vĩnh viễn (dùng cho dispute resolution nếu có)
- Notification: push notification khi có tin nhắn mới
- Trong chat có shortcut: "Xem thông tin booking", "Xác nhận giao đồ", "Báo cáo vấn đề"

**Business Rule:**
- Không được phép chia sẻ thông tin cá nhân (số điện thoại, địa chỉ nhà cụ thể, link thanh toán ngoài app) trong chat — hệ thống auto-detect và cảnh báo
- Sau khi booking `COMPLETED` hoặc `CANCELLED`: không thể gửi tin nhắn mới, nhưng vẫn đọc được lịch sử
- Admin có quyền đọc chat khi xử lý dispute (người dùng được thông báo điều này trong Terms of Service)

---

## 5. Business Rules & Logic nghiệp vụ

### 5.1 Trạng thái Booking (State Machine)

```
                    ┌──────────────────────────────────────────┐
                    │                                          │
  Renter gửi → [PENDING] ──── Owner decline ────► [DECLINED]  │
                    │                                          │
              Owner approve                             24h timeout
                    │                                          │
                    ▼                                          │
             [CONFIRMED] ◄─────────────────────────────────────┘
                    │
           Renter/Owner cancel (trước ngày bắt đầu)
                    │
              [CANCELLED]
                    │
           Owner xác nhận giao đồ
                    │
                    ▼
              [ACTIVE] ──── Quá hạn trả ──► [OVERDUE]
                    │                            │
           Owner xác nhận nhận đồ lại            │
                    │                     Admin can thiệp
                    ▼                            │
             [COMPLETED] ◄──────────────────────┘
                    │
            Owner báo có vấn đề
                    │
                    ▼
              [DISPUTED]
                    │
             Admin giải quyết
                    │
             [RESOLVED]
```

### 5.2 Trạng thái Listing

```
Owner tạo → [PENDING_REVIEW] ──► [ACTIVE]
                                      │
                              Owner pause/unlist
                                      │
                                  [PAUSED]
                                      │
                              Owner activate lại
                                      │
                                  [ACTIVE]
                                      │
                              Owner xoá / Admin remove
                                      │
                                  [DELETED]
                                      │
                          Admin vi phạm nghiêm trọng
                                      │
                                 [SUSPENDED]
```

### 5.3 Trạng thái User Account

```
Đăng ký → [UNVERIFIED]
               │
          Verify CCCD
               │
           [VERIFIED]
               │
    Nhiều vi phạm / dispute thua
               │
          [WARNED] ──► [SUSPENDED] ──► [BANNED]
```

**Quy tắc leo thang:**
- 1 dispute thua: cảnh báo (WARNED)
- 2 dispute thua trong 90 ngày: tạm khoá 30 ngày (SUSPENDED)
- 3 dispute thua trong 180 ngày: khoá vĩnh viễn (BANNED)
- Owner không phản hồi booking 3 lần liên tiếp trong 7 ngày: listing tự động PAUSED

### 5.4 Quy tắc Cancellation

#### Cancel bởi Renter:

| Thời điểm cancel | Hậu quả |
|-----------------|---------|
| Trước 48h ngày bắt đầu | Không phạt, deposit hoàn đủ (Phase 2) |
| Trong 24–48h trước | Phạt 25% tổng tiền thuê (Phase 2) |
| Trong 24h trước hoặc sau khi đã nhận đồ | Phạt 50% tổng tiền thuê (Phase 2) |
| Sau khi đã nhận đồ | Không được cancel — phải hoàn thành hoặc mở dispute |

**MVP (chưa có payment):** Ghi nhận lịch sử cancel, tính vào cancel rate của user. Cancel rate > 30% trong 60 ngày → cảnh báo.

#### Cancel bởi Owner:

| Thời điểm cancel | Hậu quả |
|-----------------|---------|
| Bất kỳ lúc nào trước khi giao đồ | Được phép, renter thông báo ngay |
| Sau khi đã giao đồ | Không được cancel — phải hoàn thành hoặc mở dispute |

**Business Rule:**
- Owner cancel nhiều: ảnh hưởng đến Reliability Score của listing
- 3 lần cancel sau khi đã confirm trong 30 ngày → listing bị PAUSED tự động + cảnh báo

### 5.5 Deposit Logic (MVP — chưa có escrow)

Trong MVP, deposit được thoả thuận và xử lý **ngoài app** (chuyển khoản trực tiếp). App chỉ:
- Hiển thị số tiền deposit yêu cầu rõ ràng
- Remind cả hai bên về deposit trước khi gặp mặt
- Ghi nhận owner xác nhận "đã nhận deposit" và renter xác nhận "đã đặt cọc" (checkbox trong app)
- Trong trường hợp dispute: dùng bằng chứng chat + xác nhận deposit để phân xử

**Phase 2 (có payment escrow):**
- Renter thanh toán deposit qua PayOS/VNPay khi booking được confirm
- Deposit được giữ trong escrow account của platform
- Release deposit: khi owner xác nhận đồ nguyên vẹn sau khi nhận lại
- Nếu có dispute: deposit bị freeze cho đến khi admin giải quyết

### 5.6 Notification Rules

| Sự kiện | Người nhận | Kênh |
|---------|-----------|------|
| Có booking request mới | Owner | Push + Email |
| Booking được approve | Renter | Push + Email |
| Booking bị decline | Renter | Push |
| Booking sắp hết hạn phản hồi (còn 4h) | Owner | Push |
| Ngày nhận đồ ngày mai | Cả hai | Push + Email |
| Hạn trả đồ ngày mai | Renter | Push + Email |
| Quá hạn trả 2 tiếng | Renter + Owner | Push + Email |
| Giao dịch hoàn thành | Cả hai | Push |
| Có tin nhắn mới | Người nhận | Push |
| Được để lại review | Người được review | Push |
| Dispute được mở | Cả hai + Admin | Push + Email |
| Dispute được giải quyết | Cả hai | Push + Email |

---

## 6. Edge Cases & Xử lý ngoại lệ

### 6.1 Trường hợp liên quan đến đồ vật

#### EC-001: Đồ bị hỏng một phần khi trả
**Tình huống:** Owner nhận lại đồ, phát hiện bị trầy xước nhẹ hoặc phụ kiện bị thiếu.

**Xử lý:**
- Owner chọn "Đồ có vấn đề" khi xác nhận nhận lại
- Upload ảnh mô tả damage (bắt buộc tối thiểu 2 ảnh)
- Mô tả vấn đề (bắt buộc, tối thiểu 50 ký tự)
- Đề xuất mức bồi thường (trong phạm vi deposit)
- Renter có 24h để: đồng ý với mức bồi thường, hoặc phản đối → mở dispute
- Nếu đồng ý: booking chuyển `RESOLVED`, owner nhận bồi thường từ deposit (Phase 2)
- Nếu không có phản hồi sau 24h: coi như đồng ý

#### EC-002: Đồ bị mất / hỏng hoàn toàn
**Tình huống:** Renter làm mất đồ hoặc đồ bị hỏng không sửa được.

**Xử lý:**
- Owner báo cáo "Mất đồ" hoặc "Hỏng hoàn toàn"
- Upload bằng chứng (ảnh đồ hỏng, hoặc tuyên bố mất có xác nhận)
- Admin can thiệp trong vòng 48h
- Mức bồi thường tối đa = deposit đã đặt
- Nếu thiệt hại > deposit: platform không đảm bảo phần vượt quá (thông báo rõ trong ToS)
- Renter nhận `DISPUTE_LOST` → tăng counter vi phạm

#### EC-003: Renter không trả đồ đúng hạn (Overdue)
**Tình huống:** Đã qua ngày trả mà renter chưa trả hoặc không liên lạc được.

**Xử lý theo mốc thời gian:**
- **+2h sau deadline:** Push notification + Email nhắc renter, thông báo cho owner
- **+6h:** SMS reminder (nếu có tích hợp)
- **+12h:** Booking chuyển `OVERDUE`, owner nhận alert, có thể mở dispute ngay
- **+24h:** Admin được thông báo tự động để theo dõi
- **+48h không liên lạc được:** Admin có thể escalate, xem xét blacklist renter

**Business Rule:**
- Mỗi ngày overdue: tính thêm 150% giá thuê/ngày (ghi nhận, thu khi có payment Phase 2)
- Renter bị overdue 2 lần: account bị `WARNED`

#### EC-004: Owner không giao đồ dù đã Confirm
**Tình huống:** Booking `CONFIRMED`, đến ngày nhận đồ nhưng owner không phản hồi / không giao.

**Xử lý:**
- Renter báo cáo "Owner không giao đồ" sau 2h kể từ giờ hẹn
- Admin verify qua chat history
- Nếu xác nhận: booking `CANCELLED`, renter nhận deposit lại (Phase 2), owner nhận warning
- Owner cancel sau confirm 2 lần trong 30 ngày: listing bị PAUSED

#### EC-005: Đồ không giống mô tả / ảnh
**Tình huống:** Renter nhận đồ nhưng thực tế khác xa ảnh/mô tả (ví dụ: ảnh đồ mới nhưng đồ thật rất cũ).

**Xử lý:**
- Renter báo cáo ngay lúc nhận đồ (trước khi xác nhận "đã nhận")
- Upload ảnh thực tế + mô tả khác biệt
- Renter có quyền từ chối nhận đồ → booking `CANCELLED` không phạt
- Nếu renter đã xác nhận nhận nhưng sau đó mới phàn nàn: khó xử lý hơn, cần bằng chứng rõ

### 6.2 Trường hợp liên quan đến người dùng

#### EC-006: Owner bị tai nạn / bệnh, không thể giao đồ
**Tình huống:** Owner có lý do bất khả kháng không thể thực hiện giao dịch.

**Xử lý:**
- Owner liên hệ admin qua hotline trong vòng 6h
- Admin verify (nếu cần), cancel booking không phạt cho owner
- Renter nhận thông báo và hoàn deposit
- Booking được đánh dấu "force cancel — bất khả kháng" không tính vào cancel rate

#### EC-007: Renter bị tai nạn, không thể trả đồ đúng hạn
**Xử lý tương tự EC-006 nhưng từ phía renter.** Admin có thể gia hạn trả đồ thêm tối đa 3 ngày.

#### EC-008: Tài khoản bị hack, giao dịch không phải do chủ tài khoản thực hiện
**Xử lý:**
- User báo cáo account bị xâm phạm → Admin lock account ngay lập tức
- Review tất cả giao dịch trong 7 ngày gần nhất
- Cancel các booking chưa active nếu xác nhận bị hack
- Booking đang active: admin liên hệ trực tiếp cả 2 bên để xử lý từng trường hợp

#### EC-009: Listing bị report nhiều lần (suspected fraud)
**Trigger:** Listing nhận ≥ 3 report từ các user khác nhau trong 24h.

**Xử lý:**
- Listing tự động chuyển `PENDING_REVIEW` (ẩn khỏi search)
- Admin review trong 4h
- Nếu xác nhận vi phạm: listing `SUSPENDED`, owner nhận warning
- Nếu không vi phạm: listing restore về `ACTIVE`, thông báo cho người report

### 6.3 Edge Cases kỹ thuật

#### EC-010: Mất kết nối khi đang trong quá trình xác nhận
- Tất cả actions (confirm giao đồ, confirm nhận đồ) là idempotent — gửi 2 lần cũng không thay đổi kết quả
- UI hiển thị trạng thái realtime qua WebSocket/Supabase Realtime
- Nếu action fail: toast error, giữ nguyên state, user thử lại

#### EC-011: 2 renter cùng gửi booking request cho cùng 1 ngày
- Hệ thống xử lý theo thứ tự nhận được (first-come-first-served)
- Khi owner approve request đầu tiên: ngày đó bị block → request thứ hai tự động decline với lý do "Đã có người đặt"
- Owner chỉ nhìn thấy và xử lý 1 request tại 1 thời điểm cho cùng ngày

---

## 7. Luồng xử lý tranh chấp (Dispute Resolution)

### 7.1 Mở Dispute

**Ai có thể mở:**
- Owner: sau khi nhận đồ có vấn đề (US-011)
- Renter: khi owner không giao đồ, đồ không như mô tả, hoặc owner không hoàn deposit sau giao dịch kết thúc
- Cả hai: trong vòng **7 ngày** kể từ ngày `COMPLETED`

**Thông tin cần cung cấp khi mở dispute:**
- Loại vi phạm (chọn từ danh sách)
- Mô tả chi tiết (tối thiểu 100 ký tự)
- Bằng chứng: ảnh, screenshot chat (tối đa 10 files)
- Yêu cầu cụ thể (vd: bồi thường X đồng, hoàn deposit, cancel booking)

### 7.2 Quy trình xử lý

```
Mở Dispute
    │
    ▼
[Mediation - 48h]
Hệ thống thông báo cho bên kia, cho phép phản hồi + upload bằng chứng
    │
    ├── Hai bên tự thoả thuận → [RESOLVED_MUTUAL]
    │
    └── Không thoả thuận được
            │
            ▼
    [Admin Review - 48h tiếp theo]
    Admin xem xét toàn bộ:
    - Chat history
    - Ảnh bằng chứng
    - Lịch sử giao dịch
    - Rating/reputation của cả hai
            │
            ├── Admin ra quyết định → thông báo cho cả hai
            │
            └── Cần thêm bằng chứng → yêu cầu thêm 24h
```

### 7.3 Kết quả có thể có

| Kết quả | Ý nghĩa | Hậu quả |
|---------|---------|---------|
| `RESOLVED_MUTUAL` | Hai bên tự giải quyết | Không tác động rating |
| `OWNER_WIN` | Admin xác nhận owner đúng | Renter mất deposit (Phase 2), tăng vi phạm |
| `RENTER_WIN` | Admin xác nhận renter đúng | Owner bị warning, renter hoàn tiền (Phase 2) |
| `PARTIAL` | Lỗi cả hai, chia deposit | Ghi nhận cho cả hai |
| `INCONCLUSIVE` | Không đủ bằng chứng | Không tác động, đóng case |

### 7.4 SLA Admin

| Giai đoạn | Thời gian xử lý |
|-----------|-----------------|
| Acknowledge dispute | 2 giờ |
| Hoàn thành mediation phase | 48 giờ |
| Admin review + quyết định | 48 giờ tiếp |
| Tổng tối đa | 4 ngày làm việc |

---

## 8. Trust & Safety System

### 8.1 Trust Score

Mỗi user có **Trust Score** (0–100), tính từ:

| Yếu tố | Trọng số | Ghi chú |
|--------|---------|---------|
| Đã verify CCCD | +30 điểm | Cộng một lần |
| Số giao dịch hoàn thành | +2/giao dịch | Tối đa +30 |
| Rating trung bình | ×10 (scale) | Rating 5.0 → +10, 4.0 → +8... |
| Thời gian là thành viên | +1/tháng | Tối đa +10 |
| Cancel rate | −5/10% cancel rate vượt 20% | |
| Dispute thua | −15/lần | |
| Dispute thắng | +5/lần | |

**Hiển thị:** Trust Level thay cho điểm tuyệt đối

| Score | Level | Badge |
|-------|-------|-------|
| 0–29 | Mới | Không có badge |
| 30–49 | Đáng tin | ✓ |
| 50–69 | Uy tín | ✓✓ |
| 70–89 | Đáng tin cậy | ✓✓✓ |
| 90–100 | Super User | ⭐ |

### 8.2 Content Moderation

**Listing moderation:**
- Auto-check khi tạo listing: detect forbidden keywords (đồ ăn cắp, hàng giả, vũ khí, đồ người lớn)
- Ảnh: chạy qua AI model detect nudity/violence (Google Vision API)
- Giá bất thường: flag nếu giá > 5× trung bình category → cần admin review
- Sau 10 listing đầu tiên của platform: auto-approve, sau đó dùng trust score để quyết định

**Review moderation:**
- Auto-remove review chứa: số điện thoại, URL, từ ngữ thô tục (blacklist)
- Review 1 sao không có text (vi phạm rule bắt buộc text khi < 2 sao): ẩn ngay

### 8.3 Fraud Detection (Rules-based, MVP)

Flag account để admin review nếu:
- Tạo listing > 20 items trong 24h đầu tiên
- Gửi > 10 booking request trong 1 ngày
- Nhiều account đăng nhập từ cùng thiết bị (fingerprint)
- Thay đổi giá listing đột ngột > 200% sau khi có booking pending
- Nhận report từ ≥ 3 user khác nhau trong 7 ngày

---

## 9. Monetization Logic

### 9.1 Phase 1 (MVP — Freemium, chưa thu phí)

- Mọi tính năng miễn phí
- Mục tiêu: build user base, validate product-market fit
- Thu thập dữ liệu để định giá đúng ở Phase 2

### 9.2 Phase 2 (3–6 tháng sau launch)

#### Model chính: Commission fee

```
Tổng tiền thuê = Giá/ngày × Số ngày

Platform fee = Tổng tiền thuê × 15%
  Trong đó:
    - Owner nhận: Tổng tiền thuê × 85%
    - Platform giữ: Tổng tiền thuê × 15%

Deposit: Không thu phí (100% trả lại nếu đồ nguyên vẹn)
```

**Ví dụ:**
- Thuê lều cắm trại 3 ngày × 150.000đ/ngày = 450.000đ
- Platform fee: 450.000 × 15% = 67.500đ
- Owner nhận: 382.500đ
- Deposit (chuyển khoản riêng): 300.000đ (hoàn lại sau)

#### Model phụ: Premium Listing

| Gói | Giá | Quyền lợi |
|-----|-----|-----------|
| Boost 3 ngày | 29.000đ | Listing hiện đầu category 3 ngày |
| Boost 7 ngày | 59.000đ | Listing hiện đầu category 7 ngày |
| Featured badge | 99.000đ/tháng | Badge "Nổi bật" + ưu tiên search |

#### Insurance fee (Phase 3):
- Renter có thể mua bảo hiểm: 2% giá trị đồ/ngày thuê
- Cover: tai nạn, mất cắp (không cover: cố ý phá hoại)
- Partner: Bảo hiểm Bảo Việt hoặc PVI

### 9.3 Quy tắc hoàn tiền (Phase 2)

| Tình huống | Hoàn tiền cho Renter | Owner nhận |
|-----------|---------------------|------------|
| Cancel trước 48h | 100% | 0% |
| Cancel 24–48h trước | 75% | 25% |
| Owner không giao đồ | 100% + bồi thường 10% | -10% penalty |
| Đồ không như mô tả (renter từ chối) | 100% | 0% |
| Hoàn thành bình thường | Deposit lại | 85% tiền thuê |

---

## 10. Phân tích rủi ro

### 10.1 Ma trận rủi ro

| Rủi ro | Khả năng xảy ra | Mức độ nghiêm trọng | Mitigation |
|--------|-----------------|---------------------|------------|
| Đồ bị mất/hỏng không bồi thường được | Trung bình | Cao | Verify CCCD, deposit rõ ràng, dispute process |
| Fraud listing (đăng đồ không có, nhận deposit rồi biến mất) | Thấp (có CCCD) | Rất cao | CCCD verify, không release deposit trước khi nhận đồ (Phase 2 escrow) |
| Cold start — không có listing | Cao | Cao | Seeding thủ công trong outdoor community |
| Người dùng bypass app, giao dịch ngoài | Trung bình | Trung bình | Tạo giá trị đủ lớn trong app (review, dispute, tracking) |
| Chủ đồ lo sợ không dám đăng | Trung bình | Cao | Deposit rõ, review system, CCCD verify renter |
| Pháp lý: cho thuê có cần đăng ký kinh doanh? | Thấp | Trung bình | Tư vấn pháp lý, model P2P tương tự Airbnb |
| Review giả (nhờ bạn bè review tốt) | Trung bình | Trung bình | Chỉ review sau giao dịch confirmed, 1 giao dịch = 1 review |

### 10.2 Định nghĩa "Done" cho MVP

MVP được coi là hoàn thành khi:
- [ ] Người dùng có thể đăng ký, verify CCCD
- [ ] Người dùng có thể tạo listing với ảnh và đầy đủ thông tin
- [ ] Người dùng có thể tìm kiếm và lọc listing
- [ ] Booking flow hoàn chỉnh: request → approve → giao đồ → trả đồ → review
- [ ] Chat trong app hoạt động realtime
- [ ] Notification (push + email) cho tất cả sự kiện quan trọng
- [ ] Admin dashboard: xem danh sách giao dịch, xử lý dispute
- [ ] Không có lỗ hổng cho phép giao dịch khi chưa verify CCCD

---

*Tài liệu này sẽ được cập nhật liên tục trong quá trình development. Mọi thay đổi business logic cần được phản ánh vào đây trước khi implement.*

*Phiên bản tiếp theo sẽ bao gồm: Data Models chi tiết, API Endpoint definitions, và Technical Architecture.*
