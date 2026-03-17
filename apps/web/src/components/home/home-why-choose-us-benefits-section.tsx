const BENEFITS = [
  {
    id: 1,
    icon: "🚚",
    title: "Giao dịch trực tiếp",
    description: "Gặp mặt trao đổi nhanh chóng",
  },
  {
    id: 2,
    icon: "💰",
    title: "Tiết kiệm đến 90%",
    description: "So với mua đồ mới",
  },
  {
    id: 3,
    icon: "⭐",
    title: "Đánh giá 2 chiều",
    description: "Minh bạch, uy tín",
  },
  {
    id: 4,
    icon: "🔒",
    title: "Đặt cọc bảo vệ",
    description: "Quyền lợi cả 2 bên",
  },
];

export function HomeWhyChooseUsBenefitsSection() {
  return (
    <section className="py-6 px-4 bg-white border-t-2 border-primary">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-4 divide-y-2 sm:divide-y-0 sm:divide-x divide-gray-200">
          {BENEFITS.map((benefit) => (
            <div
              key={benefit.id}
              className="flex flex-col sm:flex-row items-center sm:items-start gap-3 px-6 py-4 sm:py-0"
            >
              <span className="text-2xl shrink-0">{benefit.icon}</span>
              <div className="flex flex-col gap-0.5 text-center sm:text-left">
                <span className="font-bold text-sm text-gray-900">{benefit.title}</span>
                <span className="text-xs text-gray-600">{benefit.description}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
