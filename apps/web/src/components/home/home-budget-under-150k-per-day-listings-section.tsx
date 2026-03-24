import { MarketplaceListingCard } from "@/components/listing/marketplace-listing-card";
import { useQuery } from "@tanstack/react-query";
import { orpc } from "@/utils/orpc";
import { WalletMinimal, Tag } from "lucide-react";

export function HomeBudgetUnder150kListingsSection() {
  const { data } = useQuery(orpc.listings.list.queryOptions({
    input: { priceMax: 150000, sortBy: "price_asc", limit: 8 },
  }));

  const listings = data?.items ?? [];

  if (listings.length === 0) return null;

  return (
    <section className="bg-amber-50/50 py-10 px-4">
      <div className="max-w-7xl mx-auto flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <WalletMinimal className="w-6 h-6 text-primary" /> Dưới 150k/ngày — Thuê Tiết Kiệm
            </h2>
            <span className="bg-amber-100 text-amber-700 text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
              <Tag className="w-3 h-3" /> Tiết kiệm
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
