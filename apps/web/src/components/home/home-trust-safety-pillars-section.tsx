import { IdCard, Star, ShieldCheck } from "lucide-react";
import type { ReactNode } from "react";

const PILLARS: { icon: ReactNode; title: string; description: string }[] = [
  {
    icon: <IdCard className="w-6 h-6 text-primary" />,
    title: "Xác minh danh tính",
    description: "Hồ sơ được xác minh với CMND/CCCD",
  },
  {
    icon: <Star className="w-6 h-6 text-primary" />,
    title: "Hệ thống đánh giá",
    description: "Đánh giá 2 chiều sau mỗi giao dịch",
  },
  {
    icon: <ShieldCheck className="w-6 h-6 text-primary" />,
    title: "Đặt cọc bảo vệ",
    description: "Đặt cọc đảm bảo quyền lợi cả 2 bên",
  },
];

export function HomeTrustSafetyPillarsSection() {
  return (
    <section className="py-14 px-4">
      <div className="max-w-4xl mx-auto flex flex-col gap-8">
        <h2 className="text-2xl font-bold text-center">An toàn & Tin cậy</h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {PILLARS.map((pillar) => (
            <div
              key={pillar.title}
              className="bg-card border border-border rounded-xl p-6 flex flex-col items-center text-center gap-4"
            >
              {/* Amber icon circle */}
              <div className="w-14 h-14 rounded-full bg-primary/15 flex items-center justify-center text-2xl shrink-0">
                {pillar.icon}
              </div>
              <div className="flex flex-col gap-1.5">
                <p className="font-semibold text-sm">{pillar.title}</p>
                <p className="text-muted-foreground text-xs leading-relaxed">{pillar.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
