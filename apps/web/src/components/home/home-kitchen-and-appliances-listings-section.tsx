import { LISTINGS } from "@/data/marketplace-mock-data";
import { MarketplaceListingCard } from "@/components/listing/marketplace-listing-card";

export function HomeKitchenAndAppliancesListingsSection() {
  const listings = LISTINGS.filter(
    (listing) => listing.category === "kitchen"
  ).slice(0, 8);

  return (
    <section className="bg-gray-50 py-10 px-4">
      <div className="max-w-7xl mx-auto flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">🍳 Nhà Bếp &amp; Gia Dụng</h2>
          <a
            href="/browse?category=kitchen"
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
