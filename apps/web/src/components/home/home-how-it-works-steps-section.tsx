const STEPS = [
  {
    number: 1,
    icon: "🔍",
    title: "Tìm đồ bạn cần",
    description: "Tìm kiếm theo danh mục hoặc địa điểm",
  },
  {
    number: 2,
    icon: "💬",
    title: "Liên hệ chủ đồ",
    description: "Chat trực tiếp, hỏi thêm chi tiết",
  },
  {
    number: 3,
    icon: "🤝",
    title: "Nhận đồ & sử dụng",
    description: "Gặp mặt hoặc giao hàng, thanh toán an toàn",
  },
];

export function HomeHowItWorksStepsSection() {
  return (
    <section className="py-14 px-4">
      <div className="max-w-4xl mx-auto flex flex-col gap-10">
        <h2 className="text-2xl font-bold text-center">Cách hoạt động</h2>

        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-0">
          {STEPS.map((step, idx) => (
            <div key={step.number} className="flex sm:flex-1 flex-col sm:flex-row items-center w-full">
              {/* Step card */}
              <div className="flex flex-col items-center text-center gap-3 px-6 flex-1">
                {/* Number badge */}
                <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm shrink-0">
                  {step.number}
                </div>
                <span className="text-3xl">{step.icon}</span>
                <div className="flex flex-col gap-1">
                  <p className="font-semibold text-sm">{step.title}</p>
                  <p className="text-muted-foreground text-xs">{step.description}</p>
                </div>
              </div>

              {/* Arrow divider — hidden on mobile, hidden after last step */}
              {idx < STEPS.length - 1 && (
                <span className="hidden sm:block text-muted-foreground text-xl px-2 shrink-0">→</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
