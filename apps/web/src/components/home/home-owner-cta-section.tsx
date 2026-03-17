import { Button } from "@chomuon/ui/components/button";

export function HomeOwnerCtaSection() {
  return (
    <section className="py-16 px-4 relative overflow-hidden">
      {/* Amber gradient background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(135deg, color-mix(in srgb, var(--color-primary) 20%, transparent) 0%, transparent 60%)",
        }}
      />

      <div className="relative max-w-2xl mx-auto text-center flex flex-col gap-6">
        <h2 className="text-3xl font-bold">Bạn có đồ chưa dùng?</h2>

        <p className="text-muted-foreground text-base leading-relaxed">
          Hãy cho thuê và kiếm thêm thu nhập. Đăng đồ miễn phí, kiểm soát
          lịch và giá của bạn.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a href="/login">
            <Button
              size="lg"
              className="bg-primary text-primary-foreground px-8 h-auto py-3 rounded-lg font-semibold hover:bg-primary/90 w-full sm:w-auto"
            >
              Đăng đồ ngay
            </Button>
          </a>
          <a href="/how-it-works">
            <Button
              variant="outline"
              size="lg"
              className="px-8 h-auto py-3 rounded-lg font-semibold w-full sm:w-auto"
            >
              Tìm hiểu thêm
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
}
