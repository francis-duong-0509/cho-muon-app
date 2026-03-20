// Top verified hosts — hardcoded placeholder until a hosts API is available

interface TopHost {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  reviewCount: number;
  listingCount: number;
  verified: boolean;
}

const TOP_HOSTS: TopHost[] = [
  { id: "1", name: "Francis Duong", avatar: "", rating: 4.9, reviewCount: 42, listingCount: 12, verified: true },
  { id: "2", name: "Minh Nguyễn", avatar: "", rating: 4.8, reviewCount: 36, listingCount: 8, verified: true },
  { id: "3", name: "Thảo Trần", avatar: "", rating: 4.7, reviewCount: 28, listingCount: 6, verified: true },
  { id: "4", name: "Hùng Lê", avatar: "", rating: 4.6, reviewCount: 21, listingCount: 5, verified: true },
];

function HostCard({ host }: { host: TopHost }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col items-center gap-2 text-center hover:border-primary hover:shadow-md transition-all duration-200 cursor-pointer">
      {/* Avatar */}
      <div className="relative">
        <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-xl font-bold text-primary border-2 border-gray-100">
          {host.name.charAt(0)}
        </div>
        {host.verified && (
          <span
            className="absolute -bottom-1 -right-1 bg-primary text-white text-[9px] rounded-full w-4 h-4 flex items-center justify-center font-bold leading-none"
            title="Đã xác minh"
          >
            ✓
          </span>
        )}
      </div>

      {/* Name */}
      <p className="font-semibold text-gray-900 text-sm leading-tight line-clamp-1">
        {host.name}
      </p>

      {/* Rating */}
      <div className="flex items-center gap-1 text-xs text-gray-600">
        <span>⭐</span>
        <span className="font-bold text-gray-800">{host.rating.toFixed(1)}</span>
        <span className="text-gray-400">·</span>
        <span>{host.reviewCount} đánh giá</span>
      </div>

      {/* Verified badge */}
      {host.verified && (
        <span className="text-[10px] bg-amber-50 text-amber-700 border border-amber-200 rounded-full px-2 py-0.5 font-medium">
          Đã xác minh
        </span>
      )}

      {/* Listing count */}
      <p className="text-xs text-gray-500">
        {host.listingCount} đồ cho thuê
      </p>
    </div>
  );
}

export function HomeTopVerifiedHostsShowcaseSection() {
  return (
    <section className="py-8 px-4 bg-white">
      <div className="max-w-5xl mx-auto">
        {/* Section header */}
        <div className="mb-5">
          <h2 className="text-xl font-bold text-gray-900">🏆 Chủ Đồ Uy Tín</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Được xác minh và đánh giá cao nhất
          </p>
        </div>

        {/* Host grid: 2 cols on mobile, 4 on desktop */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {TOP_HOSTS.map((host) => (
            <HostCard key={host.id} host={host} />
          ))}
        </div>
      </div>
    </section>
  );
}
