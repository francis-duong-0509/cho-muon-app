import { LISTINGS } from "@/data/marketplace-mock-data";
import { MarketplaceListingCard } from "@/components/listing/marketplace-listing-card";

export function HomeSportsAndMusicListingsSection() {
  const listings = LISTINGS.filter(
    (listing) =>
      listing.category === "sports" || listing.category === "music"
  ).slice(0, 8);

  return (
    <section className="bg-white py-10 px-4">
      <div className="max-w-7xl mx-auto flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">🏋️ Thể Thao &amp; Nhạc Cụ</h2>
          <a
            href="/browse?category=sports"
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
