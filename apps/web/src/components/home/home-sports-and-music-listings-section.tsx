import { MarketplaceListingCard } from "@/components/listing/marketplace-listing-card";
import { useQuery } from "@tanstack/react-query";
import { orpc } from "@/utils/orpc";
import { Dumbbell } from "lucide-react";

export function HomeSportsAndMusicListingsSection() {
  const { data } = useQuery(orpc.listings.list.queryOptions({
    input: { categoryId: "outdoor_sports", limit: 8 },
  }));

  const listings = data?.items ?? [];

  if (listings.length === 0) return null;

  return (
    <section className="bg-white py-10 px-4">
      <div className="max-w-7xl mx-auto flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold flex items-center gap-2"><Dumbbell className="w-6 h-6 text-primary" /> Thể Thao &amp; Nhạc Cụ</h2>
          <a
            href="/browse?category=outdoor_sports"
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
