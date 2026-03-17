import { LISTINGS } from "@/data/marketplace-mock-data";
import { MarketplaceListingCard } from "@/components/listing/marketplace-listing-card";

export function HomeBudgetUnder150kListingsSection() {
  const listings = LISTINGS.filter((listing) => listing.pricePerDay <= 150000)
    .sort((a, b) => a.pricePerDay - b.pricePerDay)
    .slice(0, 8);

  return (
    <section className="bg-amber-50/50 py-10 px-4">
      <div className="max-w-7xl mx-auto flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold">
              💰 Dưới 150k/ngày — Thuê Tiết Kiệm
            </h2>
            <span className="bg-amber-100 text-amber-700 text-xs font-semibold px-2 py-0.5 rounded-full">
              🏷️ Tiết kiệm
            </span>
          </div>
          <a
            href="/browse"
            className="text-primary font-medium hover:underline text-sm"
          >
            Xem tất cả →
          </a>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {listings.map((listing) => (
            <MarketplaceListingCard listing={listing} key={listing.id} />
          ))}
        </div>
      </div>
    </section>
  );
}
