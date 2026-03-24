import { MarketplaceListingCard } from "@/components/listing/marketplace-listing-card";
import { useQuery } from "@tanstack/react-query";
import { orpc } from "@/utils/orpc";
import { PartyPopper } from "lucide-react";

export function HomeEventsAndOutdoorListingsSection() {
  const { data } = useQuery(orpc.listings.list.queryOptions({
    input: { categoryId: "party_events", limit: 6 },
  }));

  const listings = data?.items ?? [];

  if (listings.length === 0) return null;

  return (
    <section className="bg-gray-50 py-10 px-4">
      <div className="max-w-7xl mx-auto flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold flex items-center gap-2"><PartyPopper className="w-6 h-6 text-primary" /> Sự Kiện &amp; Ngoài Trời</h2>
          <a
            href="/browse?category=party_events"
            className="text-primary font-medium hover:underline text-sm"
          >
            Xem thêm →
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {listings.map((listing) => (
            <MarketplaceListingCard listing={listing} key={listing.id} />
          ))}
        </div>
      </div>
    </section>
  );
}
