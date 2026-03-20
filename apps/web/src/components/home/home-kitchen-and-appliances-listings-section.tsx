import { MarketplaceListingCard } from "@/components/listing/marketplace-listing-card";
import { useQuery } from "@tanstack/react-query";
import { orpc } from "@/utils/orpc";

export function HomeKitchenAndAppliancesListingsSection() {
  const { data } = useQuery(orpc.listings.list.queryOptions({
    input: { categoryId: "home_appliances", limit: 8 },
  }));

  const listings = data?.items ?? [];

  if (listings.length === 0) return null;

  return (
    <section className="bg-gray-50 py-10 px-4">
      <div className="max-w-7xl mx-auto flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">🍳 Nhà Bếp &amp; Gia Dụng</h2>
          <a
            href="/browse?category=home_appliances"
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
