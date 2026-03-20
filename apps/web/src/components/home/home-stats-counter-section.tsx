const STAT_ITEMS = [
  { value: "100+", label: "Đồ cho thuê" },
  { value: "500+", label: "Giao dịch" },
  { value: "50+", label: "Chủ đồ" },
  { value: "3", label: "Thành phố" },
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
