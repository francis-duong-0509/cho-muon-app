import { Quote, Star } from "lucide-react";

const TESTIMONIALS = [
  {
    id: 1,
    text: "Thuê máy ảnh cho chuyến Đà Lạt, tiết kiệm được 3 triệu so với mua. Chủ đồ rất nhiệt tình!",
    name: "Nguyễn Văn An",
    location: "TP.HCM",
    initials: "NA",
    rating: 5,
  },
  {
    id: 2,
    text: "Cho thuê lều cắm trại được 800k/tháng trong khi không dùng đến. Thật sự hay!",
    name: "Trần Thị Bích",
    location: "TP.HCM",
    initials: "TB",
    rating: 5,
  },
  {
    id: 3,
    text: "Thuê bộ bàn ghế cho sinh nhật, rẻ hơn thuê ngoài 50%. ChoMuon quá tiện!",
    name: "Lê Minh Tuấn",
    location: "TP.HCM",
    initials: "LT",
    rating: 5,
  },
];

export function HomeUserTestimonialsSection() {
  return (
    <section className="py-14 px-4 bg-amber-50/40">
      <div className="max-w-5xl mx-auto flex flex-col gap-8">
        {/* Header */}
        <h2 className="text-2xl font-bold text-center text-gray-900 flex items-center gap-2 justify-center"><Quote className="w-6 h-6 text-primary" /> Người Dùng Nói Gì</h2>

        {/* Testimonial cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.id}
              className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col gap-4"
            >
              {/* Quote mark */}
              <span className="text-primary text-4xl font-serif leading-none">"</span>

              {/* Testimonial text */}
              <p className="text-gray-700 text-sm italic leading-relaxed flex-1">
                {t.text}
              </p>

              {/* Stars */}
              <div className="flex gap-0.5">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 text-primary fill-primary" />
                ))}
              </div>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold shrink-0">
                  {t.initials}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-gray-900">{t.name}</span>
                  <span className="text-xs text-gray-400">{t.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
