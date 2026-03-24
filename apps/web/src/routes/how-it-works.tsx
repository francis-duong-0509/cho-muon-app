import { createFileRoute } from "@tanstack/react-router";
import { SiteNavbarWithAuthCta } from "@/components/layout/site-navbar-with-auth-cta";
import { SiteFooterWithNavLinks } from "@/components/layout/site-footer-with-nav-links";
import { ShoppingBag, Home } from "lucide-react";

export const Route = createFileRoute("/how-it-works")({
  component: HowItWorksPage,
});

const RENTER_STEPS = [
  { num: 1, title: "Tìm kiếm", desc: "Duyệt hàng nghìn món đồ theo danh mục, khu vực và giá cả phù hợp với nhu cầu." },
  { num: 2, title: "Liên hệ", desc: "Gửi yêu cầu thuê đến chủ đồ. Chủ đồ sẽ xác nhận trong vòng 24 giờ." },
  { num: 3, title: "Nhận đồ", desc: "Gặp chủ đồ tại địa điểm thỏa thuận hoặc nhận qua giao hàng. Kiểm tra đồ trước khi nhận." },
  { num: 4, title: "Trả đồ & Đánh giá", desc: "Trả đồ đúng hạn và để lại đánh giá để giúp cộng đồng thuê dễ dàng hơn." },
];

const OWNER_STEPS = [
  { num: 1, title: "Đăng đồ", desc: "Chụp ảnh, điền mô tả và đặt giá cho thuê. Đăng miễn phí, không giới hạn số lượng." },
  { num: 2, title: "Nhận yêu cầu", desc: "Xem xét yêu cầu thuê từ người dùng. Chấp nhận hoặc từ chối theo lịch của bạn." },
  { num: 3, title: "Giao đồ", desc: "Gặp người thuê và bàn giao đồ. Chụp ảnh hiện trạng trước khi giao để an tâm." },
  { num: 4, title: "Nhận tiền", desc: "Tiền thuê được chuyển vào tài khoản sau khi người thuê xác nhận nhận đồ thành công." },
];

const FAQS = [
  {
    q: "Tôi có thể thuê trong bao lâu?",
    a: "Tùy thuộc vào chủ đồ quy định. Hầu hết cho thuê tối thiểu 1 ngày và tối đa 30 ngày. Bạn có thể thỏa thuận thêm với chủ đồ nếu cần thuê lâu hơn.",
  },
  {
    q: "Nếu đồ bị hỏng thì sao?",
    a: "Người thuê có trách nhiệm bồi thường thiệt hại theo thỏa thuận ban đầu. Tiền cọc sẽ được giữ lại toàn bộ hoặc một phần tùy mức độ hư hỏng. Chúng tôi hỗ trợ giải quyết tranh chấp nếu cần.",
  },
  {
    q: "Thanh toán như thế nào?",
    a: "Hiện tại hỗ trợ thanh toán qua chuyển khoản ngân hàng và ví điện tử (MoMo, ZaloPay). Thanh toán được giữ an toàn và chỉ chuyển cho chủ đồ sau khi giao dịch hoàn tất.",
  },
  {
    q: "Làm sao biết chủ đồ uy tín?",
    a: "Mỗi chủ đồ có huy hiệu xác minh danh tính, điểm đánh giá và lịch sử giao dịch công khai. Bạn có thể đọc nhận xét từ người thuê trước để đưa ra quyết định.",
  },
];

function StepCard({ num, title, desc }: { num: number; title: string; desc: string }) {
  return (
    <div className="flex gap-4 bg-card border border-border rounded-xl p-5">
      <div className="shrink-0 w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
        {num}
      </div>
      <div>
        <p className="font-semibold text-foreground mb-1">{title}</p>
        <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteNavbarWithAuthCta />

      {/* Hero */}
      <section className="bg-gradient-to-b from-primary/10 to-background py-16 px-4 text-center">
        <h1 className="text-3xl md:text-4xl font-extrabold text-foreground mb-4">
          Cách ChoMuon hoạt động
        </h1>
        <p className="text-muted-foreground text-lg max-w-xl mx-auto">
          Nền tảng cho thuê đồ đơn giản, an toàn và tiết kiệm — dành cho cả người thuê lẫn chủ đồ.
        </p>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-12 flex flex-col gap-14">
        {/* For Renters */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <ShoppingBag className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-bold text-foreground">Dành cho người thuê</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {RENTER_STEPS.map((step) => (
              <StepCard key={step.num} {...step} />
            ))}
          </div>
        </section>

        {/* For Owners */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <Home className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-bold text-foreground">Dành cho chủ đồ</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {OWNER_STEPS.map((step) => (
              <StepCard key={step.num} {...step} />
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section>
          <h2 className="text-xl font-bold text-foreground mb-6">Câu hỏi thường gặp</h2>
          <div className="flex flex-col gap-3">
            {FAQS.map(({ q, a }) => (
              <details
                key={q}
                className="group bg-card border border-border rounded-xl overflow-hidden"
              >
                <summary className="flex items-center justify-between px-5 py-4 cursor-pointer font-medium text-foreground select-none list-none">
                  <span>{q}</span>
                  <span className="text-muted-foreground text-lg group-open:rotate-45 transition-transform duration-200">+</span>
                </summary>
                <div className="px-5 pb-4 text-sm text-muted-foreground leading-relaxed border-t border-border pt-3">
                  {a}
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-primary/10 rounded-2xl p-8 text-center">
          <h2 className="text-xl font-bold text-foreground mb-2">Sẵn sàng bắt đầu?</h2>
          <p className="text-muted-foreground text-sm mb-6">
            Tham gia cộng đồng ChoMuon — cho thuê và thuê đồ dễ dàng ngay hôm nay.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="/browse"
              className="inline-block bg-primary text-primary-foreground font-semibold px-6 py-2.5 rounded-lg hover:opacity-90 transition-opacity"
            >
              Khám phá đồ cho thuê
            </a>
            <a
              href="/login"
              className="inline-block bg-card border border-border text-foreground font-semibold px-6 py-2.5 rounded-lg hover:bg-muted transition-colors"
            >
              Đăng đồ của bạn
            </a>
          </div>
        </section>
      </div>

      <SiteFooterWithNavLinks />
    </div>
  );
}
