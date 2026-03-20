import { MarketplaceListingCard } from "@/components/listing/marketplace-listing-card";
import { Button } from "@chomuon/ui/components/button";
import { useQuery } from "@tanstack/react-query";
import { orpc } from "@/utils/orpc";

export function HomeFeaturedListingsSection() {
  const { data } = useQuery(orpc.listings.list.queryOptions({
    input: { sortBy: "newest", limit: 6 },
  }));

  const listings = data?.items ?? [];

  if (listings.length === 0) return null;

  return (
    <section className="py-14 px-4">
      <div className="max-w-5xl mx-auto flex flex-col gap-8">
        <h2 className="text-2xl font-bold text-center">Đồ nổi bật gần bạn</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {listings.map((listing) => (
            <MarketplaceListingCard listing={listing} key={listing.id} />
          ))}
        </div>

        <div className="flex justify-center">
          <a href="/browse">
            <Button variant="outline" size="lg" className="px-8 rounded-lg h-auto py-2.5">
              Xem tất cả đồ cho thuê →
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
}
