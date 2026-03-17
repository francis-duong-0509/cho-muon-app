import { STATS } from "@/data/marketplace-mock-data";

const STAT_ITEMS = [
  { value: `${STATS.listings}+`, label: "Đồ cho thuê" },
  { value: `${STATS.transactions}+`, label: "Giao dịch" },
  { value: `${STATS.hosts}+`, label: "Chủ đồ" },
  { value: `${STATS.cities}`, label: "Thành phố" },
];

export function HomeStatsCounterSection() {
  return (
    <section className="py-12 px-4 bg-card">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-border">
          {STAT_ITEMS.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center justify-center py-6 px-4 gap-1">
              <span className="text-3xl font-bold text-primary">{stat.value}</span>
              <span className="text-sm text-muted-foreground">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
