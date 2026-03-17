import { CATEGORIES } from "@/data/marketplace-mock-data";

export function HomeCategoriesGridSection() {
  return (
    <section className="py-14 px-4">
      <div className="max-w-5xl mx-auto flex flex-col gap-8">
        <h2 className="text-2xl font-bold text-center">Khám phá theo danh mục</h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {CATEGORIES.map((cat) => (
            <a
              key={cat.id}
              href={`/browse?category=${cat.id}`}
              className="bg-card rounded-xl border border-border p-4 text-center flex flex-col items-center gap-2
                         transition-all duration-200 hover:border-primary hover:scale-[1.03] group"
            >
              <span className="text-3xl">{cat.icon}</span>
              <span className="text-sm font-medium leading-tight">{cat.name}</span>
              <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                {cat.count} đồ
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
