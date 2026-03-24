import { MapPin, Building2 } from "lucide-react";

const DISTRICTS = [
  { name: "Quận 1", slug: "quan-1", count: 72 },
  { name: "Quận 2", slug: "quan-2", count: 48 },
  { name: "Quận 3", slug: "quan-3", count: 63 },
  { name: "Quận 5", slug: "quan-5", count: 37 },
  { name: "Quận 7", slug: "quan-7", count: 55 },
  { name: "Quận 10", slug: "quan-10", count: 29 },
  { name: "Bình Thạnh", slug: "binh-thanh", count: 61 },
  { name: "Phú Nhuận", slug: "phu-nhuan", count: 44 },
];

export function HomeBrowseByDistrictSection() {
  return (
    <section className="py-12 px-4 bg-gray-50">
      <div className="max-w-5xl mx-auto flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col gap-1 text-center">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2"><MapPin className="w-6 h-6 text-primary" /> Tìm Đồ Gần Bạn</h2>
          <p className="text-gray-600 text-sm">Hơn 500 món đồ có sẵn tại TP. Hồ Chí Minh</p>
        </div>

        {/* District grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {DISTRICTS.map((district) => (
            <a
              key={district.slug}
              href={`/browse?district=${district.slug}`}
              className="
                flex flex-col items-center gap-2 p-4
                bg-white border border-gray-200 rounded-xl
                hover:border-primary hover:bg-orange-50
                transition-colors duration-150 cursor-pointer
                group
              "
            >
              <Building2 className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
              <span className="font-semibold text-sm text-gray-900 group-hover:text-primary transition-colors">
                {district.name}
              </span>
              <span className="text-xs text-gray-400">{district.count} tin đăng</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
