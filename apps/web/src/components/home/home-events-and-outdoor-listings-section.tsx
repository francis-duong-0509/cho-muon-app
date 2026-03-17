import { LISTINGS } from "@/data/marketplace-mock-data";
import { MarketplaceListingCard } from "@/components/listing/marketplace-listing-card";

export function HomeEventsAndOutdoorListingsSection() {
  const eventsAndOutdoorListings = LISTINGS.filter(
    (listing) =>
      listing.category === "events" ||
      listing.category === "camping" ||
      listing.category === "sports"
  );

  return (
    <section className="bg-gray-50 py-10 px-4">
      <div className="max-w-7xl mx-auto flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">🎉 Sự Kiện &amp; Ngoài Trời</h2>
          <a
            href="/browse?category=events"
            className="text-primary font-medium hover:underline text-sm"
          >
            Xem thêm →
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {eventsAndOutdoorListings.map((listing) => (
            <MarketplaceListingCard listing={listing} key={listing.id} />
          ))}
        </div>
      </div>
    </section>
  );
}
